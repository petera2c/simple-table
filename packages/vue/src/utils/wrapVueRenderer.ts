import { render, h, type Component, type VNode } from "vue";
import type { MountRegistry } from "../MountRegistry";

/**
 * Wraps a Vue 3 component into a function that returns an HTMLElement, matching
 * the vanilla renderer contract expected by simple-table-core.
 *
 * Uses Vue 3's low-level render() + h() which is synchronous, so the element
 * is fully populated before it is returned to the vanilla rendering pipeline.
 * The mount is registered so core's `onRendererHostDiscard` can unmount it
 * (including any `<Teleport>` / floating UI) when the host is discarded.
 */
export function wrapVueRenderer<P extends object>(
  registry: MountRegistry,
  component: Component,
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const el = document.createElement("div");
    render(h(component, props as any), el);
    registry.register(el, () => render(null, el));
    return el;
  };
}

/**
 * Like {@link wrapVueRenderer}, but reuses one wrapper per accessor so
 * unstable column rebuilds keep a stable function identity on HeaderObject.
 */
export function wrapCachedVueRenderer<P extends object>(
  registry: MountRegistry,
  accessor: string,
  kind: "cell" | "header",
  component: Component,
): (props: P) => HTMLElement {
  const cache = kind === "cell" ? registry.cellRendererCache : registry.headerRendererCache;
  const existing = cache.get(accessor);
  if (existing) {
    existing.component = component;
    return existing.wrapped as (props: P) => HTMLElement;
  }

  const slot: { component: Component; wrapped: (props: P) => HTMLElement } = {
    component,
    wrapped: null as unknown as (props: P) => HTMLElement,
  };
  const wrapped = (props: P): HTMLElement => {
    const el = document.createElement("div");
    render(h(slot.component, props as any), el);
    registry.register(el, () => render(null, el));
    return el;
  };
  slot.wrapped = wrapped;
  cache.set(accessor, slot);
  return wrapped;
}

/**
 * Renders a static VNode into an HTMLElement.
 * Used for props like tableEmptyStateRenderer that are not called with arguments.
 */
export function wrapVueNode(registry: MountRegistry, node: VNode): HTMLElement {
  const el = document.createElement("div");
  render(node, el);
  registry.register(el, () => render(null, el));
  return el;
}

/**
 * Converts a VNode to an HTML string.
 * Used for icon props where vanilla expects string | HTMLElement | SVGSVGElement.
 */
export function vueNodeToHtmlString(node: VNode): string {
  const el = document.createElement("div");
  render(node, el);
  const html = el.innerHTML;
  // Unmount by rendering null into the container.
  render(null, el);
  return html;
}

/** Returns true if the value is a Vue component (object or function). */
export function isVueComponent(value: unknown): value is Component {
  return typeof value === "object" || typeof value === "function";
}
