/**
 * Spreadsheet Example — vanilla port of simple-table-marketing SpreadsheetExample.
 * Loan-style columns, amortization recalculation on edit, and dynamic “Add column”.
 */
import type { CellChangeProps, HeaderObject, Row } from "../../../src/index";
import { SimpleTableVanilla } from "../../../src/index";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import "./spreadsheet-demo.css";

const BASE_SPREADSHEET_COLUMNS = 6;

function generateSpreadsheetRows(count: number): Row[] {
  const data: Row[] = [];
  for (let i = 0; i < count; i++) {
    const principal = Math.floor(Math.random() * 490000) + 10000;
    const interestRate = parseFloat((Math.random() * 5 + 3).toFixed(2));
    const monthlyRate = interestRate / 100 / 12;
    const numMonths = 360;
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numMonths))) /
      (Math.pow(1 + monthlyRate, numMonths) - 1);
    const paymentsMade = Math.floor(Math.random() * 120);
    const remainingBalance =
      (principal *
        (Math.pow(1 + monthlyRate, numMonths) - Math.pow(1 + monthlyRate, paymentsMade))) /
      (Math.pow(1 + monthlyRate, numMonths) - 1);
    const totalPaid = monthlyPayment * paymentsMade;
    const principalReduction = principal - Math.max(0, remainingBalance);
    const interestPaid = totalPaid - principalReduction;

    data.push({
      id: i + 1,
      principal: parseFloat(principal.toFixed(2)),
      interestRate: parseFloat(interestRate.toFixed(2)),
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      remainingBalance: parseFloat(Math.max(0, remainingBalance).toFixed(2)),
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      interestPaid: parseFloat(Math.max(0, interestPaid).toFixed(2)),
    });
  }
  return data;
}

function getSpreadsheetHeaders(additionalColumns: HeaderObject[] = []): HeaderObject[] {
  return [
    {
      accessor: "principal",
      label: "Principal",
      width: "1fr",
      minWidth: 100,
      align: "right",
      isEditable: true,
      type: "number",
      aggregation: { type: "sum" },
    },
    {
      accessor: "interestRate",
      label: "Interest Rate %",
      width: "1fr",
      minWidth: 110,
      align: "right",
      isEditable: true,
      type: "number",
      aggregation: { type: "average" },
    },
    {
      accessor: "monthlyPayment",
      label: "Monthly Payment",
      width: "1fr",
      minWidth: 120,
      align: "right",
      isEditable: true,
      type: "number",
      aggregation: { type: "sum" },
    },
    {
      accessor: "remainingBalance",
      label: "Remaining Balance",
      width: "1fr",
      minWidth: 130,
      align: "right",
      isEditable: true,
      type: "number",
      aggregation: { type: "sum" },
    },
    {
      accessor: "totalPaid",
      label: "Total Paid",
      width: "1fr",
      minWidth: 110,
      align: "right",
      isEditable: true,
      type: "number",
      aggregation: { type: "sum" },
    },
    {
      accessor: "interestPaid",
      label: "Interest Paid",
      width: "1fr",
      minWidth: 110,
      align: "right",
      isEditable: true,
      type: "number",
      aggregation: { type: "sum" },
    },
    ...additionalColumns,
  ];
}

function applyAmortizationEdit(
  item: Row,
  accessor: string,
  newValue: CellChangeProps["newValue"],
): Row {
  const updatedItem: Row = {
    ...item,
    [accessor]: newValue,
  };

  if (!["principal", "interestRate", "monthlyPayment"].includes(accessor)) {
    return updatedItem;
  }

  const principal =
    accessor === "principal"
      ? parseFloat(String(newValue)) || 0
      : typeof item.principal === "number"
        ? item.principal
        : 0;
  const interestRate =
    accessor === "interestRate"
      ? parseFloat(String(newValue)) || 0
      : typeof item.interestRate === "number"
        ? item.interestRate
        : 0;
  const monthlyPayment =
    accessor === "monthlyPayment"
      ? parseFloat(String(newValue)) || 0
      : typeof item.monthlyPayment === "number"
        ? item.monthlyPayment
        : 0;

  const monthlyRate = interestRate / 100 / 12;
  const numMonths = 360;

  let calculatedPayment = monthlyPayment;
  if (accessor === "principal" || accessor === "interestRate") {
    if (monthlyRate > 0 && principal > 0) {
      calculatedPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) /
        (Math.pow(1 + monthlyRate, numMonths) - 1);
      updatedItem.monthlyPayment = parseFloat(calculatedPayment.toFixed(2));
    }
  }

  const totalPaidValue = typeof item.totalPaid === "number" ? item.totalPaid : 0;
  const estimatedPaymentsMade = Math.max(
    0,
    Math.min(120, Math.floor(totalPaidValue / calculatedPayment)),
  );

  let remainingBalance = principal;
  if (monthlyRate > 0 && calculatedPayment > 0) {
    remainingBalance =
      principal *
      ((Math.pow(1 + monthlyRate, numMonths) - Math.pow(1 + monthlyRate, estimatedPaymentsMade)) /
        (Math.pow(1 + monthlyRate, numMonths) - 1));
  }

  const totalPaid = calculatedPayment * estimatedPaymentsMade;
  const principalReduction = principal - Math.max(0, remainingBalance);
  const interestPaid = totalPaid - principalReduction;

  updatedItem.remainingBalance = parseFloat(Math.max(0, remainingBalance).toFixed(2));
  updatedItem.totalPaid = parseFloat(totalPaid.toFixed(2));
  updatedItem.interestPaid = parseFloat(Math.max(0, interestPaid).toFixed(2));

  return updatedItem;
}

