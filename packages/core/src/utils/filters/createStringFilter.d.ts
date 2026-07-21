import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
export interface CreateStringFilterOptions {
    header: HeaderObject;
    currentFilter?: FilterCondition;
    onApplyFilter: (filter: FilterCondition) => void;
    onClearFilter: () => void;
    containerRef?: HTMLElement;
    mainBodyRef?: HTMLElement;
}
export declare const createStringFilter: (options: CreateStringFilterOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateStringFilterOptions>) => void;
    destroy: () => void;
};
