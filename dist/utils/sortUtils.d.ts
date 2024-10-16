import HeaderObject from "../types/HeaderObject";
export declare const onSort: (headers: HeaderObject[], rows: {
    [key: string]: any;
}[], sortConfig: {
    key: HeaderObject;
    direction: string;
} | null, columnIndex: number) => {
    sortedData: {
        [key: string]: any;
    }[];
    newSortConfig: {
        key: HeaderObject;
        direction: string;
    };
};
