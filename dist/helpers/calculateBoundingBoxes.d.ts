import { MutableRefObject } from "react";
import BoundingBox from "../types/BoundingBox";
import HeaderObject from "../types/HeaderObject";
declare const calculateBoundingBoxes: ({ currentHeaders, draggedHeaderRef, rowIndex, }: {
    currentHeaders: HeaderObject[];
    draggedHeaderRef?: MutableRefObject<HeaderObject | null> | undefined;
    rowIndex: number;
}) => {
    [key: string]: false | BoundingBox;
};
export default calculateBoundingBoxes;
