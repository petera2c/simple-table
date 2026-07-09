import { afterEach, describe, expect, it, vi } from "vitest";
import { MountRegistry } from "../MountRegistry";

const els: HTMLElement[] = [];

function makeEl(): HTMLElement {
  const el = document.createElement("div");
  els.push(el);
  return el;
}

afterEach(() => {
  for (const el of els.splice(0)) el.remove();
});

describe("MountRegistry", () => {
  it("registers a mount and disposes it when the host is the container", () => {
    const registry = new MountRegistry();
    const container = makeEl();
    const dispose = vi.fn();
    registry.register(container, dispose);

    expect(registry.size).toBe(1);
    expect(container.getAttribute("data-st-mount-id")).toMatch(/^st-mount-/);

    registry.disposeHost(container);
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(registry.size).toBe(0);
  });

  it("disposes nested mounts inside a discarded host", () => {
    const registry = new MountRegistry();
    const host = makeEl();
    const inner1 = document.createElement("div");
    const inner2 = document.createElement("div");
    host.appendChild(inner1);
    host.appendChild(inner2);

    const d1 = vi.fn();
    const d2 = vi.fn();
    registry.register(inner1, d1);
    registry.register(inner2, d2);

    registry.disposeHost(host);
    expect(d1).toHaveBeenCalledTimes(1);
    expect(d2).toHaveBeenCalledTimes(1);
    expect(registry.size).toBe(0);
  });

  it("is a no-op for hosts with no registered mounts", () => {
    const registry = new MountRegistry();
    const container = makeEl();
    const dispose = vi.fn();
    registry.register(container, dispose);

    registry.disposeHost(makeEl());
    expect(dispose).not.toHaveBeenCalled();
    expect(registry.size).toBe(1);
  });

  it("clear() disposes every tracked mount", () => {
    const registry = new MountRegistry();
    const d1 = vi.fn();
    const d2 = vi.fn();
    registry.register(makeEl(), d1);
    registry.register(makeEl(), d2);

    registry.clear();
    expect(d1).toHaveBeenCalledTimes(1);
    expect(d2).toHaveBeenCalledTimes(1);
    expect(registry.size).toBe(0);
  });
});
