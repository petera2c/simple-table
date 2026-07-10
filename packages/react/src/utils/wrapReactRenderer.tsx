import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type {
  ColumnEditorCustomRendererProps as VanillaColumnEditorCustomRendererProps,
  ColumnEditorRowRendererProps as VanillaColumnEditorRowRendererProps,
  HeaderRendererProps as VanillaHeaderRendererProps,
  HeaderDropdownProps as VanillaHeaderDropdownProps,
  FooterRendererProps as VanillaFooterRendererProps,
  RowButtonProps as VanillaRowButtonProps,
} from "simple-table-core";
import type { PortalBridge } from "../PortalBridge";
import {
  domSlotToReactNode,
  mapColumnEditorRowComponentsForReact,
  mapHeaderRendererComponentsForReact,
  mapFooterIconsForReact,
} from "./ImperativeDomSlot";

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
 * Marks a function produced by the wrap helpers below. Controlled-header flows
 * often push core's already-wrapped renderers back through React state into
 * {@link buildVanillaConfig}; without this marker those functions would be
 * wrapped again (a portal-registering wrapper around another portal-registering
 * wrapper), which can freeze the page after autofit / width sync.
 */
export const ST_WRAPPED_RENDERER = Symbol.for("simple-table.wrappedRenderer");

/** True when `fn` was produced by one of the wrap helpers in this module. */
export function isWrappedRenderer(fn: unknown): boolean {
  return typeof fn === "function" && Boolean((fn as any)[ST_WRAPPED_RENDERER]);
}

function markWrapped<T extends (...args: any[]) => any>(fn: T): T {
  (fn as any)[ST_WRAPPED_RENDERER] = true;
  return fn;
}

/**
 * Wraps a React component into a function that returns an HTMLElement, matching
 * the vanilla renderer contract expected by simple-table-core.
 *
 * The component is registered with the {@link PortalBridge} rather than mounted
 * in its own `createRoot`, so it renders as part of the host React tree and
 * inherits context. The returned container is filled on the host's next render.
 *
 * Idempotent: if `Component` is already a wrapped vanilla renderer, it is
 * returned unchanged so controlled `defaultHeaders` updates cannot nest wraps.
 */
export function wrapReactRenderer<P extends object>(
  bridge: PortalBridge,
  Component: React.ComponentType<P>,
): (props: P) => HTMLElement {
  if (isWrappedRenderer(Component)) {
    return Component as unknown as (props: P) => HTMLElement;
  }
  return markWrapped((props: P): HTMLElement => {
    const container = document.createElement("div");
    bridge.register(<Component {...(props as any)} />, container);
    return container;
  });
}

/**
 * Like {@link wrapReactRenderer} but uses `display: contents` so layout is
 * unchanged when core appends this node (no extra box vs a plain div). Used for
 * cell renderers.
 */
export function wrapReactRendererIntoFragment<P extends object>(
  bridge: PortalBridge,
  Component: React.ComponentType<P>,
): (props: P) => HTMLElement {
  if (isWrappedRenderer(Component)) {
    return Component as unknown as (props: P) => HTMLElement;
  }
  return markWrapped((props: P): HTMLElement => {
    const container = document.createElement("div");
    container.style.display = "contents";
    bridge.register(<Component {...(props as any)} />, container);
    return container;
  });
}

/**
 * Like {@link wrapReactRenderer} for header renderers: core passes `components.*`
 * (sortIcon / filterIcon / collapseIcon / labelContent) as live DOM nodes; this
 * bridges them to React nodes so consumers can use them directly in JSX.
 *
 * Reuses a single portal host per wrapped column so sort/filter icon refreshes
 * update props in place (via {@link PortalBridge.update}) instead of remounting
 * the React subtree and wiping local state.
 */
export function wrapReactHeaderRenderer(
  bridge: PortalBridge,
  Component: React.ComponentType<VanillaHeaderRendererProps>,
): (props: VanillaHeaderRendererProps) => HTMLElement {
  if (isWrappedRenderer(Component)) {
    return Component as unknown as (props: VanillaHeaderRendererProps) => HTMLElement;
  }
  // One host per column wrapper. transformHeader wraps each column separately,
  // so this closure is not shared across accessors.
  let host: HTMLElement | null = null;
  return markWrapped((props: VanillaHeaderRendererProps): HTMLElement => {
    const reactProps = {
      ...props,
      components: mapHeaderRendererComponentsForReact(props.components),
    };
    const node = <Component {...(reactProps as any)} />;
    if (host && bridge.update(host, node)) {
      return host;
    }
    host = document.createElement("div");
    bridge.register(node, host);
    return host;
  });
}

/**
 * Like {@link wrapReactHeaderRenderer} for the header dropdown, which shares the
 * same `components` slot shape.
 */
