import { Component } from "@angular/core";

@Component({
  selector: "demo-table-empty-state",
  standalone: true,
  template: `
    <div
      style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;color:#64748b;gap:12px;"
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
        <path d="M16 3H8L3 7h18l-5-4z" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
      <div style="font-size:16px;font-weight:600;">No data available</div>
      <div style="font-size:13px;">Try adjusting your filters or adding new records.</div>
    </div>
  `,
})
export class TableEmptyStateComponent {}
