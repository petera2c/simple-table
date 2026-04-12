import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { SimpleTableComponent, mapToAngularHeaderObjects } from "@simple-table/angular";
import type { AngularHeaderObject, CellChangeProps, CellRenderer, HeaderObject, Row, Theme } from "@simple-table/angular";
import { getThemeColors, salesHeadersCore, salesSampleRows, type SalesRow } from "./sales.demo-data";
import "@simple-table/angular/styles.css";

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "70dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

function el(tag: string, styles?: Partial<CSSStyleDeclaration>, children?: (Node | string)[]): HTMLElement {
  const e = document.createElement(tag);
  if (styles) Object.assign(e.style, styles);
  if (children) {
    for (const c of children) {
      e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
  }
  return e;
}

function buildSalesRenderers(): Record<string, CellRenderer> {
  return {
    dealValue: ({ row, theme }) => {
      if (row.dealValue === "—") return "—";
      const d = row as unknown as SalesRow;
      const c = getThemeColors(theme);
      let color = c.gray;
      let fontWeight = "normal";
      if (d.dealValue > 100000) {
        color = c.success.high.color;
        fontWeight = c.success.high.fontWeight;
      } else if (d.dealValue > 50000) color = c.success.medium;
      else if (d.dealValue > 10000) color = c.success.low;
      return el("span", { color, fontWeight }, [
        `$${d.dealValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ]);
    },

    isWon: ({ row }) => {
      if (row.isWon === "—") return "—";
      const d = row as unknown as SalesRow;
      const s = d.isWon ? { bg: "#f6ffed", text: "#2a6a0d" } : { bg: "#fff1f0", text: "#a8071a" };
      return el(
        "span",
        {
          backgroundColor: s.bg,
          color: s.text,
          padding: "0 7px",
          fontSize: "12px",
          lineHeight: "20px",
          borderRadius: "2px",
          display: "inline-block",
        },
        [d.isWon ? "Won" : "Lost"],
      );
    },

    commission: ({ row, theme }) => {
      if (row.commission === "—") return "—";
      const d = row as unknown as SalesRow;
      const c = getThemeColors(theme);
      if (d.commission === 0) return el("span", { color: c.grayMuted }, ["$0.00"]);
      return `$${d.commission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    profitMargin: ({ row, theme }) => {
      if (row.profitMargin === "—") return "—";
      const d = row as unknown as SalesRow;
      const c = getThemeColors(theme);
      let color = c.gray;
      let fontWeight = "normal";
      if (d.profitMargin >= 0.7) {
        color = c.success.high.color;
        fontWeight = c.success.high.fontWeight;
      } else if (d.profitMargin >= 0.5) color = c.success.medium;
      else if (d.profitMargin >= 0.4) color = c.success.low;
      else if (d.profitMargin >= 0.3) color = c.info;
      else color = c.warning;
      const barColor =
        d.profitMargin >= 0.5 ? c.progressColors.high : d.profitMargin >= 0.3 ? c.progressColors.medium : c.progressColors.low;

      const pctSpan = el("span", { color, fontWeight }, [`${(d.profitMargin * 100).toFixed(1)}%`]);
      const track = el("div", {
        backgroundColor: "#f5f5f5",
        height: "6px",
        width: "100%",
        borderRadius: "100px",
        overflow: "hidden",
      });
      track.appendChild(
        el("div", {
          height: "100%",
          width: `${d.profitMargin * 100}%`,
          backgroundColor: barColor,
          borderRadius: "100px",
        }),
      );
      const barWrap = el("div", { marginLeft: "8px", width: "48px" }, [track]);

      return el("div", { display: "flex", alignItems: "center", justifyContent: "flex-end" }, [pctSpan, barWrap]);
    },

    dealProfit: ({ row, theme }) => {
      if (row.dealProfit === "—") return "—";
      const d = row as unknown as SalesRow;
      const c = getThemeColors(theme);
      if (d.dealProfit === 0) return el("span", { color: c.grayMuted }, ["$0.00"]);
      let color = c.gray;
      let fontWeight = "normal";
      if (d.dealProfit > 50000) {
        color = c.success.high.color;
        fontWeight = c.success.high.fontWeight;
      } else if (d.dealProfit > 20000) color = c.success.medium;
      else if (d.dealProfit > 10000) color = c.success.low;
      return el("span", { color, fontWeight }, [
        `$${d.dealProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ]);
    },
  };
}

function buildSalesHeaders(): AngularHeaderObject[] {
  const renderers = buildSalesRenderers();
  const headers: HeaderObject[] = JSON.parse(JSON.stringify(salesHeadersCore));

  const applyRenderers = (hdrs: HeaderObject[]) => {
    for (const h of hdrs) {
      const renderer = renderers[String(h.accessor)];
      if (renderer) h.cellRenderer = renderer;
      if (h.children) applyRenderers(h.children as HeaderObject[]);
    }
  };
  applyRenderers(headers);
  return mapToAngularHeaderObjects(headers);
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

  readonly headers: AngularHeaderObject[] = buildSalesHeaders();
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
