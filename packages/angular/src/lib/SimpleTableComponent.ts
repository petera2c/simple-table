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
import type { TableAPI } from "simple-table-core";
import { buildVanillaConfig } from "../buildVanillaConfig";
import type { SimpleTableAngularProps, TableInstance, AngularHeaderObject } from "../types";
import type { Row } from "simple-table-core";

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
  @Input({ required: true }) rows!: Row[];
  @Input({ required: true }) defaultHeaders!: AngularHeaderObject[];

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
  @Input() onGridReady?: SimpleTableAngularProps["onGridReady"];
  @Input() rowGrouping?: SimpleTableAngularProps["rowGrouping"];
  @Input() enableRowSelection?: SimpleTableAngularProps["enableRowSelection"];
  @Input() theme?: SimpleTableAngularProps["theme"];
  @Input() quickFilter?: SimpleTableAngularProps["quickFilter"];
  @Input() isLoading?: SimpleTableAngularProps["isLoading"];
  @Input() getRowId?: SimpleTableAngularProps["getRowId"];
  @Input() shouldPaginate?: SimpleTableAngularProps["shouldPaginate"];
  @Input() rowsPerPage?: SimpleTableAngularProps["rowsPerPage"];
  @Input() serverSidePagination?: SimpleTableAngularProps["serverSidePagination"];
  @Input() totalRowCount?: SimpleTableAngularProps["totalRowCount"];
  @Input() height?: SimpleTableAngularProps["height"];
  @Input() maxHeight?: SimpleTableAngularProps["maxHeight"];
  @Input() columnResizing?: SimpleTableAngularProps["columnResizing"];
  @Input() columnReordering?: SimpleTableAngularProps["columnReordering"];
  @Input() editColumns?: SimpleTableAngularProps["editColumns"];
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
  @Input() initialSortColumn?: SimpleTableAngularProps["initialSortColumn"];
  @Input() initialSortDirection?: SimpleTableAngularProps["initialSortDirection"];
  @Input() expandAll?: SimpleTableAngularProps["expandAll"];
  @Input() autoExpandColumns?: SimpleTableAngularProps["autoExpandColumns"];

  /** Emits the TableAPI once the table has mounted. */
  @Output() tableReady = new EventEmitter<TableAPI>();

  private instance: TableInstance | null = null;
  private hostEl = inject(ElementRef<HTMLElement>);
  private appRef = inject(ApplicationRef);
  private envInjector = inject(EnvironmentInjector);

  ngOnInit(): void {
    const container = this.hostEl.nativeElement.querySelector("div") as HTMLElement;
    if (!container) return;

    this.instance = new SimpleTableVanilla(
      container,
      buildVanillaConfig(this.getProps(), this.appRef, this.envInjector)
    ) as unknown as TableInstance;
    this.instance.mount();

    this.tableReady.emit(this.instance.getAPI());
  }

  ngOnChanges(): void {
    this.instance?.update(
      buildVanillaConfig(this.getProps(), this.appRef, this.envInjector)
    );
  }

  ngOnDestroy(): void {
    this.instance?.destroy();
    this.instance = null;
  }

  /** Returns the full imperative TableAPI. Use via @ViewChild or (tableReady) output. */
  getAPI(): TableAPI | null {
    return this.instance?.getAPI() ?? null;
  }

  private getProps(): SimpleTableAngularProps {
    const props: SimpleTableAngularProps = {
      rows: this.rows,
      defaultHeaders: this.defaultHeaders,
    };

    if (this.footerRenderer !== undefined) props.footerRenderer = this.footerRenderer;
    if (this.loadingStateRenderer !== undefined) props.loadingStateRenderer = this.loadingStateRenderer;
    if (this.errorStateRenderer !== undefined) props.errorStateRenderer = this.errorStateRenderer;
    if (this.emptyStateRenderer !== undefined) props.emptyStateRenderer = this.emptyStateRenderer;
    if (this.tableEmptyStateRenderer !== undefined) props.tableEmptyStateRenderer = this.tableEmptyStateRenderer;
    if (this.headerDropdown !== undefined) props.headerDropdown = this.headerDropdown;
    if (this.columnEditorConfig !== undefined) props.columnEditorConfig = this.columnEditorConfig;
    if (this.onCellClick !== undefined) props.onCellClick = this.onCellClick;
    if (this.onCellEdit !== undefined) props.onCellEdit = this.onCellEdit;
    if (this.onSortChange !== undefined) props.onSortChange = this.onSortChange;
    if (this.onFilterChange !== undefined) props.onFilterChange = this.onFilterChange;
    if (this.onRowSelectionChange !== undefined) props.onRowSelectionChange = this.onRowSelectionChange;
    if (this.onRowGroupExpand !== undefined) props.onRowGroupExpand = this.onRowGroupExpand;
    if (this.onColumnOrderChange !== undefined) props.onColumnOrderChange = this.onColumnOrderChange;
    if (this.onColumnVisibilityChange !== undefined) props.onColumnVisibilityChange = this.onColumnVisibilityChange;
    if (this.onColumnWidthChange !== undefined) props.onColumnWidthChange = this.onColumnWidthChange;
    if (this.onPageChange !== undefined) props.onPageChange = this.onPageChange;
    if (this.onLoadMore !== undefined) props.onLoadMore = this.onLoadMore;
    if (this.onGridReady !== undefined) props.onGridReady = this.onGridReady;
    if (this.rowGrouping !== undefined) props.rowGrouping = this.rowGrouping;
    if (this.enableRowSelection !== undefined) props.enableRowSelection = this.enableRowSelection;
    if (this.theme !== undefined) props.theme = this.theme;
    if (this.quickFilter !== undefined) props.quickFilter = this.quickFilter;
    if (this.isLoading !== undefined) props.isLoading = this.isLoading;
    if (this.getRowId !== undefined) props.getRowId = this.getRowId;
    if (this.shouldPaginate !== undefined) props.shouldPaginate = this.shouldPaginate;
    if (this.rowsPerPage !== undefined) props.rowsPerPage = this.rowsPerPage;
    if (this.serverSidePagination !== undefined) props.serverSidePagination = this.serverSidePagination;
    if (this.totalRowCount !== undefined) props.totalRowCount = this.totalRowCount;
    if (this.height !== undefined) props.height = this.height;
    if (this.maxHeight !== undefined) props.maxHeight = this.maxHeight;
    if (this.columnResizing !== undefined) props.columnResizing = this.columnResizing;
    if (this.columnReordering !== undefined) props.columnReordering = this.columnReordering;
    if (this.editColumns !== undefined) props.editColumns = this.editColumns;
    if (this.selectableCells !== undefined) props.selectableCells = this.selectableCells;
    if (this.selectableColumns !== undefined) props.selectableColumns = this.selectableColumns;
    if (this.enableHeaderEditing !== undefined) props.enableHeaderEditing = this.enableHeaderEditing;
    if (this.onHeaderEdit !== undefined) props.onHeaderEdit = this.onHeaderEdit;
    if (this.customTheme !== undefined) props.customTheme = this.customTheme;
    if (this.icons !== undefined) props.icons = this.icons;
    if (this.externalFilterHandling !== undefined) props.externalFilterHandling = this.externalFilterHandling;
    if (this.externalSortHandling !== undefined) props.externalSortHandling = this.externalSortHandling;
    if (this.columnBorders !== undefined) props.columnBorders = this.columnBorders;
    if (this.rowButtons !== undefined) props.rowButtons = this.rowButtons;
    if (this.hideFooter !== undefined) props.hideFooter = this.hideFooter;
    if (this.initialSortColumn !== undefined) props.initialSortColumn = this.initialSortColumn;
    if (this.initialSortDirection !== undefined) props.initialSortDirection = this.initialSortDirection;
    if (this.expandAll !== undefined) props.expandAll = this.expandAll;
    if (this.autoExpandColumns !== undefined) props.autoExpandColumns = this.autoExpandColumns;

    return props;
  }
}
