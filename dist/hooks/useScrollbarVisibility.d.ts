import { RefObject } from "react";
declare const useScrollbarVisibility: ({ headerContainerRef, mainSectionRef, scrollbarHorizontalRef, scrollbarWidth, }: {
    headerContainerRef?: RefObject<HTMLElement | null> | undefined;
    mainSectionRef?: RefObject<HTMLElement | null> | undefined;
    scrollbarHorizontalRef?: RefObject<HTMLElement | null> | undefined;
    scrollbarWidth: number;
}) => void;
export default useScrollbarVisibility;
