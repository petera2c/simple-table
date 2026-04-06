import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import type {
  ColumnEditorCustomRendererProps as VanillaColumnEditorCustomRendererProps,
  ColumnEditorRowRendererProps as VanillaColumnEditorRowRendererProps,
} from "simple-table-core";
import { domSlotToReactNode, mapColumnEditorRowComponentsForReact } from "./ImperativeDomSlot";

/**
 * After assigning innerHTML from renderToStaticMarkup, drop the temporary host
 * when markup produced exactly one element root (no extra wrapper in the tree).
 */
function unwrapStaticMarkupHost(container: HTMLDivElement): HTMLElement {
  const meaningful = Array.from(container.childNodes).filter(
    (n) =>
      n.nodeType !== Node.TEXT_NODE ||
      (n.textContent != null && n.textContent.trim() !== ""),
  );
  if (meaningful.length === 1 && meaningful[0] instanceof HTMLElement) {
    container.removeChild(meaningful[0]);
    return meaningful[0];
  }
  return container;
}

/**
 * Wraps a React component into a function that returns an HTMLElement, matching
 * the vanilla renderer contract expected by simple-table-core.
 *
 * Uses `createRoot` so event handlers work (same idea as Vue/Svelte/Solid adapters).
 * When core replaces or clears that DOM, the root is detached like other adapters.
 */
export function wrapReactRenderer<P extends object>(
  Component: React.ComponentType<P>,
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const container = document.createElement("div");
    const root = createRoot(container);
    flushSync(() => {
      root.render(<Component {...(props as any)} />);
    });
    return container;
  };
}

/**
 * Like {@link wrapReactRenderer} for column editor rows: core passes `components.*` as
 * live DOM nodes; this maps them to React hosts so consumers can use normal JSX.
 */
export function wrapReactColumnEditorRowRenderer(
  Component: React.ComponentType<object>,
): (props: VanillaColumnEditorRowRendererProps) => HTMLElement {
  return (props: VanillaColumnEditorRowRendererProps): HTMLElement => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const reactProps = {
      ...props,
      components: mapColumnEditorRowComponentsForReact(props.components),
    };
    flushSync(() => {
      root.render(<Component {...(reactProps as any)} />);
    });
    return container;
  };
}

/**
 * Maps `searchSection` / `listSection` / `resetSection` HTMLElement slots for
 * `columnEditorConfig.customRenderer` the same way as row slots.
 */
export function wrapReactColumnEditorCustomRenderer(
  Component: React.ComponentType<object>,
): (props: VanillaColumnEditorCustomRendererProps) => HTMLElement {
  return (props: VanillaColumnEditorCustomRendererProps): HTMLElement => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const reactProps = {
      ...props,
      searchSection: props.searchSection ? domSlotToReactNode(props.searchSection) : null,
      listSection: domSlotToReactNode(props.listSection),
      resetSection: props.resetSection ? domSlotToReactNode(props.resetSection) : null,
    };
    flushSync(() => {
      root.render(<Component {...(reactProps as any)} />);
    });
    return container;
  };
}

/**
 * Like wrapReactRenderer but uses `display: contents` so layout is unchanged
 * when core appends this node (no extra box vs a plain div).
 * flushSync ensures the tree is committed before the host is returned — required
 * when vanilla renders cells from a React effect, where a deferred nested root
 * would otherwise yield an empty container.
 */
export function wrapReactRendererIntoFragment<P extends object>(
  Component: React.ComponentType<P>,
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const container = document.createElement("div");
    container.style.display = "contents";
    const root = createRoot(container);
    flushSync(() => {
      root.render(<Component {...(props as any)} />);
    });
    return container;
  };
}

/**
 * Renders a static ReactNode into an HTMLElement.
 * Used for props like tableEmptyStateRenderer that are not called with arguments.
 */
export function wrapReactNode(node: React.ReactNode): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<>{node}</>);
  return unwrapStaticMarkupHost(container);
}

/**
 * Converts a ReactNode to an HTML string using server-side static rendering.
 * Used for icon props where the vanilla table expects a string | HTMLElement | SVGSVGElement.
 * Uses renderToStaticMarkup so it works synchronously from any context — including
 * inside a useEffect — unlike createRoot + flushSync which silently produces empty
 * output when called during React 18's passive effects phase.
 */
export function reactNodeToHtmlString(node: React.ReactNode): string {
  return renderToStaticMarkup(<>{node}</>);
}

/** Returns true if the value is a React component (function or class). */
export function isReactComponent(value: unknown): value is React.ComponentType<any> {
  return typeof value === "function";
}
