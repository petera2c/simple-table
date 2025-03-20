import HeaderObject from "../types/HeaderObject";
export declare const getCellId: ({ accessor, rowIndex, }: {
    accessor: string;
    rowIndex: number;
}) => string;
export declare const displayCell: ({ hiddenColumns, header, pinned, }: {
    hiddenColumns: Record<string, boolean>;
    header: HeaderObject;
    pinned?: "left" | "right" | undefined;
}) => true | null;
