import { Component, Input } from "@angular/core";
import type { Row } from "@simple-table/angular";
import type { CellRendererEmployee } from "./cell-renderer.demo-data";

@Component({
  standalone: true,
  selector: "demo-cr-team-members",
  template: `
    <div style="display:flex;align-items:center;gap:6px;">
      @for (m of members; track m.name) {
        <div style="display:flex;align-items:center;gap:4px;">
          <div
            style="width:24px;height:24px;border-radius:50%;background:#DBEAFE;color:#1E40AF;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;"
          >
            {{ initials(m.name) }}
          </div>
          <span style="font-size:13px;white-space:nowrap;">{{ m.name }}</span>
        </div>
      }
    </div>
  `,
})
export class CrTeamMembersCellComponent {
  @Input({ required: true }) row!: Row;

  get members(): { name: string; role: string }[] {
    return (this.row as unknown as CellRendererEmployee).teamMembers;
  }

  initials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  }
}
