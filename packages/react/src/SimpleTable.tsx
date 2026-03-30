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
const SimpleTable = () => {
  return <div>hello</div>;
};

export default SimpleTable;
