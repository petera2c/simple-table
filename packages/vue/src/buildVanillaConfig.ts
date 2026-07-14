import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig, Row } from "simple-table-core";
import { collectHeaderAccessors } from "simple-table-core";
import type { VNode } from "vue";
import type {
  SimpleTableVueProps,
  VueHeaderObject,
  VueColumnEditorConfig,
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

function transformHeader(
  header: HeaderObject | VueHeaderObject,
  registry: MountRegistry,
): HeaderObject {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;
  const accessor = String(header.accessor);

  const transformed: HeaderObject = { ...(rest as any) };

  if (cellRenderer) {
    if (typeof cellRenderer === "object") {
      transformed.cellRenderer = wrapCachedVueRenderer(
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
    if (typeof headerRenderer === "object") {
      transformed.headerRenderer = wrapCachedVueRenderer(
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
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableVueProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig, registry) as any;
  }

  return transformed;
}

export function buildVanillaConfig(
  config: SimpleTableVueProps,
  registry: MountRegistry,
): SimpleTableConfig {
  const {
    defaultHeaders,
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
    ...rest
  } = config;

  registry.pruneRendererCaches(collectHeaderAccessors(defaultHeaders));

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    rows: rows as Row[],
    defaultHeaders: defaultHeaders.map((header) => transformHeader(header, registry)),
    // Authoritative mount teardown: core calls this before it permanently
    // discards any host element, so the registry unmounts exactly the affected
    // Vue apps (including Teleport / floating UI).
    onRendererHostDiscard: registry.disposeHost,
  };

  if (footerRenderer !== undefined) {
    if (typeof footerRenderer === "object") {
      vanillaConfig.footerRenderer = wrapVueRenderer(registry, footerRenderer) as any;
    } else {
      vanillaConfig.footerRenderer = footerRenderer as any;
    }
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
