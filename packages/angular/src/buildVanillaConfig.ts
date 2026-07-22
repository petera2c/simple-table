import type { ApplicationRef, EnvironmentInjector } from "@angular/core";
import type { SimpleTableConfig, ColumnDef, ColumnEditorConfig, Row } from "simple-table-core";
import { collectHeaderAccessors } from "simple-table-core";
import type {
  SimpleTableAngularProps,
  AngularColumnDef,
  AngularColumnEditorConfig,
  AngularIconsConfig,
} from "./types";
import type { MountRegistry } from "./MountRegistry";
import { wrapAngularRenderer, wrapCachedAngularRenderer } from "./utils/wrapAngularRenderer";

/** Resolve column definitions. */
export function resolveAngularColumns(
  config: Pick<SimpleTableAngularProps, "columns">,
): ReadonlyArray<ColumnDef | AngularColumnDef> {
  const headers = config.columns;
  if (!headers) {
    throw new Error("SimpleTable requires `columns`");
  }
  return headers;
}

export function buildVanillaConfig(
  config: SimpleTableAngularProps,
  registry: MountRegistry,
  appRef: ApplicationRef,
  injector: EnvironmentInjector,
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

  const wrap = <P extends object>(component: any) =>
    wrapAngularRenderer<P>(component, appRef, injector, registry);

  function transformIcons(icons: AngularIconsConfig): NonNullable<SimpleTableConfig["icons"]> {
    const result: NonNullable<SimpleTableConfig["icons"]> = {};
    for (const [key, value] of Object.entries(icons)) {
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
      ...(rowRenderer ? { rowRenderer: wrap(rowRenderer) as any } : {}),
      ...(customRenderer ? { customRenderer: wrap(customRenderer) as any } : {}),
    };
  }

  function transformHeader(header: ColumnDef | AngularColumnDef): ColumnDef {
    const { cellRenderer, headerRenderer, children, nestedTable, ...headerRest } = header;
    const accessor = String(header.accessor);
    const transformed: ColumnDef = { ...(headerRest as any) };

    if (cellRenderer) {
      if ((cellRenderer as any).ɵcmp) {
        transformed.cellRenderer = wrapCachedAngularRenderer(
          cellRenderer as any,
          appRef,
          injector,
          registry,
          accessor,
          "cell",
        ) as any;
      } else {
        transformed.cellRenderer = cellRenderer as any;
      }
    }
    if (headerRenderer) {
      if ((headerRenderer as any).ɵcmp) {
        transformed.headerRenderer = wrapCachedAngularRenderer(
          headerRenderer as any,
          appRef,
          injector,
          registry,
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
      ) as any;
    }

    return transformed;
  }

  const columns = resolveAngularColumns(config);

  registry.pruneRendererCaches(collectHeaderAccessors(columns));

  const vanillaConfig: SimpleTableConfig = {
    ...rest,
    rows: rows as Row[],
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
    ...(onColumnOrderChange
      ? {
          onColumnOrderChange: (headers: ColumnDef[]) =>
            onColumnOrderChange(headers as unknown as AngularColumnDef[]),
        }
      : {}),
    ...(onColumnWidthChange
      ? {
          onColumnWidthChange: (headers: ColumnDef[]) =>
            onColumnWidthChange(headers as unknown as AngularColumnDef[]),
        }
      : {}),
    ...(onHeaderEdit
      ? {
          onHeaderEdit: (header: ColumnDef, newLabel: string) =>
            onHeaderEdit(header as unknown as AngularColumnDef, newLabel),
        }
      : {}),
    ...(onColumnSelect
      ? {
          onColumnSelect: (header: ColumnDef) =>
            onColumnSelect(header as unknown as AngularColumnDef),
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

  if (rowButtons !== undefined) {
    vanillaConfig.rowButtons = rowButtons.map((button) => wrap(button) as any);
  }

  return vanillaConfig;
}
