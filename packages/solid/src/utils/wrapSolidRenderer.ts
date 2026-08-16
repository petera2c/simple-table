import { mergeProps, createSignal, type Component } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { render, createComponent, Dynamic } from "solid-js/web";
import type {
  ColumnEditorRowRendererProps as VanillaColumnEditorRowRendererProps,
  HeaderRendererProps as VanillaHeaderRendererProps,
} from "simple-table-core";
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
 * Mount a Solid tree once and push subsequent prop updates through a store so
 * the tree is not remounted (Solid cannot re-call `render()` to patch).
 *
 * A plain `createSignal` + re-running `createComponent(Comp, snapshot)` does not
 * give the child reactive prop getters; `createStore` + `reconcile` keeps one
 * props object whose fields update in place for the live tree to read.
 */
function mountReusableSolidHost<P extends object>(
  registry: MountRegistry,
  getComponent: () => Component<P>,
  props: P,
): { host: HTMLElement; setProps: (p: P) => void } {
  const host = document.createElement("div");
  const [store, setStore] = createStore(props as object);
  const [comp, setComp] = createSignal<Component<P>>(getComponent());
  const dispose = render(() => {
    return createComponent(Dynamic as any, mergeProps(store, {
      get component() {
        return comp();
      },
    }));
  }, host);
  registry.register(host, dispose);
  return {
    host,
    setProps: (p: P) => {
      setComp(() => getComponent());
      setStore(reconcile(p as object));
    },
  };
}

/**
 * Header renderer wrapper that reuses one host element so sort/filter icon
 * refreshes update props in place (via a reactive props store) instead of
 * remounting the Solid subtree and wiping local state. Mirrors Vue's
 * {@link wrapVueHeaderRenderer} / React's {@link wrapReactHeaderRenderer}.
 */
export function wrapSolidHeaderRenderer(
  registry: MountRegistry,
  component: Component<VanillaHeaderRendererProps>,
): (props: VanillaHeaderRendererProps) => HTMLElement {
  let host: HTMLElement | null = null;
  let setProps: ((p: VanillaHeaderRendererProps) => void) | null = null;
  return (props: VanillaHeaderRendererProps): HTMLElement => {
    if (host && registry.isRegistered(host) && setProps) {
      setProps(props);
      return host;
    }
    const mounted = mountReusableSolidHost(registry, () => component, props);
    host = mounted.host;
    setProps = mounted.setProps;
    return host;
  };
}

/**
 * Like {@link wrapSolidRenderer}, but reuses one wrapper per accessor so
 * unstable column rebuilds keep a stable function identity on ColumnDef.
 *
 * For `kind: "header"`, also reuses a single mount host (Vue
 * {@link wrapCachedVueRenderer} / React {@link wrapCachedHeaderRenderer}) so
 * sort/filter refreshes preserve state.
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

  if (kind === "header") {
    let host: HTMLElement | null = null;
    let setProps: ((p: P) => void) | null = null;
    const wrapped = (props: P): HTMLElement => {
      if (host && registry.isRegistered(host) && setProps) {
        setProps(props);
        return host;
      }
      const mounted = mountReusableSolidHost(registry, () => slot.component, props);
      host = mounted.host;
      setProps = mounted.setProps;
      return host;
    };
    slot.wrapped = wrapped;
    cache.set(accessor, slot);
    return wrapped;
  }

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
 * Column-editor row renderer: one host per `accessor` so popout list rebuilds
 * update in place instead of remounting Solid state (mirrors Vue/React).
 */
export function wrapSolidColumnEditorRowRenderer(
  registry: MountRegistry,
  component: Component<VanillaColumnEditorRowRendererProps>,
): (props: VanillaColumnEditorRowRendererProps) => HTMLElement {
  const hosts = new Map<
    string,
    { host: HTMLElement; setProps: (p: VanillaColumnEditorRowRendererProps) => void }
  >();
  return (props: VanillaColumnEditorRowRendererProps): HTMLElement => {
    const key = String(props.accessor);
    const existing = hosts.get(key);
    if (existing && registry.isRegistered(existing.host)) {
      existing.setProps(props);
      return existing.host;
    }
    const mounted = mountReusableSolidHost(registry, () => component, props);
    hosts.set(key, mounted);
    return mounted.host;
  };
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
