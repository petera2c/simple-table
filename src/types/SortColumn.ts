import HeaderObject from "./HeaderObject";

// Type for a single sort column
type SortColumn = {
  key: HeaderObject;
  direction: "ascending" | "descending";
};

export default SortColumn;
