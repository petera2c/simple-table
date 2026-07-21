import { SimpleTableConfig } from "../../types/SimpleTableConfig";
export interface DOMElements {
    rootElement: HTMLElement;
    wrapperContainer: HTMLElement;
    contentWrapper: HTMLElement;
    content: HTMLElement;
    headerContainer: HTMLElement;
    bodyContainer: HTMLElement;
    footerContainer: HTMLElement;
    ariaLiveRegion: HTMLElement;
}
export interface DOMRefs {
    mainBodyRef: {
        current: HTMLDivElement | null;
    };
    pinnedLeftRef: {
        current: HTMLDivElement | null;
    };
    pinnedRightRef: {
        current: HTMLDivElement | null;
    };
    mainHeaderRef: {
        current: HTMLDivElement | null;
    };
    pinnedLeftHeaderRef: {
        current: HTMLDivElement | null;
    };
    pinnedRightHeaderRef: {
        current: HTMLDivElement | null;
    };
    headerContainerRef: {
        current: HTMLDivElement | null;
    };
    tableBodyContainerRef: {
        current: HTMLDivElement | null;
    };
    horizontalScrollbarRef: {
        current: HTMLElement | null;
    };
}
export declare class DOMManager {
    private elements;
    private refs;
    constructor();
    createDOMStructure(container: HTMLElement, config: SimpleTableConfig): DOMElements;
    updateTheme(theme: string): void;
    /** Reorders footer vs content when `footerPosition` changes after mount. */
    syncFooterPosition(footerPosition: SimpleTableConfig["footerPosition"]): void;
    getElements(): DOMElements | null;
    getRefs(): DOMRefs;
    destroy(container: HTMLElement): void;
}
