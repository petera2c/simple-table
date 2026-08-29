import type { ApplicationRef, EnvironmentInjector, Injector, TemplateRef } from "@angular/core";
import type { SimpleTableConfig, ColumnDef, ColumnEditorConfig } from "simple-table-core";
import { asRows, collectHeaderAccessors } from "simple-table-core";
import type {
  SimpleTableAngularProps,
  AngularColumnDef,
  AngularColumnEditorConfig,
  AngularDefaultRowData,
  AngularIconsConfig,
} from "./types";
import type { MountRegistry } from "./MountRegistry";
import {
  wrapAngularRenderer,
  wrapCachedAngularRenderer,
  wrapAngularColumnEditorRowRenderer,
  type AngularMountOptions,
} from "./utils/wrapAngularRenderer";
import {
  wrapAngularTemplate,
  wrapCachedAngularTemplate,
  cellTemplateContext,
  headerTemplateContext,
  footerTemplateContext,
  loadingTemplateContext,
  errorTemplateContext,
  emptyTemplateContext,
} from "./utils/wrapAngularTemplate";

/** Projected `ng-template` slots from the page that hosts `<simple-table>`. */
export type AngularContentSlots = {
  cellTemplates?: ReadonlyMap<string, TemplateRef<unknown>>;
  headerTemplates?: ReadonlyMap<string, TemplateRef<unknown>>;
  emptyTemplate?: TemplateRef<unknown>;
  footerTemplate?: TemplateRef<unknown>;
  loadingTemplate?: TemplateRef<unknown>;
  errorTemplate?: TemplateRef<unknown>;
};

/** Resolve column definitions. */
export function resolveAngularColumns<
  TData extends AngularDefaultRowData = AngularDefaultRowData,
>(
  config: Pick<SimpleTableAngularProps<TData>, "columns">,
): ReadonlyArray<AngularColumnDef<TData, any>> {
  const headers = config.columns;
  if (!headers) {
    throw new Error("SimpleTable requires `columns`");
  }
  return headers;
}

function resolveTableEmptyState(
  value: NonNullable<SimpleTableAngularProps["tableEmptyStateRenderer"]> | null,
  wrap: <P extends object>(component: any) => (props: Partial<P>) => HTMLElement,
  registry: MountRegistry,
): HTMLElement | string | null | (() => HTMLElement | string | null) {
  if (value === null) {
    if (registry.tableEmptyStateMount) {
      registry.disposeHost(registry.tableEmptyStateMount.host);
      registry.tableEmptyStateMount = null;
    }
    return null;
  }
  if ((value as { ɵcmp?: unknown }).ɵcmp) {
    return () => {
      const existing = registry.tableEmptyStateMount;
      if (
        existing &&
        existing.component === value &&
        registry.isRegistered(existing.host)
      ) {
        return existing.host;
      }
      if (existing) {
        registry.disposeHost(existing.host);
        registry.tableEmptyStateMount = null;
      }
      const host = wrap(value as any)({});
      registry.tableEmptyStateMount = { component: value, host };
      return host;
    };
  }
  if (registry.tableEmptyStateMount) {
    registry.disposeHost(registry.tableEmptyStateMount.host);
    registry.tableEmptyStateMount = null;
  }
  return value as HTMLElement | string;
}

