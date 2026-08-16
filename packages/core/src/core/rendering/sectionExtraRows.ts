import TableRow from "../../types/TableRow";
import { expandStateKey, calculateFinalNestedGridHeight } from "../../utils/rowUtils";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import {
  createNestedGridRow,
  createNestedGridSpacer,
  type NestedGridRowRenderContext,
} from "../../utils/nestedGridRowRenderer";
import { createStateRow, type StateRowRenderContext } from "../../utils/stateRowRenderer";
import type { CellRenderContext } from "../../utils/bodyCellRenderer";
import type { AnimationCoordinator } from "../../managers/AnimationCoordinator";

export interface NestedGridRowEntry {
  element: HTMLElement;
  cleanup?: () => void;
  lastPosition: number;
  /** Last numeric top written onto the row. */
  lastTop: number;
  lastWrapperHeight: number;
}

export interface StateRowEntry {
  element: HTMLElement;
  lastTop: number;
  lastPosition: number;
}

export function renderNestedGridRows(
  section: HTMLElement,
  sectionKey: string,
  rows: TableRow[],
  pinned: "left" | "right" | undefined,
  context: CellRenderContext,
  animationCoordinator: AnimationCoordinator | undefined,
  nestedGridRowsMap: Map<string, Map<string, NestedGridRowEntry>>,
  stateRowsMap: Map<string, Map<string, StateRowEntry>>,
): void {
  // Inline transition string driven by the user's configured animations:
  //   - Matches the body-cell FLIP duration/easing so a row's nested grid
  //     animates in lockstep with the cells above and below it.
  //   - Empty when the coordinator is disabled (e.g. animations.enabled=false
  //     or prefers-reduced-motion) so position updates snap as expected.
  // We *only* attach this transition when the renderer is already updating
  // an existing nested-grid-row's transform/height (so the change has a
  // "before" value to interpolate from). Newly-created rows assign their
  // transform synchronously before paint and we leave the transition empty,
  // letting them appear at their destination immediately.
  const animationsActive = animationCoordinator?.isEnabled() ?? false;
  const transitionStyle = animationsActive
    ? `transform ${animationCoordinator!.getDuration()}ms ${animationCoordinator!.getEasing()}, height ${animationCoordinator!.getDuration()}ms ${animationCoordinator!.getEasing()}`
    : "";
  const nestedRows = rows.filter((r) => r.nestedTable);
  const currentKeys = new Set(nestedRows.map((r) => expandStateKey(r)));

  let map = nestedGridRowsMap.get(sectionKey);
  if (!map) {
    map = new Map();
    nestedGridRowsMap.set(sectionKey, map);
  }

  // Remove nested row elements that no longer have a matching parent in the list.
  map.forEach((entry, key) => {
    if (!currentKeys.has(key)) {
      entry.cleanup?.();
      entry.element.remove();
      map!.delete(key);
    }
  });

  const nestedContext: NestedGridRowRenderContext = {
    rowHeight: context.rowHeight,
    heightOffsets: context.heightOffsets,
    customTheme: context.customTheme ?? ({} as any),
    theme: context.theme,
    rowGrouping: context.rowGrouping,
    depth: 0,
    loadingStateRenderer: context.loadingStateRenderer,
    errorStateRenderer: context.errorStateRenderer,
    emptyStateRenderer: context.emptyStateRenderer,
    icons: context.icons,
    createNestedTable: context.createNestedTable,
  };

  nestedRows.forEach((tableRow) => {
    const stableKey = expandStateKey(tableRow);
    const existing = map!.get(stableKey);

    if (existing) {
      // Same nested table is still expanded for the same parent row, but its
      // visual position and/or wrapper height may have changed because rows
      // above expanded/collapsed (or a sibling's child data just resolved
      // and grew the layout). Update the inline transform/height on the
      // existing element rather than tearing it down — keeping the same DOM
      // node lets the inline CSS transition interpolate smoothly to the new
      // position in lockstep with the body-cell FLIP.
      const newTop = calculateRowTopPosition({
        position: tableRow.position,
        rowHeight: context.rowHeight,
        heightOffsets: context.heightOffsets,
        customTheme: context.customTheme ?? ({} as any),
      });
      const newWrapperHeight = calculateFinalNestedGridHeight({
        calculatedHeight: tableRow.nestedTable!.calculatedHeight,
        customHeight: tableRow.nestedTable!.expandableHeader.nestedTable?.height,
        customTheme: context.customTheme ?? ({} as any),
      });
      const transformChanged = existing.lastTop !== newTop;
      const heightChanged = existing.lastWrapperHeight !== newWrapperHeight;
      if (transformChanged || heightChanged) {
        existing.element.style.transition = transitionStyle;
        if (transformChanged) {
          existing.element.style.transform = `translate3d(0, ${newTop}px, 0)`;
        }
        if (heightChanged) {
          existing.element.style.height = `${newWrapperHeight}px`;
        }
        existing.lastTop = newTop;
        existing.lastWrapperHeight = newWrapperHeight;
      }
      existing.element.dataset.index = String(tableRow.position);
      existing.lastPosition = tableRow.position;
      return;
    }

    // Decide the initial visual height for a freshly-created nested grid row:
    //   - If a state row existed at the same flattened position this render
    //     replaced (lazy-load case: loading row → resolved nested table),
    //     start at `rowHeight` so the wrapper appears to "grow" out of the
    //     state row that just disappeared.
    //   - Otherwise (eager-load: parent expanded with data already present)
    //     start at 0 so it appears to unfold from the parent row directly,
    //     in lockstep with the body cells below it sliding down by the full
    //     wrapper height (FLIP delta = wrapperHeight in that case).
    // The state-row map is keyed by the same stable rowId as the nested-grid
    // row that replaces it (both share `[...rowPath, currentGroupingKey]`),
    // so a hit here means the just-resolved data is replacing a loading row.
    const stateRowMapForSection = stateRowsMap.get(sectionKey);
    const replacedStateRow =
      !!stateRowMapForSection && stateRowMapForSection.has(stableKey);
    const initialHeight = replacedStateRow ? context.rowHeight : 0;
    const finalWrapperHeight = calculateFinalNestedGridHeight({
      calculatedHeight: tableRow.nestedTable!.calculatedHeight,
      customHeight: tableRow.nestedTable!.expandableHeader.nestedTable?.height,
      customTheme: context.customTheme ?? ({} as any),
    });
    const finalTop = calculateRowTopPosition({
      position: tableRow.position,
      rowHeight: context.rowHeight,
      heightOffsets: context.heightOffsets,
      customTheme: context.customTheme ?? ({} as any),
    });

    if (pinned) {
      const spacer = createNestedGridSpacer(tableRow, {
        rowHeight: context.rowHeight,
        heightOffsets: context.heightOffsets,
        customTheme: context.customTheme ?? ({} as any),
      });
      // Same growth treatment for pinned spacers so left/right pinned
      // sections stay vertically aligned with the main section's nested row.
      if (animationsActive && initialHeight !== finalWrapperHeight) {
        spacer.style.height = `${initialHeight}px`;
      }
      section.appendChild(spacer);
      map!.set(stableKey, {
        element: spacer,
        lastPosition: tableRow.position,
        lastTop: finalTop,
        lastWrapperHeight: finalWrapperHeight,
      });
      if (animationsActive && initialHeight !== finalWrapperHeight) {
        // 2x rAF so the browser commits the initial height frame before we
        // flip in the transition + final height — without this the change
        // collapses into a single paint and there's nothing to animate.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            spacer.style.transition = transitionStyle;
            spacer.style.height = `${finalWrapperHeight}px`;
          });
        });
      }
    } else {
      nestedContext.depth = tableRow.depth > 0 ? tableRow.depth - 1 : 0;
      const { element, cleanup } = createNestedGridRow(
        tableRow,
        nestedContext,
      );
      // Override the height that createNestedGridRow set so we can grow into
      // the final value on the next frame. Overflow:hidden keeps the inner
      // SimpleTable visually clipped while the wrapper expands.
      if (animationsActive && initialHeight !== finalWrapperHeight) {
        element.style.height = `${initialHeight}px`;
        element.style.overflow = "hidden";
      }
      section.appendChild(element);
      map!.set(stableKey, {
        element,
        cleanup,
        lastPosition: tableRow.position,
        lastTop: finalTop,
        lastWrapperHeight: finalWrapperHeight,
      });
      if (animationsActive && initialHeight !== finalWrapperHeight) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            element.style.transition = transitionStyle;
            element.style.height = `${finalWrapperHeight}px`;
          });
        });
      }
    }
  });
}

