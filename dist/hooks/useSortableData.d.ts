/// <reference types="react" />
import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import SortConfig from "../types/SortConfig";
declare const useSortableData: (tableRows: Row[], headers: HeaderObject[]) => {
    sort: SortConfig | null;
    setSort: import("react").Dispatch<import("react").SetStateAction<SortConfig | null>>;
    sortedRows: Row[];
    hiddenColumns: Record<string, boolean>;
    setHiddenColumns: import("react").Dispatch<import("react").SetStateAction<Record<string, boolean>>>;
};
export default useSortableData;
