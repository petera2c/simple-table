import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig } from "simple-table-core";
import type {
  SimpleTableSvelteProps,
  SvelteHeaderObject,
  SvelteColumnEditorConfig,
} from "./types";
import { wrapSvelteRenderer } from "./utils/wrapSvelteRenderer";

function transformColumnEditorConfig(config: SvelteColumnEditorConfig): ColumnEditorConfig {
  const { rowRenderer, ...rest } = config;
  return {
    ...rest,
    ...(rowRenderer ? { rowRenderer: wrapSvelteRenderer(rowRenderer) as any } : {}),
  };
}

function transformHeader(header: SvelteHeaderObject): HeaderObject {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;

  const transformed: HeaderObject = { ...(rest as any) };

  if (cellRenderer) {
    transformed.cellRenderer = wrapSvelteRenderer(cellRenderer) as any;
  }

  if (headerRenderer) {
    transformed.headerRenderer = wrapSvelteRenderer(headerRenderer) as any;
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
    vanillaConfig.footerRenderer = wrapSvelteRenderer(footerRenderer) as any;
  }

  if (emptyStateRenderer !== undefined) {
    vanillaConfig.emptyStateRenderer = wrapSvelteRenderer(emptyStateRenderer) as any;
  }

  if (errorStateRenderer !== undefined) {
    vanillaConfig.errorStateRenderer = wrapSvelteRenderer(errorStateRenderer) as any;
  }

  if (loadingStateRenderer !== undefined) {
    vanillaConfig.loadingStateRenderer = wrapSvelteRenderer(loadingStateRenderer) as any;
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrapSvelteRenderer(headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig);
  }

  return vanillaConfig;
}
