import type { ComponentType, ReactNode } from "react";
import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig, Row } from "simple-table-core";
import type {
  SimpleTableReactProps,
  ReactHeaderObject,
  ReactColumnEditorConfig,
  ReactIconsConfig,
} from "./types";
import type { PortalBridge } from "./PortalBridge";
import {
  wrapReactRenderer,
  wrapReactRendererIntoFragment,
  wrapReactHeaderRenderer,
  wrapReactHeaderDropdown,
  wrapReactFooterRenderer,
  wrapReactColumnEditorRowRenderer,
  wrapReactColumnEditorCustomRenderer,
  wrapReactRowButton,
  wrapReactNode,
  reactNodeToHtmlString,
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
      (result as any)[key] = reactNodeToHtmlString(value);
    }
  }

  return result;
}

function transformColumnEditorConfig(
  config: ReactColumnEditorConfig,
  bridge: PortalBridge,
): ColumnEditorConfig {
  const { rowRenderer, customRenderer, ...rest } = config;
  return {
    ...rest,
    ...(rowRenderer
      ? {
          rowRenderer: wrapReactColumnEditorRowRenderer(
            bridge,
            rowRenderer as ComponentType<object>,
          ) as any,
        }
      : {}),
    ...(customRenderer
      ? {
          customRenderer: wrapReactColumnEditorCustomRenderer(
            bridge,
            customRenderer as ComponentType<object>,
          ) as any,
        }
      : {}),
  };
}

function transformHeader(header: ReactHeaderObject, bridge: PortalBridge): HeaderObject {
  const { cellRenderer, headerRenderer, children, nestedTable, ...rest } = header;

  const transformed: HeaderObject = { ...(rest as any) };

  if (cellRenderer) {
    transformed.cellRenderer = wrapReactRendererIntoFragment(
      bridge,
      cellRenderer as ComponentType<object>,
    ) as any;
  }

  if (headerRenderer) {
    transformed.headerRenderer = wrapReactHeaderRenderer(
      bridge,
      headerRenderer as ComponentType<any>,
    ) as any;
  }

  if (children) {
    transformed.children = children.map((child) => transformHeader(child, bridge));
  }

  if (nestedTable) {
    // Recursively convert the nested table config. Rows are provided at
    // render time by the vanilla core, so we supply an empty placeholder.
    const nestedConfig = { ...nestedTable, rows: [] } as unknown as SimpleTableReactProps;
    transformed.nestedTable = buildVanillaConfig(nestedConfig, bridge) as any;
  }

  return transformed;
}

export function buildVanillaConfig(
  config: SimpleTableReactProps,
  bridge: PortalBridge,
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
    onColumnOrderChange,
    onColumnWidthChange,
    onHeaderEdit,
    onColumnSelect,
    ...rest
  } = config;

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    rows: rows as Row[],
    defaultHeaders: defaultHeaders.map((header) => transformHeader(header, bridge)),
    // Authoritative portal teardown: core calls this before it permanently
    // discards any host element, so the bridge unmounts exactly the affected
    // portal subtrees (no DOM-inference / MutationObserver pruning needed).
    onRendererHostDiscard: bridge.disposeHost,
    ...(onColumnOrderChange
      ? {
          onColumnOrderChange: (headers: HeaderObject[]) =>
            onColumnOrderChange(headers as unknown as ReactHeaderObject[]),
        }
      : {}),
    ...(onColumnWidthChange
      ? {
          onColumnWidthChange: (headers: HeaderObject[]) =>
            onColumnWidthChange(headers as unknown as ReactHeaderObject[]),
        }
      : {}),
    ...(onHeaderEdit
      ? {
          onHeaderEdit: (header: HeaderObject, newLabel: string) =>
            onHeaderEdit(header as unknown as ReactHeaderObject, newLabel),
        }
      : {}),
    ...(onColumnSelect
      ? {
          onColumnSelect: (header: HeaderObject) =>
            onColumnSelect(header as unknown as ReactHeaderObject),
        }
      : {}),
  };

  if (footerRenderer !== undefined) {
    vanillaConfig.footerRenderer = wrapReactFooterRenderer(
      bridge,
      footerRenderer as ComponentType<any>,
    ) as any;
  }

  if (emptyStateRenderer !== undefined) {
    if (isReactComponent(emptyStateRenderer)) {
      vanillaConfig.emptyStateRenderer = wrapReactRenderer(bridge, emptyStateRenderer) as any;
    } else {
      // Static ReactNode — TypeScript can't auto-narrow the union here, so cast explicitly.
      const node = emptyStateRenderer as ReactNode;
      vanillaConfig.emptyStateRenderer = () => wrapReactNode(node);
    }
  }

  if (errorStateRenderer !== undefined) {
    if (isReactComponent(errorStateRenderer)) {
      vanillaConfig.errorStateRenderer = wrapReactRenderer(bridge, errorStateRenderer) as any;
    } else {
      const node = errorStateRenderer as ReactNode;
      vanillaConfig.errorStateRenderer = () => wrapReactNode(node);
    }
  }

  if (loadingStateRenderer !== undefined) {
    if (isReactComponent(loadingStateRenderer)) {
      vanillaConfig.loadingStateRenderer = wrapReactRenderer(bridge, loadingStateRenderer) as any;
    } else {
      const node = loadingStateRenderer as ReactNode;
      vanillaConfig.loadingStateRenderer = () => wrapReactNode(node);
    }
  }

  if (tableEmptyStateRenderer !== undefined) {
    vanillaConfig.tableEmptyStateRenderer =
      tableEmptyStateRenderer === null ? null : wrapReactNode(tableEmptyStateRenderer);
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrapReactHeaderDropdown(
      bridge,
      headerDropdown as ComponentType<any>,
    ) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig, bridge);
  }

  if (icons !== undefined) {
    vanillaConfig.icons = transformIcons(icons);
  }

  if (rowButtons !== undefined) {
    vanillaConfig.rowButtons = rowButtons.map((button) =>
      wrapReactRowButton(bridge, button as ComponentType<any>),
    );
  }

  return vanillaConfig;
}
