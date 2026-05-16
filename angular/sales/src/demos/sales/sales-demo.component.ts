import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type {
  AngularCellRenderer,
  AngularHeaderObject,
  CellChangeProps,
  Row,
  Theme,
} from "@simple-table/angular";
import { salesHeadersCore, salesSampleRows } from "./sales.demo-data";
import { SalesCommissionCellComponent } from "./sales-commission-cell.component";
import { SalesDealProfitCellComponent } from "./sales-deal-profit-cell.component";
import { SalesDealValueCellComponent } from "./sales-deal-value-cell.component";
import { SalesIsWonCellComponent } from "./sales-is-won-cell.component";
import { SalesProfitMarginCellComponent } from "./sales-profit-margin-cell.component";
import "@simple-table/angular/styles.css";

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "70dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

const RENDERERS: Partial<Record<string, AngularCellRenderer>> = {
  dealValue: SalesDealValueCellComponent,
  isWon: SalesIsWonCellComponent,
  commission: SalesCommissionCellComponent,
  profitMargin: SalesProfitMarginCellComponent,
  dealProfit: SalesDealProfitCellComponent,
};

function applyCellComponents(hdrs: AngularHeaderObject[]): AngularHeaderObject[] {
  return hdrs.map((h): AngularHeaderObject => {
    const cellRenderer = RENDERERS[String(h.accessor)];
    return {
      ...h,
      ...(cellRenderer ? { cellRenderer } : {}),
      ...(h.children ? { children: applyCellComponents(h.children) } : {}),
    };
  });
}

@Component({
  selector: "sales-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [defaultHeaders]="headers"
      [rows]="data"
      [height]="formatHeight()"
      [theme]="theme"
      [autoExpandColumns]="!isMobile"
      [editColumns]="true"
      [selectableCells]="true"
      [columnResizing]="true"
      [columnReordering]="true"
      [initialSortColumn]="'dealValue'"
      [initialSortDirection]="'desc'"
      (cellEdit)="onCellEdit($event)"
    ></simple-table>
  `,
})
export class SalesDemoComponent implements OnInit, OnDestroy {
  @Input() height: string | number | null | undefined;
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = applyCellComponents(
    structuredClone(salesHeadersCore) as AngularHeaderObject[],
  );
  data: Row[] = salesSampleRows.map((r) => ({ ...r })) as Row[];
  isMobile = false;

  private readonly onResize = () => this.updateMobile();

  ngOnInit(): void {
    this.updateMobile();
    window.addEventListener("resize", this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.onResize);
  }

  formatHeight(): string {
    return formatTableHeight(this.height);
  }

  updateMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  onCellEdit({ accessor, newValue, row }: CellChangeProps): void {
    this.data = this.data.map((item) =>
      item.id === row.id ? { ...item, [accessor]: newValue } : item,
    ) as Row[];
  }
}
