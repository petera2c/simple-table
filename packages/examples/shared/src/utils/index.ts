export const DEMO_LIST = [
  { id: "quick-start", label: "Quick Start" },
  { id: "column-filtering", label: "Column Filtering" },
  { id: "column-sorting", label: "Column Sorting" },
  { id: "value-formatter", label: "Value Formatter" },
  { id: "pagination", label: "Pagination" },
] as const;

export type DemoId = (typeof DEMO_LIST)[number]["id"];
