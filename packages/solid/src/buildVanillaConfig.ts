import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig } from "simple-table-core";
import type {
  SimpleTableSolidProps,
  SolidHeaderObject,
  SolidColumnEditorConfig,
  SolidIconsConfig,
} from "./types";
import {
  wrapSolidRenderer,
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

function transformColumnEditorConfig(config: SolidColumnEditorConfig): ColumnEditorConfig {
  const { rowRenderer, customRenderer, ...rest } = config;
  return {
    ...rest,
    ...(rowRenderer ? { rowRenderer: wrapSolidRenderer(rowRenderer) as any } : {}),
    ...(customRenderer ? { customRenderer: wrapSolidRenderer(customRenderer) as any } : {}),
  };
}

function transformHeader(header: SolidHeaderObject): HeaderObject {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;

  const transformed: HeaderObject = { ...(rest as any) };

  if (cellRenderer) {
    transformed.cellRenderer = wrapSolidRenderer(cellRenderer) as any;
  }

  if (headerRenderer) {
    transformed.headerRenderer = wrapSolidRenderer(headerRenderer) as any;
  }

  if (children) {
    transformed.children = children.map(transformHeader);
  }

  if (nestedTable) {
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableSolidProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig) as any;
  }

  return transformed;
}

export function buildVanillaConfig(config: SimpleTableSolidProps): SimpleTableConfig {
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
    ref: _ref,
    ...rest
  } = config;

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    defaultHeaders: defaultHeaders.map(transformHeader),
  };

  if (footerRenderer !== undefined) {
    vanillaConfig.footerRenderer = wrapSolidRenderer(footerRenderer) as any;
  }

  if (emptyStateRenderer !== undefined) {
    if (isSolidComponent(emptyStateRenderer)) {
      vanillaConfig.emptyStateRenderer = wrapSolidRenderer(emptyStateRenderer) as any;
    } else {
      const node = emptyStateRenderer;
      vanillaConfig.emptyStateRenderer = () => wrapSolidNode(node);
    }
  }

  if (errorStateRenderer !== undefined) {
    if (isSolidComponent(errorStateRenderer)) {
      vanillaConfig.errorStateRenderer = wrapSolidRenderer(errorStateRenderer) as any;
    } else {
      const node = errorStateRenderer;
      vanillaConfig.errorStateRenderer = () => wrapSolidNode(node);
    }
  }

  if (loadingStateRenderer !== undefined) {
    if (isSolidComponent(loadingStateRenderer)) {
      vanillaConfig.loadingStateRenderer = wrapSolidRenderer(loadingStateRenderer) as any;
    } else {
      const node = loadingStateRenderer;
      vanillaConfig.loadingStateRenderer = () => wrapSolidNode(node);
    }
  }

  if (tableEmptyStateRenderer !== undefined) {
    vanillaConfig.tableEmptyStateRenderer =
      tableEmptyStateRenderer === null ? null : wrapSolidNode(tableEmptyStateRenderer);
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrapSolidRenderer(headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig);
  }

  if (icons !== undefined) {
    vanillaConfig.icons = transformIcons(icons);
  }

  return vanillaConfig;
}
