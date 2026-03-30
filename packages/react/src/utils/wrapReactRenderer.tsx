import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * Wraps a React component into a function that returns an HTMLElement, matching
 * the vanilla renderer contract expected by simple-table-core.
 *
 * Uses renderToStaticMarkup for synchronous rendering that is safe to call from
 * any context (including inside useEffect) without triggering React 18's
 * "flushSync was called from inside a lifecycle method" warning.
 */
export function wrapReactRenderer<P extends object>(
  Component: React.ComponentType<P>
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(<Component {...(props as any)} />);
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
  return container;
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
