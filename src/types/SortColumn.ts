import HeaderObject from "./HeaderObject";

// Type for a single sort column
type SortColumn<T> = {
  key: HeaderObject<T>;
  direction: "ascending" | "descending";
};

export default SortColumn;
