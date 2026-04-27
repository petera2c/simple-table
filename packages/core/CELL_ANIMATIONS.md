# Cell Animations — Deep Analysis

> Status: analysis only. No code, no API, no implementation timeline. Goal is to make the trade-offs and obstacles concrete enough that an implementation can be designed against this document.

---

## 1. Goal and non-goals

### Goal

Animate body and header cells smoothly when the table's logical state changes their position on screen. The visible result should be that a cell **slides** from its old `(left, top)` to its new `(left, top)` rather than teleporting.

The state changes that should be animated:

- **Sort change** (rows reorder vertically).
- **Column reorder** (columns reorder horizontally).
- **Column resize** (cells right of the resized column shift horizontally; resized cells change width).
- **Row expand / collapse** (rows below shift vertically; nested rows enter/leave).
- **Filter / quick-filter change** (rows enter/leave; surviving rows shift).
- **Pin / unpin column** (cell migrates between sections).

### Non-goals

- **Scrolling is not animated.** Scroll already produces motion natively; layering a transition on top would feel laggy and conflict with the existing scroll fast path (`positionOnlyBody`).
- **No animation of cell _content_.** Only the cell's geometry (position, optionally width/height) animates. Text/checkbox/expand-icon updates stay instantaneous.
- **No re-architecture of the renderer.** The mechanism must layer on top of the existing vanilla-DOM renderer, not replace it.
- **No new heavyweight dependencies** (no framer-motion, no react-spring). The core package is framework-agnostic vanilla DOM; animation must be plain CSS transitions or the Web Animations API.

---

## 2. How the table renders today

This section captures the facts the animation system must work _with_, not _against_.

### 2.1 Vanilla DOM, not React

The core package builds the table by directly creating `<div>` elements via `document.createElement`. There is no React `key` reconciliation. Cell identity is owned by the renderer through a stable string id.

Cell creation lives in [`packages/core/src/utils/bodyCell/styling.ts`](packages/core/src/utils/bodyCell/styling.ts) (`createBodyCellElement`) and [`packages/core/src/utils/headerCell/styling.ts`](packages/core/src/utils/headerCell/styling.ts) (`createHeaderCellElement`).

### 2.2 Stable cell identity

Each body cell's DOM `id` is computed by `getCellId({ accessor, rowId })` in [`packages/core/src/utils/cellUtils.ts`](packages/core/src/utils/cellUtils.ts) (L6–8):

```ts
export const getCellId = ({ accessor, rowId }) => `${rowId}-${accessor}`;
```

Critically: **the same DOM node survives sort and column reorder** as long as both its row id and its accessor are still in the visible window. Only `style.left` and `style.top` change. This is the cornerstone fact that makes a FLIP-style animation viable here.

### 2.3 Positioning: absolute px, no flex/grid

Body cells:

```56:60:packages/core/src/utils/bodyCell/styling.ts
  cellElement.style.position = "absolute";
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  cellElement.style.width = `${cell.width}px`;
  cellElement.style.height = `${cell.height}px`;
```

(see `createBodyCellElement` ~L195–200; `updateBodyCellPosition` ~L411–418; `updateBodyCellElement` ~L437–441.)

Header cells use the same scheme (`packages/core/src/utils/headerCell/styling.ts` L145–147 and L283–284).

The implication for animation: **the cell is already a "free" absolutely-positioned element**. We can layer a `transform` on top of it without disturbing the layout calculation. We do **not** need to introduce a portal/ghost container.

### 2.4 Three physical sections

`renderBody` in [`packages/core/src/core/rendering/TableRenderer.ts`](packages/core/src/core/rendering/TableRenderer.ts) (L521–588) builds three independent DOM containers:

- pinned-left
- main (the only horizontally scrolling one)
- pinned-right

Each section has its own `startColIndex`. The pinned sections **always render every column they own** (no horizontal culling); only the main section is horizontally virtualized.

### 2.5 Vertical virtualization (rows)

`getViewportCalculations` in [`packages/core/src/utils/infiniteScrollUtils.ts`](packages/core/src/utils/infiniteScrollUtils.ts) (~L212+) computes a row index window from `scrollTop`, viewport height, row heights, and an overscan. It is consumed by `processRows` / `recomputeProcessRowsViewport` in [`packages/core/src/utils/rowProcessing.ts`](packages/core/src/utils/rowProcessing.ts) (L152–169, L254–265).

