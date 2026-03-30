import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig } from "simple-table-core";
import type {
  SimpleTableSvelteProps,
  SvelteHeaderObject,
  SvelteColumnEditorConfig,
} from "./types";
import { wrapSvelteRenderer } from "./utils/wrapSvelteRenderer";

function transformColumnEditorConfig(config: SvelteColumnEditorConfig): ColumnEditorConfig {
  const { rowRenderer, customRenderer, ...rest } = config;
  return {
    ...rest,
    ...(rowRenderer ? { rowRenderer: wrapSvelteRenderer(rowRenderer) as any } : {}),
    ...(customRenderer ? { customRenderer: wrapSvelteRenderer(customRenderer) as any } : {}),
  };
}

function transformHeader(header: SvelteHeaderObject): HeaderObject {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;

  const transformed: HeaderObject = { ...(rest as any) };

  if (cellRenderer) {
    if (typeof cellRenderer === "function" && cellRenderer.length >= 2) {
      transformed.cellRenderer = wrapSvelteRenderer(cellRenderer) as any;
    } else {
      transformed.cellRenderer = cellRenderer as any;
    }
  }

  if (headerRenderer) {
    if (typeof headerRenderer === "function" && headerRenderer.length >= 2) {
      transformed.headerRenderer = wrapSvelteRenderer(headerRenderer) as any;
    } else {
      transformed.headerRenderer = headerRenderer as any;
    }
  }

  if (children) {
    transformed.children = children.map(transformHeader);
  }

  if (nestedTable) {
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableSvelteProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig) as any;
  }

  return transformed;
}

export function buildVanillaConfig(config: SimpleTableSvelteProps): SimpleTableConfig {
  const {
    defaultHeaders,
    footerRenderer,
    emptyStateRenderer,
    errorStateRenderer,
    loadingStateRenderer,
    headerDropdown,
    columnEditorConfig,
    ...rest
  } = config;

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    defaultHeaders: defaultHeaders.map(transformHeader),
  };

  if (footerRenderer !== undefined) {
    if (typeof footerRenderer === "function" && footerRenderer.length >= 2) {
      vanillaConfig.footerRenderer = wrapSvelteRenderer(footerRenderer) as any;
    } else {
      vanillaConfig.footerRenderer = footerRenderer as any;
    }
  }

  if (emptyStateRenderer !== undefined) {
    if (typeof emptyStateRenderer === "function" && emptyStateRenderer.length >= 2) {
      vanillaConfig.emptyStateRenderer = wrapSvelteRenderer(emptyStateRenderer) as any;
    } else {
      vanillaConfig.emptyStateRenderer = emptyStateRenderer as any;
    }
  }

  if (errorStateRenderer !== undefined) {
    if (typeof errorStateRenderer === "function" && errorStateRenderer.length >= 2) {
      vanillaConfig.errorStateRenderer = wrapSvelteRenderer(errorStateRenderer) as any;
    } else {
      vanillaConfig.errorStateRenderer = errorStateRenderer as any;
    }
  }

  if (loadingStateRenderer !== undefined) {
    if (typeof loadingStateRenderer === "function" && loadingStateRenderer.length >= 2) {
      vanillaConfig.loadingStateRenderer = wrapSvelteRenderer(loadingStateRenderer) as any;
    } else {
      vanillaConfig.loadingStateRenderer = loadingStateRenderer as any;
    }
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrapSvelteRenderer(headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig);
  }

  return vanillaConfig;
}
