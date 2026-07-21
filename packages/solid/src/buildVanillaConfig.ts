import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig, Row } from "simple-table-core";
import { collectHeaderAccessors } from "simple-table-core";
import type {
  SimpleTableSolidProps,
  SolidHeaderObject,
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
  header: HeaderObject | SolidHeaderObject,
  registry: MountRegistry,
): HeaderObject {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;
  const accessor = String(header.accessor);

  const transformed: HeaderObject = { ...(rest as any) };

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

/** Resolve preferred `columns` or legacy `defaultHeaders`. */
export function resolveSolidColumns(
  config: Pick<SimpleTableSolidProps, "columns" | "defaultHeaders">,
): ReadonlyArray<HeaderObject | SolidHeaderObject> {
  const headers = config.columns ?? config.defaultHeaders;
  if (!headers) {
    throw new Error("SimpleTable requires `columns` or `defaultHeaders`");
  }
  return headers;
}

export function buildVanillaConfig(
  config: SimpleTableSolidProps,
  registry: MountRegistry,
): SimpleTableConfig {
  const {
    defaultHeaders: _defaultHeaders,
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
    editColumns,
    enableColumnEditorInitOpen,
    editColumnsInitOpen,
    enablePagination,
    shouldPaginate,
    onTableReady,
    onGridReady,
    hoverRowBackground,
    useHoverRowBackground,
    oddColumnBackground,
    useOddColumnBackground,
    oddEvenRowBackground,
    useOddEvenRowBackground,
    ...rest
  } = config;

  const defaultHeaders = resolveSolidColumns(config);

  registry.pruneRendererCaches(collectHeaderAccessors(defaultHeaders));

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    rows: rows as Row[],
    defaultHeaders: defaultHeaders.map((header) => transformHeader(header, registry)),
    editColumns: enableColumnEditor ?? editColumns,
    editColumnsInitOpen: enableColumnEditorInitOpen ?? editColumnsInitOpen,
    shouldPaginate: enablePagination ?? shouldPaginate,
    onGridReady: onTableReady ?? onGridReady,
    useHoverRowBackground: hoverRowBackground ?? useHoverRowBackground,
    useOddColumnBackground: oddColumnBackground ?? useOddColumnBackground,
    useOddEvenRowBackground: oddEvenRowBackground ?? useOddEvenRowBackground,
    // Authoritative mount teardown: core calls this before it permanently
    // discards any host element, so the registry disposes exactly the affected
    // Solid trees (including portals / floating UI).
    onRendererHostDiscard: registry.disposeHost,
    ...(onColumnOrderChange
      ? {
          onColumnOrderChange: (headers: HeaderObject[]) =>
            onColumnOrderChange(headers as unknown as SolidHeaderObject[]),
        }
      : {}),
    ...(onColumnWidthChange
      ? {
          onColumnWidthChange: (headers: HeaderObject[]) =>
            onColumnWidthChange(headers as unknown as SolidHeaderObject[]),
        }
      : {}),
    ...(onHeaderEdit
      ? {
          onHeaderEdit: (header: HeaderObject, newLabel: string) =>
            onHeaderEdit(header as unknown as SolidHeaderObject, newLabel),
        }
      : {}),
    ...(onColumnSelect
      ? {
          onColumnSelect: (header: HeaderObject) =>
            onColumnSelect(header as unknown as SolidHeaderObject),
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