If `contentHeight` is undefined the renderer treats _all_ rows as in-window (rowProcessing.ts L152–156). This is rare in practice for any non-trivial dataset.

### 2.6 Horizontal virtualization (main only)

`getVisibleBodyCells` in [`packages/core/src/utils/bodyCellRenderer.ts`](packages/core/src/utils/bodyCellRenderer.ts) (~L52–69) filters the AbsoluteBodyCell list by `scrollLeft`, viewport width, and ~100 px overscan.

Cells outside the visible set are removed from the DOM in the removal pass (`bodyCellRenderer.ts` L283–294):

```283:294:packages/core/src/utils/bodyCellRenderer.ts
  // Remove cells that are no longer visible
  renderedCells.forEach((element, cellId) => {
    if (!visibleCellIds.has(cellId)) {
      // Untrack from row hover map before removing (stable row id; visual row index can change on scroll)
      const rowIdAttr = element.getAttribute("data-row-id");
      if (rowIdAttr) {
        untrackCellByRow(rowIdAttr, element);
      }
      element.remove();
      renderedCells.delete(cellId);
    }
  });
```

**This is the single most important obstacle to animation.** Anything we want to animate must either (a) still be in `visibleCellIds`, or (b) be exempted from this removal until the animation finishes.

### 2.7 Sort flow

`SortManager.updateSort` in [`packages/core/src/managers/SortManager.ts`](packages/core/src/managers/SortManager.ts) (L161–227) computes a new `sortedRows`, stores it in state, calls `onSortChange`, and `notifySubscribers`. The `RenderOrchestrator` reads `getSortedRows()` as `effectiveRows` (`RenderOrchestrator.ts` L266–270), flattens it, and produces `AbsoluteBodyCell` records whose `top` is derived from `tableRow.position` via `calculateRowTopPosition`.

End result for a surviving cell: same DOM node, new `top`. `updateBodyCellElement` is called and writes the new `top` (`bodyCell/styling.ts` L437–441). The cell teleports.

### 2.8 Column reorder flow

Drag handlers in [`packages/core/src/utils/headerCell/dragging.ts`](packages/core/src/utils/headerCell/dragging.ts) build a new `headers` array and call `context.onTableHeaderDragEnd(newHeaders)` (L260). `TableRenderer` wires that to:

```ts
deps.setHeaders(headers);
deps.onRender();
```

`setHeaders` in [`packages/core/src/core/SimpleTableVanilla.ts`](packages/core/src/core/SimpleTableVanilla.ts) (L503–506) replaces `this.headers` and calls `renderOrchestrator.invalidateCache("header")`. Re-render recomputes each cell's `left` from cumulative leaf widths in `SectionRenderer.calculateAbsoluteBodyCells` (~L608–615). End result for a surviving cell: same DOM node, new `left`. The cell teleports.

### 2.9 Scroll fast paths

Two performance optimizations interact with animation:

- **`positionOnlyBody`** is set to `true` when `source === "scroll-raf"` and `isScrolling === true` (`SimpleTableVanilla.ts` L568). In this mode `renderBodyCells` only updates positions and skips separator / content work (`bodyCellRenderer.ts` L245–252, L373–381).
- **No-op when scroll range unchanged.** In `RenderOrchestrator` (L495–504), if `verticalScrollFastPath && lastScrollRafPaintedRange.start === renderedStartIndex && ... .end === renderedEndIndex`, the render returns without touching the DOM.

Both must be bypassed for renders that originate from sort, reorder, expand, etc. These are not "scroll" renders, so `positionOnlyBody` will already be `false` for them — but the animation system must explicitly **never** trigger off `scroll-raf` renders.

### 2.10 Existing animations in the codebase

Only CSS keyframe flashes exist:

- `cell-flash` (`base.css` L1424–1436) — animates `background-color` only. Class is `.st-cell-updating` plus `cellUpdateFlash` flag in `bodyCell/styling.ts` L275–278.
- `copy-flash`, `warning-flash` — same pattern.

There is **no FLIP, no `transition: transform`, no `framer-motion`, no `react-spring`** anywhere in `packages/core/src`. `requestAnimationFrame` is used only for scroll throttling.

### 2.11 Optional future-helper that is unused today

