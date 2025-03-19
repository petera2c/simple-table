import { Dispatch, SetStateAction } from "react";
import HeaderObject from "../types/HeaderObject";
import SortConfig from "../types/SortConfig";
import Row from "../types/Row";
export declare const handleSort: (headers: HeaderObject[], rows: Row[], sortConfig: SortConfig) => {
    sortedData: Row[];
    newSortConfig: {
        key: HeaderObject;
        direction: string;
    };
};
export declare const handleResizeStart: ({ event, forceUpdate, header, headersRef, index, reverse, setIsWidthDragging, }: {
    event: MouseEvent;
    forceUpdate: () => void;
    header: HeaderObject;
    headersRef: React.RefObject<HeaderObject[]>;
    index: number;
    reverse?: boolean | undefined;
    setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
}) => void;
