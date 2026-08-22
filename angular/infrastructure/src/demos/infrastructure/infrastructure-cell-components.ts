import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getInfraMetricColorStyles, getInfraStatusColors } from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";

@Component({
  standalone: true,
  selector: "demo-infra-server-id",
  template: `<span style="font-family:monospace;font-size:0.85rem;">{{ row.serverId }}</span>`,
})
export class InfraServerIdCellComponent {
  @Input({ required: true }) row!: InfrastructureServer;
}

@Component({
  standalone: true,
  selector: "demo-infra-cpu",
  template: `
    <div style="display:flex;justify-content:end;">
      <div
        style="padding:3px 6px;border-radius:3px;font-weight:600;font-size:0.8rem;"
        [style.color]="styles.color"
        [style.background-color]="styles.backgroundColor || 'transparent'"
      >
        {{ row.cpuUsage.toFixed(1) }}%
      </div>
    </div>
  `,
})
export class InfraCpuCellComponent {
  @Input({ required: true }) row!: InfrastructureServer;
  @Input() theme?: Theme;

  get styles(): ReturnType<typeof getInfraMetricColorStyles> {
    return getInfraMetricColorStyles(this.row.cpuUsage, this.theme || "light", "cpu");
  }
}

@Component({
  standalone: true,
  selector: "demo-infra-memory",
  template: `
    <div style="display:flex;justify-content:end;">
      <div
        style="padding:3px 6px;border-radius:3px;font-weight:600;font-size:0.8rem;"
        [style.color]="styles.color"
        [style.background-color]="styles.backgroundColor || 'transparent'"
      >
        {{ row.memoryUsage.toFixed(1) }}%
      </div>
    </div>
  `,
})
export class InfraMemoryCellComponent {
  @Input({ required: true }) row!: InfrastructureServer;
  @Input() theme?: Theme;

  get styles(): ReturnType<typeof getInfraMetricColorStyles> {
    return getInfraMetricColorStyles(this.row.memoryUsage, this.theme || "light", "memory");
  }
}

@Component({
  standalone: true,
  selector: "demo-infra-disk",
  template: `{{ row.diskUsage.toFixed(1) }}%`,
})
export class InfraDiskCellComponent {
  @Input({ required: true }) row!: InfrastructureServer;
}

@Component({
  standalone: true,
  selector: "demo-infra-response",
  template: `
    <span
      style="font-weight:500;"
      [style.color]="styles.color"
      [style.background-color]="styles.backgroundColor || 'transparent'"
      >{{ row.responseTime.toFixed(1) }}</span>
  `,
})
export class InfraResponseCellComponent {
  @Input({ required: true }) row!: InfrastructureServer;
  @Input() theme?: Theme;

  get styles(): ReturnType<typeof getInfraMetricColorStyles> {
    return getInfraMetricColorStyles(this.row.responseTime, this.theme || "light", "response");
  }
}

@Component({
  standalone: true,
  selector: "demo-infra-status",
  template: `
    <div
      style="padding:4px 8px;border-radius:4px;font-size:0.75rem;"
      [style.color]="styles.color"
      [style.background-color]="styles.backgroundColor"
    >
      {{ label }}
    </div>
  `,
})
export class InfraStatusCellComponent {
  @Input({ required: true }) row!: InfrastructureServer;
  @Input() theme?: Theme;

  get styles(): ReturnType<typeof getInfraStatusColors> {
    return getInfraStatusColors(this.row.status, this.theme || "light");
  }

  get label(): string {
    const s = this.row.status;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
