// Self-contained demo table setup for this example.
import type { HeaderObject, Row } from "@simple-table/angular";


export const emptyStateData: Row[] = [];

export const emptyStateHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: 180, type: "string" },
  { accessor: "email", label: "Email", width: 220, type: "string" },
  { accessor: "role", label: "Role", width: 140, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
];

export const emptyStateConfig = {
  headers: emptyStateHeaders,
  rows: emptyStateData,
} as const;

export function buildEmptyStateElement(): HTMLElement {
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    color: "#64748b",
    gap: "12px",
  });

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "48");
  svg.setAttribute("height", "48");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "#94a3b8");
  svg.setAttribute("stroke-width", "1.5");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute("d", "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7");
  svg.appendChild(path1);

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute("d", "M16 3H8L3 7h18l-5-4z");
  svg.appendChild(path2);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", "10");
  line.setAttribute("y1", "12");
  line.setAttribute("x2", "14");
  line.setAttribute("y2", "12");
  svg.appendChild(line);

  wrapper.appendChild(svg);

  const title = document.createElement("div");
  Object.assign(title.style, { fontSize: "16px", fontWeight: "600" });
  title.textContent = "No data available";
  wrapper.appendChild(title);

  const sub = document.createElement("div");
  Object.assign(sub.style, { fontSize: "13px" });
  sub.textContent = "Try adjusting your filters or adding new records.";
  wrapper.appendChild(sub);

  return wrapper;
}
