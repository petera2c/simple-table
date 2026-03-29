import { render, createComponent } from "solid-js/web";
import type { Component } from "solid-js";

/**
 * Wraps a Solid component into a function that returns an HTMLElement, matching
 * the vanilla renderer contract expected by simple-table-core.
 *
 * Solid's render() is synchronous, so no flushSync equivalent is needed.
 */
export function wrapSolidRenderer<P extends object>(
  component: Component<P>
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const el = document.createElement("div");
    render(() => createComponent(component, props as any), el);
    return el;
  };
}

/**
 * Renders a static Solid JSX node (already evaluated) into an HTMLElement.
 * Used for props like tableEmptyStateRenderer that are not called with arguments.
 */
export function wrapSolidNode(node: any): HTMLElement {
  const el = document.createElement("div");
  render(() => node, el);
  return el;
}

/**
 * Converts a Solid node to an HTML string.
 * Used for icon props where vanilla expects string | HTMLElement | SVGSVGElement.
 */
export function solidNodeToHtmlString(node: any): string {
  const el = document.createElement("div");
  render(() => node, el);
  const html = el.innerHTML;
  // Solid does not expose an unmount API for individual renders at this level;
  // the container is GC'd naturally since it's not attached to the document.
  return html;
}

/** Returns true if the value is a Solid component (a function). */
export function isSolidComponent(value: unknown): value is Component<any> {
  return typeof value === "function";
}
