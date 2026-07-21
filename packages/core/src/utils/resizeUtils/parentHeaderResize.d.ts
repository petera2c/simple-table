import type HeaderObject from "../../types/HeaderObject";
/**
 * Handle resizing of parent headers with multiple children
 */
export declare const handleParentHeaderResize: ({ delta, leafHeaders, minWidth, startWidth, maxWidth, }: {
    delta: number;
    leafHeaders: HeaderObject[];
    minWidth: number;
    startWidth: number;
    maxWidth: number;
}) => void;
