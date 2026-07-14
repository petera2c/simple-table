/**
 * Shared MountRegistry pattern: track imperative framework mounts and cache
 * wrapped cell/header renderers per accessor so unstable column rebuilds keep
 * stable wrapper identity.
 */
const MOUNT_ID_ATTR = "data-st-mount-id";

export type CachedRendererSlot<T = unknown> = {
  component: T;
  wrapped: unknown;
};

export class MountRegistry {
  private entries = new Map<string, () => void>();
  private nextId = 0;

  /** Per-accessor cached cellRenderer wrappers. */
  readonly cellRendererCache = new Map<string, CachedRendererSlot>();
  /** Per-accessor cached headerRenderer wrappers. */
  readonly headerRendererCache = new Map<string, CachedRendererSlot>();

  /**
   * Register a dispose callback for a mount container. Tags the container so
   * {@link disposeHost} can find it when core discards an ancestor host.
   */
  register(container: HTMLElement, dispose: () => void): void {
    const id = `st-mount-${this.nextId++}`;
    container.setAttribute(MOUNT_ID_ATTR, id);
    this.entries.set(id, dispose);
  }

  /**
   * Tear down mounts owned by a host element core is permanently discarding.
   * Collects `host` itself plus every descendant tagged with {@link MOUNT_ID_ATTR}.
   */
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

  /** Dispose every tracked mount (used on table teardown). */
  clear(): void {
    this.cellRendererCache.clear();
    this.headerRendererCache.clear();
    for (const dispose of this.entries.values()) {
      dispose();
    }
    this.entries.clear();
  }

  /**
   * Drop cached wrappers for accessors no longer present in the header tree.
   */
  pruneRendererCaches(liveAccessors: ReadonlySet<string>): void {
    for (const key of this.cellRendererCache.keys()) {
      if (!liveAccessors.has(key)) this.cellRendererCache.delete(key);
    }
    for (const key of this.headerRendererCache.keys()) {
      if (!liveAccessors.has(key)) this.headerRendererCache.delete(key);
    }
  }

  /** Test helper — number of live mounts. */
  get size(): number {
    return this.entries.size;
  }
}
