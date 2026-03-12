/**
 * AdvancedSorting Example – vanilla port of React AdvancedSortingExample.
 * Same columns, valueFormatters, custom comparator, and valueGetter as React.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";

const ROWS: Row[] = [
  { id: 1, name: "Alice Johnson", department: "Engineering", salary: 95000, experience: 8, rating: 4.8, hireDate: "2016-03-15", status: "active", priority: 1, metadata: { seniorityLevel: 3, performanceScore: 92 } },
  { id: 2, name: "Bob Smith", department: "Marketing", salary: 75000, experience: 5, rating: 4.2, hireDate: "2019-07-22", status: "active", priority: 2, metadata: { seniorityLevel: 2, performanceScore: 78 } },
  { id: 3, name: "Carol Williams", department: "Engineering", salary: 120000, experience: 12, rating: 4.9, hireDate: "2012-01-10", status: "active", priority: 1, metadata: { seniorityLevel: 4, performanceScore: 98 } },
  { id: 4, name: "David Brown", department: "Sales", salary: 68000, experience: 3, rating: 3.8, hireDate: "2021-05-18", status: "probation", priority: 3, metadata: { seniorityLevel: 1, performanceScore: 65 } },
  { id: 5, name: "Eve Davis", department: "Engineering", salary: 110000, experience: 10, rating: 4.7, hireDate: "2014-09-30", status: "active", priority: 1, metadata: { seniorityLevel: 4, performanceScore: 88 } },
  { id: 6, name: "Frank Miller", department: "Marketing", salary: 82000, experience: 6, rating: 4.3, hireDate: "2018-11-05", status: "active", priority: 2, metadata: { seniorityLevel: 2, performanceScore: 81 } },
  { id: 7, name: "Grace Lee", department: "Sales", salary: 72000, experience: 4, rating: 4.1, hireDate: "2020-02-14", status: "active", priority: 2, metadata: { seniorityLevel: 2, performanceScore: 73 } },
  { id: 8, name: "Henry Wilson", department: "Engineering", salary: 88000, experience: 7, rating: 4.5, hireDate: "2017-06-20", status: "active", priority: 2, metadata: { seniorityLevel: 3, performanceScore: 85 } },
];

const HEADERS: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 180, isSortable: true, type: "string" },
  { accessor: "department", label: "Department", width: 150, isSortable: true, type: "string" },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") return `$${value.toLocaleString()}`;
      return String(value ?? "—");
    },
  },
  { accessor: "experience", label: "Years Experience", width: 140, isSortable: true, type: "number" },
  {
    accessor: "rating",
    label: "Rating",
    width: 100,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") return `⭐ ${value.toFixed(1)}`;
      return String(value ?? "—");
    },
  },
  {
    accessor: "hireDate",
    label: "Hire Date",
    width: 130,
    isSortable: true,
    type: "date",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "string") {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return String(value ?? "—");
    },
  },
  {
    accessor: "status",
    label: "Status",
    width: 120,
    isSortable: true,
    type: "string",
    valueFormatter: ({ value }: { value?: unknown }) => {
      const s = String(value ?? "");
      return s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
    },
  },
  {
    accessor: "priority",
    label: "Priority (Custom Sort)",
    width: 180,
    isSortable: true,
    type: "number",
    comparator: ({ rowA, rowB, direction }: { rowA: Row; rowB: Row; direction: string }) => {
      const priorityA = (rowA as Record<string, unknown>).priority as number;
      const priorityB = (rowB as Record<string, unknown>).priority as number;
      if (priorityA !== priorityB) {
        const result = priorityA - priorityB;
        return direction === "asc" ? result : -result;
      }
      const metadataA = (rowA as Record<string, unknown>).metadata as Record<string, unknown> | undefined;
      const metadataB = (rowB as Record<string, unknown>).metadata as Record<string, unknown> | undefined;
      const scoreA = (metadataA?.performanceScore as number) ?? 0;
      const scoreB = (metadataB?.performanceScore as number) ?? 0;
      const result = scoreB - scoreA;
      return direction === "asc" ? result : -result;
    },
    valueFormatter: ({ value, row }: { value?: unknown; row?: Row }) => {
      const metadata = (row as Record<string, unknown>)?.metadata as Record<string, unknown> | undefined;
      const score = (metadata?.performanceScore as number) ?? 0;
      return `P${value} (Score: ${score})`;
    },
  },
  {
    accessor: "metadata",
    label: "Seniority Level (ValueGetter)",
    width: 220,
    isSortable: true,
    type: "number",
    valueGetter: ({ row }: { row: Row }) => {
      const metadata = (row as Record<string, unknown>).metadata as Record<string, unknown> | undefined;
      return (metadata?.seniorityLevel as number) ?? 0;
    },
    valueFormatter: ({ row }: { row?: Row }) => {
      const metadata = (row as Record<string, unknown>)?.metadata as Record<string, unknown> | undefined;
      const level = (metadata?.seniorityLevel as number) ?? 0;
      const labels = ["Intern", "Junior", "Mid", "Senior", "Lead"];
      return labels[level] ?? "Unknown";
    },
  },
];

export function renderAdvancedSortingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    height: "600px",
    maxHeight: "600px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Advanced Sorting";
  const p = document.createElement("p");
  p.style.marginBottom = "1rem";
  p.style.color = "#666";
  p.innerHTML =
    "Custom comparator on Priority (sorts by priority then performance score). Seniority Level uses valueGetter for sort and valueFormatter for display.";
  wrapper.insertBefore(p, wrapper.querySelector("div:last-child"));
  return wrapper;
}
