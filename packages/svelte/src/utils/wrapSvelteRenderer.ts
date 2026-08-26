import { mount, unmount } from "svelte";
import { createClassComponent } from "svelte/legacy";
import type { Component, SvelteComponent } from "svelte";
import type {
  ColumnEditorRowRendererProps as VanillaColumnEditorRowRendererProps,
  HeaderRendererProps as VanillaHeaderRendererProps,
} from "simple-table-core";
import type { MountRegistry } from "../MountRegistry";

const ST_RENDERER_GENERATION = Symbol.for("simple-table.rendererGeneration");

type ClassInstance = SvelteComponent & { $set: (props: Record<string, any>) => void; $destroy: () => void };

/**
 * Imperative mount that supports prop updates via `$set` (Svelte 5 `mount`
 * has no updater). Uses `svelte/legacy` `createClassComponent`, which wraps
 * `mount` with a reactive props proxy — works for both runes and legacy
 * components without a `.svelte.ts` `$state` helper (rollup cannot compile those).
 */
function mountUpdatable(
  component: Component<any>,
  target: HTMLElement,
  props: Record<string, any>,
): ClassInstance {
  return createClassComponent({
    component,
    target,
    props,
    // Avoid an extra flushSync here — template DOM is sync; callers that need
    // onMount can flush in tests.
    intro: false,
  }) as ClassInstance;
}

/**
 * Wraps a Svelte 5 component into a function returning an HTMLElement,
 * matching the vanilla renderer contract expected by simple-table-core.
 * The mount is registered so core's `onRendererHostDiscard` can unmount it
 * (including any `<svelte:teleport>` / floating UI) when the host is discarded.
 */
export function wrapSvelteRenderer<P extends Record<string, any>>(
  registry: MountRegistry,
  component: Component<P>,
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    const el = document.createElement("div");
    const instance = mount(component, { target: el, props });
    registry.register(el, () => {
      unmount(instance);
    });
    return el;
  };
}

/**
 * Header renderer wrapper that reuses one host element so sort/filter icon
 * refreshes update props in place instead of remounting the Svelte subtree
 * and wiping local state. Mirrors Vue's {@link wrapVueHeaderRenderer} /
 * React's {@link wrapReactHeaderRenderer}.
 */
export function wrapSvelteHeaderRenderer(
  registry: MountRegistry,
  component: Component<VanillaHeaderRendererProps>,
): (props: VanillaHeaderRendererProps) => HTMLElement {
  let host: HTMLElement | null = null;
  let instance: ClassInstance | null = null;

  return (props: VanillaHeaderRendererProps): HTMLElement => {
    if (host && instance && registry.isRegistered(host)) {
      instance.$set(props as Record<string, any>);
      return host;
    }
    host = document.createElement("div");
    instance = mountUpdatable(component, host, props as Record<string, any>);
    registry.register(host, () => {
      instance?.$destroy();
      instance = null;
      host = null;
    });
    return host;
  };
}

/**
 * Like {@link wrapSvelteRenderer}, but reuses one wrapper per accessor so
 * unstable column rebuilds keep a stable function identity on ColumnDef.
 *
 * For `kind: "header"`, also reuses a single mount host (React
 * {@link wrapCachedHeaderRenderer} / Vue {@link wrapCachedVueRenderer}) so
 * sort/filter refreshes preserve state.
 */
export function wrapCachedSvelteRenderer<P extends Record<string, any>>(
  registry: MountRegistry,
  accessor: string,
  kind: "cell" | "header",
  component: Component<P>,
): (props: P) => HTMLElement {
  const cache = kind === "cell" ? registry.cellRendererCache : registry.headerRendererCache;
  const existing = cache.get(accessor);
  if (existing) {
    if (kind === "cell" && existing.component !== component) {
      existing.component = component;
      const current = (existing.wrapped as any)[ST_RENDERER_GENERATION];
      (existing.wrapped as any)[ST_RENDERER_GENERATION] =
        (typeof current === "number" ? current : 0) + 1;
    } else {
      existing.component = component;
    }
    return existing.wrapped as (props: P) => HTMLElement;
  }

  const slot: { component: Component<P>; wrapped: (props: P) => HTMLElement } = {
    component,
    wrapped: null as unknown as (props: P) => HTMLElement,
  };

  if (kind === "header") {
    let host: HTMLElement | null = null;
    let instance: ClassInstance | null = null;
    let mountedComponent: Component<P> | null = null;

    const wrapped = (props: P): HTMLElement => {
      const Comp = slot.component;
      if (host && instance && registry.isRegistered(host) && mountedComponent === Comp) {
        instance.$set(props as Record<string, any>);
        return host;
      }
      if (host && registry.isRegistered(host)) {
        registry.disposeHost(host);
      }
      host = document.createElement("div");
      instance = mountUpdatable(Comp, host, props as Record<string, any>);
      mountedComponent = Comp;
      registry.register(host, () => {
        instance?.$destroy();
        instance = null;
        mountedComponent = null;
        host = null;
      });
      return host;
    };
    slot.wrapped = wrapped;
    cache.set(accessor, slot);
    return wrapped;
  }

  const wrapped = (props: P): HTMLElement => {
    const el = document.createElement("div");
    const instance = mount(slot.component, { target: el, props });
    registry.register(el, () => {
      unmount(instance);
    });
    return el;
  };
  slot.wrapped = wrapped;
  (wrapped as any)[ST_RENDERER_GENERATION] = 0;
  cache.set(accessor, slot);
  return wrapped;
}

/**
 * Column-editor row renderer: one host per `accessor` so popout list rebuilds
 * update in place instead of remounting Svelte state (mirrors Vue/React).
 */
export function wrapSvelteColumnEditorRowRenderer(
  registry: MountRegistry,
  component: Component<VanillaColumnEditorRowRendererProps>,
): (props: VanillaColumnEditorRowRendererProps) => HTMLElement {
  const hosts = new Map<string, { host: HTMLElement; instance: ClassInstance }>();

  return (props: VanillaColumnEditorRowRendererProps): HTMLElement => {
    const key = String(props.accessor);
    const existing = hosts.get(key);
    if (existing && registry.isRegistered(existing.host)) {
      existing.instance.$set(props as Record<string, any>);
      return existing.host;
    }
    const host = document.createElement("div");
    const instance = mountUpdatable(component, host, props as Record<string, any>);
    registry.register(host, () => {
      instance.$destroy();
      hosts.delete(key);
    });
    hosts.set(key, { host, instance });
    return host;
  };
}

/** Mount a Svelte component into a div for vanilla-only slots (e.g. table empty state). */
export function wrapSvelteStatic(registry: MountRegistry, component: Component): HTMLElement {
  const el = document.createElement("div");
  const instance = mount(component, { target: el, props: {} });
  registry.register(el, () => {
    unmount(instance);
  });
  return el;
}

/**
 * Converts a rendered Svelte component to an HTML string.
 * Used for icon props where vanilla expects string | HTMLElement | SVGSVGElement.
 */
export function svelteComponentToHtmlString(
  component: Component<Record<string, any>>,
  props: Record<string, any> = {},
): string {
  const el = document.createElement("div");
  const instance = mount(component, { target: el, props });
  const html = el.innerHTML;
  unmount(instance);
  return html;
}

/** Returns true if the value looks like a Svelte component (function or class). */
export function isSvelteComponent(value: unknown): value is Component<any> {
  return typeof value === "function";
}
