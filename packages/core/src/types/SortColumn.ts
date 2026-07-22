import ColumnDef from "./ColumnDef";
type SortDirection = "asc" | "desc";
// Type for a single sort column
type SortColumn = {
  key: ColumnDef;
  direction: SortDirection;
};

export default SortColumn;
export type { SortDirection };