`getVisibleColumns` / `recalculateGridPositions` in [`packages/core/src/utils/columnVirtualizationUtils.ts`](packages/core/src/utils/columnVirtualizationUtils.ts) (L170–226, L342–373) define a CSS-grid-based path that is not imported anywhere. Worth ignoring for the animation design.

---

## 3. The FLIP primitive and why it fits

FLIP (First, Last, Invert, Play) is the canonical technique for animating an element from one layout state to another without animating the layout-affecting properties themselves.

For each cell that exists both before and after a logical change:

1. **First** — record the cell's pre-change rect (`top`, `left` either from the cell record or from `getBoundingClientRect`).
2. **Last** — let the existing renderer place the cell at its new `(left, top)`. The cell now sits at its destination.
3. **Invert** — immediately set `transform: translate3d(dx, dy, 0)` where `(dx, dy) = first - last`. The cell visually appears at its old position with no layout cost.
4. **Play** — on the next frame, set `transform: translate3d(0, 0, 0)` and `transition: transform <duration> <easing>`. The browser tweens the inverse transform back to identity.

### 3.1 Why FLIP is the right primitive here

- The renderer **already gives us "Last" for free**. After the normal re-render, every surviving cell sits at its correct final coordinates. We only have to capture "First" before the render and apply the invert+play after.
- Cells have **stable string ids** (`getCellId`), so matching first→last pairs is a `Map` lookup, not a DOM diff.
- Cells are already **`position: absolute`**, so a `transform` on them is purely additive — it does not interact with sibling layout, does not push other cells around, does not change scroll geometry.
- `transform` is GPU-composited; `transition: left 250ms` is not. With a few hundred visible cells the difference is the difference between buttery and stuttery.
- FLIP works **uniformly** for sort, reorder, resize, expand, and filter, because all of them reduce to "the cell ends up at a new `(left, top)`". One mechanism, many triggers.

### 3.2 Why not `transition: left, top` directly

- It triggers layout/paint per frame, not just composite. Bad for hundreds of cells.
- It fights with the existing `updateBodyCellPosition` writes during scroll. The transition would cause cells to "drift" toward their target while scrolling, which is wrong.
- It cannot be cleanly disabled on a per-render basis. With FLIP, scroll renders simply skip the snapshot+invert step.

### 3.3 Why not Web Animations API instead of CSS transition

WAAPI (`element.animate(...)`) is a fine alternative and gives finer control (cancel, reverse, finished promise). Either is acceptable. CSS `transition: transform` is simpler and sufficient for a v1; WAAPI is worth considering if cancellation semantics get complex.

---

## 4. Virtualization-aware extensions

Plain FLIP works only for cells that exist as DOM nodes both before and after the change. Virtualization breaks this assumption in two ways:

- A cell that is currently visible may **leave the DOM** because its target is outside the new viewport window. The animation has nothing to animate to.
- A cell that should _enter_ the viewport from off-screen may **be created at its final position** with no inverted "first" rect to start from.

Two complementary mechanisms address this.

### 4.1 Expanded render window for the animation duration

Temporarily widen the visibility windows so they cover the union of "what was visible before" and "what will be visible after". Concretely:

- **Vertical (rows):** during the animation, `processRows` should render rows in `[min(startBefore, startAfter), max(endBefore, endAfter)]` instead of just the after-window. Implementation hook: extend `getViewportCalculations` consumers to accept an "extra range" provided by the animation coordinator.
- **Horizontal (main columns):** `getVisibleBodyCells` should accept a similar "extra range" so columns whose `left` was inside the viewport before, or will be inside after, are included.

Why this is the cleanest mechanism:

- It expresses the constraint exactly once, in the place the renderer already enforces visibility.
- It is naturally one-frame-only — the coordinator removes the extra range when the animation completes, and the next render culls back to the steady-state window.
- It composes with the existing removal pass: cells outside _both_ the after-window and the in-flight set get `remove()`d as usual after the animation finishes.

Cost: at most a single additional viewport-worth of cells for the duration of the transition (typically 200–400 ms).

### 4.2 In-flight retention set

A `Set<cellId>` owned by the animation coordinator. Any cell currently mid-transition is added; the removal pass at [`bodyCellRenderer.ts` L283–294](packages/core/src/utils/bodyCellRenderer.ts) consults this set:

