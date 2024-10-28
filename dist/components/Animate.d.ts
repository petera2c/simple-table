import { RefObject } from "react";
interface AnimateProps {
    allowHorizontalAnimate?: boolean;
    children: any;
    pauseAnimation?: boolean;
    tableRef: RefObject<HTMLDivElement>;
}
declare const Animate: ({ allowHorizontalAnimate, children, pauseAnimation, tableRef, }: AnimateProps) => any;
export default Animate;
