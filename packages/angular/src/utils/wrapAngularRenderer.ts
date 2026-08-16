import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  reflectComponentType,
  type ComponentRef,
  type Type,
} from "@angular/core";
import type {
  ColumnEditorRowRendererProps as VanillaColumnEditorRowRendererProps,
  HeaderRendererProps as VanillaHeaderRendererProps,
} from "simple-table-core";
import type { MountRegistry } from "../MountRegistry";

/** Declared `@Input` / `input()` names for a component type (template + prop). */
function declaredInputNames(component: Type<unknown>): Set<string> {
  const mirror = reflectComponentType(component);
  const names = new Set<string>();
  if (!mirror) return names;
  for (const input of mirror.inputs) {
    names.add(input.propName);
    names.add(input.templateName);
  }
  return names;
}

/** Apply props to a dynamic ComponentRef and flush change detection. */
function applyComponentProps<P extends object>(
  componentRef: ComponentRef<P>,
  props: Partial<P>,
): void {
  const ref = componentRef as ComponentRef<P> & {
    setInput?: (name: string, value: unknown) => void;
  };
  const inputs = declaredInputNames(componentRef.componentType as Type<unknown>);
  if (typeof ref.setInput === "function" && inputs.size > 0) {
    for (const [key, value] of Object.entries(props)) {
      if (inputs.has(key)) {
        ref.setInput(key, value);
      } else {
        // Core may pass undeclared keys; keep prior Object.assign behavior.
        (componentRef.instance as Record<string, unknown>)[key] = value;
      }
    }
  } else {
    Object.assign(componentRef.instance as object, props);
  }
  componentRef.changeDetectorRef.detectChanges();
}

function mountAngularComponent<P extends object>(
  component: Type<P>,
  props: Partial<P>,
  appRef: ApplicationRef,
  injector: EnvironmentInjector,
  registry: MountRegistry | undefined,
  host?: HTMLElement,
): { host: HTMLElement; componentRef: ComponentRef<P> } {
  const el = host ?? document.createElement("div");
  const componentRef = createComponent(component, {
    environmentInjector: injector,
    hostElement: el,
  });
  applyComponentProps(componentRef, props);
  appRef.attachView(componentRef.hostView);
  registry?.register(el, () => {
    appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  });
  return { host: el, componentRef };
}

/**
 * Wraps an Angular standalone component into a function that returns an
 * HTMLElement, matching the vanilla renderer contract expected by
 * simple-table-core.
 *
 * Requires references to the running Angular ApplicationRef and
 * EnvironmentInjector so it can attach the dynamically-created component
 * to the change detection tree and trigger a synchronous flush before
 * returning the element to the vanilla rendering pipeline.
 *
 * Pass an optional {@link MountRegistry} so core's `onRendererHostDiscard` can
 * destroy the ComponentRef (including any CDK Overlay / floating UI) when the
 * host is discarded. The table adapter always supplies a registry; the public
 * helper used for one-shot static slots (e.g. `tableEmptyStateRenderer`) may omit it.
 *
 * These are injected automatically when the consumer uses
 * `provideSimpleTable()` in their application providers.
 */
export function wrapAngularRenderer<P extends object>(
  component: Type<P>,
  appRef: ApplicationRef,
  injector: EnvironmentInjector,
  registry?: MountRegistry,
): (props: Partial<P>) => HTMLElement {
  return (props: Partial<P>): HTMLElement => {
    return mountAngularComponent(component, props, appRef, injector, registry).host;
  };
}

/**
 * Header renderer wrapper that reuses one host element so sort/filter icon
 * refreshes update props in place instead of remounting the Angular subtree
 * and wiping local state. Mirrors Vue's {@link wrapVueHeaderRenderer} /
 * React's wrapReactHeaderRenderer.
 */
export function wrapAngularHeaderRenderer(
  component: Type<object>,
  appRef: ApplicationRef,
  injector: EnvironmentInjector,
  registry: MountRegistry,
): (props: VanillaHeaderRendererProps) => HTMLElement {
  let host: HTMLElement | null = null;
  let componentRef: ComponentRef<object> | null = null;
  return (props: VanillaHeaderRendererProps): HTMLElement => {
    if (host && componentRef && registry.isRegistered(host)) {
      applyComponentProps(componentRef, props as object);
      return host;
    }
    const mounted = mountAngularComponent(
      component,
      props as object,
      appRef,
      injector,
      registry,
    );
    host = mounted.host;
    componentRef = mounted.componentRef;
    return host;
  };
}

/**
 * Like {@link wrapAngularRenderer}, but reuses one wrapper per accessor so
 * unstable column rebuilds keep a stable function identity on ColumnDef.
 *
 * For `kind: "header"`, also reuses a single mount host so sort/filter
 * refreshes preserve Angular component state.
 */
export function wrapCachedAngularRenderer<P extends object>(
  component: Type<P>,
  appRef: ApplicationRef,
  injector: EnvironmentInjector,
  registry: MountRegistry,
  accessor: string,
  kind: "cell" | "header",
): (props: Partial<P>) => HTMLElement {
  const cache = kind === "cell" ? registry.cellRendererCache : registry.headerRendererCache;
  const existing = cache.get(accessor);
  if (existing) {
    existing.component = component;
    return existing.wrapped as (props: Partial<P>) => HTMLElement;
  }

  const slot: { component: Type<P>; wrapped: (props: Partial<P>) => HTMLElement } = {
    component,
    wrapped: null as unknown as (props: Partial<P>) => HTMLElement,
  };

  if (kind === "header") {
    let host: HTMLElement | null = null;
    let componentRef: ComponentRef<P> | null = null;
    const wrapped = (props: Partial<P>): HTMLElement => {
      if (host && componentRef && registry.isRegistered(host)) {
        applyComponentProps(componentRef, props);
        return host;
      }
      const mounted = mountAngularComponent(
        slot.component,
        props,
        appRef,
        injector,
        registry,
      );
      host = mounted.host;
      componentRef = mounted.componentRef;
      return host;
    };
    slot.wrapped = wrapped;
    cache.set(accessor, slot);
    return wrapped;
  }

  const wrapped = (props: Partial<P>): HTMLElement => {
    return mountAngularComponent(slot.component, props, appRef, injector, registry).host;
  };
  slot.wrapped = wrapped;
  cache.set(accessor, slot);
  return wrapped;
}

/**
 * Column-editor row renderer: one host per `accessor` so popout list rebuilds
 * update in place instead of remounting Angular state (mirrors Vue/React).
 */
export function wrapAngularColumnEditorRowRenderer(
  component: Type<object>,
  appRef: ApplicationRef,
  injector: EnvironmentInjector,
  registry: MountRegistry,
): (props: VanillaColumnEditorRowRendererProps) => HTMLElement {
  const mounts = new Map<
    string,
    { host: HTMLElement; componentRef: ComponentRef<object> }
  >();
  return (props: VanillaColumnEditorRowRendererProps): HTMLElement => {
    const key = String(props.accessor);
    const existing = mounts.get(key);
    if (existing && registry.isRegistered(existing.host)) {
      applyComponentProps(existing.componentRef, props as object);
      return existing.host;
    }
    const mounted = mountAngularComponent(
      component,
      props as object,
      appRef,
      injector,
      registry,
    );
    mounts.set(key, mounted);
    return mounted.host;
  };
}
