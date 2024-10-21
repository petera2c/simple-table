import HeaderObject from "../types/HeaderObject";
import SortConfig from "../types/SortConfig";

export const handleSort = (
  headers: HeaderObject[],
  rows: { [key: string]: any }[],
  sortConfig: SortConfig
) => {
  const key = sortConfig ? sortConfig.key : headers[0];

  let direction = "ascending";
  if (
    sortConfig &&
    sortConfig.key.accessor === key.accessor &&
    sortConfig.direction === "ascending"
  ) {
    direction = "descending";
  }

  const sortedData = [...rows].sort((a, b) => {
    if (a[key.accessor] < b[key.accessor]) {
      return direction === "ascending" ? -1 : 1;
    }
    if (a[key.accessor] > b[key.accessor]) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return { sortedData, newSortConfig: { key, direction } };
};
