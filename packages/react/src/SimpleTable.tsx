import React, { useLayoutEffect, useRef } from "react";
import { SimpleTableVanilla } from "simple-table-core";
import type { SimpleTableConfig, TableAPI } from "simple-table-core";
import { buildVanillaConfig } from "./buildVanillaConfig";
import { PortalBridge, useTablePortals } from "./PortalBridge";
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

    // One PortalBridge per table instance. Custom cell/header/footer renderers
    // register their React subtrees here; the bridge renders them via portals
    // (see the JSX below) so they live inside this host tree and inherit context.
    const bridgeRef = useRef<PortalBridge | null>(null);
    if (bridgeRef.current === null) bridgeRef.current = new PortalBridge();
    const bridge = bridgeRef.current;

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

    // Mount the vanilla instance once. Custom renderers now register portals
    // (no nested createRoot/flushSync), so we can mount synchronously here.
    useLayoutEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const instance = new SimpleTableVanilla(container, buildVanillaConfig(reactProps, bridge));
      instance.mount();
      instanceRef.current = instance;

      // The full config (including defaultHeaders) was just applied via mount();
      // seed the sync refs so the prop-sync effect's first run is a no-op and
      // doesn't immediately re-apply (and re-render) the same config.
      lastSyncedPropsRef.current = reactProps;
      syncedDefaultHeadersRef.current = reactProps.defaultHeaders;

      if (ref) {
        const api = instance.getAPI();
        if (typeof ref === "function") {
          ref(api);
        } else {
          ref.current = api;
        }
      }

      return () => {
        instance.destroy();
        instanceRef.current = null;
        syncedDefaultHeadersRef.current = undefined;
        lastSyncedPropsRef.current = null;
        bridge.clear();
        if (ref && typeof ref !== "function") {
          ref.current = null;
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

      const fullConfig = buildVanillaConfig(reactProps, bridge);

      if (syncedDefaultHeadersRef.current !== reactProps.defaultHeaders) {
        syncedDefaultHeadersRef.current = reactProps.defaultHeaders;
        instance.update(fullConfig);
        return;
      }

      const { defaultHeaders: _headers, ...rest } = fullConfig;
      instance.update(rest as Partial<SimpleTableConfig>);
    }, [reactProps]);

    const portals = useTablePortals(bridge);
    const hasPortals = Array.isArray(portals) && portals.length > 0;

    // Re-fit auto columns from real portal DOM once — not on every portals
    // array identity change (that re-enters measure/render and loops easily).
    // A second pass runs only when leaving `isLoading`, when skeleton cells
    // are replaced by real renderer output.
    const didInitialAutoSizeRef = useRef(false);
    const wasLoadingRef = useRef(Boolean(reactProps.isLoading));
    useLayoutEffect(() => {
      const instance = instanceRef.current;
      if (!instance) return;

      const isLoading = Boolean(reactProps.isLoading);
      const leftLoading = wasLoadingRef.current && !isLoading;
      wasLoadingRef.current = isLoading;

      if (leftLoading) {
        instance.refitAutoSizeColumns?.();
        return;
      }

      if (!didInitialAutoSizeRef.current && hasPortals) {
        didInitialAutoSizeRef.current = true;
        instance.refitAutoSizeColumns?.();
      }
    }, [hasPortals, reactProps.isLoading]);

    return (
      <>
        <div ref={containerRef} />
        {portals}
      </>
    );
  },
);

SimpleTable.displayName = "SimpleTable";

export default SimpleTable;