```ts
if (!visibleCellIds.has(cellId) && !animationCoordinator.isInFlight(cellId)) {
  element.remove();
  renderedCells.delete(cellId);
}
```

When the cell's `transitionend` fires (or a safety timeout expires), the coordinator removes the id and the next render disposes of the node naturally.

This handles the case of "cell leaves the viewport mid-flight" without coupling the animation to the virtualization math.

### 4.3 Entering vs leaving cells

- **Surviving** (in both snapshots): standard FLIP — invert + play to identity.
- **Entering** (in after only): the cell is created at its final position. Animate `opacity 0 → 1` (and optionally a subtle `scale` or `translate` from the direction of travel) over the same duration. No invert step.
- **Leaving** (in before only): keep the original DOM node alive via the in-flight retention set, animate `opacity 1 → 0`, optionally `translate` toward where its target _would_ be. Remove on completion.

For a sort that swaps two rows, both rows are surviving (their row ids exist before and after); they FLIP. For a filter that hides half the rows, the hidden ones are leaving; the rest survive.

### 4.4 Header cells

Header cells use the exact same positioning model:

```145:147:packages/core/src/utils/headerCell/styling.ts
  cellElement.style.position = "absolute";
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
```

The same FLIP coordinator applies, with snapshots taken in `renderHeaderCells` ([`packages/core/src/utils/headerCellRenderer.ts`](packages/core/src/utils/headerCellRenderer.ts)). On column reorder, headers and their column body cells should animate together with the same duration and easing so the column appears as a coherent moving block.

### 4.5 Three sections, three coordinators

Cells in pinned-left, main, and pinned-right live in different DOM containers with different scroll/clip behaviors. A single `transform` cannot move a cell from one container to another. The coordinator should treat each section independently for FLIP, and treat **cross-section migrations** (pin / unpin) as fade-out-at-old + fade-in-at-new rather than slide.

---

## 5. Trigger taxonomy

A complete catalogue of state changes that should hook the animation coordinator, and what is animated for each.

| Trigger                      | Source                                                                    | What changes per cell                                | FLIP target                                                                                 | Notes                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Sort change                  | `SortManager.updateSort` (`SortManager.ts` L161–227)                      | `top` only                                           | `translate3d(0, dy, 0)`                                                                     | Snapshot before `notifySubscribers`; play after the resulting render.                                                             |
| Column reorder               | `setHeaders` from `headerCell/dragging.ts` L260                           | `left` only                                          | `translate3d(dx, 0, 0)`                                                                     | Headers and body cells snapshot together.                                                                                         |
| Column resize                | Resize handlers in `headerCell/resizing.ts`                               | Resized column: `width`. Cells to the right: `left`. | `translate3d(dx, 0, 0)` for right-side cells; optional `width` tween for the resized column | If the user is mid-drag, do **not** animate (the drag is already a continuous motion). Only animate on commit/snap if applicable. |
| Row expand / collapse        | `setExpandedRows` / `setCollapsedRows` (`SimpleTableVanilla.ts` L510–522) | All rows below: `top`. New nested rows: enter.       | `translate3d(0, dy, 0)` for shifted rows; fade-in for newly mounted nested rows             | Combine with row-height transition on the row container if visible.                                                               |
| Quick-filter / filter change | `FilterManager` → re-flatten                                              | Surviving rows: `top`. Filtered-out rows: leave.     | `translate3d(0, dy, 0)` + fade-out for leavers                                              | Same pattern as sort plus leaver handling.                                                                                        |
| Pin / unpin column           | column metadata change → `setHeaders`                                     | Cell migrates between sections                       | Cross-section fade-out / fade-in                                                            | Cannot FLIP across containers.                                                                                                    |
| Cell content update          | `cellUpdateFlash` path (`bodyCell/styling.ts` L275–278)                   | None geometric                                       | Existing CSS keyframe (`background-color`)                                                  | Already animated; do not touch.                                                                                                   |
| **Scroll**                   | `scroll-raf` / `positionOnlyBody === true`                                | `top`/`left` per cell                                | **Do nothing.**                                                                             | Explicitly excluded; the coordinator must ignore renders whose source is scroll.                                                  |

### Hook points (for reference, not a design)

