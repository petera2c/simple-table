import React, { RefObject } from "react";
import HeaderObject from "../types/HeaderObject";
export declare const TEST_KEY = "productId";
interface AnimateProps {
    allowHorizontalAnimate?: boolean;
    children: React.ReactNode | React.ReactNode[];
    draggedHeaderRef?: RefObject<HeaderObject | null>;
    headersRef: RefObject<HeaderObject[]>;
    isBody?: boolean;
    mainBodyRef: RefObject<HTMLDivElement | null>;
    pauseAnimation?: boolean;
    rowIndex: number;
}
declare const AnimateWrapper: ({ allowAnimations, children, ...props }: AnimateProps & {
    allowAnimations: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export default AnimateWrapper;
