import type { ApplicationRef, EnvironmentInjector } from "@angular/core";
import type { SimpleTableConfig, HeaderObject, ColumnEditorConfig } from "simple-table-core";
import type {
  SimpleTableAngularProps,
  AngularHeaderObject,
  AngularColumnEditorConfig,
} from "./types";
import { wrapAngularRenderer } from "./utils/wrapAngularRenderer";

export function buildVanillaConfig(
  config: SimpleTableAngularProps,
  appRef: ApplicationRef,
  injector: EnvironmentInjector
): SimpleTableConfig {
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

  const wrap = <P extends object>(component: any) =>
    wrapAngularRenderer<P>(component, appRef, injector);

  function transformColumnEditorConfig(cfg: AngularColumnEditorConfig): ColumnEditorConfig {
    const { rowRenderer, ...cfgRest } = cfg;
    return {
      ...cfgRest,
      ...(rowRenderer ? { rowRenderer: wrap(rowRenderer) as any } : {}),
    };
  }

  function transformHeader(header: AngularHeaderObject): HeaderObject {
    const { cellRenderer, headerRenderer, children, nestedTable, ...headerRest } = header;
    const transformed: HeaderObject = { ...(headerRest as any) };

    if (cellRenderer) transformed.cellRenderer = wrap(cellRenderer) as any;
    if (headerRenderer) transformed.headerRenderer = wrap(headerRenderer) as any;
    if (children) transformed.children = children.map(transformHeader);

    if (nestedTable) {
      const nestedFull = { ...nestedTable, rows: [] } as unknown as SimpleTableAngularProps;
      transformed.nestedTable = buildVanillaConfig(nestedFull, appRef, injector) as any;
    }

    return transformed;
  }

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    defaultHeaders: defaultHeaders.map(transformHeader),
  };

  if (footerRenderer !== undefined) {
    vanillaConfig.footerRenderer = wrap(footerRenderer) as any;
  }

  if (emptyStateRenderer !== undefined) {
    vanillaConfig.emptyStateRenderer = wrap(emptyStateRenderer) as any;
  }

  if (errorStateRenderer !== undefined) {
    vanillaConfig.errorStateRenderer = wrap(errorStateRenderer) as any;
  }

  if (loadingStateRenderer !== undefined) {
    vanillaConfig.loadingStateRenderer = wrap(loadingStateRenderer) as any;
  }

  if (headerDropdown !== undefined) {
    vanillaConfig.headerDropdown = wrap(headerDropdown) as any;
  }

  if (columnEditorConfig !== undefined) {
    vanillaConfig.columnEditorConfig = transformColumnEditorConfig(columnEditorConfig);
  }

  return vanillaConfig;
}