The coordinator needs a way to be told "a logical change is about to happen" so it can snapshot. The cleanest signals already exist:

- `SortManager` notifies subscribers — add a "pre-change" subscription, or wrap `updateSort` to capture before mutating state.
- `setHeaders` in `SimpleTableVanilla.ts` is a single funnel for header changes (drag reorder, resize commit, pin toggle).
- `setExpandedRows` / `setCollapsedRows` are similar single funnels.
- `FilterManager` updates similarly notify subscribers.

For each, the contract is: capture rects → let the change apply → render runs → coordinator runs FLIP on the resulting DOM.

---

## 6. Edge cases

Each of these needs explicit handling. Many have been the failure mode of past attempts at table animation in other libraries.

### 6.1 Animation interrupted by another animation

User clicks a sort header twice quickly. The second click happens while the first transition is in flight.

- **Wrong**: snapshot the cell's _logical_ pre-render `top`. The cell is currently mid-flight at some interpolated position; jumping back to the logical top would visibly stutter.
- **Right**: snapshot via `getBoundingClientRect()` so the new "first" reflects the cell's _actual rendered_ position. The new FLIP starts from where the user can see the cell, not from a logical state.

### 6.2 Editor open during an animation

If `isEditing && !isEditInDropdown` (`bodyCell/styling.ts` L214), the cell contains an inline editor with focus. Animating its position would move the editor mid-typing.

Options:

- Commit (or cancel) the editor before applying the change.
- Skip animation for the cell with the open editor; let it teleport.
- Hold the change until the editor closes.

Recommendation: skip animation for that one cell and animate the rest. Document this as a known behavior.

### 6.3 Selection rectangle / fill handle

`SelectionManager` reads cell DOM rects to position selection borders and fill handles. If it queries during an animation it will read interpolated rects.

Mitigation: SelectionManager should re-query on `transitionend` of the relevant cells, or explicitly disable selection rect updates while the coordinator reports an in-flight set.

### 6.4 `cellUpdateFlash` overlap

The flash is `animation: cell-flash 0.6s ease-in-out` on `.st-cell-updating` and only animates `background-color` (`base.css` L1425–1436). Confirmed safe — does not conflict with `transform`. The two animations can run simultaneously on the same cell.

### 6.5 `prefers-reduced-motion`

