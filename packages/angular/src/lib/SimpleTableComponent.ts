import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  ElementRef,
  ApplicationRef,
  EnvironmentInjector,
  Injector,
  NgZone,
  inject,
} from "@angular/core";
import { SimpleTableVanilla } from "simple-table-core";
import type {
  SimpleTableConfig,
  TableAPI,
  SortColumn,
  CellClickProps,
  CellChangeProps,
  TableFilterState,
  RowSelectionChangeProps,
  OnRowGroupExpandProps,
  ColumnVisibilityState,
  PivotConfig,
} from "simple-table-core";
import {
  headersStructurallyEqual,
  rowsShallowUnchanged,
} from "simple-table-core";
import {
  buildVanillaConfig,
  resolveAngularColumns,
  type AngularContentSlots,
} from "../buildVanillaConfig";
import { MountRegistry } from "../MountRegistry";
import type {
  AngularColumnDef,
  AngularDefaultRowData,
  SimpleTableAngularProps,
  TableInstance,
} from "../types";
import {
  StCellDirective,
  StEmptyDirective,
  StErrorDirective,
  StFooterDirective,
  StHeaderDirective,
  StLoadingDirective,
} from "./stDirectives";

/**
 * SimpleTable — Angular adapter for simple-table-core.
 *
 * Accepts the same props as SimpleTableProps (the vanilla user-facing API) but
 * with Angular component types for all renderer props.
 *
 * Prefer typed `rows` / `columns` (`AngularColumnDef<MyRow>`). For a typed
 * imperative handle, use `@ViewChild(SimpleTableComponent) table!: SimpleTableComponent<MyRow>`
 * or listen to `(tableReady)`.
 *
 * Page templates (`stCell`, `stEmpty`, …) and `(sortChange)`-style outputs are
 * the native Angular API. Import `SimpleTableImports` on the page. `class` on
 * this host styles the wrapper; `[className]` styles the inner grid root.
 */
