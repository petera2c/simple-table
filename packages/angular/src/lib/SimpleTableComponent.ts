import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ApplicationRef,
  EnvironmentInjector,
  inject,
} from "@angular/core";
import { SimpleTableVanilla } from "simple-table-core";
import type { SimpleTableConfig, TableAPI } from "simple-table-core";
import {
  headersStructurallyEqual,
  rowsShallowUnchanged,
} from "simple-table-core";
import { buildVanillaConfig, resolveAngularColumns } from "../buildVanillaConfig";
import { MountRegistry } from "../MountRegistry";
import type {
  AngularDefaultRowData,
  SimpleTableAngularProps,
  TableInstance,
} from "../types";

/**
 * SimpleTable — Angular adapter for simple-table-core.
 *
 * Accepts the same props as SimpleTableProps (the vanilla user-facing API) but
 * with Angular component types for all renderer props.
 *
 * Prefer typed `rows` / `columns` (`AngularColumnDef<MyRow>`). For a typed
 * imperative handle, use `@ViewChild(SimpleTableComponent) table!: SimpleTableComponent<MyRow>`
 * or listen to `(tableReady)`.
 */
@Component({
  selector: "simple-table",
  standalone: true,
  template: `<div #host></div>`,
  styles: [":host { display: block; }"],
})
export class SimpleTableComponent<
  TData extends AngularDefaultRowData = AngularDefaultRowData,
> implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) rows!: SimpleTableAngularProps<TData>["rows"];
  @Input() columns?: SimpleTableAngularProps<TData>["columns"];

  // All optional SimpleTableAngularProps inputs
  @Input() footerRenderer?: SimpleTableAngularProps<TData>["footerRenderer"];
  @Input() loadingStateRenderer?: SimpleTableAngularProps<TData>["loadingStateRenderer"];
  @Input() errorStateRenderer?: SimpleTableAngularProps<TData>["errorStateRenderer"];
  @Input() emptyStateRenderer?: SimpleTableAngularProps<TData>["emptyStateRenderer"];
  @Input() tableEmptyStateRenderer?: SimpleTableAngularProps<TData>["tableEmptyStateRenderer"];
  @Input() headerDropdown?: SimpleTableAngularProps<TData>["headerDropdown"];
  @Input() columnEditorConfig?: SimpleTableAngularProps<TData>["columnEditorConfig"];
  @Input() onCellClick?: SimpleTableAngularProps<TData>["onCellClick"];
  @Input() onCellEdit?: SimpleTableAngularProps<TData>["onCellEdit"];
  @Input() onSortChange?: SimpleTableAngularProps<TData>["onSortChange"];
  @Input() onFilterChange?: SimpleTableAngularProps<TData>["onFilterChange"];
  @Input() onRowSelectionChange?: SimpleTableAngularProps<TData>["onRowSelectionChange"];
  @Input() onRowGroupExpand?: SimpleTableAngularProps<TData>["onRowGroupExpand"];
  @Input() onColumnOrderChange?: SimpleTableAngularProps<TData>["onColumnOrderChange"];
  @Input() onColumnVisibilityChange?: SimpleTableAngularProps<TData>["onColumnVisibilityChange"];
  @Input() onColumnWidthChange?: SimpleTableAngularProps<TData>["onColumnWidthChange"];
  @Input() onPageChange?: SimpleTableAngularProps<TData>["onPageChange"];
  @Input() onLoadMore?: SimpleTableAngularProps<TData>["onLoadMore"];
  @Input() onTableReady?: SimpleTableAngularProps<TData>["onTableReady"];
  @Input() rowGrouping?: SimpleTableAngularProps<TData>["rowGrouping"];
  @Input() pivot?: SimpleTableAngularProps<TData>["pivot"];
  @Input() onPivotChange?: SimpleTableAngularProps<TData>["onPivotChange"];
  @Input() enableRowSelection?: SimpleTableAngularProps<TData>["enableRowSelection"];
  @Input() theme?: SimpleTableAngularProps<TData>["theme"];
  @Input() quickFilter?: SimpleTableAngularProps<TData>["quickFilter"];
  @Input() isLoading?: SimpleTableAngularProps<TData>["isLoading"];
  @Input() getRowId?: SimpleTableAngularProps<TData>["getRowId"];
  @Input() enablePagination?: SimpleTableAngularProps<TData>["enablePagination"];
  @Input() rowsPerPage?: SimpleTableAngularProps<TData>["rowsPerPage"];
  @Input() serverSidePagination?: SimpleTableAngularProps<TData>["serverSidePagination"];
  @Input() totalRowCount?: SimpleTableAngularProps<TData>["totalRowCount"];
  @Input() height?: SimpleTableAngularProps<TData>["height"];
  @Input() maxHeight?: SimpleTableAngularProps<TData>["maxHeight"];
  @Input() scrollParent?: SimpleTableAngularProps<TData>["scrollParent"];
  @Input() infiniteScrollThreshold?: SimpleTableAngularProps<TData>["infiniteScrollThreshold"];
  @Input() columnResizing?: SimpleTableAngularProps<TData>["columnResizing"];
  @Input() columnReordering?: SimpleTableAngularProps<TData>["columnReordering"];
  @Input() enableColumnEditor?: SimpleTableAngularProps<TData>["enableColumnEditor"];
  @Input() enableColumnEditorInitOpen?: SimpleTableAngularProps<TData>["enableColumnEditorInitOpen"];
  @Input() enablePivotPanel?: SimpleTableAngularProps<TData>["enablePivotPanel"];
  @Input() selectableCells?: SimpleTableAngularProps<TData>["selectableCells"];
  @Input() selectableColumns?: SimpleTableAngularProps<TData>["selectableColumns"];
  @Input() enableHeaderEditing?: SimpleTableAngularProps<TData>["enableHeaderEditing"];
  @Input() onHeaderEdit?: SimpleTableAngularProps<TData>["onHeaderEdit"];
  @Input() customTheme?: SimpleTableAngularProps<TData>["customTheme"];
  @Input() icons?: SimpleTableAngularProps<TData>["icons"];
  @Input() externalFilterHandling?: SimpleTableAngularProps<TData>["externalFilterHandling"];
  @Input() externalSortHandling?: SimpleTableAngularProps<TData>["externalSortHandling"];
  @Input() columnBorders?: SimpleTableAngularProps<TData>["columnBorders"];
  @Input() rowButtons?: SimpleTableAngularProps<TData>["rowButtons"];
  @Input() hideFooter?: SimpleTableAngularProps<TData>["hideFooter"];
  @Input() footerPosition?: SimpleTableAngularProps<TData>["footerPosition"];
  @Input() initialSortColumn?: SimpleTableAngularProps<TData>["initialSortColumn"];
  @Input() initialSortDirection?: SimpleTableAngularProps<TData>["initialSortDirection"];
  @Input() expandAll?: SimpleTableAngularProps<TData>["expandAll"];
  @Input() autoExpandColumns?: SimpleTableAngularProps<TData>["autoExpandColumns"];
  @Input() animations?: SimpleTableAngularProps<TData>["animations"];
  @Input() enableVirtualization?: SimpleTableAngularProps<TData>["enableVirtualization"];
  @Input() hoverRowBackground?: SimpleTableAngularProps<TData>["hoverRowBackground"];
  @Input() oddColumnBackground?: SimpleTableAngularProps<TData>["oddColumnBackground"];
  @Input() oddEvenRowBackground?: SimpleTableAngularProps<TData>["oddEvenRowBackground"];

  /** Emits the TableAPI once the table has mounted. */
  @Output() tableReady = new EventEmitter<TableAPI<TData>>();

  private instance: TableInstance | null = null;
  private registry = new MountRegistry();
  private syncedDefaultHeaders: ReadonlyArray<
    NonNullable<SimpleTableAngularProps<TData>["columns"]>[number]
  > | undefined;
  private syncedRows: SimpleTableAngularProps<TData>["rows"] | undefined;
  private wasLoading = false;
  private didInitialAutoSize = false;
  private hostEl = inject(ElementRef<HTMLElement>);
  private appRef = inject(ApplicationRef);
  private envInjector = inject(EnvironmentInjector);

  private maybeRefitAutoSizeColumns(leftLoading: boolean): void {
    if (!this.instance) return;
    if (leftLoading) {
      this.instance.refitAutoSizeColumns?.();
      return;
    }
    // Angular mounts are synchronous, so custom renderer DOM is already present
    // after the first paint that registered mounts (mirrors Vue/React).
    if (!this.didInitialAutoSize && this.registry.size > 0) {
      this.didInitialAutoSize = true;
      this.instance.refitAutoSizeColumns?.();
    }
  }

  ngOnInit(): void {
    const container = this.hostEl.nativeElement.querySelector("div") as HTMLElement;
    if (!container) return;

    const props = this.getProps();
    this.instance = new SimpleTableVanilla(
      container,
      buildVanillaConfig(props, this.registry, this.appRef, this.envInjector),
    ) as unknown as TableInstance;
    this.instance.mount();
    this.syncedDefaultHeaders = resolveAngularColumns(props);
    this.syncedRows = props.rows;
    this.wasLoading = Boolean(props.isLoading);
    this.maybeRefitAutoSizeColumns(false);

    this.tableReady.emit(this.instance.getAPI() as unknown as TableAPI<TData>);
  }

  ngOnChanges(): void {
    if (!this.instance) return;

    const props = this.getProps();
    const fullConfig = buildVanillaConfig(props, this.registry, this.appRef, this.envInjector);
    const patch: Partial<SimpleTableConfig> = { ...fullConfig };
    const resolvedColumns = resolveAngularColumns(props);

    const headersUnchanged = headersStructurallyEqual(
      this.syncedDefaultHeaders,
      resolvedColumns,
    );
    this.syncedDefaultHeaders = resolvedColumns;
    if (headersUnchanged) {
      delete patch.columns;
    }

    const rowsUnchanged = rowsShallowUnchanged(
      this.syncedRows as ReadonlyArray<object> | undefined,
      props.rows as ReadonlyArray<object>,
      props.getRowId as Parameters<typeof rowsShallowUnchanged>[2],
    );
    this.syncedRows = props.rows;
    if (rowsUnchanged) {
      delete patch.rows;
    }

    const isLoading = Boolean(props.isLoading);
    const leftLoading = this.wasLoading && !isLoading;
    this.wasLoading = isLoading;

    this.instance.update(patch);
    this.maybeRefitAutoSizeColumns(leftLoading);
  }

  ngOnDestroy(): void {
    this.instance?.destroy();
    this.instance = null;
    this.syncedDefaultHeaders = undefined;
    this.syncedRows = undefined;
    this.registry.clear();
  }

  /** Returns the full imperative TableAPI. Use via @ViewChild or (tableReady) output. */
  getAPI(): TableAPI<TData> | null {
    return (this.instance?.getAPI() as TableAPI<TData> | undefined) ?? null;
  }

  private getProps(): SimpleTableAngularProps<TData> {
    const props: SimpleTableAngularProps<TData> = {
      rows: this.rows,
    };

    if (this.columns !== undefined) props.columns = this.columns;
    if (this.footerRenderer !== undefined) props.footerRenderer = this.footerRenderer;
    if (this.loadingStateRenderer !== undefined)
      props.loadingStateRenderer = this.loadingStateRenderer;
    if (this.errorStateRenderer !== undefined) props.errorStateRenderer = this.errorStateRenderer;
    if (this.emptyStateRenderer !== undefined) props.emptyStateRenderer = this.emptyStateRenderer;
    if (this.tableEmptyStateRenderer !== undefined)
      props.tableEmptyStateRenderer = this.tableEmptyStateRenderer;
    if (this.headerDropdown !== undefined) props.headerDropdown = this.headerDropdown;
    if (this.columnEditorConfig !== undefined) props.columnEditorConfig = this.columnEditorConfig;
    if (this.onCellClick !== undefined) props.onCellClick = this.onCellClick;
    if (this.onCellEdit !== undefined) props.onCellEdit = this.onCellEdit;
    if (this.onSortChange !== undefined) props.onSortChange = this.onSortChange;
    if (this.onFilterChange !== undefined) props.onFilterChange = this.onFilterChange;
    if (this.onRowSelectionChange !== undefined)
      props.onRowSelectionChange = this.onRowSelectionChange;
    if (this.onRowGroupExpand !== undefined) props.onRowGroupExpand = this.onRowGroupExpand;
    if (this.onColumnOrderChange !== undefined)
      props.onColumnOrderChange = this.onColumnOrderChange;
    if (this.onColumnVisibilityChange !== undefined)
      props.onColumnVisibilityChange = this.onColumnVisibilityChange;
    if (this.onColumnWidthChange !== undefined)
      props.onColumnWidthChange = this.onColumnWidthChange;
    if (this.onPageChange !== undefined) props.onPageChange = this.onPageChange;
    if (this.onLoadMore !== undefined) props.onLoadMore = this.onLoadMore;
    if (this.onTableReady !== undefined) props.onTableReady = this.onTableReady;
    if (this.rowGrouping !== undefined) props.rowGrouping = this.rowGrouping;
    if (this.pivot !== undefined) props.pivot = this.pivot;
    if (this.onPivotChange !== undefined) props.onPivotChange = this.onPivotChange;
    if (this.enableRowSelection !== undefined) props.enableRowSelection = this.enableRowSelection;
    if (this.theme !== undefined) props.theme = this.theme;
    if (this.quickFilter !== undefined) props.quickFilter = this.quickFilter;
    if (this.isLoading !== undefined) props.isLoading = this.isLoading;
    if (this.getRowId !== undefined) props.getRowId = this.getRowId;
    if (this.enablePagination !== undefined) props.enablePagination = this.enablePagination;
    if (this.rowsPerPage !== undefined) props.rowsPerPage = this.rowsPerPage;
    if (this.serverSidePagination !== undefined)
      props.serverSidePagination = this.serverSidePagination;
    if (this.totalRowCount !== undefined) props.totalRowCount = this.totalRowCount;
    if (this.height !== undefined) props.height = this.height;
    if (this.maxHeight !== undefined) props.maxHeight = this.maxHeight;
    if (this.scrollParent !== undefined) props.scrollParent = this.scrollParent;
    if (this.infiniteScrollThreshold !== undefined)
      props.infiniteScrollThreshold = this.infiniteScrollThreshold;
    if (this.columnResizing !== undefined) props.columnResizing = this.columnResizing;
    if (this.columnReordering !== undefined) props.columnReordering = this.columnReordering;
    if (this.enableColumnEditor !== undefined) props.enableColumnEditor = this.enableColumnEditor;
    if (this.enableColumnEditorInitOpen !== undefined)
      props.enableColumnEditorInitOpen = this.enableColumnEditorInitOpen;
    if (this.enablePivotPanel !== undefined) props.enablePivotPanel = this.enablePivotPanel;
    if (this.selectableCells !== undefined) props.selectableCells = this.selectableCells;
    if (this.selectableColumns !== undefined) props.selectableColumns = this.selectableColumns;
    if (this.enableHeaderEditing !== undefined)
      props.enableHeaderEditing = this.enableHeaderEditing;
    if (this.onHeaderEdit !== undefined) props.onHeaderEdit = this.onHeaderEdit;
    if (this.customTheme !== undefined) props.customTheme = this.customTheme;
    if (this.icons !== undefined) props.icons = this.icons;
    if (this.externalFilterHandling !== undefined)
      props.externalFilterHandling = this.externalFilterHandling;
    if (this.externalSortHandling !== undefined)
      props.externalSortHandling = this.externalSortHandling;
    if (this.columnBorders !== undefined) props.columnBorders = this.columnBorders;
    if (this.rowButtons !== undefined) props.rowButtons = this.rowButtons;
    if (this.hideFooter !== undefined) props.hideFooter = this.hideFooter;
    if (this.footerPosition !== undefined) props.footerPosition = this.footerPosition;
    if (this.initialSortColumn !== undefined) props.initialSortColumn = this.initialSortColumn;
    if (this.initialSortDirection !== undefined)
      props.initialSortDirection = this.initialSortDirection;
    if (this.expandAll !== undefined) props.expandAll = this.expandAll;
    if (this.autoExpandColumns !== undefined) props.autoExpandColumns = this.autoExpandColumns;
    if (this.animations !== undefined) props.animations = this.animations;
    if (this.enableVirtualization !== undefined)
      props.enableVirtualization = this.enableVirtualization;
    if (this.hoverRowBackground !== undefined) props.hoverRowBackground = this.hoverRowBackground;
    if (this.hoverRowBackground !== undefined)
      props.hoverRowBackground = this.hoverRowBackground;
    if (this.oddColumnBackground !== undefined)
      props.oddColumnBackground = this.oddColumnBackground;
    if (this.oddColumnBackground !== undefined)
      props.oddColumnBackground = this.oddColumnBackground;
    if (this.oddEvenRowBackground !== undefined)
      props.oddEvenRowBackground = this.oddEvenRowBackground;
    if (this.oddEvenRowBackground !== undefined)
      props.oddEvenRowBackground = this.oddEvenRowBackground;

    return props;
  }
}
