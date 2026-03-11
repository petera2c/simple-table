/**
 * InfrastructureExample – vanilla port of React infrastructure/InfrastructureExample.
 */
import type { HeaderObject, Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "host", label: "Host", width: 200 },
  { accessor: "status", label: "Status", width: 120 },
  { accessor: "region", label: "Region", width: 120 },
];
  
const ROWS: Row[] = [
  { id: 1, host: "api-01.example.com", status: "healthy", region: "us-east-1" },
  { id: 2, host: "api-02.example.com", status: "healthy", region: "us-west-2" },
  { id: 3, host: "db-01.example.com", status: "degraded", region: "us-east-1" },
];

export function renderInfrastructureExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Infrastructure Example";
  return wrapper;
}
