import HeaderObject from "./HeaderObject";
type SortDirection = "asc" | "desc";
// Type for a single sort column
type SortColumn = {
  key: HeaderObject;
  direction: SortDirection;
};

export default SortColumn;
export type { SortDirection };