@Component({
  selector: "simple-table",
  standalone: true,
  template: `<div #host></div><ng-content />`,
  styles: [":host { display: block; }"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTableComponent<
  TData extends AngularDefaultRowData = AngularDefaultRowData,
> implements AfterContentInit, OnChanges, OnDestroy {
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
  @Input() onNextPage?: SimpleTableAngularProps<TData>["onNextPage"];
  @Input() onLoadMore?: SimpleTableAngularProps<TData>["onLoadMore"];
  @Input() onTableReady?: SimpleTableAngularProps<TData>["onTableReady"];
  @Input() rowGrouping?: SimpleTableAngularProps<TData>["rowGrouping"];
  @Input() canExpandRowGroup?: SimpleTableAngularProps<TData>["canExpandRowGroup"];
  @Input() enableStickyParents?: SimpleTableAngularProps<TData>["enableStickyParents"];
  @Input() pivot?: SimpleTableAngularProps<TData>["pivot"];
  @Input() onPivotChange?: SimpleTableAngularProps<TData>["onPivotChange"];
  @Input() enableRowSelection?: SimpleTableAngularProps<TData>["enableRowSelection"];
  @Input() rowSelectionMode?: SimpleTableAngularProps<TData>["rowSelectionMode"];
  @Input() selectRowOnClick?: SimpleTableAngularProps<TData>["selectRowOnClick"];
  @Input() showRowSelectionColumn?: SimpleTableAngularProps<TData>["showRowSelectionColumn"];
  @Input() theme?: SimpleTableAngularProps<TData>["theme"];
  @Input() quickFilter?: SimpleTableAngularProps<TData>["quickFilter"];
  @Input() isLoading?: SimpleTableAngularProps<TData>["isLoading"];
  @Input() getRowId?: SimpleTableAngularProps<TData>["getRowId"];
  @Input() getRowClass?: SimpleTableAngularProps<TData>["getRowClass"];
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
  @Input() onColumnSelect?: SimpleTableAngularProps<TData>["onColumnSelect"];
  @Input() customTheme?: SimpleTableAngularProps<TData>["customTheme"];
  @Input() icons?: SimpleTableAngularProps<TData>["icons"];
  @Input() externalFilterHandling?: SimpleTableAngularProps<TData>["externalFilterHandling"];
  @Input() externalSortHandling?: SimpleTableAngularProps<TData>["externalSortHandling"];
  @Input() columnBorders?: SimpleTableAngularProps<TData>["columnBorders"];
  @Input() rowButtons?: SimpleTableAngularProps<TData>["rowButtons"];
  @Input() hideFooter?: SimpleTableAngularProps<TData>["hideFooter"];
  @Input() hideHeader?: SimpleTableAngularProps<TData>["hideHeader"];
  @Input() footerRenderKey?: SimpleTableAngularProps<TData>["footerRenderKey"];
  @Input() footerPosition?: SimpleTableAngularProps<TData>["footerPosition"];
  @Input() className?: SimpleTableAngularProps<TData>["className"];
  @Input() copyHeadersToClipboard?: SimpleTableAngularProps<TData>["copyHeadersToClipboard"];
  @Input() includeHeadersInCSVExport?: SimpleTableAngularProps<TData>["includeHeadersInCSVExport"];
  @Input() initialSortColumn?: SimpleTableAngularProps<TData>["initialSortColumn"];
  @Input() initialSortDirection?: SimpleTableAngularProps<TData>["initialSortDirection"];
  @Input() expandAll?: SimpleTableAngularProps<TData>["expandAll"];
  @Input() autoExpandColumns?: SimpleTableAngularProps<TData>["autoExpandColumns"];
  @Input() animations?: SimpleTableAngularProps<TData>["animations"];
  @Input() cellUpdateFlash?: SimpleTableAngularProps<TData>["cellUpdateFlash"];
  @Input() enableVirtualization?: SimpleTableAngularProps<TData>["enableVirtualization"];
  @Input() hoverRowBackground?: SimpleTableAngularProps<TData>["hoverRowBackground"];
  @Input() oddColumnBackground?: SimpleTableAngularProps<TData>["oddColumnBackground"];
  @Input() oddEvenRowBackground?: SimpleTableAngularProps<TData>["oddEvenRowBackground"];

  /** Emits the TableAPI once the table has mounted. */
  @Output() tableReady = new EventEmitter<TableAPI<TData>>();
  @Output() cellClick = new EventEmitter<CellClickProps<TData>>();
  @Output() cellEdit = new EventEmitter<CellChangeProps<TData>>();
  @Output() sortChange = new EventEmitter<SortColumn | null>();
  @Output() filterChange = new EventEmitter<TableFilterState<TData>>();
  @Output() rowSelectionChange = new EventEmitter<RowSelectionChangeProps<TData>>();
  @Output() rowGroupExpand = new EventEmitter<OnRowGroupExpandProps<TData>>();
  @Output() columnOrderChange = new EventEmitter<AngularColumnDef<TData, any>[]>();
  @Output() columnVisibilityChange = new EventEmitter<ColumnVisibilityState>();
  @Output() columnWidthChange = new EventEmitter<AngularColumnDef<TData, any>[]>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() headerEdit = new EventEmitter<{
    header: AngularColumnDef<TData, any>;
    newLabel: string;
  }>();
  @Output() columnSelect = new EventEmitter<AngularColumnDef<TData, any>>();
  @Output() pivotChange = new EventEmitter<PivotConfig<TData> | null>();

  @ContentChildren(StCellDirective) private cellSlots!: QueryList<StCellDirective>;
  @ContentChildren(StHeaderDirective) private headerSlots!: QueryList<StHeaderDirective>;
  @ContentChildren(StEmptyDirective) private emptySlots!: QueryList<StEmptyDirective>;
  @ContentChildren(StFooterDirective) private footerSlots!: QueryList<StFooterDirective>;
  @ContentChildren(StLoadingDirective) private loadingSlots!: QueryList<StLoadingDirective>;
  @ContentChildren(StErrorDirective) private errorSlots!: QueryList<StErrorDirective>;

  private instance: TableInstance | null = null;
  private registry = new MountRegistry();
  private syncedDefaultHeaders: ReadonlyArray<
    NonNullable<SimpleTableAngularProps<TData>["columns"]>[number]
  > | undefined;
  private syncedRows: SimpleTableAngularProps<TData>["rows"] | undefined;
  private syncedSlotsKey = "";
  private wasLoading = false;
  private didInitialAutoSize = false;
  private slotUnsub: Array<{ unsubscribe(): void }> = [];
  private hostEl = inject(ElementRef<HTMLElement>);
  private appRef = inject(ApplicationRef);
  private envInjector = inject(EnvironmentInjector);
  private elementInjector = inject(Injector);
  private ngZone = inject(NgZone);

  // Run table event callbacks in Angular's zone so the page template updates.
  private inZone<T>(work: () => T): T {
    return this.ngZone.run(work);
  }

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

  private collectSlots(): AngularContentSlots {
    const cellTemplates = new Map<string, StCellDirective["templateRef"]>();
    for (const slot of this.cellSlots ?? []) {
      cellTemplates.set(slot.stCell, slot.templateRef);
    }
    const headerTemplates = new Map<string, StHeaderDirective["templateRef"]>();
    for (const slot of this.headerSlots ?? []) {
      headerTemplates.set(slot.stHeader, slot.templateRef);
    }
    return {
      cellTemplates,
      headerTemplates,
      emptyTemplate: this.emptySlots?.last?.templateRef,
      footerTemplate: this.footerSlots?.last?.templateRef,
      loadingTemplate: this.loadingSlots?.last?.templateRef,
      errorTemplate: this.errorSlots?.last?.templateRef,
    };
  }

  private slotsFingerprint(slots: AngularContentSlots): string {
    const cells = [...(slots.cellTemplates?.keys() ?? [])].sort().join(",");
    const headers = [...(slots.headerTemplates?.keys() ?? [])].sort().join(",");
    return [
      `c:${cells}`,
      `h:${headers}`,
      `e:${slots.emptyTemplate ? 1 : 0}`,
      `f:${slots.footerTemplate ? 1 : 0}`,
      `l:${slots.loadingTemplate ? 1 : 0}`,
      `r:${slots.errorTemplate ? 1 : 0}`,
    ].join("|");
  }

  private buildConfig() {
    const props = this.getProps();
    const slots = this.collectSlots();
    return {
      props,
      slots,
      slotsKey: this.slotsFingerprint(slots),
      fullConfig: buildVanillaConfig(
        props,
        this.registry,
        this.appRef,
        this.envInjector,
        this.elementInjector,
        slots,
      ),
    };
  }

  private mountTable(): void {
    const container = this.hostEl.nativeElement.querySelector("div") as HTMLElement;
    if (!container) return;

    const { props, slotsKey, fullConfig } = this.buildConfig();
    this.instance = new SimpleTableVanilla(
      container,
      fullConfig,
    ) as unknown as TableInstance;
    this.instance.mount();
    this.syncedDefaultHeaders = resolveAngularColumns(props);
    this.syncedRows = props.rows;
    this.syncedSlotsKey = slotsKey;
    this.wasLoading = Boolean(props.isLoading);
    this.maybeRefitAutoSizeColumns(false);

    this.tableReady.emit(this.instance.getAPI() as unknown as TableAPI<TData>);
  }

  private applyConfig(): void {
    if (!this.instance) return;

    const { props, slotsKey, fullConfig } = this.buildConfig();
    const patch: Partial<SimpleTableConfig> = { ...fullConfig };
    const resolvedColumns = resolveAngularColumns(props);

    const headersUnchanged = headersStructurallyEqual(
      this.syncedDefaultHeaders,
      resolvedColumns,
    );
    this.syncedDefaultHeaders = resolvedColumns;
    const slotsChanged = slotsKey !== this.syncedSlotsKey;
    this.syncedSlotsKey = slotsKey;
    if (headersUnchanged && !slotsChanged) {
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

  ngAfterContentInit(): void {
    this.mountTable();
    const lists = [
      this.cellSlots,
      this.headerSlots,
      this.emptySlots,
      this.footerSlots,
      this.loadingSlots,
      this.errorSlots,
    ];
    for (const list of lists) {
      this.slotUnsub.push(list.changes.subscribe(() => this.applyConfig()));
    }
  }

  ngOnChanges(): void {
    this.applyConfig();
  }

  ngOnDestroy(): void {
    for (const sub of this.slotUnsub) sub.unsubscribe();
    this.slotUnsub = [];
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
    if (this.onNextPage !== undefined) props.onNextPage = this.onNextPage;
    if (this.onTableReady !== undefined) props.onTableReady = this.onTableReady;
    if (this.rowGrouping !== undefined) props.rowGrouping = this.rowGrouping;
    if (this.canExpandRowGroup !== undefined) props.canExpandRowGroup = this.canExpandRowGroup;
    if (this.enableStickyParents !== undefined)
      props.enableStickyParents = this.enableStickyParents;
    if (this.pivot !== undefined) props.pivot = this.pivot;
    if (this.enableRowSelection !== undefined) props.enableRowSelection = this.enableRowSelection;
    if (this.rowSelectionMode !== undefined) props.rowSelectionMode = this.rowSelectionMode;
    if (this.selectRowOnClick !== undefined) props.selectRowOnClick = this.selectRowOnClick;
    if (this.showRowSelectionColumn !== undefined)
      props.showRowSelectionColumn = this.showRowSelectionColumn;
    if (this.theme !== undefined) props.theme = this.theme;
    if (this.quickFilter !== undefined) props.quickFilter = this.quickFilter;
    if (this.isLoading !== undefined) props.isLoading = this.isLoading;
    if (this.getRowId !== undefined) props.getRowId = this.getRowId;
    if (this.getRowClass !== undefined) props.getRowClass = this.getRowClass;
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
    if (this.customTheme !== undefined) props.customTheme = this.customTheme;
    if (this.icons !== undefined) props.icons = this.icons;
    if (this.externalFilterHandling !== undefined)
      props.externalFilterHandling = this.externalFilterHandling;
    if (this.externalSortHandling !== undefined)
      props.externalSortHandling = this.externalSortHandling;
    if (this.columnBorders !== undefined) props.columnBorders = this.columnBorders;
    if (this.rowButtons !== undefined) props.rowButtons = this.rowButtons;
    if (this.hideFooter !== undefined) props.hideFooter = this.hideFooter;
    if (this.hideHeader !== undefined) props.hideHeader = this.hideHeader;
    if (this.footerRenderKey !== undefined) props.footerRenderKey = this.footerRenderKey;
    if (this.footerPosition !== undefined) props.footerPosition = this.footerPosition;
    if (this.className !== undefined) props.className = this.className;
    if (this.copyHeadersToClipboard !== undefined)
      props.copyHeadersToClipboard = this.copyHeadersToClipboard;
    if (this.includeHeadersInCSVExport !== undefined)
      props.includeHeadersInCSVExport = this.includeHeadersInCSVExport;
    if (this.initialSortColumn !== undefined) props.initialSortColumn = this.initialSortColumn;
    if (this.initialSortDirection !== undefined)
      props.initialSortDirection = this.initialSortDirection;
    if (this.expandAll !== undefined) props.expandAll = this.expandAll;
    if (this.autoExpandColumns !== undefined) props.autoExpandColumns = this.autoExpandColumns;
    if (this.animations !== undefined) props.animations = this.animations;
    if (this.cellUpdateFlash !== undefined) props.cellUpdateFlash = this.cellUpdateFlash;
    if (this.enableVirtualization !== undefined)
      props.enableVirtualization = this.enableVirtualization;
    if (this.hoverRowBackground !== undefined) props.hoverRowBackground = this.hoverRowBackground;
    if (this.oddColumnBackground !== undefined)
      props.oddColumnBackground = this.oddColumnBackground;
    if (this.oddEvenRowBackground !== undefined)
      props.oddEvenRowBackground = this.oddEvenRowBackground;

    if (this.onCellClick || this.cellClick.observed) {
      props.onCellClick = (event) => {
        this.inZone(() => {
          this.onCellClick?.(event);
          this.cellClick.emit(event);
        });
      };
    }
    if (this.onCellEdit || this.cellEdit.observed) {
      props.onCellEdit = (event) => {
        this.inZone(() => {
          this.onCellEdit?.(event);
          this.cellEdit.emit(event);
        });
      };
    }
    if (this.onSortChange || this.sortChange.observed) {
      props.onSortChange = (sort) => {
        this.inZone(() => {
          this.onSortChange?.(sort);
          this.sortChange.emit(sort);
        });
      };
    }
    if (this.onFilterChange || this.filterChange.observed) {
      props.onFilterChange = (filters) => {
        this.inZone(() => {
          this.onFilterChange?.(filters);
          this.filterChange.emit(filters);
        });
      };
    }
    if (this.onRowSelectionChange || this.rowSelectionChange.observed) {
      props.onRowSelectionChange = (event) => {
        this.inZone(() => {
          this.onRowSelectionChange?.(event);
          this.rowSelectionChange.emit(event);
        });
      };
    }
    if (this.onRowGroupExpand || this.rowGroupExpand.observed) {
      props.onRowGroupExpand = (event) => {
        return this.inZone(() => {
          const result = this.onRowGroupExpand?.(event);
          this.rowGroupExpand.emit(event);
          return result;
        });
      };
    }
    if (this.onColumnOrderChange || this.columnOrderChange.observed) {
      props.onColumnOrderChange = (headers) => {
        this.inZone(() => {
          this.onColumnOrderChange?.(headers);
          this.columnOrderChange.emit(headers);
        });
      };
    }
    if (this.onColumnVisibilityChange || this.columnVisibilityChange.observed) {
      props.onColumnVisibilityChange = (state) => {
        this.inZone(() => {
          this.onColumnVisibilityChange?.(state);
          this.columnVisibilityChange.emit(state);
        });
      };
    }
    if (this.onColumnWidthChange || this.columnWidthChange.observed) {
      props.onColumnWidthChange = (headers) => {
        this.inZone(() => {
          this.onColumnWidthChange?.(headers);
          this.columnWidthChange.emit(headers);
        });
      };
    }
    if (this.onPageChange || this.pageChange.observed) {
      props.onPageChange = (page) => {
        return this.inZone(() => {
          const result = this.onPageChange?.(page);
          this.pageChange.emit(page);
          return result;
        });
      };
    }
    if (this.onLoadMore || this.loadMore.observed) {
      props.onLoadMore = () => {
        this.inZone(() => {
          this.onLoadMore?.();
          this.loadMore.emit();
        });
      };
    }
    if (this.onHeaderEdit || this.headerEdit.observed) {
      props.onHeaderEdit = (header, newLabel) => {
        this.inZone(() => {
          this.onHeaderEdit?.(header, newLabel);
          this.headerEdit.emit({ header, newLabel });
        });
      };
    }
    if (this.onColumnSelect || this.columnSelect.observed) {
      props.onColumnSelect = (header) => {
        this.inZone(() => {
          this.onColumnSelect?.(header);
          this.columnSelect.emit(header);
        });
      };
    }
    if (this.onPivotChange || this.pivotChange.observed) {
      props.onPivotChange = (pivot) => {
        this.inZone(() => {
          this.onPivotChange?.(pivot);
          this.pivotChange.emit(pivot);
        });
      };
    }

    return props;
  }
}
