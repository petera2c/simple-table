/**
 * Tracks imperative Vue mounts and caches wrapped cell/header renderers per
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

  register(container: HTMLElement, dispose: () => void): void {
    const id = `st-mount-${this.nextId++}`;
    container.setAttribute(MOUNT_ID_ATTR, id);
    this.entries.set(id, dispose);
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
    for (const dispose of this.entries.values()) {
      dispose();
    }
    this.entries.clear();
  }

  pruneRendererCaches(liveAccessors: ReadonlySet<string>): void {
    for (const key of this.cellRendererCache.keys()) {
      if (!liveAccessors.has(key)) this.cellRendererCache.delete(key);
    }
    for (const key of this.headerRendererCache.keys()) {
      if (!liveAccessors.has(key)) this.headerRendererCache.delete(key);
    }
  }

  get size(): number {
    return this.entries.size;
  }
}
