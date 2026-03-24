import React, { useEffect, useRef } from "react";
import { SimpleTableVanilla } from "simple-table-core";
import type { TableAPI } from "simple-table-core";
import { buildVanillaConfig } from "./buildVanillaConfig";
import type { SimpleTableReactProps, TableInstance } from "./types";

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

    // forwardRef omits `ref` from props at the type level; cast it back so
    // buildVanillaConfig receives the complete SimpleTableReactProps shape.
    const reactProps = props as SimpleTableReactProps;

    // Mount the vanilla instance exactly once.
    useEffect(() => {
      if (!containerRef.current) return;

      const instance = new SimpleTableVanilla(
        containerRef.current,
        buildVanillaConfig(reactProps)
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

      return () => {
        instance.destroy();
        instanceRef.current = null;
        if (ref && typeof ref !== "function") {
          ref.current = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync prop changes to the vanilla instance after every render.
    useEffect(() => {
      instanceRef.current?.update(buildVanillaConfig(reactProps));
    });

    return <div ref={containerRef} />;
  }
);

SimpleTable.displayName = "SimpleTable";

export default SimpleTable;
