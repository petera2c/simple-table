import { afterEach, describe, expect, it, vi } from "vitest";

const { mount, unmount } = vi.hoisted(() => ({
  mount: vi.fn(() => ({ __instance: true })),
  unmount: vi.fn(),
}));

vi.mock("svelte", () => ({
  mount,
  unmount,
}));

import { MountRegistry } from "../MountRegistry";
import { wrapSvelteRenderer } from "../utils/wrapSvelteRenderer";

afterEach(() => {
  mount.mockClear();
  unmount.mockClear();
});

describe("wrapSvelteRenderer — mount registry wiring", () => {
  it("registers the mount so disposeHost unmounts the Svelte instance", () => {
    const registry = new MountRegistry();
    const FakeComponent = (() => null) as any;
    const renderToDom = wrapSvelteRenderer(registry, FakeComponent);
    const container = renderToDom({ label: "Score" } as any);

    expect(mount).toHaveBeenCalledTimes(1);
    expect(registry.size).toBe(1);
    expect(container.getAttribute("data-st-mount-id")).toMatch(/^st-mount-/);

    registry.disposeHost(container);
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(registry.size).toBe(0);
  });
});
