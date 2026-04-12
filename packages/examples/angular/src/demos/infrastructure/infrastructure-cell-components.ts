import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getInfraMetricColorStyles, getInfraStatusColors } from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";

@Component({
  standalone: true,
  selector: "demo-infra-server-id",
  template: `<span style="font-family:monospace;font-size:0.85rem;">{{ d.serverId }}</span>`,
})
export class InfraServerIdCellComponent {
  @Input({ required: true }) row!: Row;

  get d(): InfrastructureServer {
    return this.row as unknown as InfrastructureServer;
  }
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
        {{ d.cpuUsage.toFixed(1) }}%
      </div>
    </div>
  `,
})
export class InfraCpuCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): InfrastructureServer {
    return this.row as unknown as InfrastructureServer;
  }

  get styles(): ReturnType<typeof getInfraMetricColorStyles> {
    return getInfraMetricColorStyles(this.d.cpuUsage, this.theme || "light", "cpu");
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
        {{ d.memoryUsage.toFixed(1) }}%
      </div>
    </div>
  `,
})
export class InfraMemoryCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): InfrastructureServer {
    return this.row as unknown as InfrastructureServer;
  }

  get styles(): ReturnType<typeof getInfraMetricColorStyles> {
    return getInfraMetricColorStyles(this.d.memoryUsage, this.theme || "light", "memory");
  }
}

@Component({
  standalone: true,
  selector: "demo-infra-disk",
  template: `{{ d.diskUsage.toFixed(1) }}%`,
})
export class InfraDiskCellComponent {
  @Input({ required: true }) row!: Row;

  get d(): InfrastructureServer {
    return this.row as unknown as InfrastructureServer;
  }
}

@Component({
  standalone: true,
  selector: "demo-infra-response",
  template: `
    <span
      style="font-weight:500;"
      [style.color]="styles.color"
      [style.background-color]="styles.backgroundColor || 'transparent'"
      >{{ d.responseTime.toFixed(1) }}</span>
  `,
})
export class InfraResponseCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): InfrastructureServer {
    return this.row as unknown as InfrastructureServer;
  }

  get styles(): ReturnType<typeof getInfraMetricColorStyles> {
    return getInfraMetricColorStyles(this.d.responseTime, this.theme || "light", "response");
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
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): InfrastructureServer {
    return this.row as unknown as InfrastructureServer;
  }

  get styles(): ReturnType<typeof getInfraStatusColors> {
    return getInfraStatusColors(this.d.status, this.theme || "light");
  }

  get label(): string {
    const s = this.d.status;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
