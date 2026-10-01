import { SimpleTableVanilla } from "simple-table-core";
import type { ProgrammaticControlProduct } from "./programmatic-control.demo-data";
import type { Theme, ColumnDef, CellRendererProps, GetRowIdParams } from "simple-table-core";
import {
  programmaticControlConfig,
  PROGRAMMATIC_CONTROL_STATUS_COLORS,
} from "./programmatic-control.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<ProgrammaticControlProduct>) => row.id;
export function renderProgrammaticControlDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<ProgrammaticControlProduct> {
  const wrapper = document.createElement("div");

  const banner = document.createElement("div");
  banner.style.cssText =
    "margin-bottom:12px;padding:8px 12px;background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;color:#1e40af;font-size:14px";
  banner.textContent = "No status message";
  wrapper.appendChild(banner);

  const controls = document.createElement("div");
  controls.style.cssText = "margin-bottom:12px;display:flex;gap:8px;flex-wrap:wrap";

  const headers: ColumnDef<ProgrammaticControlProduct>[] = programmaticControlConfig.headers.map((h) => {
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row }: CellRendererProps<ProgrammaticControlProduct>) => {
          const s = String(row.status);
          const colors = PROGRAMMATIC_CONTROL_STATUS_COLORS[s] ?? {
            bg: "#f3f4f6",
            color: "#374151",
          };
          return `<span style="background:${colors.bg};color:${colors.color};padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold">${s}</span>`;
        },
      };
    }
    return { ...h };
  });

  let table: SimpleTableVanilla<ProgrammaticControlProduct>;

  function setStatus(msg: string) {
    banner.textContent = msg;
  }

  const buttons: Array<{ label: string; action: () => void }> = [
    {
      label: "Sort by Name (A-Z)",
      action: () => {
        table.getAPI().applySortState({ accessor: "name", direction: "asc" });
        setStatus("Sorted by Name (A-Z)");
      },
    },
    {
      label: "Sort by Price (High to Low)",
      action: () => {
        table.getAPI().applySortState({ accessor: "price", direction: "desc" });
        setStatus("Sorted by Price (High to Low)");
      },
    },
    {
      label: "Filter: Available",
      action: () => {
        table.getAPI().applyFilter({ accessor: "status", operator: "equals", value: "Available" });
        setStatus("Filtered to show only Available products");
      },
    },
    {
      label: "Clear Filters",
      action: () => {
        table.getAPI().clearAllFilters();
        setStatus("All filters cleared");
      },
    },
    {
      label: "Get Table Info",
      action: () => {
        const api = table.getAPI();
        const allRows = api.getAllRows();
        const hdrs = api.getHeaders();
        const sortState = api.getSortState();
        const filterState = api.getFilterState();
        const totalValue = allRows.reduce(
          (sum, r) => sum + Number(r.row.price) * Number(r.row.stock),
          0,
        );
        const sortInfo = sortState ? `${sortState.key.label} (${sortState.direction})` : "None";
        alert(
          `Table Info:\n• Rows: ${allRows.length}\n• Columns: ${hdrs.length}\n• Active filters: ${Object.keys(filterState).length}\n• Sort: ${sortInfo}\n• Total inventory value: $${totalValue.toFixed(2)}`,
        );
        setStatus("Table info displayed");
      },
    },
  ];

  for (const { label, action } of buttons) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.addEventListener("click", action);
    controls.appendChild(btn);
  }

  wrapper.appendChild(controls);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  table = new SimpleTableVanilla(tableContainer, {
    getRowId,
    columns: headers,
    rows: programmaticControlConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });

  return table;
}
