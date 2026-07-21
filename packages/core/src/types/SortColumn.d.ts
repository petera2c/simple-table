import HeaderObject from "./HeaderObject";
type SortDirection = "asc" | "desc";
type SortColumn = {
    key: HeaderObject;
    direction: SortDirection;
};
export default SortColumn;
export type { SortDirection };
