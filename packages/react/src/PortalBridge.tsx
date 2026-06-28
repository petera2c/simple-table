import React, { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * A single React subtree to render into a DOM node owned by simple-table-core.
 */
interface PortalEntry {
  id: string;
  container: HTMLElement;
  node: ReactNode;
}

/**
 * Grace window (ms) during which an entry whose container is detached is kept
 * fully mounted. Core legitimately detaches-then-reattaches the SAME cell node
 * during overlapping sort/FLIP animations (cell recycling via the animation
 * coordinator's retain/claim path). Keeping the entry mounted across this short
 * window means React keeps the subtree in the (temporarily detached) container,
 * so content travels with the node and reappears on a quick reconnect WITHOUT
 * any unmount/remount churn.
 */
const DETACH_GRACE_MS = 1000;

/**
 * How long (ms) a still-detached entry is retained — unmounted — in the
 * {@link PortalBridge}'s detached pool before it is permanently discarded.
 *
 * Under aggressive interaction (e.g. spam-clicking sort) core can leave a cell
 * node detached for longer than {@link DETACH_GRACE_MS} and then reconnect the
 * exact same node. A purely time-based prune cannot tell that reused node apart
 * from a truly-recycled one, so once past the grace window we unmount the entry
 * but retain it keyed by id; if its exact container reconnects (detected by the
 * same MutationObserver that drives pruning) the entry is restored and React
 * re-mounts the content. Entries that stay detached for this whole TTL are
 * genuinely recycled and are dropped then, preserving the anti-leak behaviour.
 */
const DETACHED_POOL_TTL_MS = 30000;

/**
 * Bridges simple-table-core's imperative DOM rendering with React so that custom
 * cell / header / footer renderers stay part of the host React tree.
 *
 * Instead of mounting each renderer in its own isolated `createRoot` (which can
 * never see the host app's context providers and leaks because it is never
 * unmounted), each renderer registers a {@link PortalEntry}. The owning
 * `<SimpleTable>` renders one `createPortal` per entry via {@link useTablePortals},
 * so the consumer's components are children of the host tree and inherit context,
 * Suspense, error boundaries, etc.
 *
 * Cleanup is driven by the DOM: core recycles cells by clearing/replacing their
 * content (`innerHTML = ""`), which detaches the registered container. A
 * `MutationObserver` (see {@link attach}) drives {@link runPrune}, which unmounts
 * the React subtree for containers that stay detached. Because core also
 * legitimately detaches-then-reattaches the SAME node during overlapping
 * sort/FLIP animations, pruning is tolerant of transient detaches (see
 * {@link DETACH_GRACE_MS} and {@link DETACHED_POOL_TTL_MS}) so a reused node's
 * content is preserved/restored rather than being lost to a permanently empty
 * cell.
 */
export class PortalBridge {
  private entries = new Map<string, PortalEntry>();
  private listeners = new Set<() => void>();
  private nextId = 0;

  // useSyncExternalStore requires getSnapshot to return a referentially stable
  // value until something actually changes; cache the array and invalidate on emit.
  private cachedSnapshot: PortalEntry[] = [];
  private snapshotDirty = true;

  private emitScheduled = false;
  private pruneScheduled = false;

  // First time (ms) each currently-disconnected (but still mounted) container
  // was observed detached, so the pruner can apply DETACH_GRACE_MS before
  // unmounting it. Cleared as soon as a container reconnects.
  private disconnectedSince = new Map<string, number>();
  // Entries unmounted after the grace window but retained so a later reconnect
  // of the exact same node can re-mount them (keyed by id). GC'd after
  // DETACHED_POOL_TTL_MS. `since` is when the entry entered the pool.
  private detached = new Map<string, { entry: PortalEntry; since: number }>();
  // Trailing timer that re-runs the prune so still-detached entries advance
  // through the grace window / pool TTL even when no further DOM mutations occur.
  private pruneRecheckTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Register a React node to be rendered into `container`. The container is
   * returned to core synchronously (matching the vanilla renderer contract); the
   * React subtree commits on the host's next render.
   */
  register(node: ReactNode, container: HTMLElement): { id: string; unregister: () => void } {
    const id = `st-portal-${this.nextId++}`;
    this.entries.set(id, { id, container, node });
    this.scheduleEmit();
    return { id, unregister: () => this.unregister(id) };
  }

  private unregister(id: string): void {
    this.disconnectedSince.delete(id);
    this.detached.delete(id);
    if (this.entries.delete(id)) this.scheduleEmit();
  }

  /**
   * Observe a root element and prune entries whose container has been detached by
   * core (cell recycling). Returns a disconnect function.
   */
  attach(root: HTMLElement): () => void {
    const observer = new MutationObserver(() => this.schedulePrune());
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }

  /** Remove all entries (used on table teardown). */
  clear(): void {
    this.disconnectedSince.clear();
    this.detached.clear();
    if (this.pruneRecheckTimer !== null) {
      clearTimeout(this.pruneRecheckTimer);
      this.pruneRecheckTimer = null;
    }
    if (this.entries.size === 0) return;
    this.entries.clear();
    this.emit();
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): PortalEntry[] => {
    if (this.snapshotDirty) {
      this.cachedSnapshot = Array.from(this.entries.values());
      this.snapshotDirty = false;
    }
    return this.cachedSnapshot;
  };

  private emit(): void {
    this.snapshotDirty = true;
    for (const listener of this.listeners) listener();
  }

  // Batch bursts of register/unregister (e.g. a full re-render of every visible
  // cell) into a single host re-render.
  private scheduleEmit(): void {
    if (this.emitScheduled) return;
    this.emitScheduled = true;
    queueMicrotask(() => {
      this.emitScheduled = false;
      this.emit();
    });
  }

  // Defer pruning to a microtask so a synchronous detach+reattach (core moving a
  // cell during animations) is not mistaken for a removal.
  private schedulePrune(): void {
    if (this.pruneScheduled) return;
    this.pruneScheduled = true;
    queueMicrotask(() => {
      this.pruneScheduled = false;
      this.runPrune();
    });
  }

  // Two-phase prune that tolerates core detaching-then-reattaching the SAME
  // cell node (cell recycling during overlapping sort/FLIP animations):
  //   1. A live entry whose container has been detached for the whole
  //      DETACH_GRACE_MS window is unmounted but moved to the detached pool
  //      (retained, keyed by id) rather than discarded.
  //   2. A pooled entry whose exact container has reconnected is restored to
  //      the live set (React re-mounts its content). Pooled entries that stay
  //      detached for DETACHED_POOL_TTL_MS are genuinely recycled and dropped.
  // A trailing timer re-runs this while anything is pending so the grace window
  // and pool TTL still advance when no further DOM mutations fire the observer.
  private runPrune(): void {
    const now = Date.now();
    let changed = false;
    let pending = 0;

    // Phase 1: live entries whose container is currently detached.
    for (const [id, entry] of this.entries) {
      if (entry.container.isConnected) {
        this.disconnectedSince.delete(id);
        continue;
      }

      const since = this.disconnectedSince.get(id);
      if (since === undefined) {
        // First observed detach — start the grace window; keep it mounted so a
        // quick reconnect doesn't churn the subtree.
        this.disconnectedSince.set(id, now);
        pending++;
        continue;
      }

      if (now - since < DETACH_GRACE_MS) {
        pending++;
        continue;
      }

      // Detached past the grace window: unmount but retain for a possible
      // later reconnect of the same node.
      this.disconnectedSince.delete(id);
      this.entries.delete(id);
      this.detached.set(id, { entry, since: now });
      pending++;
      changed = true;
    }

    // Phase 2: pooled (unmounted) entries — restore on reconnect, GC when stale.
    for (const [id, rec] of this.detached) {
      if (rec.entry.container.isConnected) {
        this.detached.delete(id);
        this.entries.set(id, rec.entry);
        changed = true;
      } else if (now - rec.since >= DETACHED_POOL_TTL_MS) {
        this.detached.delete(id);
      } else {
        pending++;
      }
    }

    if (pending > 0 && this.pruneRecheckTimer === null) {
      this.pruneRecheckTimer = setTimeout(() => {
        this.pruneRecheckTimer = null;
        this.runPrune();
      }, DETACH_GRACE_MS);
    }

    if (changed) this.emit();
  }
}

/**
 * Isolates each portalled renderer so a throwing consumer component renders
 * nothing instead of crashing the whole table (the portal is part of the host
 * tree now, so an uncaught error would otherwise unmount `<SimpleTable>`).
 */
class PortalErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("[simple-table] A custom renderer threw while rendering:", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/**
 * Renders one `createPortal` per registered entry. Call once from `<SimpleTable>`
 * and include the result in its JSX so portals mount inside the host React tree.
 */
export function useTablePortals(bridge: PortalBridge): ReactNode {
  const entries = useSyncExternalStore(bridge.subscribe, bridge.getSnapshot, bridge.getSnapshot);
  return entries.map((entry) =>
    createPortal(
      <PortalErrorBoundary>{entry.node}</PortalErrorBoundary>,
      entry.container,
      entry.id,
    ),
  );
}
