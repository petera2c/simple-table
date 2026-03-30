import type React from "react";
import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig } from "simple-table-core";
import type {
  SimpleTableReactProps,
  ReactHeaderObject,
  ReactColumnEditorConfig,
  ReactIconsConfig,
} from "./types";
import {
  wrapReactRenderer,
  wrapReactNode,
  isReactComponent,
} from "./utils/wrapReactRenderer";

function transformIcons(icons: ReactIconsConfig): NonNullable<SimpleTableConfig["icons"]> {
  const result: NonNullable<SimpleTableConfig["icons"]> = {};

  for (const [key, value] of Object.entries(icons)) {
    if (value == null) continue;
    // Pass through values that are already valid vanilla IconElement types.
    // Otherwise treat as a ReactNode and serialise to an HTML string.
    if (typeof value === "string" || value instanceof HTMLElement || value instanceof SVGElement) {
      (result as any)[key] = value;
    } else {
      (result as any)[key] = wrapReactNode(value);
    }
  }

  return result;
}

function transformColumnEditorConfig(config: ReactColumnEditorConfig): ColumnEditorConfig {
  const { rowRenderer, ...rest } = config;
  return {
    ...rest,
    ...(rowRenderer ? { rowRenderer: wrapReactRenderer(rowRenderer) as any } : {}),
  };
}

function transformHeader(header: ReactHeaderObject): HeaderObject {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;

  const transformed: HeaderObject = { ...(rest as any) };

  if (cellRenderer) {
    transformed.cellRenderer = wrapReactRenderer(cellRenderer) as any;
  }

  if (headerRenderer) {
    transformed.headerRenderer = wrapReactRenderer(headerRenderer) as any;
  }

  if (children) {
    transformed.children = children.map(transformHeader);
  }

  if (nestedTable) {
    // Recursively convert the nested table config. Rows are provided at
    // render time by the vanilla core, so we supply an empty placeholder.
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableReactProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig) as any;
  }

  return transformed;
}

export function buildVanillaConfig(config: SimpleTableReactProps): SimpleTableConfig {
  const {
    defaultHeaders,
    footerRenderer,
    emptyStateRenderer,
    errorStateRenderer,
    loadingStateRenderer,
    tableEmptyStateRenderer,
    headerDropdown,
    columnEditorConfig,
    icons,
    ...rest
  } = config;

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    defaultHeaders: defaultHeaders.map(transformHeader),
  };

  if (footerRenderer !== undefined) {
    vanillaConfig.footerRenderer = wrapReactRenderer(footerRenderer) as any;
  }

  if (emptyStateRenderer !== undefined) {
    if (isReactComponent(emptyStateRenderer)) {
      vanillaConfig.emptyStateRenderer = wrapReactRenderer(emptyStateRenderer) as any;
    } else {
      // Static ReactNode — TypeScript can't auto-narrow the union here, so cast explicitly.
      const node = emptyStateRenderer as React.ReactNode;
      vanillaConfig.emptyStateRenderer = () => wrapReactNode(node);
    }
  }

  if (errorStateRenderer !== undefined) {
    if (isReactComponent(errorStateRenderer)) {
      vanillaConfig.errorStateRenderer = wrapReactRenderer(errorStateRenderer) as any;
    } else {
      const node = errorStateRenderer as React.ReactNode;
      vanillaConfig.errorStateRenderer = () => wrapReactNode(node);
    }
  }

  if (loadingStateRenderer !== undefined) {
    if (isReactComponent(loadingStateRenderer)) {
      vanillaConfig.loadingStateRenderer = wrapReactRenderer(loadingStateRenderer) as any;
    } else {
      const node = loadingStateRenderer as React.ReactNode;
      vanillaConfig.loadingStateRenderer = () => wrapReactNode(node);
    }
  }

  if (tableEmptyStateRenderer !== undefined) {
    vanillaConfig.tableEmptyStateRenderer =
      tableEmptyStateRenderer === null ? null : wrapReactNode(tableEmptyStateRenderer);
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrapReactRenderer(headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig);
  }

  if (icons !== undefined) {
    vanillaConfig.icons = transformIcons(icons);
  }

  return vanillaConfig;
}
