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
 * `MutationObserver` (see {@link attach}) prunes entries whose container is no
 * longer connected, which unmounts the corresponding React subtree.
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
      let changed = false;
      for (const [id, entry] of this.entries) {
        if (!entry.container.isConnected) {
          this.entries.delete(id);
          changed = true;
        }
      }
      if (changed) this.emit();
    });
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
