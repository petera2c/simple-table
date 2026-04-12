import { Component, Input, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { liveUpdateConfig, liveUpdateData } from "./live-update.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "live-update-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      #simpleTable
      [defaultHeaders]="headers"
      [rows]="rows"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class LiveUpdateDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = liveUpdateConfig.headers;
  readonly rows: Row[] = liveUpdateConfig.rows;

  private cleanupFn?: () => void;

  ngAfterViewInit(): void {
    const api = this.tableRef.getAPI();
    if (!api) return;

    const currentData = JSON.parse(JSON.stringify(liveUpdateData));
    const timerMap = new Map<string | number, ReturnType<typeof setTimeout>>();
    const currentPeriodSales = new Map<string | number, number>();
    let isActive = true;

    const createRowTimer = (rowId: string | number) => {
      const scheduleUpdate = () => {
        if (!isActive) return;
        const interval = 300 + Math.random() * 700;
        const timerId = setTimeout(() => {
          if (!isActive) return;
          const currentApi = this.tableRef?.getAPI();
          if (!currentApi) return;
          const idx = currentData.findIndex((r: any) => r.id === rowId);
          if (idx === -1) return;
          const product = currentData[idx];

          if (typeof product.price === "number") {
            const newPrice = parseFloat((product.price * (0.95 + Math.random() * 0.1)).toFixed(2));
            currentData[idx].price = newPrice;
            currentApi.updateData({ accessor: "price", rowIndex: idx, newValue: newPrice });
          }
          if (typeof product.stock === "number") {
            const newStock = Math.max(0, product.stock + Math.floor((Math.random() - 0.5) * 6));
            currentData[idx].stock = newStock;
            currentApi.updateData({ accessor: "stock", rowIndex: idx, newValue: newStock });
            if (Array.isArray(product.stockHistory)) {
              const updated = [...product.stockHistory.slice(1), newStock];
              currentData[idx].stockHistory = updated;
              currentApi.updateData({ accessor: "stockHistory", rowIndex: idx, newValue: updated });
            }
          }
          if (Math.random() < 0.6 && typeof product.sales === "number") {
            const inc = Math.floor(Math.random() * 3) + 1;
            currentData[idx].sales = product.sales + inc;
            currentApi.updateData({ accessor: "sales", rowIndex: idx, newValue: currentData[idx].sales });
            currentPeriodSales.set(rowId, (currentPeriodSales.get(rowId) || 0) + inc);
          }
          scheduleUpdate();
        }, interval);
        timerMap.set(rowId, timerId);
      };
      scheduleUpdate();
    };

    const syncTimers = () => {
      const currentApi = this.tableRef?.getAPI();
      if (!currentApi) return;
      const visibleRows = currentApi.getVisibleRows();
      const visibleIds = new Set(visibleRows.map((vr) => vr.row.id as string | number));
      timerMap.forEach((tid, rid) => {
        if (!visibleIds.has(rid)) {
          clearTimeout(tid);
          timerMap.delete(rid);
        }
      });
      visibleRows.forEach((vr) => {
        const rid = vr.row.id as string | number;
        if (!timerMap.has(rid)) createRowTimer(rid);
      });
    };

    const salesRotate = setInterval(() => {
      const currentApi = this.tableRef?.getAPI();
      if (!currentApi || !isActive) return;
      currentData.forEach((row: any, i: number) => {
        if (Array.isArray(row.salesHistory)) {
          const rid = row.id;
          const sp = currentPeriodSales.get(rid) || 0;
          const updated = [...row.salesHistory.slice(1), sp];
          currentData[i].salesHistory = updated;
          currentApi.updateData({ accessor: "salesHistory", rowIndex: i, newValue: updated });
          currentPeriodSales.set(rid, 0);
        }
      });
    }, 2000);

    syncTimers();
    const syncInt = setInterval(syncTimers, 500);

    this.cleanupFn = () => {
      isActive = false;
      clearInterval(syncInt);
      clearInterval(salesRotate);
      timerMap.forEach((t) => clearTimeout(t));
      timerMap.clear();
    };
  }

  ngOnDestroy(): void {
    this.cleanupFn?.();
  }
}
