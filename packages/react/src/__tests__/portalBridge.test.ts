import { afterEach, describe, expect, it, vi } from "vitest";
import { PortalBridge } from "../PortalBridge";

const els: HTMLElement[] = [];

/** A fresh detached container, tracked for cleanup. */
function makeContainer(): HTMLElement {
  const el = document.createElement("div");
  els.push(el);
  return el;
}

/** Flush microtasks + the MutationObserver/timer queue. */
const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

afterEach(() => {
  for (const el of els.splice(0)) el.remove();
});

describe("PortalBridge — registration lifecycle", () => {
  it("registers an entry and removes it on unregister", async () => {
    const bridge = new PortalBridge();
    const { id, unregister } = bridge.register("a", makeContainer());

    expect(id).toMatch(/^st-portal-/);
    expect(bridge.getSnapshot()).toHaveLength(1);

    unregister();
    await flush();
    expect(bridge.getSnapshot()).toHaveLength(0);
  });
});

describe("PortalBridge — snapshot stability for useSyncExternalStore", () => {
  it("returns a stable reference until a change is committed via emit", async () => {
    const bridge = new PortalBridge();
    bridge.register("a", makeContainer());
    await flush(); // let the initial emit settle

    const s1 = bridge.getSnapshot();
    const s2 = bridge.getSnapshot();
    expect(s1).toBe(s2);
    expect(s1).toHaveLength(1);

    // A new register mutates the map but the snapshot stays referentially stable
    // until the batched emit runs (so React does not see a tearing read).
    bridge.register("b", makeContainer());
    const s3 = bridge.getSnapshot();
    expect(s3).toBe(s1);
    expect(s3).toHaveLength(1);

    await flush();
    const s4 = bridge.getSnapshot();
    expect(s4).not.toBe(s1);
    expect(s4).toHaveLength(2);
  });
});

describe("PortalBridge — emit batching", () => {
  it("coalesces a burst of registrations into a single notification", async () => {
    const bridge = new PortalBridge();
    const listener = vi.fn();
    bridge.subscribe(listener);

    bridge.register("a", makeContainer());
    bridge.register("b", makeContainer());
    bridge.register("c", makeContainer());

    expect(listener).not.toHaveBeenCalled();
    await flush();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(bridge.getSnapshot()).toHaveLength(3);
  });

  it("stops notifying after unsubscribe", async () => {
    const bridge = new PortalBridge();
    const listener = vi.fn();
    const unsubscribe = bridge.subscribe(listener);
    unsubscribe();

    bridge.register("a", makeContainer());
    await flush();
    expect(listener).not.toHaveBeenCalled();
  });
});

describe("PortalBridge — register tags the container", () => {
  it("stamps data-st-portal-id on the container so disposeHost can find it", () => {
    const bridge = new PortalBridge();
    const container = makeContainer();
    const { id } = bridge.register("a", container);
    expect(container.getAttribute("data-st-portal-id")).toBe(id);
  });
});

describe("PortalBridge — update in place", () => {
  it("replaces the node for a registered container without changing id or count", async () => {
    const bridge = new PortalBridge();
    const container = makeContainer();
    const { id } = bridge.register("a", container);
    await flush();

    expect(bridge.update(container, "b")).toBe(true);
    await flush();

    const snapshot = bridge.getSnapshot();
    expect(snapshot).toHaveLength(1);
    expect(snapshot[0].id).toBe(id);
    expect(snapshot[0].container).toBe(container);
    expect(snapshot[0].node).toBe("b");
    expect(container.getAttribute("data-st-portal-id")).toBe(id);
  });

  it("returns false after disposeHost so callers can re-register", async () => {
    const bridge = new PortalBridge();
    const container = makeContainer();
    bridge.register("a", container);
    await flush();

    bridge.disposeHost(container);
    await flush();

    expect(bridge.update(container, "b")).toBe(false);
    expect(bridge.getSnapshot()).toHaveLength(0);
  });
});

describe("PortalBridge — disposeHost authoritative teardown", () => {
  it("unregisters the entry when the discarded host IS the registered container", async () => {
    const bridge = new PortalBridge();
    const container = makeContainer();
    bridge.register("a", container);
    await flush();
    expect(bridge.getSnapshot()).toHaveLength(1);

    // Core signals it is about to permanently discard this cell host.
    bridge.disposeHost(container);
    await flush();
    expect(bridge.getSnapshot()).toHaveLength(0);
  });

  it("unregisters nested portal containers inside a discarded host", async () => {
    const bridge = new PortalBridge();
    // A cell host whose content holds two portal containers (e.g. a renderer
    // returning a fragment with multiple portalled children).
    const host = makeContainer();
    const inner1 = document.createElement("div");
    const inner2 = document.createElement("div");
    host.appendChild(inner1);
    host.appendChild(inner2);

    bridge.register("first", inner1);
    bridge.register("second", inner2);
    await flush();
    expect(bridge.getSnapshot()).toHaveLength(2);

    bridge.disposeHost(host);
    await flush();
    expect(bridge.getSnapshot()).toHaveLength(0);
  });

  it("is a no-op when the discarded host owns no portal (reuse path)", async () => {
    const bridge = new PortalBridge();
    const container = makeContainer();
    bridge.register("a", container);
    await flush();
    expect(bridge.getSnapshot()).toHaveLength(1);

    // A reused/reparented host that was never registered (and holds no tagged
    // descendants) must not tear down unrelated entries.
    const unrelated = makeContainer();
    bridge.disposeHost(unrelated);
    await flush();
    expect(bridge.getSnapshot()).toHaveLength(1);
  });
});

describe("PortalBridge — clear", () => {
  it("empties all entries and notifies subscribers", async () => {
    const bridge = new PortalBridge();
    const listener = vi.fn();

    bridge.register("a", makeContainer());
    bridge.register("b", makeContainer());
    await flush();
    listener.mockClear?.();

    bridge.subscribe(listener);
    bridge.clear();

    expect(bridge.getSnapshot()).toHaveLength(0);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
