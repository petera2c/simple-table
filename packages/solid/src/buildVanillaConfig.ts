import type { SimpleTableConfig, ColumnDef, ColumnEditorConfig, Row } from "simple-table-core";
import { collectHeaderAccessors } from "simple-table-core";
import type {
  SimpleTableSolidProps,
  SolidColumnDef,
  SolidColumnEditorConfig,
  SolidIconsConfig,
} from "./types";
import type { MountRegistry } from "./MountRegistry";
import {
  wrapSolidRenderer,
  wrapCachedSolidRenderer,
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
    ...(rowRenderer ? { rowRenderer: wrapSolidRenderer(registry, rowRenderer) as any } : {}),
    ...(customRenderer
      ? { customRenderer: wrapSolidRenderer(registry, customRenderer) as any }
      : {}),
  };
}

function transformHeader(
  header: ColumnDef | SolidColumnDef,
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
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableSolidProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig, registry) as any;
  }

  return transformed;
}

/** Resolve column definitions. */
export function resolveSolidColumns(
  config: Pick<SimpleTableSolidProps, "columns">,
): ReadonlyArray<ColumnDef | SolidColumnDef> {
  const headers = config.columns;
  if (!headers) {
    throw new Error("SimpleTable requires `columns`");
  }
  return headers;
}

export function buildVanillaConfig(
  config: SimpleTableSolidProps,
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

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    rows: rows as Row[],
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
    ...(onColumnOrderChange
      ? {
          onColumnOrderChange: (headers: ColumnDef[]) =>
            onColumnOrderChange(headers as unknown as SolidColumnDef[]),
        }
      : {}),
    ...(onColumnWidthChange
      ? {
          onColumnWidthChange: (headers: ColumnDef[]) =>
            onColumnWidthChange(headers as unknown as SolidColumnDef[]),
        }
      : {}),
    ...(onHeaderEdit
      ? {
          onHeaderEdit: (header: ColumnDef, newLabel: string) =>
            onHeaderEdit(header as unknown as SolidColumnDef, newLabel),
        }
      : {}),
    ...(onColumnSelect
      ? {
          onColumnSelect: (header: ColumnDef) =>
            onColumnSelect(header as unknown as SolidColumnDef),
        }
      : {}),
  };

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
