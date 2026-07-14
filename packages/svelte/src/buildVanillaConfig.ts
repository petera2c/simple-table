import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig, Row } from "simple-table-core";
import { collectHeaderAccessors } from "simple-table-core";
import type {
  SimpleTableSvelteProps,
  SvelteHeaderObject,
  SvelteColumnEditorConfig,
  SvelteIconsConfig,
} from "./types";
import type { Component } from "svelte";
import type { MountRegistry } from "./MountRegistry";
import {
  wrapSvelteRenderer,
  wrapCachedSvelteRenderer,
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
    ...(rowRenderer ? { rowRenderer: wrapSvelteRenderer(registry, rowRenderer) as any } : {}),
    ...(customRenderer
      ? { customRenderer: wrapSvelteRenderer(registry, customRenderer) as any }
      : {}),
  };
}

function transformHeader(
  header: HeaderObject | SvelteHeaderObject,
  registry: MountRegistry,
): HeaderObject {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;
  const accessor = String(header.accessor);

  const transformed: HeaderObject = { ...(rest as any) };

  if (cellRenderer) {
    if (typeof cellRenderer === "function" && cellRenderer.length >= 2) {
      transformed.cellRenderer = wrapCachedSvelteRenderer(
        registry,
        accessor,
        "cell",
        cellRenderer,
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
        headerRenderer,
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

export function buildVanillaConfig(
  config: SimpleTableSvelteProps,
  registry: MountRegistry,
): SimpleTableConfig {
  const {
    defaultHeaders,
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
    ...rest
  } = config;

  registry.pruneRendererCaches(collectHeaderAccessors(defaultHeaders));

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    rows: rows as Row[],
    defaultHeaders: defaultHeaders.map((header) => transformHeader(header, registry)),
    // Authoritative mount teardown: core calls this before it permanently
    // discards any host element, so the registry unmounts exactly the affected
    // Svelte instances (including teleport / floating UI).
    onRendererHostDiscard: registry.disposeHost,
    ...(onColumnOrderChange
      ? {
          onColumnOrderChange: (headers: HeaderObject[]) =>
            onColumnOrderChange(headers as unknown as SvelteHeaderObject[]),
        }
      : {}),
    ...(onColumnWidthChange
      ? {
          onColumnWidthChange: (headers: HeaderObject[]) =>
            onColumnWidthChange(headers as unknown as SvelteHeaderObject[]),
        }
      : {}),
    ...(onHeaderEdit
      ? {
          onHeaderEdit: (header: HeaderObject, newLabel: string) =>
            onHeaderEdit(header as unknown as SvelteHeaderObject, newLabel),
        }
      : {}),
    ...(onColumnSelect
      ? {
          onColumnSelect: (header: HeaderObject) =>
            onColumnSelect(header as unknown as SvelteHeaderObject),
        }
      : {}),
  };

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
