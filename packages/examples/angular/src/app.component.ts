import {
  Component,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { DEMO_LIST } from "./demo-list";
import { QuickStartDemoComponent } from "./demos/quick-start/quick-start-demo.component";
import { ColumnFilteringDemoComponent } from "./demos/column-filtering/column-filtering-demo.component";
import { ColumnSortingDemoComponent } from "./demos/column-sorting/column-sorting-demo.component";
import { ValueFormatterDemoComponent } from "./demos/value-formatter/value-formatter-demo.component";
import { PaginationDemoComponent } from "./demos/pagination/pagination-demo.component";
import { ColumnPinningDemoComponent } from "./demos/column-pinning/column-pinning-demo.component";
import { ColumnAlignmentDemoComponent } from "./demos/column-alignment/column-alignment-demo.component";
import { ColumnWidthDemoComponent } from "./demos/column-width/column-width-demo.component";
import { ColumnResizingDemoComponent } from "./demos/column-resizing/column-resizing-demo.component";
import { ColumnReorderingDemoComponent } from "./demos/column-reordering/column-reordering-demo.component";
import { ColumnSelectionDemoComponent } from "./demos/column-selection/column-selection-demo.component";
import { ColumnEditingDemoComponent } from "./demos/column-editing/column-editing-demo.component";
import { CellEditingDemoComponent } from "./demos/cell-editing/cell-editing-demo.component";
import { CellHighlightingDemoComponent } from "./demos/cell-highlighting/cell-highlighting-demo.component";
import { ThemesDemoComponent } from "./demos/themes/themes-demo.component";
import { RowHeightDemoComponent } from "./demos/row-height/row-height-demo.component";
import { TableHeightDemoComponent } from "./demos/table-height/table-height-demo.component";
import { QuickFilterDemoComponent } from "./demos/quick-filter/quick-filter-demo.component";
import { NestedHeadersDemoComponent } from "./demos/nested-headers/nested-headers-demo.component";
import { AggregateFunctionsDemoComponent } from "./demos/aggregate-functions/aggregate-functions-demo.component";
import { CollapsibleColumnsDemoComponent } from "./demos/collapsible-columns/collapsible-columns-demo.component";
import { ExternalSortDemoComponent } from "./demos/external-sort/external-sort-demo.component";
import { ExternalFilterDemoComponent } from "./demos/external-filter/external-filter-demo.component";
import { LoadingStateDemoComponent } from "./demos/loading-state/loading-state-demo.component";
import { InfiniteScrollDemoComponent } from "./demos/infinite-scroll/infinite-scroll-demo.component";
import { RowSelectionDemoComponent } from "./demos/row-selection/row-selection-demo.component";
import { CsvExportDemoComponent } from "./demos/csv-export/csv-export-demo.component";
import { ProgrammaticControlDemoComponent } from "./demos/programmatic-control/programmatic-control-demo.component";
import { RowGroupingDemoComponent } from "./demos/row-grouping/row-grouping-demo.component";
import { CellRendererDemoComponent } from "./demos/cell-renderer/cell-renderer-demo.component";
import { HeaderRendererDemoComponent } from "./demos/header-renderer/header-renderer-demo.component";
import { FooterRendererDemoComponent } from "./demos/footer-renderer/footer-renderer-demo.component";
import { CellClickingDemoComponent } from "./demos/cell-clicking/cell-clicking-demo.component";
import { TooltipDemoComponent } from "./demos/tooltip/tooltip-demo.component";
import { CustomThemeDemoComponent } from "./demos/custom-theme/custom-theme-demo.component";
import { CustomIconsDemoComponent } from "./demos/custom-icons/custom-icons-demo.component";
import { EmptyStateDemoComponent } from "./demos/empty-state/empty-state-demo.component";
import { ColumnVisibilityDemoComponent } from "./demos/column-visibility/column-visibility-demo.component";
import { ColumnEditorCustomRendererDemoComponent } from "./demos/column-editor-custom-renderer/column-editor-custom-renderer-demo.component";
import { SingleRowChildrenDemoComponent } from "./demos/single-row-children/single-row-children-demo.component";
import { NestedTablesDemoComponent } from "./demos/nested-tables/nested-tables-demo.component";
import { DynamicNestedTablesDemoComponent } from "./demos/dynamic-nested-tables/dynamic-nested-tables-demo.component";
import { DynamicRowLoadingDemoComponent } from "./demos/dynamic-row-loading/dynamic-row-loading-demo.component";
import { ChartsDemoComponent } from "./demos/charts/charts-demo.component";
import { LiveUpdateDemoComponent } from "./demos/live-update/live-update-demo.component";
import { CRMDemoComponent } from "./demos/crm/crm-demo.component";
import { InfrastructureDemoComponent } from "./demos/infrastructure/infrastructure-demo.component";
import { MusicDemoComponent } from "./demos/music/music-demo.component";
import { BillingDemoComponent } from "./demos/billing/billing-demo.component";
import { ManufacturingDemoComponent } from "./demos/manufacturing/manufacturing-demo.component";
import { HRDemoComponent } from "./demos/hr/hr-demo.component";
import { SalesDemoComponent } from "./demos/sales/sales-demo.component";
import { SpreadsheetDemoComponent } from "./demos/spreadsheet/spreadsheet-demo.component";

const REGISTRY: Record<string, any> = {
  "quick-start": QuickStartDemoComponent,
  "column-filtering": ColumnFilteringDemoComponent,
  "column-sorting": ColumnSortingDemoComponent,
  "value-formatter": ValueFormatterDemoComponent,
  "pagination": PaginationDemoComponent,
  "column-pinning": ColumnPinningDemoComponent,
  "column-alignment": ColumnAlignmentDemoComponent,
  "column-width": ColumnWidthDemoComponent,
  "column-resizing": ColumnResizingDemoComponent,
  "column-reordering": ColumnReorderingDemoComponent,
  "column-selection": ColumnSelectionDemoComponent,
  "column-editing": ColumnEditingDemoComponent,
  "cell-editing": CellEditingDemoComponent,
  "cell-highlighting": CellHighlightingDemoComponent,
  "themes": ThemesDemoComponent,
  "row-height": RowHeightDemoComponent,
  "table-height": TableHeightDemoComponent,
  "quick-filter": QuickFilterDemoComponent,
  "nested-headers": NestedHeadersDemoComponent,
  "aggregate-functions": AggregateFunctionsDemoComponent,
  "collapsible-columns": CollapsibleColumnsDemoComponent,
  "external-sort": ExternalSortDemoComponent,
  "external-filter": ExternalFilterDemoComponent,
  "loading-state": LoadingStateDemoComponent,
  "infinite-scroll": InfiniteScrollDemoComponent,
  "row-selection": RowSelectionDemoComponent,
  "csv-export": CsvExportDemoComponent,
  "programmatic-control": ProgrammaticControlDemoComponent,
  "row-grouping": RowGroupingDemoComponent,
  "cell-renderer": CellRendererDemoComponent,
  "header-renderer": HeaderRendererDemoComponent,
  "footer-renderer": FooterRendererDemoComponent,
  "cell-clicking": CellClickingDemoComponent,
  "tooltip": TooltipDemoComponent,
  "custom-theme": CustomThemeDemoComponent,
  "custom-icons": CustomIconsDemoComponent,
  "empty-state": EmptyStateDemoComponent,
  "column-visibility": ColumnVisibilityDemoComponent,
  "column-editor-custom-renderer": ColumnEditorCustomRendererDemoComponent,
  "single-row-children": SingleRowChildrenDemoComponent,
  "nested-tables": NestedTablesDemoComponent,
  "dynamic-nested-tables": DynamicNestedTablesDemoComponent,
  "dynamic-row-loading": DynamicRowLoadingDemoComponent,
  charts: ChartsDemoComponent,
  "live-update": LiveUpdateDemoComponent,
  "crm": CRMDemoComponent,
  "infrastructure": InfrastructureDemoComponent,
  "music": MusicDemoComponent,
  "billing": BillingDemoComponent,
  "manufacturing": ManufacturingDemoComponent,
  "hr": HRDemoComponent,
  "sales": SalesDemoComponent,
  "spreadsheet": SpreadsheetDemoComponent,
};

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    QuickStartDemoComponent,
    ColumnFilteringDemoComponent,
    ColumnSortingDemoComponent,
    ValueFormatterDemoComponent,
    PaginationDemoComponent,
    ColumnPinningDemoComponent,
    ColumnAlignmentDemoComponent,
    ColumnWidthDemoComponent,
    ColumnResizingDemoComponent,
    ColumnReorderingDemoComponent,
    ColumnSelectionDemoComponent,
    ColumnEditingDemoComponent,
    CellEditingDemoComponent,
    CellHighlightingDemoComponent,
    ThemesDemoComponent,
    RowHeightDemoComponent,
    TableHeightDemoComponent,
    QuickFilterDemoComponent,
    NestedHeadersDemoComponent,
    AggregateFunctionsDemoComponent,
    CollapsibleColumnsDemoComponent,
    ExternalSortDemoComponent,
    ExternalFilterDemoComponent,
    LoadingStateDemoComponent,
    InfiniteScrollDemoComponent,
    RowSelectionDemoComponent,
    CsvExportDemoComponent,
    ProgrammaticControlDemoComponent,
    RowGroupingDemoComponent,
    CellRendererDemoComponent,
    HeaderRendererDemoComponent,
    FooterRendererDemoComponent,
    CellClickingDemoComponent,
    TooltipDemoComponent,
    CustomThemeDemoComponent,
    CustomIconsDemoComponent,
    EmptyStateDemoComponent,
    ColumnVisibilityDemoComponent,
    ColumnEditorCustomRendererDemoComponent,
    SingleRowChildrenDemoComponent,
    NestedTablesDemoComponent,
    DynamicNestedTablesDemoComponent,
    DynamicRowLoadingDemoComponent,
    ChartsDemoComponent,
    LiveUpdateDemoComponent,
    CRMDemoComponent,
    InfrastructureDemoComponent,
    MusicDemoComponent,
    BillingDemoComponent,
    ManufacturingDemoComponent,
    HRDemoComponent,
    SalesDemoComponent,
    SpreadsheetDemoComponent,
  ],
  template: `
    <div class="examples-shell">
      <aside class="examples-sidebar">
        <div class="examples-sidebar-header">Angular Examples</div>
        <nav>
          <ul class="examples-sidebar-nav">
            @for (demo of demos; track demo.id) {
              <li>
                <button
                  class="examples-sidebar-link"
                  [class.active]="demo.id === activeDemo"
                  (click)="selectDemo(demo.id)"
                >
                  {{ demo.label }}
                </button>
              </li>
            }
          </ul>
        </nav>
      </aside>
      <main class="examples-content">
        <ng-container #demoHost></ng-container>
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("demoHost", { read: ViewContainerRef, static: true })
  demoHost!: ViewContainerRef;

  demos = DEMO_LIST;
  activeDemo = "quick-start";

  private height: string | undefined;
  private theme: string | undefined;
  private popStateHandler: (() => void) | null = null;

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    this.activeDemo = params.get("demo") || "quick-start";
    this.height = params.get("height") || undefined;
    this.theme = params.get("theme") || undefined;

    this.loadDemo(this.activeDemo);

    this.popStateHandler = () => {
      const p = new URLSearchParams(window.location.search);
      this.activeDemo = p.get("demo") || "quick-start";
      this.loadDemo(this.activeDemo);
    };
    window.addEventListener("popstate", this.popStateHandler);
  }

  ngOnDestroy(): void {
    if (this.popStateHandler) {
      window.removeEventListener("popstate", this.popStateHandler);
    }
  }

  selectDemo(id: string): void {
    this.activeDemo = id;
    const url = new URL(window.location.href);
    url.searchParams.set("demo", id);
    window.history.pushState({}, "", url);
    this.loadDemo(id);
  }

  private loadDemo(id: string): void {
    this.demoHost.clear();
    const component = REGISTRY[id];
    if (component) {
      const ref = this.demoHost.createComponent(component);
      if (this.height) ref.setInput("height", this.height);
      if (this.theme) ref.setInput("theme", this.theme);
    }
  }
}
