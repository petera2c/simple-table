import OnNextPage from "../../types/OnNextPage";
export interface CreateTableFooterOptions {
    currentPage: number;
    hideFooter?: boolean;
    onPageChange: (page: number) => void;
    onNextPage?: OnNextPage;
    onUserPageChange?: (page: number) => void | Promise<void>;
    rowsPerPage: number;
    shouldPaginate?: boolean;
    totalPages: number;
    totalRows: number;
    /** Custom icon for previous page button (string = HTML, HTMLElement = node to clone/append). */
    prevIcon?: string | HTMLElement | SVGSVGElement;
    /** Custom icon for next page button. */
    nextIcon?: string | HTMLElement | SVGSVGElement;
}
export declare const createTableFooter: (options: CreateTableFooterOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateTableFooterOptions>) => void;
    destroy: () => void;
};
