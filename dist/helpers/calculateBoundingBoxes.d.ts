import { ReactNode } from "react";
interface BoundingBox {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}
declare const calculateBoundingBoxes: (children: ReactNode) => {
    [key: string]: BoundingBox;
};
export default calculateBoundingBoxes;
