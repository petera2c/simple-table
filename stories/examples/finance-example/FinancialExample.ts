/**
 * FinancialExample – vanilla port of React finance-example/FinancialExample.
 */
import { renderVanillaTable } from "../../utils";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "symbol", label: "Symbol", width: 100 },
  { accessor: "price", label: "Price", width: 120 },
  { accessor: "change", label: "Change", width: 100 },
  { accessor: "volume", label: "Volume", width: 120 },
];

const ROWS: Record<string, unknown>[] = [
  { id: 1, symbol: "AAPL", price: 185.5, change: 1.2, volume: 52000000 },
  { id: 2, symbol: "GOOGL", price: 142.3, change: -0.5, volume: 28000000 },
  { id: 3, symbol: "MSFT", price: 378.9, change: 2.1, volume: 21000000 },
];

export function renderFinanceExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    height: "90dvh",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Finance Example";
  return wrapper;
}
