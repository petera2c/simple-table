/**
 * LoadingState Example – vanilla port of React LoadingStateExample.
 */
import type { HeaderObject } from "../../src/index";
import { SimpleTableVanilla } from "../../src/index";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "Project ID", width: 80, type: "number" },
  { accessor: "projectName", label: "Project Name", width: "1fr", minWidth: 120, type: "string" },
  { accessor: "client", label: "Client", width: 180, type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
  { accessor: "budget", label: "Budget", width: 110, type: "string" },
];

const ROWS = [
  { id: 1001, projectName: "Phoenix Analytics Platform", client: "TechVenture Labs", status: "In Progress", budget: "$245K" },
  { id: 1002, projectName: "Quantum E-Commerce Rebuild", client: "RetailMax Solutions", status: "Planning", budget: "$180K" },
  { id: 1003, projectName: "CloudSync Mobile App", client: "DataFlow Systems", status: "Testing", budget: "$320K" },
  { id: 1004, projectName: "AI Dashboard Integration", client: "SmartMetrics Inc", status: "In Progress", budget: "$425K" },
  { id: 1005, projectName: "SecureVault Authentication", client: "CyberShield Corp", status: "Completed", budget: "$156K" },
  { id: 1006, projectName: "StreamLine Video Platform", client: "MediaWave Digital", status: "In Progress", budget: "$390K" },
  { id: 1007, projectName: "BlockChain Payment Gateway", client: "FinTech Innovations", status: "Planning", budget: "$520K" },
  { id: 1008, projectName: "Neural Network API", client: "AI Dynamics Group", status: "Testing", budget: "$275K" },
  { id: 1009, projectName: "RealTime Chat Engine", client: "ConnectHub Technologies", status: "In Progress", budget: "$198K" },
  { id: 1010, projectName: "Inventory Optimization Suite", client: "LogiTrack Enterprises", status: "Completed", budget: "$340K" },
  { id: 1011, projectName: "HealthTrack Wellness App", client: "MedTech Partners", status: "Planning", budget: "$285K" },
  { id: 1012, projectName: "AutoScale Cloud Migration", client: "InfraCore Systems", status: "In Progress", budget: "$460K" },
];

export function renderLoadingStateExample(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.padding = "2rem";
  const btn = document.createElement("button");
  btn.textContent = "Reload Data";
  btn.type = "button";
  btn.style.cssText = "margin-bottom:1rem;padding:0.5rem 1rem;cursor:pointer;font-family:Nunito,sans-serif;";
  wrapper.appendChild(btn);
  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);
  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: HEADERS,
    height: "380px",
    isLoading: true,
    rows: [],
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  table.mount();
  const reload = () => {
    table.update({ isLoading: true });
    setTimeout(() => table.update({ isLoading: false, rows: ROWS }), 2000);
  };
  btn.addEventListener("click", reload);
  setTimeout(() => table.update({ isLoading: false, rows: ROWS }), 2000);
  return wrapper;
}
