import HeaderObject, { Accessor } from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { RowId } from "../types/RowId";
export declare const getCellId: ({ accessor, rowId }: {
    accessor: Accessor;
    rowId: RowId;
}) => string;
export declare const displayCell: ({ header, pinned, headers, collapsedHeaders, rootPinned, }: {
    header: HeaderObject;
    pinned?: Pinned;
    headers?: HeaderObject[];
    collapsedHeaders?: Set<Accessor>;
    rootPinned?: Pinned;
}) => true | null;
export declare const getCellKey: ({ rowId, accessor }: {
    rowId: RowId;
    accessor: Accessor;
}) => string;
