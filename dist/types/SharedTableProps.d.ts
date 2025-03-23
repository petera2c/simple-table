import { RefObject } from "react";
import HeaderObject from "./HeaderObject";
interface SharedTableProps {
    allowAnimations: boolean;
    draggedHeaderRef: RefObject<HeaderObject | null>;
    headerContainerRef: RefObject<HTMLDivElement | null>;
    headersRef: RefObject<HeaderObject[]>;
    hiddenColumns: Record<string, boolean>;
    hoveredHeaderRef: RefObject<HeaderObject | null>;
    isWidthDragging: boolean;
    mainBodyRef: RefObject<HTMLDivElement | null>;
    mainTemplateColumns: string;
    onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
    pinnedLeftColumns: HeaderObject[];
    pinnedLeftTemplateColumns: string;
    pinnedRightColumns: HeaderObject[];
    pinnedRightTemplateColumns: string;
    shouldDisplayLastColumnCell: boolean;
    tableBodyContainerRef: RefObject<HTMLDivElement | null>;
}
export default SharedTableProps;
