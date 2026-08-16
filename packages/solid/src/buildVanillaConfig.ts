import type { SimpleTableConfig, ColumnDef, ColumnEditorConfig } from "simple-table-core";
import { asRows, collectHeaderAccessors } from "simple-table-core";
import type {
  SimpleTableSolidProps,
  SolidColumnDef,
  SolidColumnEditorConfig,
  SolidDefaultRowData,
  SolidIconsConfig,
} from "./types";
import type { MountRegistry } from "./MountRegistry";
import {
  wrapSolidRenderer,
  wrapCachedSolidRenderer,
  wrapSolidColumnEditorRowRenderer,
  wrapSolidNode,
  solidNodeToHtmlString,
  isSolidComponent,
} from "./utils/wrapSolidRenderer";

function transformIcons(icons: SolidIconsConfig): NonNullable<SimpleTableConfig["icons"]> {
  const result: NonNullable<SimpleTableConfig["icons"]> = {};

  for (const [key, value] of Object.entries(icons)) {
    if (value == null) continue;
    if (typeof value === "string" || value instanceof HTMLElement || value instanceof SVGElement) {
      (result as any)[key] = value;
    } else {
      (result as any)[key] = solidNodeToHtmlString(value);
    }
  }

  return result;
}

function transformColumnEditorConfig(
  config: SolidColumnEditorConfig,
  registry: MountRegistry,
): ColumnEditorConfig {
  const { rowRenderer, customRenderer, ...rest } = config;
  return {
    ...rest,
    ...(rowRenderer
      ? { rowRenderer: wrapSolidColumnEditorRowRenderer(registry, rowRenderer) as any }
      : {}),
    ...(customRenderer
      ? { customRenderer: wrapSolidRenderer(registry, customRenderer) as any }
      : {}),
  };
}

function transformHeader<TData extends SolidDefaultRowData>(
  header: SolidColumnDef<TData, any>,
  registry: MountRegistry,
): ColumnDef {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;
  const accessor = String(header.accessor);

  const transformed: ColumnDef = { ...(rest as any) };

  if (cellRenderer) {
    transformed.cellRenderer = wrapCachedSolidRenderer(
      registry,
      accessor,
      "cell",
      cellRenderer,
    ) as any;
  }

  if (headerRenderer) {
    transformed.headerRenderer = wrapCachedSolidRenderer(
      registry,
      accessor,
      "header",
      headerRenderer,
    ) as any;
  }

  if (children) {
    transformed.children = children.map((child) => transformHeader(child, registry));
  }

  if (nestedTable) {
    // Recursively convert the nested table config. Rows are provided at
    // render time by the vanilla core, so we supply an empty placeholder.
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableSolidProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig, registry) as any;
  }

  return transformed;
}

/** Resolve column definitions. */
export function resolveSolidColumns<TData extends SolidDefaultRowData = SolidDefaultRowData>(
  config: Pick<SimpleTableSolidProps<TData>, "columns">,
): ReadonlyArray<SolidColumnDef<TData, any>> {
  const headers = config.columns;
  if (!headers) {
    throw new Error("SimpleTable requires `columns`");
  }
  return headers;
}

export function buildVanillaConfig<TData extends SolidDefaultRowData = SolidDefaultRowData>(
  config: SimpleTableSolidProps<TData>,
  registry: MountRegistry,
): SimpleTableConfig {
  const {
    columns: _columns,
    rows,
    footerRenderer,
    emptyStateRenderer,
    errorStateRenderer,
    loadingStateRenderer,
    tableEmptyStateRenderer,
    headerDropdown,
    columnEditorConfig,
    icons,
    rowButtons,
    ref: _ref,
    onColumnOrderChange,
    onColumnWidthChange,
    onHeaderEdit,
    onColumnSelect,
    enableColumnEditor,
    enableColumnEditorInitOpen,
    enablePagination,
    onTableReady,
    hoverRowBackground,
    oddColumnBackground,
    oddEvenRowBackground,
    ...rest
  } = config;

  const columns = resolveSolidColumns(config);

  registry.pruneRendererCaches(collectHeaderAccessors(columns));

  // `rest` still carries TData-bound callbacks (getRowId, onCellEdit, …).
  // Widen once here — the vanilla runtime is Row-shaped.
  const shared = rest as SimpleTableConfig;

  const vanillaConfig: SimpleTableConfig = {
    ...shared,
    rows: asRows(rows),
    columns: columns.map((header) => transformHeader(header, registry)),
    enableColumnEditor,
    enableColumnEditorInitOpen,
    enablePagination,
    onTableReady,
    hoverRowBackground,
    oddColumnBackground,
    oddEvenRowBackground,
    // Authoritative mount teardown: core calls this before it permanently
    // discards any host element, so the registry disposes exactly the affected
    // Solid trees (including portals / floating UI).
    onRendererHostDiscard: registry.disposeHost,
  };

  if (onColumnOrderChange) {
    vanillaConfig.onColumnOrderChange = (headers) =>
      onColumnOrderChange(headers as unknown as SolidColumnDef<TData, any>[]);
  }
  if (onColumnWidthChange) {
    vanillaConfig.onColumnWidthChange = (headers) =>
      onColumnWidthChange(headers as unknown as SolidColumnDef<TData, any>[]);
  }
  if (onHeaderEdit) {
    vanillaConfig.onHeaderEdit = (header, newLabel) =>
      onHeaderEdit(header as unknown as SolidColumnDef<TData, any>, newLabel);
  }
  if (onColumnSelect) {
    vanillaConfig.onColumnSelect = (header) =>
      onColumnSelect(header as unknown as SolidColumnDef<TData, any>);
  }

  if (footerRenderer !== undefined) {
    vanillaConfig.footerRenderer = wrapSolidRenderer(registry, footerRenderer) as any;
  }

  if (emptyStateRenderer !== undefined) {
    if (isSolidComponent(emptyStateRenderer)) {
      vanillaConfig.emptyStateRenderer = wrapSolidRenderer(registry, emptyStateRenderer) as any;
    } else {
      const node = emptyStateRenderer;
      vanillaConfig.emptyStateRenderer = () => wrapSolidNode(registry, node);
    }
  }

  if (errorStateRenderer !== undefined) {
    if (isSolidComponent(errorStateRenderer)) {
      vanillaConfig.errorStateRenderer = wrapSolidRenderer(registry, errorStateRenderer) as any;
    } else {
      const node = errorStateRenderer;
      vanillaConfig.errorStateRenderer = () => wrapSolidNode(registry, node);
    }
  }

  if (loadingStateRenderer !== undefined) {
    if (isSolidComponent(loadingStateRenderer)) {
      vanillaConfig.loadingStateRenderer = wrapSolidRenderer(registry, loadingStateRenderer) as any;
    } else {
      const node = loadingStateRenderer;
      vanillaConfig.loadingStateRenderer = () => wrapSolidNode(registry, node);
    }
  }

  if (tableEmptyStateRenderer !== undefined) {
    vanillaConfig.tableEmptyStateRenderer =
      tableEmptyStateRenderer === null ? null : wrapSolidNode(registry, tableEmptyStateRenderer);
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrapSolidRenderer(registry, headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig, registry);
  }

  if (icons !== undefined) {
    vanillaConfig.icons = transformIcons(icons);
  }

  if (rowButtons !== undefined) {
    vanillaConfig.rowButtons = rowButtons.map(
      (button) => wrapSolidRenderer(registry, button) as any,
    );
  }

  return vanillaConfig;
}
