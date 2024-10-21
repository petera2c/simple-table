import HeaderObject from "../types/HeaderObject";
import SortConfig from "../types/SortConfig";
export declare const handleSort: (headers: HeaderObject[], rows: {
    [key: string]: any;
}[], sortConfig: SortConfig) => {
    sortedData: {
        [key: string]: any;
    }[];
    newSortConfig: {
        key: HeaderObject;
        direction: string;
    };
};