export function buildVanillaConfig<TData extends AngularDefaultRowData = AngularDefaultRowData>(
  config: SimpleTableAngularProps<TData>,
  registry: MountRegistry,
  appRef: ApplicationRef,
  injector: EnvironmentInjector,
  elementInjector?: Injector,
  slots?: AngularContentSlots,
): SimpleTableConfig {
  const {
    columns: _columns,
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
    enableColumnEditor,
    enableColumnEditorInitOpen,
    enablePagination,
    onTableReady,
    hoverRowBackground,
    oddColumnBackground,
    oddEvenRowBackground,
    ...rest
  } = config;

  const mountOptions: AngularMountOptions = {
    appRef,
    envInjector: injector,
    registry,
    elementInjector,
  };
  const wrap = <P extends object>(component: any) =>
    wrapAngularRenderer<P>(component, appRef, injector, registry, elementInjector);

  function transformIcons(iconsConfig: AngularIconsConfig): NonNullable<SimpleTableConfig["icons"]> {
    const result: NonNullable<SimpleTableConfig["icons"]> = {};
    for (const [key, value] of Object.entries(iconsConfig)) {
      if (value == null) continue;
      if (
        typeof value === "string" ||
        value instanceof HTMLElement ||
        value instanceof SVGSVGElement
      ) {
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
      ...(rowRenderer
        ? {
            rowRenderer: wrapAngularColumnEditorRowRenderer(
              rowRenderer as any,
              mountOptions,
            ) as any,
          }
        : {}),
      ...(customRenderer ? { customRenderer: wrap(customRenderer) as any } : {}),
    };
  }

  function transformHeader(header: AngularColumnDef<TData, any>): ColumnDef {
    const { cellRenderer, headerRenderer, children, nestedTable, ...headerRest } = header;
    const accessor = String(header.accessor);
    const transformed: ColumnDef = { ...(headerRest as any) };

    const cellTemplate = slots?.cellTemplates?.get(accessor);
    if (cellTemplate) {
      transformed.cellRenderer = wrapCachedAngularTemplate(
        cellTemplate,
        mountOptions,
        accessor,
        "cell",
        cellTemplateContext,
      ) as any;
    } else if (cellRenderer) {
      if ((cellRenderer as any).ɵcmp) {
        transformed.cellRenderer = wrapCachedAngularRenderer(
          cellRenderer as any,
          mountOptions,
          accessor,
          "cell",
        ) as any;
      } else {
        transformed.cellRenderer = cellRenderer as any;
      }
    }
    const headerTemplate = slots?.headerTemplates?.get(accessor);
    if (headerTemplate) {
      transformed.headerRenderer = wrapCachedAngularTemplate(
        headerTemplate,
        mountOptions,
        accessor,
        "header",
        headerTemplateContext,
      ) as any;
    } else if (headerRenderer) {
      if ((headerRenderer as any).ɵcmp) {
        transformed.headerRenderer = wrapCachedAngularRenderer(
          headerRenderer as any,
          mountOptions,
          accessor,
          "header",
        ) as any;
      } else {
        transformed.headerRenderer = headerRenderer as any;
      }
    }
    if (children) transformed.children = children.map(transformHeader);

    if (nestedTable) {
      const nestedFull = { ...nestedTable, rows: [] } as unknown as SimpleTableAngularProps;
      transformed.nestedTable = buildVanillaConfig(
        nestedFull,
        registry,
        appRef,
        injector,
        elementInjector,
      ) as any;
    }

    return transformed;
  }

  const columns = resolveAngularColumns(config);

  registry.pruneRendererCaches(collectHeaderAccessors(columns));

  // `rest` still carries TData-bound callbacks (getRowId, onCellEdit, …).
  // Widen once here — the vanilla runtime is Row-shaped.
  const shared = rest as SimpleTableConfig;

  const vanillaConfig: SimpleTableConfig = {
    ...shared,
    rows: asRows(rows),
    columns: columns.map(transformHeader),
    enableColumnEditor,
    enableColumnEditorInitOpen,
    enablePagination,
    onTableReady,
    hoverRowBackground,
    oddColumnBackground,
    oddEvenRowBackground,
    // Authoritative mount teardown: core calls this before it permanently
    // discards any host element, so the registry destroys exactly the affected
    // Angular ComponentRefs (including CDK Overlay / floating UI).
    onRendererHostDiscard: registry.disposeHost,
  };

  if (onColumnOrderChange) {
    vanillaConfig.onColumnOrderChange = (headers) =>
      onColumnOrderChange(headers as unknown as AngularColumnDef<TData, any>[]);
  }
  if (onColumnWidthChange) {
    vanillaConfig.onColumnWidthChange = (headers) =>
      onColumnWidthChange(headers as unknown as AngularColumnDef<TData, any>[]);
  }
  if (onHeaderEdit) {
    vanillaConfig.onHeaderEdit = (header, newLabel) =>
      onHeaderEdit(header as unknown as AngularColumnDef<TData, any>, newLabel);
  }
  if (onColumnSelect) {
    vanillaConfig.onColumnSelect = (header) =>
      onColumnSelect(header as unknown as AngularColumnDef<TData, any>);
  }

  if (slots?.footerTemplate) {
    vanillaConfig.footerRenderer = wrapAngularTemplate(
      slots.footerTemplate,
      mountOptions,
      footerTemplateContext,
    ) as any;
  } else if (footerRenderer !== undefined) {
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

  if (slots?.errorTemplate) {
    vanillaConfig.errorStateRenderer = wrapAngularTemplate(
      slots.errorTemplate,
      mountOptions,
      errorTemplateContext,
    ) as any;
  } else if (errorStateRenderer !== undefined) {
    if ((errorStateRenderer as any).ɵcmp) {
      vanillaConfig.errorStateRenderer = wrap(errorStateRenderer) as any;
    } else {
      vanillaConfig.errorStateRenderer = errorStateRenderer as any;
    }
  }

  if (slots?.loadingTemplate) {
    vanillaConfig.loadingStateRenderer = wrapAngularTemplate(
      slots.loadingTemplate,
      mountOptions,
      loadingTemplateContext,
    ) as any;
  } else if (loadingStateRenderer !== undefined) {
    if ((loadingStateRenderer as any).ɵcmp) {
      vanillaConfig.loadingStateRenderer = wrap(loadingStateRenderer) as any;
    } else {
      vanillaConfig.loadingStateRenderer = loadingStateRenderer as any;
    }
  }

  if (slots?.emptyTemplate) {
    const renderEmpty = wrapAngularTemplate(
      slots.emptyTemplate,
      mountOptions,
      emptyTemplateContext,
    );
    vanillaConfig.tableEmptyStateRenderer = () => renderEmpty({});
  } else if (tableEmptyStateRenderer !== undefined) {
    vanillaConfig.tableEmptyStateRenderer = resolveTableEmptyState(
      tableEmptyStateRenderer,
      wrap,
      registry,
    );
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

  if (rowButtons !== undefined) {
    vanillaConfig.rowButtons = rowButtons.map((button) => wrap(button) as any);
  }

  return vanillaConfig;
}
