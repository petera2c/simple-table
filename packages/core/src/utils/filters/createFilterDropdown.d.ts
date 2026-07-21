import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
export interface CreateFilterDropdownOptions {
    header: HeaderObject;
    currentFilter?: FilterCondition;
    onApplyFilter: (filter: FilterCondition) => void;
    onClearFilter: () => void;
    containerRef?: HTMLElement;
    mainBodyRef?: HTMLElement;
}
export declare const createFilterDropdown: (options: CreateFilterDropdownOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<import("./createStringFilter").CreateStringFilterOptions>) => void;
    destroy: () => void;
};
