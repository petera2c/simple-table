import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * Wraps a React component into a function that returns an HTMLElement, matching
 * the vanilla renderer contract expected by simple-table-core.
 *
 * Uses flushSync to ensure the React tree is fully painted into the container
 * before it is returned to the vanilla rendering pipeline.
 */
export function wrapReactRenderer<P extends object>(
  Component: React.ComponentType<P>
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
 * Renders a static ReactNode into an HTMLElement.
 * Used for props like tableEmptyStateRenderer that are not called with arguments.
 */
export function wrapReactNode(node: React.ReactNode): HTMLElement {
  const container = document.createElement("div");
  const root = createRoot(container);
  flushSync(() => {
    root.render(<>{node}</>);
  });
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
