import { Component, Input } from "@angular/core";
import { SimpleTableComponent, mapToAngularHeaderObjects } from "@simple-table/angular";
import type { AngularHeaderObject, HeaderObject, Row, Theme } from "@simple-table/angular";
import { headerRendererConfig } from "./header-renderer.demo-data";
import "@simple-table/angular/styles.css";

type SortDir = "asc" | "desc" | null;
const CYCLE: SortDir[] = ["asc", "desc", null];

@Component({
  selector: "header-renderer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="sortedData"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class HeaderRendererDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  private sortAccessor: string | null = null;
  private sortDirection: SortDir = null;

  get sortedData(): Row[] {
    if (!this.sortAccessor || !this.sortDirection) return [...headerRendererConfig.rows];
    const acc = this.sortAccessor;
    const dir = this.sortDirection;
    return [...headerRendererConfig.rows].sort((a, b) => {
      const aVal = a[acc];
      const bVal = b[acc];
      if (aVal === bVal) return 0;
      const cmp = typeof aVal === "number" && typeof bVal === "number"
        ? (aVal as number) - (bVal as number)
        : String(aVal).localeCompare(String(bVal));
      return dir === "asc" ? cmp : -cmp;
    });
  }

  get headers(): AngularHeaderObject[] {
    return mapToAngularHeaderObjects(
      headerRendererConfig.headers.map((h) => ({
        ...h,
        isSortable: false,
        headerRenderer: this.buildHeaderRenderer(h),
      })),
    );
  }

  private buildHeaderRenderer(h: HeaderObject) {
    return () => {
      const isSorted = this.sortAccessor === h.accessor;
      const dir = isSorted ? this.sortDirection : null;
      const indicator = dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "";

      const wrapper = document.createElement("div");
      Object.assign(wrapper.style, {
        cursor: "pointer",
        userSelect: "none",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      });
      wrapper.addEventListener("click", () => {
        if (!isSorted) {
          this.sortAccessor = h.accessor as string;
          this.sortDirection = "asc";
          return;
        }
        const idx = CYCLE.indexOf(dir);
        const next = CYCLE[(idx + 1) % CYCLE.length];
        if (next) {
          this.sortAccessor = h.accessor as string;
          this.sortDirection = next;
        } else {
          this.sortAccessor = null;
          this.sortDirection = null;
        }
      });

      const label = document.createElement("span");
      label.textContent = h.label;
      wrapper.appendChild(label);

      if (indicator) {
        const ind = document.createElement("span");
        Object.assign(ind.style, { fontSize: "10px", color: "#6366f1" });
        ind.textContent = indicator;
        wrapper.appendChild(ind);
      }

      return wrapper;
    };
  }
}
