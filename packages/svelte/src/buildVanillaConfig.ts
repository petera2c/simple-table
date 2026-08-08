import type { SimpleTableConfig, ColumnDef, ColumnEditorConfig } from "simple-table-core";
import { asRows, collectHeaderAccessors } from "simple-table-core";
import type {
  SimpleTableSvelteProps,
  SvelteColumnDef,
  SvelteColumnEditorConfig,
  SvelteDefaultRowData,
  SvelteIconsConfig,
} from "./types";
import type { Component } from "svelte";
import type { MountRegistry } from "./MountRegistry";
import {
  wrapSvelteRenderer,
  wrapCachedSvelteRenderer,
  wrapSvelteColumnEditorRowRenderer,
  wrapSvelteStatic,
  svelteComponentToHtmlString,
  isSvelteComponent,
} from "./utils/wrapSvelteRenderer";

function transformIcons(icons: SvelteIconsConfig): NonNullable<SimpleTableConfig["icons"]> {
  const result: NonNullable<SimpleTableConfig["icons"]> = {};

  for (const [key, value] of Object.entries(icons)) {
    if (value == null) continue;
    if (typeof value === "string" || value instanceof HTMLElement || value instanceof SVGElement) {
      (result as any)[key] = value;
    } else if (isSvelteComponent(value)) {
      (result as any)[key] = svelteComponentToHtmlString(value as any, {});
    }
  }

  return result;
}

function transformColumnEditorConfig(
  config: SvelteColumnEditorConfig,
  registry: MountRegistry,
): ColumnEditorConfig {
  const { rowRenderer, customRenderer, ...rest } = config;
  return {
    ...rest,
    ...(rowRenderer
      ? { rowRenderer: wrapSvelteColumnEditorRowRenderer(registry, rowRenderer) as any }
      : {}),
    ...(customRenderer
      ? { customRenderer: wrapSvelteRenderer(registry, customRenderer) as any }
      : {}),
  };
}

function transformHeader<TData extends SvelteDefaultRowData>(
  header: SvelteColumnDef<TData, any>,
  registry: MountRegistry,
): ColumnDef {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;
  const accessor = String(header.accessor);

  const transformed: ColumnDef = { ...(rest as any) };

  if (cellRenderer) {
    if (typeof cellRenderer === "function" && cellRenderer.length >= 2) {
      // Svelte Component<> is incompatible with core CellRenderer in the union;
      // length>=2 is the runtime signal that this is a Svelte 5 component.
      transformed.cellRenderer = wrapCachedSvelteRenderer(
        registry,
        accessor,
        "cell",
        cellRenderer as Component<Record<string, any>>,
      ) as any;
    } else {
      transformed.cellRenderer = cellRenderer as any;
    }
  }

  if (headerRenderer) {
    if (typeof headerRenderer === "function" && headerRenderer.length >= 2) {
      transformed.headerRenderer = wrapCachedSvelteRenderer(
        registry,
        accessor,
        "header",
        headerRenderer as Component<Record<string, any>>,
      ) as any;
    } else {
      transformed.headerRenderer = headerRenderer as any;
    }
  }

  if (children) {
    transformed.children = children.map((child) => transformHeader(child, registry));
  }

  if (nestedTable) {
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableSvelteProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig, registry) as any;
  }

  return transformed;
}

/** Resolve column definitions. */
export function resolveSvelteColumns<TData extends SvelteDefaultRowData = SvelteDefaultRowData>(
  config: Pick<SimpleTableSvelteProps<TData>, "columns">,
): ReadonlyArray<SvelteColumnDef<TData, any>> {
  const headers = config.columns;
  if (!headers) {
    throw new Error("SimpleTable requires `columns`");
  }
  return headers;
}

export function buildVanillaConfig<TData extends SvelteDefaultRowData = SvelteDefaultRowData>(
  config: SimpleTableSvelteProps<TData>,
  registry: MountRegistry,
): SimpleTableConfig {
  const {
    columns: _columns,
    rows,
    footerRenderer,
    emptyStateRenderer,
    errorStateRenderer,
    loadingStateRenderer,
    headerDropdown,
    columnEditorConfig,
    icons,
    tableEmptyStateRenderer,
    rowButtons,
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

  const columns = resolveSvelteColumns(config);

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
    // discards any host element, so the registry unmounts exactly the affected
    // Svelte instances (including teleport / floating UI).
    onRendererHostDiscard: registry.disposeHost,
  };

  if (onColumnOrderChange) {
    vanillaConfig.onColumnOrderChange = (headers) =>
      onColumnOrderChange(headers as unknown as SvelteColumnDef<TData, any>[]);
  }
  if (onColumnWidthChange) {
    vanillaConfig.onColumnWidthChange = (headers) =>
      onColumnWidthChange(headers as unknown as SvelteColumnDef<TData, any>[]);
  }
  if (onHeaderEdit) {
    vanillaConfig.onHeaderEdit = (header, newLabel) =>
      onHeaderEdit(header as unknown as SvelteColumnDef<TData, any>, newLabel);
  }
  if (onColumnSelect) {
    vanillaConfig.onColumnSelect = (header) =>
      onColumnSelect(header as unknown as SvelteColumnDef<TData, any>);
  }

  if (tableEmptyStateRenderer !== undefined) {
    if (tableEmptyStateRenderer === null) {
      vanillaConfig.tableEmptyStateRenderer = null;
    } else if (
      typeof tableEmptyStateRenderer === "string" ||
      tableEmptyStateRenderer instanceof HTMLElement
    ) {
      vanillaConfig.tableEmptyStateRenderer = tableEmptyStateRenderer;
    } else if (isSvelteComponent(tableEmptyStateRenderer)) {
      vanillaConfig.tableEmptyStateRenderer = wrapSvelteStatic(
        registry,
        tableEmptyStateRenderer as Component,
      ) as any;
    }
  }

  if (footerRenderer !== undefined) {
    if (typeof footerRenderer === "function" && footerRenderer.length >= 2) {
      vanillaConfig.footerRenderer = wrapSvelteRenderer(registry, footerRenderer) as any;
    } else {
      vanillaConfig.footerRenderer = footerRenderer as any;
    }
  }

  if (emptyStateRenderer !== undefined) {
    if (typeof emptyStateRenderer === "function" && emptyStateRenderer.length >= 2) {
      vanillaConfig.emptyStateRenderer = wrapSvelteRenderer(registry, emptyStateRenderer) as any;
    } else {
      vanillaConfig.emptyStateRenderer = emptyStateRenderer as any;
    }
  }

  if (errorStateRenderer !== undefined) {
    if (typeof errorStateRenderer === "function" && errorStateRenderer.length >= 2) {
      vanillaConfig.errorStateRenderer = wrapSvelteRenderer(registry, errorStateRenderer) as any;
    } else {
      vanillaConfig.errorStateRenderer = errorStateRenderer as any;
    }
  }

  if (loadingStateRenderer !== undefined) {
    if (typeof loadingStateRenderer === "function" && loadingStateRenderer.length >= 2) {
      vanillaConfig.loadingStateRenderer = wrapSvelteRenderer(
        registry,
        loadingStateRenderer,
      ) as any;
    } else {
      vanillaConfig.loadingStateRenderer = loadingStateRenderer as any;
    }
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrapSvelteRenderer(registry, headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig, registry);
  }

  if (icons !== undefined) {
    vanillaConfig.icons = transformIcons(icons);
  }

  if (rowButtons !== undefined) {
    vanillaConfig.rowButtons = rowButtons.map(
      (button) => wrapSvelteRenderer(registry, button) as any,
    );
  }

  return vanillaConfig;
}
