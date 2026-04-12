import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, CellChangeProps, ValueGetterProps } from "@simple-table/angular";
import { crmData } from "./crm.demo-data";
import type { CrmShellTheme } from "./crm.demo-data";
import { CrmAiScoreCellComponent } from "./crm-ai-score-cell.component";
import { CrmContactCellComponent } from "./crm-contact-cell.component";
import { CrmContactNowCellComponent } from "./crm-contact-now-cell.component";
import { crmRowsPerPageSignal, syncCrmDemoPalette } from "./crm-demo-context";
import { CrmEmailCellComponent } from "./crm-email-cell.component";
import { CrmFitCellComponent } from "./crm-fit-cell.component";
import { CrmFooterComponent } from "./crm-footer.component";
import { CrmListCellComponent } from "./crm-list-cell.component";
import { CrmSignalCellComponent } from "./crm-signal-cell.component";
import { CrmTimeAgoCellComponent } from "./crm-time-ago-cell.component";
import "@simple-table/angular/styles.css";
import "./crm-custom-theme.css";

const CRM_HEADERS: AngularHeaderObject[] = [
  {
    accessor: "name",
    label: "CONTACT",
    width: "2fr",
    minWidth: 290,
    isSortable: true,
    isEditable: true,
    type: "string",
    cellRenderer: CrmContactCellComponent,
  },
  {
    accessor: "signal",
    label: "SIGNAL",
    width: "3fr",
    minWidth: 340,
    isSortable: true,
    isEditable: true,
    type: "string",
    cellRenderer: CrmSignalCellComponent,
  },
  {
    accessor: "aiScore",
    label: "AI SCORE",
    width: "1fr",
    minWidth: 100,
    isSortable: true,
    align: "center",
    type: "number",
    cellRenderer: CrmAiScoreCellComponent,
  },
  {
    accessor: "emailStatus",
    label: "EMAIL",
    width: "1.5fr",
    minWidth: 210,
    isSortable: true,
    align: "center",
    type: "enum",
    enumOptions: [
      { label: "Enrich", value: "Enrich" },
      { label: "Verified", value: "Verified" },
      { label: "Pending", value: "Pending" },
      { label: "Bounced", value: "Bounced" },
    ],
    cellRenderer: CrmEmailCellComponent,
  },
  {
    accessor: "timeAgo",
    label: "IMPORT",
    width: "1fr",
    minWidth: 100,
    isSortable: true,
    align: "center",
    type: "string",
    cellRenderer: CrmTimeAgoCellComponent,
  },
  {
    accessor: "list",
    label: "LIST",
    width: "1.2fr",
    minWidth: 160,
    isSortable: true,
    align: "center",
    type: "enum",
    enumOptions: [
      { label: "Leads", value: "Leads" },
      { label: "Hot Leads", value: "Hot Leads" },
      { label: "Warm Leads", value: "Warm Leads" },
      { label: "Cold Leads", value: "Cold Leads" },
      { label: "Enterprise", value: "Enterprise" },
      { label: "SMB", value: "SMB" },
      { label: "Nurture", value: "Nurture" },
    ],
    valueGetter: ({ row }: ValueGetterProps) => {
      const m: Record<string, number> = {
        "Hot Leads": 1,
        "Warm Leads": 2,
        Enterprise: 3,
        Leads: 4,
        SMB: 5,
        "Cold Leads": 6,
        Nurture: 7,
      };
      return m[String(row.list)] || 999;
    },
    cellRenderer: CrmListCellComponent,
  },
  {
    accessor: "_fit",
    label: "Fit",
    width: "1fr",
    align: "center",
    minWidth: 120,
    cellRenderer: CrmFitCellComponent,
  },
  {
    accessor: "_contactNow",
    label: "",
    width: "1.2fr",
    minWidth: 160,
    cellRenderer: CrmContactNowCellComponent,
  },
];

@Component({
  selector: "crm-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div [class]="'custom-theme-container theme-' + (isDark ? 'custom-dark' : 'custom-light')">
      <simple-table
        #simpleTable
        [columnReordering]="true"
        [columnResizing]="true"
        [defaultHeaders]="headers"
        [enableRowSelection]="true"
        [customTheme]="{ headerHeight: 48, rowHeight: 92 }"
        [height]="height"
        [rows]="data"
        [rowsPerPage]="rowsPerPage()"
        [shouldPaginate]="true"
        [theme]="'custom'"
        [footerRenderer]="footerRenderer"
        (cellEdit)="onCellEdit($event)"
      ></simple-table>
    </div>
  `,
})
export class CRMDemoComponent implements OnInit, OnChanges {
  @Input() height: string | number = "400px";
  @Input() theme?: CrmShellTheme;

  isDark = false;
  data = [...crmData];
  readonly headers: AngularHeaderObject[] = CRM_HEADERS;
  readonly footerRenderer = CrmFooterComponent;
  readonly rowsPerPage = crmRowsPerPageSignal;

  ngOnInit(): void {
    this.applyShellTheme();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["theme"] || changes["height"]) {
      this.applyShellTheme();
    }
  }

  private applyShellTheme(): void {
    this.isDark =
      this.theme === "custom-dark" || this.theme === "dark" || this.theme === "modern-dark";
    syncCrmDemoPalette(this.isDark);
  }

  onCellEdit({ accessor, newValue, row }: CellChangeProps): void {
    this.data = this.data.map((item) =>
      item.id === row.id ? { ...item, [accessor]: newValue } : item,
    );
  }
}
