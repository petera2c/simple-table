import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, CellRenderer, Row, Theme } from "@simple-table/angular";
import { cellRendererConfig } from "@simple-table/examples-shared";
import type { CellRendererEmployee } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

const html = (str: string): Node => {
  const t = document.createElement("template");
  t.innerHTML = str.trim();
  return t.content;
};

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase();

const RENDERERS: Record<string, CellRenderer> = {
  teamMembers: ({ row }) => {
    const members = (row as CellRendererEmployee).teamMembers;
    return html(
      `<div style="display:flex;align-items:center;gap:6px">${members
        .map(
          (m) =>
            `<div style="display:flex;align-items:center;gap:4px"><div style="width:24px;height:24px;border-radius:50%;background:#DBEAFE;color:#1E40AF;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0">${getInitials(m.name)}</div><span style="font-size:13px;white-space:nowrap">${m.name}</span></div>`,
        )
        .join("")}</div>`,
    );
  },

  website: ({ value }) => {
    const url = String(value);
    return html(
      `<span>🌐 <a href="https://${url}" target="_blank" rel="noopener noreferrer" style="color:#2563EB;text-decoration:none" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${url}</a></span>`,
    );
  },

  status: ({ value }) => {
    const status = String(value);
    const map: Record<string, { icon: string; color: string }> = {
      active: { icon: "✓", color: "#10B981" },
      inactive: { icon: "✕", color: "#EF4444" },
      pending: { icon: "!", color: "#F59E0B" },
    };
    const { icon, color } = map[status] ?? { icon: "?", color: "#6b7280" };
    return html(
      `<span style="color:${color};font-weight:600;text-transform:capitalize">${icon} ${status}</span>`,
    );
  },

  progress: ({ value }) => {
    const pct = Number(value) || 0;
    const color = pct < 30 ? "#EF4444" : pct < 70 ? "#F59E0B" : "#10B981";
    return html(
      `<div><div style="font-size:12px;margin-bottom:2px">${pct}%</div><div style="height:10px;background:#E5E7EB;border-radius:5px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${color};border-radius:5px;transition:width 0.3s"></div></div></div>`,
    );
  },

  rating: ({ value }) => {
    const rating = Number(value) || 0;
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.25;
    const empty = 5 - full - (hasHalf ? 1 : 0);
    const halfStar = hasHalf ? '<span style="opacity:0.5">★</span>' : "";
    return html(
      `<span style="display:flex;align-items:center;gap:4px"><span style="color:#F59E0B;letter-spacing:1px">${"★".repeat(full)}${halfStar}${"☆".repeat(Math.max(0, empty))}</span><span style="font-size:12px;color:#6b7280">${rating}</span></span>`,
    );
  },

  verified: ({ value }) => {
    const yes = Boolean(value);
    return html(
      `<span style="color:${yes ? "#10B981" : "#EF4444"};font-weight:600">${yes ? "✓ Yes" : "✕ No"}</span>`,
    );
  },

  tags: ({ value }) => {
    const tags = Array.isArray(value) ? (value as string[]) : [];
    return html(
      `<div style="display:flex;gap:4px;flex-wrap:nowrap;overflow:hidden">${tags
        .map(
          (tag) =>
            `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:500;background:#DBEAFE;color:#1E40AF;white-space:nowrap">${tag}</span>`,
        )
        .join("")}</div>`,
    );
  },
};

@Component({
  selector: "cell-renderer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [selectableCells]="true"
      [customTheme]="{ rowHeight: 48 }"
    ></simple-table>
  `,
})
export class CellRendererDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = cellRendererConfig.rows;
  readonly headers: AngularHeaderObject[] = cellRendererConfig.headers.map((h) => {
    const renderer = RENDERERS[h.accessor as string];
    return renderer ? { ...h, cellRenderer: renderer as any } : h;
  });
}
