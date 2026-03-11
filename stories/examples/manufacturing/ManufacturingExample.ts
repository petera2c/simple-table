/**
 * ManufacturingExample – vanilla port of React manufacturing/ManufacturingExample.
 */
import type { HeaderObject, Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "sku", label: "SKU", width: 150 },
  { accessor: "quantity", label: "Quantity", width: 100 },
  { accessor: "status", label: "Status", width: 120 },
];

const ROWS: Row[] = [
  { id: 1, sku: "MFR-001", quantity: 500, status: "In stock" },
  { id: 2, sku: "MFR-002", quantity: 120, status: "Low stock" },
  { id: 3, sku: "MFR-003", quantity: 0, status: "Out of stock" },
];

export function renderManufacturingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Manufacturing Example";
  return wrapper;
}
