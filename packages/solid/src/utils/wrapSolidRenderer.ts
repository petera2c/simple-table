import { render, createComponent } from "solid-js/web";
import type { Component } from "solid-js";
import type { MountRegistry } from "../MountRegistry";

/**
 * Wraps a Solid component into a function that returns an HTMLElement, matching
 * the vanilla renderer contract expected by simple-table-core.
 *
 * Solid's render() is synchronous, so no flushSync equivalent is needed.
 * The dispose handle is registered so core's `onRendererHostDiscard` can tear
 * down the reactive tree (and any portal / floating UI) when the host is discarded.
 */
export function wrapSolidRenderer<P extends object>(
  registry: MountRegistry,
  component: Component<P>,
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const el = document.createElement("div");
    const dispose = render(() => createComponent(component, props as any), el);
    registry.register(el, dispose);
    return el;
  };
}

/**
 * Like {@link wrapSolidRenderer}, but reuses one wrapper per accessor so
 * unstable column rebuilds keep a stable function identity on HeaderObject.
 */
export function wrapCachedSolidRenderer<P extends object>(
  registry: MountRegistry,
  accessor: string,
  kind: "cell" | "header",
  component: Component<P>,
): (props: P) => HTMLElement {
  const cache = kind === "cell" ? registry.cellRendererCache : registry.headerRendererCache;
  const existing = cache.get(accessor);
  if (existing) {
    existing.component = component;
    return existing.wrapped as (props: P) => HTMLElement;
  }

  const slot: { component: Component<P>; wrapped: (props: P) => HTMLElement } = {
    component,
    wrapped: null as unknown as (props: P) => HTMLElement,
  };
  const wrapped = (props: P): HTMLElement => {
    const el = document.createElement("div");
    const dispose = render(() => createComponent(slot.component, props as any), el);
    registry.register(el, dispose);
    return el;
  };
  slot.wrapped = wrapped;
  cache.set(accessor, slot);
  return wrapped;
}

/**
 * Renders a static Solid JSX node (already evaluated) into an HTMLElement.
 * Used for props like tableEmptyStateRenderer that are not called with arguments.
 */
export function wrapSolidNode(registry: MountRegistry, node: any): HTMLElement {
  const el = document.createElement("div");
  const dispose = render(() => node, el);
  registry.register(el, dispose);
  return el;
}

/**
 * Converts a Solid node to an HTML string.
 * Used for icon props where vanilla expects string | HTMLElement | SVGSVGElement.
 */
export function solidNodeToHtmlString(node: any): string {
  const el = document.createElement("div");
  const dispose = render(() => node, el);
  const html = el.innerHTML;
  dispose();
  return html;
}

/** Returns true if the value is a Solid component (a function). */
export function isSolidComponent(value: unknown): value is Component<any> {
  return typeof value === "function";
}