There is currently no usage of `prefers-reduced-motion` in `packages/core/src` (verified via grep). The coordinator should respect `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and fall back to instant transitions.

### 6.6 Opt-in by default

Animation is a behavior change with non-zero CPU cost (extra rect reads, retained off-window cells, expanded render window). It must be opt-in. The existing `cellUpdateFlash?: boolean` in `SimpleTableProps` ([`packages/core/src/types/SimpleTableProps.ts`](packages/core/src/types/SimpleTableProps.ts) L30) is the obvious precedent. A future option might look like `animations?: boolean | { duration, easing }` (default `false`).

### 6.7 Performance budget

A typical visible viewport contains 200–500 cells. Per-cell work for FLIP:

- 1 × `getBoundingClientRect()` (or 1 × Map read of cached `left`/`top`) before the change — read.
- 1 × `style.transform = "translate3d(...)"` after the change — write.
- 1 × `style.transform = "translate3d(0,0,0)"` + `style.transition = "transform Xms"` next frame — write.
- 1 × cleanup on `transitionend` — write.

Reads must be **batched before any writes** to avoid layout thrash. The coordinator should:

1. Pause and read all rects in one pass (or use the cell record's `left`/`top`, which avoids the rect read entirely — this is the preferred path).
2. Allow the renderer to write all new positions.
3. In a `requestAnimationFrame`, write all inverse transforms.
4. In the next `requestAnimationFrame`, write all `transition` declarations and zero transforms.

### 6.8 Memory cleanup

The in-flight retention set must be drained on:

- Normal `transitionend`.
- `transitioncancel` (e.g. a new transition replaces the running one).
- Safety timeout (duration + 50 ms slack) in case `transitionend` is missed.
- Table `destroy()` / unmount.
- Theme switch or other full re-init.

Failure to drain leaks DOM nodes outside the visible window.

### 6.9 Variable row heights and auto-scaled column widths

Row heights use `heightOffsets` / `buildCumulativeHeightMap` and `calculateRowTopPosition` (`infiniteScrollUtils.ts` L39–75, L428–445). Column widths can be normalized by `AutoScaleManager`. Both mean the post-change `(left, top)` for a cell is non-trivial.

The animation coordinator should not attempt to compute the after-position itself. It should read it from the renderer's output (the `AbsoluteBodyCell` record placed on the DOM during "Last") or by `getBoundingClientRect()`.

### 6.10 No-op renders

`RenderOrchestrator` (L495–504) returns early when the scroll range is unchanged. Logical changes (sort, reorder, …) are not scroll renders, so this early return does not apply to them — but the coordinator must guard against snapshotting before a render that is going to early-return, otherwise the snapshot leaks.

### 6.11 Pinned-section interactions

- Sort change in a row that has both pinned and non-pinned cells: all three sections must snapshot/play in lockstep (same start time, same duration).
- Resize of a pinned column changes `left` for cells in the same pinned section only; main and the other pinned section are unaffected. The coordinator should still animate within the affected section.
- A column being unpinned migrates its body cells from one section's container to another. As noted in §4.5, this is a fade transition, not a slide.

### 6.12 Drag-in-progress vs drag-end

`headerCell/dragging.ts` calls `context.onTableHeaderDragEnd(newHeaders)` on each `dragover` (throttled, L260). The name is misleading — this fires continuously during the drag, not only on release. Animating each intermediate reorder would compete with the user's pointer.

Recommendation: when the change source is a live drag (column reorder or column resize), **suppress** FLIP. The cell should follow the pointer immediately. Animate only on a "settled" change (drop, sort click, expand toggle, filter apply, …).

### 6.13 SSR / no-DOM environments

Coordinator code must guard `window`, `requestAnimationFrame`, and `matchMedia` for SSR. The existing renderer is already DOM-bound, but the animation hook must not crash a server-side import.

---

## 7. Open questions and risks

1. **Where exactly does the snapshot get taken?**  
   Options are: inside each manager (`SortManager`, etc.), inside `setHeaders`/`setExpandedRows` funnels, or via a dedicated "logical change" event on `RenderOrchestrator`. Each has trade-offs in coupling vs duplication. Worth deciding before implementation.

2. **Should the after-positions come from cell records or from `getBoundingClientRect`?**  
   Records are cheaper (no forced reflow) but require trusting that the renderer wrote them correctly. Rects are authoritative but cost a layout. Probably: use records by default, fall back to rects only for interrupted animations (§6.1).

3. **Default duration and easing.**  
   A starting point is 220 ms `cubic-bezier(0.2, 0.8, 0.2, 1)` for a "natural" slide. Worth A/B-ing with sort vs reorder to find a single value that feels right for both, or having distinct values per trigger.

4. **WAAPI vs CSS transition.**  
   CSS transition is simpler and probably sufficient for v1. WAAPI gains: clean cancellation, `Animation.finished` promise, no `transitionend`-listener bookkeeping. Decide before writing the coordinator.

5. **Scope of expanded render window.**  
   Expanding both row and column windows for one frame is cheap. Expanding for a row-expand event with 1000 newly-inserted child rows is not. The coordinator should cap how many extra cells it will retain.

6. **Cross-section migration animation feel.**  
   Fade-only is the conservative default for pin/unpin. A fancier alternative is a "ghost element" portaled to the top-level table container that slides between sections and disappears on arrival. Fancier == more risk; not recommended for v1.

7. **Interaction with React/Solid/Vue/Angular wrappers.**  
   The animation coordinator lives in `packages/core` so all wrappers inherit it for free, but each wrapper's prop surface must expose the new opt-in flag. Worth verifying no wrapper does its own DOM mutation that would conflict.

8. **Test strategy.**  
   The Storybook test runner (per repo rules) can validate "the cell's final `top` equals the expected px after sort". Animating-state assertions are harder; visual regression with a paused mid-animation timeline is one option, but not a small undertaking.

9. **Is there a use case for animating `width` (not just position)?**  
   Column resize is the obvious one. `transition: width` causes layout, but on a single resized column it is acceptable. Worth deciding whether the coordinator owns this or it lives in the resize handler.

10. **What is the failure mode if a transition is dropped?**  
    The cell ends up at its final position visually (because we set `transform: translate3d(0,0,0)` immediately). The user sees no animation but no broken state. This is the desired graceful degradation.

---

## 8. Glossary of relevant files

| File                                                                                                               | Role in animation design                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`packages/core/src/utils/bodyCell/styling.ts`](packages/core/src/utils/bodyCell/styling.ts)                       | `createBodyCellElement`, `updateBodyCellPosition`, `updateBodyCellElement`. Where each cell's `left`/`top` is set. The coordinator's "play" step writes `transform` here (or via a sibling helper). |
| [`packages/core/src/utils/headerCell/styling.ts`](packages/core/src/utils/headerCell/styling.ts)                   | Same as above but for headers. L145–147 and L283–284.                                                                                                                                               |
| [`packages/core/src/utils/cellUtils.ts`](packages/core/src/utils/cellUtils.ts)                                     | `getCellId`. The key used to match first→last across renders.                                                                                                                                       |
| [`packages/core/src/utils/bodyCellRenderer.ts`](packages/core/src/utils/bodyCellRenderer.ts)                       | `renderBodyCells`, `getVisibleBodyCells`. Removal pass at L283–294 must consult the in-flight retention set. Visibility filter must accept an "extra range" for the expanded window.                |
| [`packages/core/src/utils/headerCellRenderer.ts`](packages/core/src/utils/headerCellRenderer.ts)                   | Header-side equivalent of `renderBodyCells`.                                                                                                                                                        |
| [`packages/core/src/core/rendering/RenderOrchestrator.ts`](packages/core/src/core/rendering/RenderOrchestrator.ts) | Central render loop. L266–270 picks `effectiveRows` from the sort manager. L495–504 is the scroll-range no-op.                                                                                      |
| [`packages/core/src/core/rendering/SectionRenderer.ts`](packages/core/src/core/rendering/SectionRenderer.ts)       | `calculateAbsoluteBodyCells` / `calculateAbsoluteHeaderCells` — where post-render `left`/`top` come from.                                                                                           |
| [`packages/core/src/core/rendering/TableRenderer.ts`](packages/core/src/core/rendering/TableRenderer.ts)           | `renderBody` builds the three sections.                                                                                                                                                             |
| [`packages/core/src/core/SimpleTableVanilla.ts`](packages/core/src/core/SimpleTableVanilla.ts)                     | Top-level orchestrator. L503–506 `setHeaders`, L510–522 `setExpandedRows`/`setCollapsedRows`. L568 sets `positionOnlyBody`.                                                                         |
| [`packages/core/src/managers/SortManager.ts`](packages/core/src/managers/SortManager.ts)                           | `updateSort` (L161–227). Subscribers fire after the new sort is committed.                                                                                                                          |
| [`packages/core/src/utils/headerCell/dragging.ts`](packages/core/src/utils/headerCell/dragging.ts)                 | Column reorder. `onTableHeaderDragEnd` at L260 fires _during_ drag, not only on release (§6.12).                                                                                                    |
| [`packages/core/src/utils/headerCell/resizing.ts`](packages/core/src/utils/headerCell/resizing.ts)                 | Column resize. Same drag-vs-commit distinction.                                                                                                                                                     |
| [`packages/core/src/utils/infiniteScrollUtils.ts`](packages/core/src/utils/infiniteScrollUtils.ts)                 | `getViewportCalculations`. Where the row window is computed; coordinator extends it for one frame.                                                                                                  |
| [`packages/core/src/utils/rowProcessing.ts`](packages/core/src/utils/rowProcessing.ts)                             | `processRows` consumes the row window.                                                                                                                                                              |
| [`packages/core/src/managers/SectionScrollController.ts`](packages/core/src/managers/SectionScrollController.ts)   | 20 px horizontal throttle; not an obstacle but worth noting (§6.7).                                                                                                                                 |
| [`packages/core/src/managers/SelectionManager`](packages/core/src/managers/SelectionManager)                       | Reads cell rects; needs to re-query post-animation (§6.3).                                                                                                                                          |
| [`packages/core/src/styles/base.css`](packages/core/src/styles/base.css)                                           | Existing flash keyframes (L1424–1436). Confirmed not to use `transform`.                                                                                                                            |
| [`packages/core/src/types/SimpleTableProps.ts`](packages/core/src/types/SimpleTableProps.ts)                       | `cellUpdateFlash` precedent for the future opt-in flag.                                                                                                                                             |
