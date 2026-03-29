import { render, h, type Component, type VNode } from "vue";

/**
 * Wraps a Vue 3 component into a function that returns an HTMLElement, matching
 * the vanilla renderer contract expected by simple-table-core.
 *
 * Uses Vue 3's low-level render() + h() which is synchronous, so the element
 * is fully populated before it is returned to the vanilla rendering pipeline.
 */
export function wrapVueRenderer<P extends object>(
  component: Component
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const el = document.createElement("div");
    render(h(component, props as any), el);
    return el;
  };
}

/**
 * Renders a static VNode into an HTMLElement.
 * Used for props like tableEmptyStateRenderer that are not called with arguments.
 */
export function wrapVueNode(node: VNode): HTMLElement {
  const el = document.createElement("div");
  render(node, el);
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
