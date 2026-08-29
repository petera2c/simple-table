/**
 * Tracks imperative Angular mounts and caches wrapped cell/header renderers per
 * accessor so unstable column rebuilds keep stable wrapper identity.
 */
const MOUNT_ID_ATTR = "data-st-mount-id";

export type CachedRendererSlot<T = unknown> = {
  component: T;
  wrapped: unknown;
};

export class MountRegistry {
  private entries = new Map<string, () => void>();
  private nextId = 0;

  readonly cellRendererCache = new Map<string, CachedRendererSlot>();
  readonly headerRendererCache = new Map<string, CachedRendererSlot>();
  readonly cellTemplateCache = new Map<string, CachedRendererSlot>();
  readonly headerTemplateCache = new Map<string, CachedRendererSlot>();
  /** One-shot `tableEmptyStateRenderer` component mount, reused across config rebuilds. */
  tableEmptyStateMount: { component: unknown; host: HTMLElement } | null = null;

  register(container: HTMLElement, dispose: () => void): void {
    const id = `st-mount-${this.nextId++}`;
    container.setAttribute(MOUNT_ID_ATTR, id);
    this.entries.set(id, dispose);
  }

  /** True when `container` is a live registered mount host (not yet disposed). */
  isRegistered(container: HTMLElement): boolean {
    const id = container.getAttribute(MOUNT_ID_ATTR);
    if (id === null) return false;
    return this.entries.has(id);
  }

  disposeHost = (host: HTMLElement): void => {
    if (typeof host.getAttribute !== "function") return;
    const ids: string[] = [];
    const selfId = host.getAttribute(MOUNT_ID_ATTR);
    if (selfId !== null) ids.push(selfId);
    const tagged = host.querySelectorAll(`[${MOUNT_ID_ATTR}]`);
    tagged.forEach((el) => {
      const id = el.getAttribute(MOUNT_ID_ATTR);
      if (id !== null) ids.push(id);
    });
    for (const id of ids) {
      const dispose = this.entries.get(id);
      if (!dispose) continue;
      this.entries.delete(id);
      dispose();
    }
  };

  clear(): void {
    this.cellRendererCache.clear();
    this.headerRendererCache.clear();
    this.cellTemplateCache.clear();
    this.headerTemplateCache.clear();
    this.tableEmptyStateMount = null;
    for (const dispose of this.entries.values()) {
      dispose();
    }
    this.entries.clear();
  }

  pruneRendererCaches(liveAccessors: ReadonlySet<string>): void {
    for (const cache of [
      this.cellRendererCache,
      this.headerRendererCache,
      this.cellTemplateCache,
      this.headerTemplateCache,
    ]) {
      for (const key of cache.keys()) {
        if (!liveAccessors.has(key)) cache.delete(key);
      }
    }
  }

  get size(): number {
    return this.entries.size;
  }
}
