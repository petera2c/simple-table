import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  type Type,
} from "@angular/core";
import type { MountRegistry } from "../MountRegistry";

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
    const el = document.createElement("div");

    const componentRef = createComponent(component, {
      environmentInjector: injector,
      hostElement: el,
    });

    // Assign input props to the component instance.
    Object.assign(componentRef.instance as object, props);

    // Attach to the application's view tree so Angular tracks it.
    appRef.attachView(componentRef.hostView);

    // Synchronous change detection flush — ensures the rendered output is
    // in the DOM before we return the element to the vanilla pipeline.
    componentRef.changeDetectorRef.detectChanges();

    registry?.register(el, () => {
      appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    return el;
  };
}

/**
 * Like {@link wrapAngularRenderer}, but reuses one wrapper per accessor so
 * unstable column rebuilds keep a stable function identity on HeaderObject.
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
  const wrapped = (props: Partial<P>): HTMLElement => {
    const el = document.createElement("div");
    const componentRef = createComponent(slot.component, {
      environmentInjector: injector,
      hostElement: el,
    });
    Object.assign(componentRef.instance as object, props);
    appRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
    registry.register(el, () => {
      appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });
    return el;
  };
  slot.wrapped = wrapped;
  cache.set(accessor, slot);
  return wrapped;
}
