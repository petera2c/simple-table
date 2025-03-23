import { RefObject } from "react";
declare const useWidthSync: ({ callback, ref, widthAttribute, }: {
    callback: (width: number) => void;
    ref: RefObject<HTMLElement | null>;
    widthAttribute: "offsetWidth" | "scrollWidth";
}) => void;
export default useWidthSync;
