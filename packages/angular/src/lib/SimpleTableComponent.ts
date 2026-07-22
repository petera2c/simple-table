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
import type { SimpleTableAngularProps, TableInstance } from "../types";

/**
 * SimpleTable — Angular adapter for simple-table-core.
 *
 * Accepts the same props as SimpleTableProps (the vanilla user-facing API) but
 * with Angular component types for all renderer props.
 *
 * Use @ViewChild to access the TableAPI:
 *   @ViewChild(SimpleTableComponent) tableRef!: SimpleTableComponent;
 *   this.tableRef.getAPI()?.sort(...)
 *
 * Or listen to the (tableReady) output event.
 */
@Component({
  selector: "simple-table",
  standalone: true,
  template: `<div #host></div>`,
  styles: [":host { display: block; }"],
})
export class SimpleTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) rows!: SimpleTableAngularProps["rows"];
  @Input() columns?: SimpleTableAngularProps["columns"];

  // All optional SimpleTableAngularProps inputs
  @Input() footerRenderer?: SimpleTableAngularProps["footerRenderer"];
  @Input() loadingStateRenderer?: SimpleTableAngularProps["loadingStateRenderer"];
  @Input() errorStateRenderer?: SimpleTableAngularProps["errorStateRenderer"];
  @Input() emptyStateRenderer?: SimpleTableAngularProps["emptyStateRenderer"];
  @Input() tableEmptyStateRenderer?: SimpleTableAngularProps["tableEmptyStateRenderer"];
  @Input() headerDropdown?: SimpleTableAngularProps["headerDropdown"];
  @Input() columnEditorConfig?: SimpleTableAngularProps["columnEditorConfig"];
  @Input() onCellClick?: SimpleTableAngularProps["onCellClick"];
  @Input() onCellEdit?: SimpleTableAngularProps["onCellEdit"];
  @Input() onSortChange?: SimpleTableAngularProps["onSortChange"];
  @Input() onFilterChange?: SimpleTableAngularProps["onFilterChange"];
  @Input() onRowSelectionChange?: SimpleTableAngularProps["onRowSelectionChange"];
  @Input() onRowGroupExpand?: SimpleTableAngularProps["onRowGroupExpand"];
  @Input() onColumnOrderChange?: SimpleTableAngularProps["onColumnOrderChange"];
  @Input() onColumnVisibilityChange?: SimpleTableAngularProps["onColumnVisibilityChange"];
  @Input() onColumnWidthChange?: SimpleTableAngularProps["onColumnWidthChange"];
  @Input() onPageChange?: SimpleTableAngularProps["onPageChange"];
  @Input() onLoadMore?: SimpleTableAngularProps["onLoadMore"];
  @Input() onTableReady?: SimpleTableAngularProps["onTableReady"];
  @Input() rowGrouping?: SimpleTableAngularProps["rowGrouping"];
  @Input() pivot?: SimpleTableAngularProps["pivot"];
  @Input() onPivotChange?: SimpleTableAngularProps["onPivotChange"];
  @Input() enableRowSelection?: SimpleTableAngularProps["enableRowSelection"];
  @Input() theme?: SimpleTableAngularProps["theme"];
  @Input() quickFilter?: SimpleTableAngularProps["quickFilter"];
  @Input() isLoading?: SimpleTableAngularProps["isLoading"];
  @Input() getRowId?: SimpleTableAngularProps["getRowId"];
  @Input() enablePagination?: SimpleTableAngularProps["enablePagination"];
  @Input() rowsPerPage?: SimpleTableAngularProps["rowsPerPage"];
  @Input() serverSidePagination?: SimpleTableAngularProps["serverSidePagination"];
  @Input() totalRowCount?: SimpleTableAngularProps["totalRowCount"];
  @Input() height?: SimpleTableAngularProps["height"];
  @Input() maxHeight?: SimpleTableAngularProps["maxHeight"];
  @Input() scrollParent?: SimpleTableAngularProps["scrollParent"];
  @Input() infiniteScrollThreshold?: SimpleTableAngularProps["infiniteScrollThreshold"];
  @Input() columnResizing?: SimpleTableAngularProps["columnResizing"];
  @Input() columnReordering?: SimpleTableAngularProps["columnReordering"];
  @Input() enableColumnEditor?: SimpleTableAngularProps["enableColumnEditor"];
  @Input() enableColumnEditorInitOpen?: SimpleTableAngularProps["enableColumnEditorInitOpen"];
  @Input() selectableCells?: SimpleTableAngularProps["selectableCells"];
  @Input() selectableColumns?: SimpleTableAngularProps["selectableColumns"];
  @Input() enableHeaderEditing?: SimpleTableAngularProps["enableHeaderEditing"];
  @Input() onHeaderEdit?: SimpleTableAngularProps["onHeaderEdit"];
  @Input() customTheme?: SimpleTableAngularProps["customTheme"];
  @Input() icons?: SimpleTableAngularProps["icons"];
  @Input() externalFilterHandling?: SimpleTableAngularProps["externalFilterHandling"];
  @Input() externalSortHandling?: SimpleTableAngularProps["externalSortHandling"];
  @Input() columnBorders?: SimpleTableAngularProps["columnBorders"];
  @Input() rowButtons?: SimpleTableAngularProps["rowButtons"];
  @Input() hideFooter?: SimpleTableAngularProps["hideFooter"];
  @Input() footerPosition?: SimpleTableAngularProps["footerPosition"];
  @Input() initialSortColumn?: SimpleTableAngularProps["initialSortColumn"];
  @Input() initialSortDirection?: SimpleTableAngularProps["initialSortDirection"];
  @Input() expandAll?: SimpleTableAngularProps["expandAll"];
  @Input() autoExpandColumns?: SimpleTableAngularProps["autoExpandColumns"];
  @Input() animations?: SimpleTableAngularProps["animations"];
  @Input() enableVirtualization?: SimpleTableAngularProps["enableVirtualization"];
  @Input() hoverRowBackground?: SimpleTableAngularProps["hoverRowBackground"];
  @Input() oddColumnBackground?: SimpleTableAngularProps["oddColumnBackground"];
  @Input() oddEvenRowBackground?: SimpleTableAngularProps["oddEvenRowBackground"];

  /** Emits the TableAPI once the table has mounted. */
  @Output() tableReady = new EventEmitter<TableAPI>();

  private instance: TableInstance | null = null;
  private registry = new MountRegistry();
  private syncedDefaultHeaders: ReadonlyArray<
    NonNullable<SimpleTableAngularProps["columns"]>[number]
  > | undefined;
  private syncedRows: SimpleTableAngularProps["rows"] | undefined;
  private hostEl = inject(ElementRef<HTMLElement>);
  private appRef = inject(ApplicationRef);
  private envInjector = inject(EnvironmentInjector);

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

    this.tableReady.emit(this.instance.getAPI());
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
      props.getRowId,
    );
    this.syncedRows = props.rows;
    if (rowsUnchanged) {
      delete patch.rows;
    }

    this.instance.update(patch);
  }

  ngOnDestroy(): void {
    this.instance?.destroy();
    this.instance = null;
    this.syncedDefaultHeaders = undefined;
    this.syncedRows = undefined;
    this.registry.clear();
  }

  /** Returns the full imperative TableAPI. Use via @ViewChild or (tableReady) output. */
  getAPI(): TableAPI | null {
    return this.instance?.getAPI() ?? null;
  }

  private getProps(): SimpleTableAngularProps {
    const props: SimpleTableAngularProps = {
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
    if (this.enableColumnEditorInitOpen !== undefined)
      props.enableColumnEditorInitOpen = this.enableColumnEditorInitOpen;
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
