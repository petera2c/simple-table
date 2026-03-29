import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig } from "simple-table-core";
import type { VNode } from "vue";
import type {
  SimpleTableVueProps,
  VueHeaderObject,
  VueColumnEditorConfig,
  VueIconsConfig,
} from "./types";
import {
  wrapVueRenderer,
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

function transformColumnEditorConfig(config: VueColumnEditorConfig): ColumnEditorConfig {
  const { rowRenderer, ...rest } = config;
  return {
    ...rest,
    ...(rowRenderer ? { rowRenderer: wrapVueRenderer(rowRenderer) as any } : {}),
  };
}

function transformHeader(header: VueHeaderObject): HeaderObject {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;

  const transformed: HeaderObject = { ...(rest as any) };

  if (cellRenderer) {
    if (typeof cellRenderer === "object") {
      transformed.cellRenderer = wrapVueRenderer(cellRenderer) as any;
    } else {
      transformed.cellRenderer = cellRenderer as any;
    }
  }

  if (headerRenderer) {
    if (typeof headerRenderer === "object") {
      transformed.headerRenderer = wrapVueRenderer(headerRenderer) as any;
    } else {
      transformed.headerRenderer = headerRenderer as any;
    }
  }

  if (children) {
    transformed.children = children.map(transformHeader);
  }

  if (nestedTable) {
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableVueProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig) as any;
  }

  return transformed;
}

export function buildVanillaConfig(config: SimpleTableVueProps): SimpleTableConfig {
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
    if (typeof footerRenderer === "object") {
      vanillaConfig.footerRenderer = wrapVueRenderer(footerRenderer) as any;
    } else {
      vanillaConfig.footerRenderer = footerRenderer as any;
    }
  }

  if (emptyStateRenderer !== undefined) {
    if (isVueComponent(emptyStateRenderer)) {
      vanillaConfig.emptyStateRenderer = wrapVueRenderer(emptyStateRenderer) as any;
    } else {
      const node = emptyStateRenderer as VNode;
      vanillaConfig.emptyStateRenderer = () => wrapVueNode(node);
    }
  }

  if (errorStateRenderer !== undefined) {
    if (isVueComponent(errorStateRenderer)) {
      vanillaConfig.errorStateRenderer = wrapVueRenderer(errorStateRenderer) as any;
    } else {
      const node = errorStateRenderer as VNode;
      vanillaConfig.errorStateRenderer = () => wrapVueNode(node);
    }
  }

  if (loadingStateRenderer !== undefined) {
    if (isVueComponent(loadingStateRenderer)) {
      vanillaConfig.loadingStateRenderer = wrapVueRenderer(loadingStateRenderer) as any;
    } else {
      const node = loadingStateRenderer as VNode;
      vanillaConfig.loadingStateRenderer = () => wrapVueNode(node);
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
      vanillaConfig.tableEmptyStateRenderer = wrapVueNode(tableEmptyStateRenderer);
    }
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrapVueRenderer(headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig);
  }

  if (icons !== undefined) {
    vanillaConfig.icons = transformIcons(icons);
  }

  return vanillaConfig;
}
