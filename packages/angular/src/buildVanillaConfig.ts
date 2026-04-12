import type { ApplicationRef, EnvironmentInjector } from "@angular/core";
import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig, Row } from "simple-table-core";
import type {
  SimpleTableAngularProps,
  AngularHeaderObject,
  AngularColumnEditorConfig,
  AngularIconsConfig,
} from "./types";
import { wrapAngularRenderer } from "./utils/wrapAngularRenderer";

export function buildVanillaConfig(
  config: SimpleTableAngularProps,
  appRef: ApplicationRef,
  injector: EnvironmentInjector
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
    onColumnOrderChange,
    onColumnWidthChange,
    onHeaderEdit,
    onColumnSelect,
    ...rest
  } = config;

  const wrap = <P extends object>(component: any) =>
    wrapAngularRenderer<P>(component, appRef, injector);

  function transformIcons(icons: AngularIconsConfig): NonNullable<SimpleTableConfig["icons"]> {
    const result: NonNullable<SimpleTableConfig["icons"]> = {};
    for (const [key, value] of Object.entries(icons)) {
      if (value == null) continue;
      if (typeof value === "string" || value instanceof HTMLElement || value instanceof SVGSVGElement) {
        (result as any)[key] = value;
      } else if ((value as any).ɵcmp) {
        (result as any)[key] = wrap(value as any)({});
      } else {
        (result as any)[key] = value;
      }
    }
    return result;
  }

  function transformColumnEditorConfig(cfg: AngularColumnEditorConfig): ColumnEditorConfig {
    const { rowRenderer, customRenderer, ...cfgRest } = cfg;
    return {
      ...cfgRest,
      ...(rowRenderer ? { rowRenderer: wrap(rowRenderer) as any } : {}),
      ...(customRenderer ? { customRenderer: wrap(customRenderer) as any } : {}),
    };
  }

  function transformHeader(header: HeaderObject | AngularHeaderObject): HeaderObject {
    const { cellRenderer, headerRenderer, children, nestedTable, ...headerRest } = header;
    const transformed: HeaderObject = { ...(headerRest as any) };

    if (cellRenderer) {
      if ((cellRenderer as any).ɵcmp) {
        transformed.cellRenderer = wrap(cellRenderer) as any;
      } else {
        transformed.cellRenderer = cellRenderer as any;
      }
    }
    if (headerRenderer) {
      if ((headerRenderer as any).ɵcmp) {
        transformed.headerRenderer = wrap(headerRenderer) as any;
      } else {
        transformed.headerRenderer = headerRenderer as any;
      }
    }
    if (children) transformed.children = children.map(transformHeader);

    if (nestedTable) {
      const nestedFull = { ...nestedTable, rows: [] } as unknown as SimpleTableAngularProps;
      transformed.nestedTable = buildVanillaConfig(nestedFull, appRef, injector) as any;
    }

    return transformed;
  }

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    rows: rows as Row[],
    defaultHeaders: defaultHeaders.map(transformHeader),
    ...(onColumnOrderChange
      ? {
          onColumnOrderChange: (headers: HeaderObject[]) =>
            onColumnOrderChange(headers as unknown as AngularHeaderObject[]),
        }
      : {}),
    ...(onColumnWidthChange
      ? {
          onColumnWidthChange: (headers: HeaderObject[]) =>
            onColumnWidthChange(headers as unknown as AngularHeaderObject[]),
        }
      : {}),
    ...(onHeaderEdit
      ? {
          onHeaderEdit: (header: HeaderObject, newLabel: string) =>
            onHeaderEdit(header as unknown as AngularHeaderObject, newLabel),
        }
      : {}),
    ...(onColumnSelect
      ? {
          onColumnSelect: (header: HeaderObject) =>
            onColumnSelect(header as unknown as AngularHeaderObject),
        }
      : {}),
  };

  if (footerRenderer !== undefined) {
    if ((footerRenderer as any).ɵcmp) {
      vanillaConfig.footerRenderer = wrap(footerRenderer) as any;
    } else {
      vanillaConfig.footerRenderer = footerRenderer as any;
    }
  }

  if (emptyStateRenderer !== undefined) {
    if ((emptyStateRenderer as any).ɵcmp) {
      vanillaConfig.emptyStateRenderer = wrap(emptyStateRenderer) as any;
    } else {
      vanillaConfig.emptyStateRenderer = emptyStateRenderer as any;
    }
  }

  if (errorStateRenderer !== undefined) {
    if ((errorStateRenderer as any).ɵcmp) {
      vanillaConfig.errorStateRenderer = wrap(errorStateRenderer) as any;
    } else {
      vanillaConfig.errorStateRenderer = errorStateRenderer as any;
    }
  }

  if (loadingStateRenderer !== undefined) {
    if ((loadingStateRenderer as any).ɵcmp) {
      vanillaConfig.loadingStateRenderer = wrap(loadingStateRenderer) as any;
    } else {
      vanillaConfig.loadingStateRenderer = loadingStateRenderer as any;
    }
  }

  if (tableEmptyStateRenderer !== undefined) {
    vanillaConfig.tableEmptyStateRenderer = tableEmptyStateRenderer;
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrap(headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig);
  }

  if (icons !== undefined) {
    vanillaConfig.icons = transformIcons(icons);
  }

  return vanillaConfig;
}
