import { mount } from "svelte";
import type { Component } from "svelte";

/**
 * Wraps a Svelte 5 component into a function returning an HTMLElement,
 * matching the vanilla renderer contract expected by simple-table-core.
 */
export function wrapSvelteRenderer<P extends Record<string, any>>(
  component: Component<P>
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const el = document.createElement("div");
    mount(component, { target: el, props });
    return el;
  };
}

/**
 * Converts a rendered Svelte component to an HTML string.
 * Used for icon props where vanilla expects string | HTMLElement | SVGSVGElement.
 */
export function svelteComponentToHtmlString(
  component: Component<Record<string, any>>,
  props: Record<string, any> = {}
): string {
  const el = document.createElement("div");
  mount(component, { target: el, props });
  return el.innerHTML;
}

/** Returns true if the value looks like a Svelte component (function or class). */
export function isSvelteComponent(value: unknown): value is Component<any> {
  return typeof value === "function";
}