export const spreadsheetExampleDefaults: Partial<UniversalVanillaArgs> = {
  columnReordering: true,
  columnResizing: true,
  selectableCells: true,
  selectableColumns: true,
  useOddEvenRowBackground: true,
  height: "70vh",
  theme: "light",
};

export function renderSpreadsheetExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...spreadsheetExampleDefaults, ...args };

  const wrapper = document.createElement("div");
  wrapper.style.padding = "2rem";

  const h2 = document.createElement("h2");
  h2.style.marginBottom = "1rem";
  h2.textContent = "Spreadsheet";
  wrapper.appendChild(h2);

  const outer = document.createElement("div");
  outer.className = "spreadsheet-container";
  wrapper.appendChild(outer);

  const tableContainer = document.createElement("div");
  outer.appendChild(tableContainer);

  const state = {
    rows: generateSpreadsheetRows(100),
    additionalColumns: [] as HeaderObject[],
  };

  let tableRef: SimpleTableVanilla | null = null;

  const buildHeaders = (): HeaderObject[] => {
    const baseHeaders = getSpreadsheetHeaders(state.additionalColumns);
    const actionsColumn: HeaderObject = {
      accessor: "actions",
      label: "",
      width: 100,
      minWidth: 100,
      filterable: false,
      type: "other",
      disableReorder: true,
      headerRenderer: () => {
        const wrap = document.createElement("div");
        wrap.style.display = "flex";
        wrap.style.justifyContent = "center";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "spreadsheet-add-column-btn";
        btn.textContent = "+ Add Column";
        btn.addEventListener("click", () => {
          const nextIndex = BASE_SPREADSHEET_COLUMNS + state.additionalColumns.length + 1;
          const accessor = `column${nextIndex}`;
          const newColumn: HeaderObject = {
            accessor,
            label: `Column ${nextIndex}`,
            width: 120,
            minWidth: 80,
            type: "number",
            align: "right",
            isEditable: true,
            aggregation: { type: "sum" },
          };
          state.additionalColumns = [...state.additionalColumns, newColumn];
          state.rows = state.rows.map((r) => ({ ...r, [accessor]: 0 }));
          tableRef?.update({
            defaultHeaders: buildHeaders(),
            rows: state.rows,
          });
        });
        wrap.appendChild(btn);
        return wrap;
      },
    };
    return [...baseHeaders, actionsColumn];
  };

  const handleCellEdit = (props: CellChangeProps) => {
    const { accessor, newValue, row } = props;
    const acc = String(accessor);
    if (acc === "actions") return;

    state.rows = state.rows.map((item) => {
      if (item.id !== row.id) return item;
      return applyAmortizationEdit(item, acc, newValue);
    });
    tableRef?.update({ rows: state.rows });
  };

  const table = new SimpleTableVanilla(tableContainer, {
    ...options,
    defaultHeaders: buildHeaders(),
    enableHeaderEditing: true,
    enableRowSelection: true,
    onCellEdit: handleCellEdit,
    customTheme: { ...(options.customTheme ?? {}), rowHeight: 22 },
    rows: state.rows,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  table.mount();
  tableRef = table;

  (wrapper as HTMLElement & { _table?: SimpleTableVanilla })._table = table;

  return wrapper;
}
