/**
 * Tracks imperative Solid mounts created for custom cell/header/footer
 * renderers so they can be torn down when core discards their host elements.
 *
 * Core invokes `onRendererHostDiscard(host)` — wired to {@link disposeHost} —
 * immediately before permanently discarding a host (header refresh on sort,
 * cell content rebuild, cell/header removal). Without this, `innerHTML = ""`
 * detaches the mount target while the Solid reactive tree (and any portal /
 * floating UI) stays alive.
 */
const MOUNT_ID_ATTR = "data-st-mount-id";

export class MountRegistry {
  private entries = new Map<string, () => void>();
  private nextId = 0;

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
    for (const dispose of this.entries.values()) {
      dispose();
    }
    this.entries.clear();
  }

  /** Test helper — number of live mounts. */
  get size(): number {
    return this.entries.size;
  }
}
