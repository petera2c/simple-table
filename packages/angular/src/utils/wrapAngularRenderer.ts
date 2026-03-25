import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  type Type,
} from "@angular/core";

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
 * These are injected automatically when the consumer uses
 * `provideSimpleTable()` in their application providers.
 */
export function wrapAngularRenderer<P extends object>(
  component: Type<P>,
  appRef: ApplicationRef,
  injector: EnvironmentInjector
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

    return el;
  };
}