export function wrapReactHeaderDropdown(
  bridge: PortalBridge,
  Component: React.ComponentType<VanillaHeaderDropdownProps>,
): (props: VanillaHeaderDropdownProps) => HTMLElement {
  if (isWrappedRenderer(Component)) {
    return Component as unknown as (props: VanillaHeaderDropdownProps) => HTMLElement;
  }
  return markWrapped((props: VanillaHeaderDropdownProps): HTMLElement => {
    const container = document.createElement("div");
    const reactProps = {
      ...props,
      components: mapHeaderRendererComponentsForReact(props.components),
    };
    bridge.register(<Component {...(reactProps as any)} />, container);
    return container;
  });
}

/**
 * Like {@link wrapReactRenderer} for footer renderers: bridges the `nextIcon` /
 * `prevIcon` pagination slots (live DOM) to React nodes for JSX use.
 */
export function wrapReactFooterRenderer(
  bridge: PortalBridge,
  Component: React.ComponentType<VanillaFooterRendererProps>,
): (props: VanillaFooterRendererProps) => HTMLElement {
  if (isWrappedRenderer(Component)) {
    return Component as unknown as (props: VanillaFooterRendererProps) => HTMLElement;
  }
  return markWrapped((props: VanillaFooterRendererProps): HTMLElement => {
    const container = document.createElement("div");
    const reactProps = {
      ...props,
      ...mapFooterIconsForReact({ nextIcon: props.nextIcon, prevIcon: props.prevIcon }),
    };
    bridge.register(<Component {...(reactProps as any)} />, container);
    return container;
  });
}

/**
 * Like {@link wrapReactRenderer} for column editor rows: core passes `components.*`
 * as live DOM nodes; this maps them to React nodes so consumers can use normal JSX.
 */
export function wrapReactColumnEditorRowRenderer(
  bridge: PortalBridge,
  Component: React.ComponentType<object>,
): (props: VanillaColumnEditorRowRendererProps) => HTMLElement {
  if (isWrappedRenderer(Component)) {
    return Component as unknown as (props: VanillaColumnEditorRowRendererProps) => HTMLElement;
  }
  return markWrapped((props: VanillaColumnEditorRowRendererProps): HTMLElement => {
    const container = document.createElement("div");
    const reactProps = {
      ...props,
      components: mapColumnEditorRowComponentsForReact(props.components),
    };
    bridge.register(<Component {...(reactProps as any)} />, container);
    return container;
  });
}

/**
 * Maps `searchSection` / `listSection` / `resetSection` HTMLElement slots for
 * `columnEditorConfig.customRenderer` the same way as row slots.
 */
export function wrapReactColumnEditorCustomRenderer(
  bridge: PortalBridge,
  Component: React.ComponentType<object>,
): (props: VanillaColumnEditorCustomRendererProps) => HTMLElement {
  if (isWrappedRenderer(Component)) {
    return Component as unknown as (props: VanillaColumnEditorCustomRendererProps) => HTMLElement;
  }
  return markWrapped((props: VanillaColumnEditorCustomRendererProps): HTMLElement => {
    const container = document.createElement("div");
    const reactProps = {
      ...props,
      searchSection: props.searchSection ? domSlotToReactNode(props.searchSection) : null,
      listSection: domSlotToReactNode(props.listSection),
      resetSection: props.resetSection ? domSlotToReactNode(props.resetSection) : null,
    };
    bridge.register(<Component {...(reactProps as any)} />, container);
    return container;
  });
}

/**
 * Wraps a React row-button render function into the vanilla `RowButton`
 * contract `(props) => HTMLElement`. Like {@link wrapReactRendererIntoFragment},
 * it registers the element with the {@link PortalBridge} so the button renders
 * inside the host React tree — preserving interactivity (onClick) and context —
 * and uses `display: contents` so core's `st-row-button` wrapper styles the
 * actual button rather than an extra box.
 */
export function wrapReactRowButton(
  bridge: PortalBridge,
  Component: React.ComponentType<VanillaRowButtonProps>,
): (props: VanillaRowButtonProps) => HTMLElement {
  if (isWrappedRenderer(Component)) {
    return Component as unknown as (props: VanillaRowButtonProps) => HTMLElement;
  }
  return markWrapped((props: VanillaRowButtonProps): HTMLElement => {
    const container = document.createElement("div");
    container.style.display = "contents";
    bridge.register(<Component {...props} />, container);
    return container;
  });
}

/**
 * Renders a static ReactNode into an HTMLElement using server-side static
 * rendering. Used for props like tableEmptyStateRenderer that are static markup
 * (not interactive and not called with arguments). These do not need context.
 */
export function wrapReactNode(node: React.ReactNode): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<>{node}</>);
  return unwrapStaticMarkupHost(container);
}

/**
 * Converts a ReactNode to an HTML string using server-side static rendering.
 * Used for icon props where the vanilla table expects a string | HTMLElement | SVGSVGElement.
 */
export function reactNodeToHtmlString(node: React.ReactNode): string {
  return renderToStaticMarkup(<>{node}</>);
}

/** Returns true if the value is a React component (function or class). */
export function isReactComponent(value: unknown): value is React.ComponentType<any> {
  return typeof value === "function";
}
