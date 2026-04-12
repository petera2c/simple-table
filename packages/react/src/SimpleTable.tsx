import React, { useLayoutEffect, useRef } from "react";
import { SimpleTableVanilla } from "simple-table-core";
import type { SimpleTableConfig, TableAPI } from "simple-table-core";
import { buildVanillaConfig } from "./buildVanillaConfig";
import type { SimpleTableReactProps, TableInstance } from "./types";

/** Top-level referential equality; avoids pushing duplicate `update` when parent re-renders with a new props object. */
function shallowTablePropsChanged(
  prev: SimpleTableReactProps,
  next: SimpleTableReactProps,
): boolean {
  const keys = new Set([...Object.keys(prev as object), ...Object.keys(next as object)]) as Set<
    keyof SimpleTableReactProps
  >;
  for (const key of keys) {
    if (prev[key] !== next[key]) return true;
  }
  return false;
}

/**
 * SimpleTable — React adapter for simple-table-core.
 *
 * Accepts the same props as SimpleTableProps (the vanilla user-facing API) but
 * with React component types for all renderer props: cellRenderer,
 * headerRenderer, footerRenderer, loadingStateRenderer, errorStateRenderer,
 * emptyStateRenderer, headerDropdown, and per-column renderers inside
 * ReactHeaderObject.
 *
 * The ref exposes the full TableAPI imperative interface (sort, filter,
 * paginate, export to CSV, cell selection, column visibility, etc.).
 *
 * @example
 * const tableRef = useRef<TableAPI>(null);
 *
 * <SimpleTable
 *   ref={tableRef}
 *   rows={rows}
 *   defaultHeaders={headers}
 *   footerRenderer={MyFooter}
 * />
 */
const SimpleTable = React.forwardRef<TableAPI, SimpleTableReactProps>(
  function SimpleTable(props, ref) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Typed as the local TableInstance interface — not the concrete
    // SimpleTableVanilla class — so the component stays decoupled from
    // internal implementation details.
    const instanceRef = useRef<TableInstance | null>(null);
    /** Last `defaultHeaders` array reference applied via `update` (full config). */
    const syncedDefaultHeadersRef = useRef<SimpleTableReactProps["defaultHeaders"] | undefined>(
      undefined,
    );
    const lastSyncedPropsRef = useRef<SimpleTableReactProps | null>(null);

    // forwardRef omits `ref` from props at the type level; cast it back so
    // buildVanillaConfig receives the complete SimpleTableReactProps shape.
    const reactProps = props as SimpleTableReactProps;

    // Mount the vanilla instance once. We defer with queueMicrotask so nested
    // createRoot + flushSync inside cell renderers does not run during React's
    // commit phase (React warns: "flushSync was called from inside a lifecycle method").
    useLayoutEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let cancelled = false;
      queueMicrotask(() => {
        if (cancelled || !containerRef.current) return;

        const instance = new SimpleTableVanilla(
          containerRef.current,
          buildVanillaConfig(reactProps),
        );
        instance.mount();
        instanceRef.current = instance;

        if (ref) {
          const api = instance.getAPI();
          if (typeof ref === "function") {
            ref(api);
          } else {
            ref.current = api;
          }
        }
      });

      return () => {
        cancelled = true;
        const instance = instanceRef.current;
        if (instance) {
          instance.destroy();
          instanceRef.current = null;
          syncedDefaultHeadersRef.current = undefined;
          lastSyncedPropsRef.current = null;
          if (ref && typeof ref !== "function") {
            ref.current = null;
          }
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync prop changes to the vanilla instance (deferred like mount).
    // When `defaultHeaders` keeps the same reference, omit it so core does not
    // reset internal header state (widths, reorder results). New reference = new columns.
    useLayoutEffect(() => {
      const instance = instanceRef.current;
      if (!instance) return;

      if (
        lastSyncedPropsRef.current !== null &&
        !shallowTablePropsChanged(lastSyncedPropsRef.current, reactProps)
      ) {
        return;
      }
      lastSyncedPropsRef.current = reactProps;

      const fullConfig = buildVanillaConfig(reactProps);

      queueMicrotask(() => {
        if (instanceRef.current !== instance) return;

        if (syncedDefaultHeadersRef.current !== reactProps.defaultHeaders) {
          syncedDefaultHeadersRef.current = reactProps.defaultHeaders;
          instance.update(fullConfig);
          return;
        }

        const { defaultHeaders: _headers, ...rest } = fullConfig;
        instance.update(rest as Partial<SimpleTableConfig>);
      });
    }, [reactProps]);

    return <div ref={containerRef} />;
  },
);

SimpleTable.displayName = "SimpleTable";

export default SimpleTable;
