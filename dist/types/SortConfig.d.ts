import HeaderObject from "./HeaderObject";
export type SortColumn = {
    key: HeaderObject;
    direction: "ascending" | "descending";
};
type SortConfig = {
    key: HeaderObject;
    direction: "ascending" | "descending";
};
export default SortConfig;
