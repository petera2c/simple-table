import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme, ValueGetterProps } from "@simple-table/angular";
import { infrastructureData } from "./infrastructure.demo-data";
import {
  InfraCpuCellComponent,
  InfraDiskCellComponent,
  InfraMemoryCellComponent,
  InfraResponseCellComponent,
  InfraServerIdCellComponent,
  InfraStatusCellComponent,
} from "./infrastructure-cell-components";
import { startInfraDemoLiveUpdates } from "./infrastructure-live-updates";
import "@simple-table/angular/styles.css";

function getHeaders(theme?: Theme): AngularHeaderObject[] {
  return [
    {
      accessor: "serverId",
      align: "left",
      filterable: true,
      isEditable: false,
      isSortable: true,
      label: "Server ID",
      minWidth: 180,
      pinned: "left",
      type: "string",
      width: "1.2fr",
      cellRenderer: InfraServerIdCellComponent,
    },
    {
      accessor: "serverName",
      align: "left",
      filterable: true,
      isEditable: false,
      isSortable: true,
      label: "Name",
      minWidth: 200,
      type: "string",
      width: "1.5fr",
    },
    {
      accessor: "performance",
      label: "Performance Metrics",
      width: 690,
      isSortable: false,
      children: [
        {
          accessor: "cpuHistory",
          label: "CPU History",
          width: 150,
          isSortable: false,
          filterable: false,
          isEditable: false,
          align: "center",
          type: "lineAreaChart",
          tooltip: "CPU usage over the last 30 intervals",
        },
        {
          accessor: "cpuUsage",
          label: "CPU %",
          width: 120,
          isSortable: true,
          filterable: true,
          isEditable: true,
          align: "right",
          type: "number",
          cellRenderer: InfraCpuCellComponent,
        },
        {
          accessor: "memoryUsage",
          label: "Memory %",
          width: 130,
          isSortable: true,
          filterable: true,
          isEditable: true,
          align: "right",
          type: "number",
          cellRenderer: InfraMemoryCellComponent,
        },
        {
          accessor: "diskUsage",
          label: "Disk %",
          width: 120,
          isSortable: true,
          filterable: true,
          isEditable: true,
          align: "right",
          type: "number",
          cellRenderer: InfraDiskCellComponent,
        },
        {
          accessor: "responseTime",
          label: "Response (ms)",
          width: 120,
          isSortable: true,
          filterable: true,
          isEditable: true,
          align: "right",
          type: "number",
          cellRenderer: InfraResponseCellComponent,
        },
      ],
    },
    {
      accessor: "status",
      label: "Status",
      width: 130,
      isSortable: true,
      filterable: true,
      isEditable: false,
      align: "center",
      type: "enum",
      enumOptions: [
        { label: "Online", value: "online" },
        { label: "Warning", value: "warning" },
        { label: "Critical", value: "critical" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Offline", value: "offline" },
      ],
      valueGetter: ({ row }: ValueGetterProps) => {
        const m: Record<string, number> = { critical: 1, offline: 2, warning: 3, maintenance: 4, online: 5 };
        return m[String(row.status)] || 999;
      },
      cellRenderer: InfraStatusCellComponent,
    },
  ];
}

@Component({
  selector: "infrastructure-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      #simpleTable
      [autoExpandColumns]="true"
      [columnReordering]="true"
      [columnResizing]="true"
      [defaultHeaders]="headers"
      [editColumns]="true"
      [height]="height"
      [rows]="rows"
      [selectableCells]="true"
      [theme]="theme"
    ></simple-table>
  `,
})
export class InfrastructureDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = infrastructureData;
  readonly headers: AngularHeaderObject[] = getHeaders();

  private cleanupFn?: () => void;

  ngAfterViewInit(): void {
    this.cleanupFn = startInfraDemoLiveUpdates(() => this.tableRef?.getAPI() ?? null, this.rows);
  }

  ngOnDestroy(): void {
    this.cleanupFn?.();
  }
}
