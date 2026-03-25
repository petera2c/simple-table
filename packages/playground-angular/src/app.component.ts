import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "simple-table-angular";
import type { AngularHeaderObject, TableAPI, Row, CellRendererProps } from "simple-table-angular";

// ─── Sample data ──────────────────────────────────────────────────────────────

const COUNTRIES = ["USA", "China", "Russia", "UK", "Brazil", "Australia", "Japan"];
const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Sam", "Chris", "Lee", "Pat"];
const LAST_NAMES = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Clark"];
const SPORTS = ["Swimming", "Track", "Gymnastics", "Cycling", "Boxing"];

const ROWS: Row[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  country: COUNTRIES[i % COUNTRIES.length],
  athleteName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
  sport: SPORTS[i % SPORTS.length],
  medals: Math.floor(Math.random() * 30) + 1,
  gold: Math.floor(Math.random() * 10),
  personalBest: parseFloat((Math.random() * 60 + 9).toFixed(2)),
  age: Math.floor(Math.random() * 20) + 18,
}));

// ─── Custom Angular cell renderers ────────────────────────────────────────────

@Component({
  selector: "medal-cell",
  standalone: true,
  template: `<span [style.font-weight]="700" [style.color]="color">{{ count }} 🏅</span>`,
})
export class MedalCellComponent {
  @Input() value!: CellRendererProps["value"];
  @Input() row!: CellRendererProps["row"];
  @Input() accessor!: CellRendererProps["accessor"];
  @Input() colIndex!: CellRendererProps["colIndex"];
  @Input() rowIndex!: CellRendererProps["rowIndex"];
  @Input() theme!: CellRendererProps["theme"];

  get count(): number { return Number(this.value) || 0; }
  get color(): string { return this.count >= 20 ? "#22c55e" : this.count >= 10 ? "#f59e0b" : "#94a3b8"; }
}

const FLAG_MAP: Record<string, string> = {
  USA: "🇺🇸", China: "🇨🇳", Russia: "🇷🇺", UK: "🇬🇧",
  Brazil: "🇧🇷", Australia: "🇦🇺", Japan: "🇯🇵",
};

@Component({
  selector: "country-cell",
  standalone: true,
  template: `<span>{{ flag }} {{ value }}</span>`,
})
export class CountryCellComponent {
  @Input() value!: CellRendererProps["value"];
  @Input() row!: CellRendererProps["row"];
  @Input() accessor!: CellRendererProps["accessor"];
  @Input() colIndex!: CellRendererProps["colIndex"];
  @Input() rowIndex!: CellRendererProps["rowIndex"];
  @Input() theme!: CellRendererProps["theme"];

  get flag(): string { return FLAG_MAP[String(this.value)] ?? "🏳️"; }
}

// ─── Column definitions ───────────────────────────────────────────────────────

const HEADERS: AngularHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60 },
  {
    accessor: "country",
    label: "Country",
    width: 140,
    isSortable: true,
    filterable: true,
    cellRenderer: CountryCellComponent,
  },
  { accessor: "athleteName", label: "Athlete", width: 180, isSortable: true },
  { accessor: "sport", label: "Sport", width: 130, isSortable: true, filterable: true },
  {
    accessor: "medals",
    label: "Total Medals",
    width: 140,
    isSortable: true,
    type: "number",
    cellRenderer: MedalCellComponent,
  },
  { accessor: "gold", label: "Gold 🥇", width: 90, isSortable: true, type: "number" },
  {
    accessor: "personalBest",
    label: "Personal Best (s)",
    width: 160,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => `${Number(value).toFixed(2)}s`,
  },
  { accessor: "age", label: "Age", width: 80, isSortable: true, type: "number" },
];

const BTN_STYLE =
  "padding: 6px 14px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: #e2e8f0; cursor: pointer; font-size: 13px;";

// ─── App component ────────────────────────────────────────────────────────────

@Component({
  selector: "app-root",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div style="padding: 24px">
      <h2 style="margin-bottom: 4px; font-size: 20px; font-weight: 700">
        simple-table-angular playground
      </h2>
      <p style="margin-bottom: 16px; font-size: 13px; color: #94a3b8">
        Edit <code>src/app.component.ts</code> — changes reload via Vite HMR.
      </p>

      <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap">
        <button [attr.style]="btnStyle" (click)="tableApi?.applySortState({ accessor: 'medals', direction: 'desc' })">
          Sort by medals ↓
        </button>
        <button [attr.style]="btnStyle" (click)="tableApi?.applySortState({ accessor: 'gold', direction: 'desc' })">
          Sort by gold ↓
        </button>
        <button [attr.style]="btnStyle" (click)="tableApi?.applySortState()">Clear sort</button>
        <button [attr.style]="btnStyle" (click)="tableApi?.clearAllFilters()">Clear filters</button>
        <button [attr.style]="btnStyle" (click)="tableApi?.exportToCSV({ filename: 'athletes.csv' })">Export CSV</button>
      </div>

      <simple-table
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="560"
        [shouldPaginate]="true"
        [rowsPerPage]="25"
        [columnResizing]="true"
        [columnReordering]="true"
        theme="modern-dark"
        (tableReady)="onTableReady($event)"
      ></simple-table>
    </div>
  `,
})
export class AppComponent {
  readonly rows = ROWS;
  readonly headers = HEADERS;
  readonly btnStyle = BTN_STYLE;

  tableApi: TableAPI | null = null;

  onTableReady(api: TableAPI): void {
    this.tableApi = api;
  }
}