export function renderStateRows(
  section: HTMLElement,
  sectionKey: string,
  rows: TableRow[],
  context: CellRenderContext,
  animationCoordinator: AnimationCoordinator | undefined,
  stateRowsMap: Map<string, Map<string, StateRowEntry>>,
): void {
  const stateRows = rows.filter((r) => r.stateIndicator);
  const currentKeys = new Set(stateRows.map((r) => expandStateKey(r)));

  let map = stateRowsMap.get(sectionKey);
  if (!map) {
    map = new Map();
    stateRowsMap.set(sectionKey, map);
  }

  // The transition mirrors the one used for nested-grid rows so the state
  // row, the nested-grid row that eventually replaces it, and the body
  // cells around it all interpolate over the same window/easing.
  const animationsActive = animationCoordinator?.isEnabled() ?? false;
  const transitionStyle = animationsActive
    ? `transform ${animationCoordinator!.getDuration()}ms ${animationCoordinator!.getEasing()}, height ${animationCoordinator!.getDuration()}ms ${animationCoordinator!.getEasing()}`
    : "";

  // Remove state rows that no longer exist in the flattened list (typically
  // because their parent collapsed or transitioned to error/empty/data).
  map.forEach((entry, key) => {
    if (!currentKeys.has(key)) {
      entry.element.remove();
      map!.delete(key);
    }
  });

  const stateContext: StateRowRenderContext = {
    index: 0,
    rowHeight: context.rowHeight,
    heightOffsets: context.heightOffsets,
    customTheme: context.customTheme ?? ({} as any),
    loadingStateRenderer: context.loadingStateRenderer,
    errorStateRenderer: context.errorStateRenderer,
    emptyStateRenderer: context.emptyStateRenderer,
  };

  stateRows.forEach((tableRow, i) => {
    const stableKey = expandStateKey(tableRow);
    const newTop = calculateRowTopPosition({
      position: tableRow.position,
      rowHeight: context.rowHeight,
      heightOffsets: context.heightOffsets,
      customTheme: context.customTheme ?? ({} as any),
    });

    const existing = map!.get(stableKey);
    if (existing) {
      // Existing state row — update its position when rows above expand or
      // collapse so it slides in lockstep with body cells (no transition
      // reset when the position is unchanged).
      if (existing.lastTop !== newTop) {
        existing.element.style.transition = transitionStyle;
        existing.element.style.transform = `translate3d(0, ${newTop}px, 0)`;
        existing.lastTop = newTop;
      }
      existing.lastPosition = tableRow.position;
      return;
    }

    const rowElement = createStateRow(tableRow, {
      ...stateContext,
      index: i,
    });
    rowElement.style.position = "absolute";
    rowElement.style.transform = `translate3d(0, ${newTop}px, 0)`;
    rowElement.style.width = "100%";

    if (animationsActive) {
      // Grow the state row in from height 0 so it appears to unfold out of
      // the parent row (matching the grow-in used for fresh nested-grid
      // rows). Overflow:hidden keeps the inner content clipped while the
      // wrapper expands to its final rowHeight.
      rowElement.style.height = "0px";
      rowElement.style.overflow = "hidden";
      section.appendChild(rowElement);
      // 2x rAF: the browser must paint the initial height=0 frame before
      // the transition starts, otherwise the change collapses into one
      // paint and there's nothing to animate from.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          rowElement.style.transition = transitionStyle;
          rowElement.style.height = `${context.rowHeight}px`;
        });
      });
    } else {
      section.appendChild(rowElement);
    }

    map!.set(stableKey, {
      element: rowElement,
      lastTop: newTop,
      lastPosition: tableRow.position,
    });
  });
}

export function releaseExtraRowMaps(
  nestedGridRowsMap: Map<string, Map<string, NestedGridRowEntry>>,
  stateRowsMap: Map<string, Map<string, StateRowEntry>>,
): void {
  nestedGridRowsMap.forEach((map) => {
    map.forEach((entry) => {
      entry.cleanup?.();
      entry.element.remove();
    });
    map.clear();
  });
  nestedGridRowsMap.clear();
  stateRowsMap.forEach((map) => {
    map.forEach((entry) => {
      entry.element.remove();
    });
    map.clear();
  });
  stateRowsMap.clear();
}
