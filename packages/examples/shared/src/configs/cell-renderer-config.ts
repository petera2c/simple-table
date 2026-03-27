import type { HeaderObject } from "simple-table-core";
import type { Row } from "simple-table-core";

export const cellRendererData: Row[] = [
  { id: 1, name: "Marcus Rodriguez", status: "active", progress: 85, rating: 4, verified: true, tags: ["frontend", "react"] },
  { id: 2, name: "Sophia Chen", status: "inactive", progress: 42, rating: 3, verified: false, tags: ["design", "ux"] },
  { id: 3, name: "Raj Patel", status: "active", progress: 97, rating: 5, verified: true, tags: ["management", "engineering"] },
  { id: 4, name: "Luna Martinez", status: "pending", progress: 23, rating: 2, verified: false, tags: ["junior", "frontend"] },
  { id: 5, name: "Tyler Anderson", status: "active", progress: 71, rating: 4, verified: true, tags: ["devops", "cloud"] },
  { id: 6, name: "Zara Kim", status: "inactive", progress: 56, rating: 3, verified: true, tags: ["design", "product"] },
  { id: 7, name: "Kai Thompson", status: "active", progress: 93, rating: 5, verified: true, tags: ["fullstack", "node"] },
  { id: 8, name: "Ava Singh", status: "pending", progress: 34, rating: 3, verified: false, tags: ["product", "analytics"] },
  { id: 9, name: "Jordan Walsh", status: "active", progress: 68, rating: 4, verified: true, tags: ["marketing", "growth"] },
  { id: 10, name: "Phoenix Lee", status: "inactive", progress: 81, rating: 4, verified: true, tags: ["backend", "python"] },
];

export const cellRendererHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", minWidth: 120, width: "1fr", type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
  { accessor: "progress", label: "Progress", width: 110, type: "number" },
  { accessor: "rating", label: "Rating", width: 110, type: "number" },
  { accessor: "verified", label: "Verified", width: 100, type: "boolean" },
  { accessor: "tags", label: "Tags", width: 180, type: "string" },
];

export const cellRendererConfig = {
  headers: cellRendererHeaders,
  rows: cellRendererData,
} as const;
