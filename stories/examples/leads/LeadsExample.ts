/**
 * LeadsExample – vanilla port of React leads/LeadsExample.
 */
import type { HeaderObject, Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 180 },
  { accessor: "email", label: "Email", width: 200 },
  { accessor: "stage", label: "Stage", width: 120 },
];

const ROWS: Row[] = [
  { id: 1, name: "Lead One", email: "lead1@example.com", stage: "New" },
  { id: 2, name: "Lead Two", email: "lead2@example.com", stage: "Qualified" },
  { id: 3, name: "Lead Three", email: "lead3@example.com", stage: "Proposal" },
];

export function renderLeadsExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Leads Example";
  return wrapper;
}
