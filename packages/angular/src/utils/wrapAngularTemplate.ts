import {
  type EmbeddedViewRef,
  type TemplateRef,
} from "@angular/core";
import type { AngularMountOptions } from "./wrapAngularRenderer";

const ST_RENDERER_GENERATION = Symbol.for("simple-table.rendererGeneration");

function applyTemplateContext(
  view: EmbeddedViewRef<Record<string, unknown>>,
  next: Record<string, unknown>,
): void {
  const ctx = view.context;
  for (const key of Object.keys(ctx)) {
    if (!(key in next)) {
      delete ctx[key];
    }
  }
  Object.assign(ctx, next);
  view.detectChanges();
}

function mountEmbeddedView(
  template: TemplateRef<unknown>,
  context: Record<string, unknown>,
  options: AngularMountOptions,
): { host: HTMLElement; view: EmbeddedViewRef<Record<string, unknown>> } {
  const host = document.createElement("div");
  const view = (
    options.elementInjector
      ? template.createEmbeddedView(context, options.elementInjector)
      : template.createEmbeddedView(context)
  ) as EmbeddedViewRef<Record<string, unknown>>;
  view.detectChanges();
  options.appRef.attachView(view);
  for (const node of view.rootNodes) {
    host.appendChild(node);
  }
  options.registry?.register(host, () => {
    options.appRef.detachView(view);
    view.destroy();
  });
  return { host, view };
}

/**
 * Turns an `ng-template` into a core renderer: create the view, attach it so
 * clicks and bindings work, and tear it down when the table discards the host.
 */
export function wrapAngularTemplate<P extends object>(
  template: TemplateRef<unknown>,
  options: AngularMountOptions,
  mapContext: (props: P) => Record<string, unknown>,
): (props: P) => HTMLElement {
  return (props: P): HTMLElement => {
    return mountEmbeddedView(template, mapContext(props), options).host;
  };
}

/**
 * Stable wrapper per column accessor so rebuilds do not swap renderer identity.
 * Header views update in place when the same template is still mounted.
 */
export function wrapCachedAngularTemplate<P extends object>(
  template: TemplateRef<unknown>,
  options: AngularMountOptions,
  accessor: string,
  kind: "cell" | "header",
  mapContext: (props: P) => Record<string, unknown>,
): (props: P) => HTMLElement {
  const registry = options.registry;
  if (!registry) {
    throw new Error("wrapCachedAngularTemplate requires a MountRegistry");
  }
  const cache =
    kind === "cell" ? registry.cellTemplateCache : registry.headerTemplateCache;
  const existing = cache.get(accessor);
  if (existing) {
    if (kind === "cell" && existing.component !== template) {
      existing.component = template;
      const current = (existing.wrapped as { [ST_RENDERER_GENERATION]?: number })[
        ST_RENDERER_GENERATION
      ];
      (existing.wrapped as { [ST_RENDERER_GENERATION]?: number })[ST_RENDERER_GENERATION] =
        (typeof current === "number" ? current : 0) + 1;
    } else {
      existing.component = template;
    }
    return existing.wrapped as (props: P) => HTMLElement;
  }

  const slot: { component: TemplateRef<unknown>; wrapped: (props: P) => HTMLElement } = {
    component: template,
    wrapped: null as unknown as (props: P) => HTMLElement,
  };

  if (kind === "header") {
    let host: HTMLElement | null = null;
    let view: EmbeddedViewRef<Record<string, unknown>> | null = null;
    let mountedTemplate: TemplateRef<unknown> | null = null;
    const wrapped = (props: P): HTMLElement => {
      const ctx = mapContext(props);
      if (
        host &&
        view &&
        registry.isRegistered(host) &&
        mountedTemplate === slot.component
      ) {
        applyTemplateContext(view, ctx);
        return host;
      }
      const mounted = mountEmbeddedView(slot.component, ctx, options);
      host = mounted.host;
      view = mounted.view;
      mountedTemplate = slot.component;
      return host;
    };
    slot.wrapped = wrapped;
    cache.set(accessor, slot);
    return wrapped;
  }

  const wrapped = (props: P): HTMLElement => {
    return mountEmbeddedView(slot.component, mapContext(props), options).host;
  };
  slot.wrapped = wrapped;
  (wrapped as { [ST_RENDERER_GENERATION]?: number })[ST_RENDERER_GENERATION] = 0;
  cache.set(accessor, slot);
  return wrapped;
}

export function cellTemplateContext(props: object): Record<string, unknown> {
  const record = props as Record<string, unknown>;
  return {
    $implicit: record.row,
    ...record,
  };
}

export function headerTemplateContext(props: object): Record<string, unknown> {
  const record = props as Record<string, unknown>;
  return {
    $implicit: record.header,
    ...record,
  };
}

export function footerTemplateContext(props: object): Record<string, unknown> {
  const record = props as Record<string, unknown>;
  return {
    $implicit: record.currentPage,
    ...record,
  };
}

export function loadingTemplateContext(props: object): Record<string, unknown> {
  const record = props as Record<string, unknown>;
  return {
    $implicit: record.parentRow,
    ...record,
  };
}

export function errorTemplateContext(props: object): Record<string, unknown> {
  const record = props as Record<string, unknown>;
  return {
    $implicit: record.error,
    ...record,
  };
}

export function emptyTemplateContext(_props: object): Record<string, unknown> {
  return {};
}
