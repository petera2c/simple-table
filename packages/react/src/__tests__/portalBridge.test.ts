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

describe("PortalBridge — attach prunes detached containers", () => {
  it("removes entries whose container core has detached from the observed root", async () => {
    const bridge = new PortalBridge();

    const root = document.createElement("div");
    document.body.appendChild(root);
    const container = document.createElement("div");
    root.appendChild(container);

    bridge.register("a", container);
    await flush();
    expect(bridge.getSnapshot()).toHaveLength(1);

    const disconnect = bridge.attach(root);

    // Simulate core recycling the cell: detach the container from the tree.
    root.removeChild(container);
    await flush();

    expect(bridge.getSnapshot()).toHaveLength(0);

    disconnect();
    root.remove();
  });

  it("keeps entries whose container is detached and synchronously reattached", async () => {
    const bridge = new PortalBridge();

    const root = document.createElement("div");
    document.body.appendChild(root);
    const container = document.createElement("div");
    root.appendChild(container);

    bridge.register("a", container);
    await flush();

    const disconnect = bridge.attach(root);

    // A synchronous detach+reattach (e.g. core moving a cell during animation)
    // must not be mistaken for a removal — pruning is deferred to a microtask.
    root.removeChild(container);
    root.appendChild(container);
    await flush();

    expect(bridge.getSnapshot()).toHaveLength(1);

    disconnect();
    root.remove();
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
