import { SimpleTableVanilla, asRows } from "simple-table-core";
import type { Theme, HeaderObject, CellRenderer, CellChangeProps, CellRendererProps } from "simple-table-core";
import { hrConfig, getHRThemeColors, HR_STATUS_COLOR_MAP } from "./hr.demo-data";
import type { HREmployee, HRTagColorKey } from "./hr.demo-data";
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

function buildHRHeaders(): HeaderObject[] {
  const renderers: Record<string, CellRenderer> = {
    fullName: ({ row, theme }: CellRendererProps) => {
      const c = getHRThemeColors(theme);
      const d = row as unknown as HREmployee;
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

    performanceScore: ({ row, theme }: CellRendererProps) => {
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

    hireDate: ({ row, theme }: CellRendererProps) => {
      const d = row as unknown as HREmployee;
      if (!d.hireDate) return "";
      const [year, month, day] = d.hireDate.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const c = getHRThemeColors(theme);
      return el("span", { color: c.gray }, [
        date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      ]);
    },

    yearsOfService: ({ row, theme }: CellRendererProps) => {
      const d = row as unknown as HREmployee;
      if (d.yearsOfService === null) return "";
      const c = getHRThemeColors(theme);
      return el("span", { color: c.gray }, [`${d.yearsOfService} yrs`]);
    },

    salary: ({ row, theme }: CellRendererProps) => {
      const d = row as unknown as HREmployee;
      const c = getHRThemeColors(theme);
      return el("span", { color: c.gray }, [`$${d.salary.toLocaleString()}`]);
    },

    status: ({ row, theme }: CellRendererProps) => {
      const d = row as unknown as HREmployee;
      if (!d.status) return "";
      const c = getHRThemeColors(theme);
      const colorKey: HRTagColorKey = HR_STATUS_COLOR_MAP[d.status] || "default";
      const tagColors = c.tagColors[colorKey] || c.tagColors.default;
      return el("span", {
        backgroundColor: tagColors.bg, color: tagColors.text,
        padding: "0 7px", fontSize: "12px", lineHeight: "20px",
        borderRadius: "2px", display: "inline-block",
      }, [d.status]);
    },
  };

  return hrConfig.headers.map((h) => {
    const renderer = renderers[String(h.accessor)];
    return renderer ? { ...h, cellRenderer: renderer } : { ...h };
  });
}

export function renderHRDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla {
  let rows = [...asRows(hrConfig.rows)];
  const rowHeight = 48;
  const heightNum = typeof options?.height === "number" ? options.height : 400;
  const rowsPerPage = Math.floor(heightNum / rowHeight);

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: buildHRHeaders(),
    rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnReordering: true,
    columnResizing: true,
    selectableCells: true,
    shouldPaginate: true,
    rowsPerPage,
    customTheme: { rowHeight },
    onCellEdit: ({ accessor, newValue, row }: CellChangeProps) => {
      rows = rows.map((item) => item.id === row.id ? { ...item, [accessor]: newValue } : item);
      table.update({ rows });
    },
  });
  return table;
}
