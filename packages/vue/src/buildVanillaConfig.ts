import type { SimpleTableConfig, ColumnDef, ColumnEditorConfig } from "simple-table-core";
import { asRows, collectHeaderAccessors } from "simple-table-core";
import type { VNode } from "vue";
import type {
  SimpleTableVueProps,
  VueColumnDef,
  VueColumnEditorConfig,
  VueDefaultRowData,
  VueIconsConfig,
} from "./types";
import type { MountRegistry } from "./MountRegistry";
import {
  wrapVueRenderer,
  wrapCachedVueRenderer,
  wrapVueNode,
  vueNodeToHtmlString,
  isVueComponent,
} from "./utils/wrapVueRenderer";

function transformIcons(icons: VueIconsConfig): NonNullable<SimpleTableConfig["icons"]> {
  const result: NonNullable<SimpleTableConfig["icons"]> = {};

  for (const [key, value] of Object.entries(icons)) {
    if (value == null) continue;
    if (typeof value === "string" || value instanceof HTMLElement || value instanceof SVGElement) {
      (result as any)[key] = value;
    } else {
      // VNode — serialise to HTML string for the vanilla icon slot
      (result as any)[key] = vueNodeToHtmlString(value as VNode);
    }
  }

  return result;
}

function transformColumnEditorConfig(
  config: VueColumnEditorConfig,
  registry: MountRegistry,
): ColumnEditorConfig {
  const { rowRenderer, customRenderer, ...rest } = config;
  return {
    ...rest,
    ...(rowRenderer ? { rowRenderer: wrapVueRenderer(registry, rowRenderer) as any } : {}),
    ...(customRenderer ? { customRenderer: wrapVueRenderer(registry, customRenderer) as any } : {}),
  };
}

function transformHeader<TData extends VueDefaultRowData>(
  header: VueColumnDef<TData, any>,
  registry: MountRegistry,
): ColumnDef {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;
  const accessor = String(header.accessor);

  const transformed: ColumnDef = { ...(rest as any) };

  if (cellRenderer) {
    // Function and object Vue components both need wrapping for the vanilla
    // HTMLElement contract (`h()`-style renderers return VNodes).
    transformed.cellRenderer = wrapCachedVueRenderer(
      registry,
      accessor,
      "cell",
      cellRenderer,
    ) as any;
  }

  if (headerRenderer) {
    transformed.headerRenderer = wrapCachedVueRenderer(
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
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableVueProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig, registry) as any;
  }

  return transformed;
}

/** Resolve column definitions. */
export function resolveVueColumns<TData extends VueDefaultRowData = VueDefaultRowData>(
  config: Pick<SimpleTableVueProps<TData>, "columns">,
): ReadonlyArray<VueColumnDef<TData, any>> {
  const headers = config.columns;
  if (!headers) {
    throw new Error("SimpleTable requires `columns`");
  }
  return headers;
}

export function buildVanillaConfig<TData extends VueDefaultRowData = VueDefaultRowData>(
  config: SimpleTableVueProps<TData>,
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

  const columns = resolveVueColumns(config);

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
    // Vue apps (including Teleport / floating UI).
    onRendererHostDiscard: registry.disposeHost,
  };

  if (onColumnOrderChange) {
    vanillaConfig.onColumnOrderChange = (headers) =>
      onColumnOrderChange(headers as unknown as VueColumnDef<TData, any>[]);
  }
  if (onColumnWidthChange) {
    vanillaConfig.onColumnWidthChange = (headers) =>
      onColumnWidthChange(headers as unknown as VueColumnDef<TData, any>[]);
  }
  if (onHeaderEdit) {
    vanillaConfig.onHeaderEdit = (header, newLabel) =>
      onHeaderEdit(header as unknown as VueColumnDef<TData, any>, newLabel);
  }
  if (onColumnSelect) {
    vanillaConfig.onColumnSelect = (header) =>
      onColumnSelect(header as unknown as VueColumnDef<TData, any>);
  }

  if (footerRenderer !== undefined) {
    vanillaConfig.footerRenderer = wrapVueRenderer(registry, footerRenderer) as any;
  }

  if (emptyStateRenderer !== undefined) {
    if (isVueComponent(emptyStateRenderer)) {
      vanillaConfig.emptyStateRenderer = wrapVueRenderer(registry, emptyStateRenderer) as any;
    } else {
      const node = emptyStateRenderer as VNode;
      vanillaConfig.emptyStateRenderer = () => wrapVueNode(registry, node);
    }
  }

  if (errorStateRenderer !== undefined) {
    if (isVueComponent(errorStateRenderer)) {
      vanillaConfig.errorStateRenderer = wrapVueRenderer(registry, errorStateRenderer) as any;
    } else {
      const node = errorStateRenderer as VNode;
      vanillaConfig.errorStateRenderer = () => wrapVueNode(registry, node);
    }
  }

  if (loadingStateRenderer !== undefined) {
    if (isVueComponent(loadingStateRenderer)) {
      vanillaConfig.loadingStateRenderer = wrapVueRenderer(registry, loadingStateRenderer) as any;
    } else {
      const node = loadingStateRenderer as VNode;
      vanillaConfig.loadingStateRenderer = () => wrapVueNode(registry, node);
    }
  }

  if (tableEmptyStateRenderer !== undefined) {
    if (tableEmptyStateRenderer === null) {
      vanillaConfig.tableEmptyStateRenderer = null;
    } else if (tableEmptyStateRenderer instanceof HTMLElement) {
      vanillaConfig.tableEmptyStateRenderer = tableEmptyStateRenderer;
    } else if (typeof tableEmptyStateRenderer === "string") {
      vanillaConfig.tableEmptyStateRenderer = tableEmptyStateRenderer;
    } else {
      vanillaConfig.tableEmptyStateRenderer = wrapVueNode(registry, tableEmptyStateRenderer);
    }
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrapVueRenderer(registry, headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig, registry);
  }

  if (icons !== undefined) {
    vanillaConfig.icons = transformIcons(icons);
  }

  if (rowButtons !== undefined) {
    vanillaConfig.rowButtons = rowButtons.map(
      (button) => wrapVueRenderer(registry, button) as any,
    );
  }

  return vanillaConfig;
}
