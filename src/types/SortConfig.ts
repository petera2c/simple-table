import HeaderObject from "./HeaderObject";

// Type for a single sort column
export type SortColumn = {
  key: HeaderObject;
  direction: "ascending" | "descending";
};

// Main sort configuration type
type SortConfig = {
  key: HeaderObject;
  direction: "ascending" | "descending";
};

export default SortConfig;
