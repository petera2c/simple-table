import { mount, unmount } from "svelte";
import type { Component } from "svelte";
import type { MountRegistry } from "../MountRegistry";

/**
 * Wraps a Svelte 5 component into a function returning an HTMLElement,
 * matching the vanilla renderer contract expected by simple-table-core.
 * The mount is registered so core's `onRendererHostDiscard` can unmount it
 * (including any `<svelte:teleport>` / floating UI) when the host is discarded.
 */
export function wrapSvelteRenderer<P extends Record<string, any>>(
  registry: MountRegistry,
  component: Component<P>,
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const el = document.createElement("div");
    const instance = mount(component, { target: el, props });
    registry.register(el, () => {
      unmount(instance);
    });
    return el;
  };
}

/** Mount a Svelte component into a div for vanilla-only slots (e.g. table empty state). */
export function wrapSvelteStatic(registry: MountRegistry, component: Component): HTMLElement {
  const el = document.createElement("div");
  const instance = mount(component, { target: el, props: {} });
  registry.register(el, () => {
    unmount(instance);
  });
  return el;
}

/**
 * Converts a rendered Svelte component to an HTML string.
 * Used for icon props where vanilla expects string | HTMLElement | SVGSVGElement.
 */
export function svelteComponentToHtmlString(
  component: Component<Record<string, any>>,
  props: Record<string, any> = {},
): string {
  const el = document.createElement("div");
  const instance = mount(component, { target: el, props });
  const html = el.innerHTML;
  unmount(instance);
  return html;
}

/** Returns true if the value looks like a Svelte component (function or class). */
export function isSvelteComponent(value: unknown): value is Component<any> {
  return typeof value === "function";
}
