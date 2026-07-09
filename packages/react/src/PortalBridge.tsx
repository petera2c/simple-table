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
 * DOM attribute stamped on every registered container so {@link PortalBridge.disposeHost}
 * can map a host element (or any descendant) core is discarding back to its
 * portal id.
 */
const PORTAL_ID_ATTR = "data-st-portal-id";

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
 * Cleanup is authoritative, not inferred: core invokes `onRendererHostDiscard(host)`
 * — wired to {@link disposeHost} — immediately before it permanently discards a
 * host element (cell rebuild/edit `innerHTML = ""`, header renderer refresh on
 * sort/filter, plain cell/header removal, and the animation coordinator's
 * ghost/FLIP/shrink teardown). `disposeHost` unregisters the portal(s) tagged
 * with {@link PORTAL_ID_ATTR} inside that host, so React unmounts exactly those
 * subtrees. Reuse/reparent paths never signal, so a reused node keeps its portal
 * entry (and its content) with zero churn.
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

  /**
   * Register a React node to be rendered into `container`. The container is
   * returned to core synchronously (matching the vanilla renderer contract); the
   * React subtree commits on the host's next render. The container is tagged with
   * {@link PORTAL_ID_ATTR} so {@link disposeHost} can find it when core discards
   * the host that owns it.
   */
  register(node: ReactNode, container: HTMLElement): { id: string; unregister: () => void } {
    const id = `st-portal-${this.nextId++}`;
    container.setAttribute(PORTAL_ID_ATTR, id);
    this.entries.set(id, { id, container, node });
    this.scheduleEmit();
    return { id, unregister: () => this.unregister(id) };
  }

  private unregister(id: string): void {
    const existed = this.entries.delete(id);
    if (existed) this.scheduleEmit();
  }

  /**
   * Tear down the portal(s) owned by a host element core is permanently
   * discarding. Collects `host` itself plus every descendant tagged with
   * {@link PORTAL_ID_ATTR} and unregisters each, so React unmounts exactly those
   * subtrees. Called via the core `onRendererHostDiscard` callback BEFORE the
   * host's content is cleared/removed, so the tagged nodes are still queryable.
   */
  disposeHost = (host: HTMLElement): void => {
    if (typeof host.getAttribute !== "function") return;
    const ids: string[] = [];
    const selfId = host.getAttribute(PORTAL_ID_ATTR);
    if (selfId !== null) ids.push(selfId);
    const tagged = host.querySelectorAll(`[${PORTAL_ID_ATTR}]`);
    tagged.forEach((el) => {
      const id = el.getAttribute(PORTAL_ID_ATTR);
      if (id !== null) ids.push(id);
    });
    for (const id of ids) this.unregister(id);
  };

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
