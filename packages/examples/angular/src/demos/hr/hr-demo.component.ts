import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { CellRenderer, CellChangeProps } from "simple-table-core";
import type { HREmployee, HRTagColorKey } from "@simple-table/examples-shared";
import { hrConfig, getHRThemeColors, HR_STATUS_COLOR_MAP } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

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

function buildHRHeaders(): AngularHeaderObject[] {
  const renderers: Record<string, CellRenderer> = {
    fullName: ({ row, theme }) => {
      const d = row as unknown as HREmployee;
      const c = getHRThemeColors(theme);
      const initials = `${d.firstName?.charAt(0) || ""}${d.lastName?.charAt(0) || ""}`;

      const avatar = el("div", {
        width: "24px", height: "24px", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: c.avatarBg, color: c.avatarText, fontSize: "12px",
      }, [initials]);

      const info = el("div", { marginLeft: "8px" }, [
        el("div", {}, [d.fullName]),
        el("div", { fontSize: "12px", color: c.grayMuted }, [d.position]),
      ]);

      return el("div", { display: "flex", alignItems: "center" }, [avatar, info]);
    },

    performanceScore: ({ row, theme }) => {
      const d = row as unknown as HREmployee;
      const score = d.performanceScore;
      const c = getHRThemeColors(theme);
      const color = score >= 90 ? c.progressSuccess : score >= 65 ? c.progressNormal : c.progressException;

      const track = el("div", {
        backgroundColor: c.progressBg, height: "6px", width: "100%",
        borderRadius: "100px", overflow: "hidden",
      });
      track.appendChild(el("div", {
        height: "100%", width: `${score}%`, backgroundColor: color, borderRadius: "100px",
      }));

      const label = el("div", {
        fontSize: "12px", textAlign: "center", marginTop: "4px", color: c.gray,
      }, [`${score}/100`]);

      return el("div", { width: "100%", display: "flex", flexDirection: "column" }, [track, label]);
    },

    hireDate: ({ row, theme }) => {
      const d = row as unknown as HREmployee;
      if (!d.hireDate) return "";
      const [year, month, day] = d.hireDate.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const c = getHRThemeColors(theme);
      return el("span", { color: c.gray }, [
        date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      ]);
    },

    yearsOfService: ({ row, theme }) => {
      const d = row as unknown as HREmployee;
      if (d.yearsOfService === null) return "";
      const c = getHRThemeColors(theme);
      return el("span", { color: c.gray }, [`${d.yearsOfService} yrs`]);
    },

    salary: ({ row, theme }) => {
      const d = row as unknown as HREmployee;
      const c = getHRThemeColors(theme);
      return el("span", { color: c.gray }, [`$${d.salary.toLocaleString()}`]);
    },

    status: ({ row, theme }) => {
      const d = row as unknown as HREmployee;
      if (!d.status) return "";
      const status = d.status;
      const c = getHRThemeColors(theme);
      const colorKey: HRTagColorKey = HR_STATUS_COLOR_MAP[status] || "default";
      const tagColors = c.tagColors[colorKey] || c.tagColors.default;
      return el("span", {
        backgroundColor: tagColors.bg, color: tagColors.text,
        padding: "0 7px", fontSize: "12px", lineHeight: "20px",
        borderRadius: "2px", display: "inline-block",
      }, [status]);
    },
  };

  return hrConfig.headers.map((h) => {
    const renderer = renderers[String(h.accessor)];
    return renderer ? { ...h, cellRenderer: renderer } : { ...h };
  });
}

@Component({
  selector: "hr-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [defaultHeaders]="headers"
      [rows]="data"
      [height]="height"
      [theme]="theme"
      [columnReordering]="true"
      [columnResizing]="true"
      [selectableCells]="true"
      [shouldPaginate]="true"
      [rowsPerPage]="rowsPerPage"
      [customTheme]="{ rowHeight: 48 }"
      (cellEdit)="onCellEdit($event)"
    ></simple-table>
  `,
})
export class HRDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = buildHRHeaders();
  data = [...hrConfig.rows];

  get rowsPerPage(): number {
    const heightNum = typeof this.height === "number" ? this.height : 400;
    return Math.floor(heightNum / 48);
  }

  onCellEdit({ accessor, newValue, row }: CellChangeProps): void {
    this.data = this.data.map((item) =>
      item.id === row.id ? { ...item, [accessor]: newValue } : item,
    );
  }
}
