import { Component, Input, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, TableAPI, Theme } from "@simple-table/angular";
import { cryptoConfig } from "./crypto.demo-data";
import "@simple-table/angular/styles.css";
import type { CryptoCoin } from "./crypto.demo-data";

@Component({
  selector: "crypto-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [autoExpandColumns]="true"
      #simpleTable
      [columns]="headers"
      [rows]="rows"
      [getRowId]="getRowId"
      [height]="height"
      [theme]="theme"
      [columnReordering]="true"
      [columnResizing]="true"
      [enableColumnEditor]="true"
      [selectableCells]="true"
      [cellUpdateFlash]="true"
      [customTheme]="customTheme"
    ></simple-table>
  `,
})
export class CryptoDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent<CryptoCoin>;
  @Input() height: string | number = "70dvh";
  @Input() theme?: Theme;

  readonly headers: AngularColumnDef<CryptoCoin>[] = cryptoConfig.headers;
  readonly rows: CryptoCoin[] = cryptoConfig.rows;
  readonly customTheme = { headerHeight: 40, rowHeight: 48 };
  readonly getRowId = ({ row }: GetRowIdParams<CryptoCoin>) => row.id;

  private cleanupFn?: () => void;

  ngAfterViewInit(): void {
    const TICK_MS = 90;
    const ROWS_PER_TICK = 6;

    function pickRandomSubset<T>(arr: T[], n: number): T[] {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = copy[i]!;
        copy[i] = copy[j]!;
        copy[j] = t;
      }
      return copy.slice(0, Math.min(n, copy.length));
    }

    function runTick(getApi: () => TableAPI<CryptoCoin> | null | undefined) {
      const api = getApi();
      if (!api) return;
      const visible = api.getVisibleRows();
      if (!visible.length) return;
      for (const vr of pickRandomSubset(visible, ROWS_PER_TICK)) {
        const row = vr.row;
        const rowId = row.id;
        const drift = (Math.random() - 0.5) * 0.012;
        const newPrice = Math.max(row.price * (1 + drift), row.price * 0.0001);
        const round = newPrice >= 1 ? 1e2 : 1e6;
        const newPriceRounded = Math.round(newPrice * round) / round;
        const newChange = Math.round((row.change24h + drift * 100) * 100) / 100;
        api.updateData({ accessor: "price", rowId, newValue: newPriceRounded });
        api.updateData({ accessor: "change24h", rowId, newValue: newChange });
        if (row.priceHistory.length > 0) {
          api.updateData({
            accessor: "priceHistory",
            rowId,
            newValue: [...row.priceHistory.slice(1), newPriceRounded],
          });
        }
      }
    }
    const intervalId = setInterval(() => runTick(() => this.tableRef?.getAPI() ?? null), TICK_MS);
    this.cleanupFn = () => clearInterval(intervalId);
  }

  ngOnDestroy(): void {
    this.cleanupFn?.();
  }
}
