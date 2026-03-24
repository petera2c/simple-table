import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";

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
 * Converts a ReactNode to an HTML string by rendering it into a temporary container.
 * Used for icon props where the vanilla table expects a string | HTMLElement | SVGSVGElement.
 * The root is immediately unmounted after extracting the HTML.
 */
export function reactNodeToHtmlString(node: React.ReactNode): string {
  const container = document.createElement("div");
  const root = createRoot(container);
  flushSync(() => {
    root.render(<>{node}</>);
  });
  const html = container.innerHTML;
  root.unmount();
  return html;
}

/** Returns true if the value is a React component (function or class). */
export function isReactComponent(value: unknown): value is React.ComponentType<any> {
  return typeof value === "function";
}
