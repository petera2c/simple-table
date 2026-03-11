/**
 * AdvancedSorting Example – vanilla port of React AdvancedSortingExample.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";

const ROWS: Row[] = [
  { id: 1, name: "Alice Johnson", department: "Engineering", salary: 95000, experience: 8, rating: 4.8, priority: 1, metadata: { seniorityLevel: 3, performanceScore: 92 } },
  { id: 2, name: "Bob Smith", department: "Marketing", salary: 75000, experience: 5, rating: 4.2, priority: 2, metadata: { seniorityLevel: 2, performanceScore: 78 } },
  { id: 3, name: "Carol Williams", department: "Engineering", salary: 120000, experience: 12, rating: 4.9, priority: 1, metadata: { seniorityLevel: 4, performanceScore: 98 } },
  { id: 4, name: "David Brown", department: "Sales", salary: 68000, experience: 3, rating: 3.8, priority: 3, metadata: { seniorityLevel: 1, performanceScore: 65 } },
  { id: 5, name: "Eve Davis", department: "Engineering", salary: 110000, experience: 10, rating: 4.7, priority: 1, metadata: { seniorityLevel: 4, performanceScore: 88 } },
];

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "department", label: "Department", width: 120 },
  { accessor: "salary", label: "Salary", width: 100 },
  { accessor: "experience", label: "Experience", width: 100 },
  { accessor: "rating", label: "Rating", width: 90 },
  { accessor: "priority", label: "Priority", width: 90 },
];

export function renderAdvancedSortingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Advanced Sorting";
  return wrapper;
}
