/**
 * BillingExample – vanilla port of React billing-example/BillingExample.
 */
import { renderVanillaTable } from "../../utils";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "invoice", label: "Invoice", width: 150 },
  { accessor: "amount", label: "Amount", width: 120 },
  { accessor: "date", label: "Date", width: 120 },
];

const ROWS: Record<string, unknown>[] = [
  { id: 1, invoice: "INV-001", amount: 1500, date: "2024-01-15" },
  { id: 2, invoice: "INV-002", amount: 2300, date: "2024-01-20" },
  { id: 3, invoice: "INV-003", amount: 800, date: "2024-02-01" },
];

export function renderBillingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    columnReordering: true,
    columnResizing: true,
    editColumns: true,
    selectableCells: true,
    height: "70dvh",
    initialSortColumn: "amount",
    initialSortDirection: "desc",
    useOddColumnBackground: true,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Billing Example";
  return wrapper;
}
