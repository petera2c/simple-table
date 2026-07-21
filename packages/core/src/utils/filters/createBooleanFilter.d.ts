import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
export interface CreateBooleanFilterOptions {
    header: HeaderObject;
    currentFilter?: FilterCondition;
    onApplyFilter: (filter: FilterCondition) => void;
    onClearFilter: () => void;
    containerRef?: HTMLElement;
    mainBodyRef?: HTMLElement;
}
export declare const createBooleanFilter: (options: CreateBooleanFilterOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateBooleanFilterOptions>) => void;
    destroy: () => void;
};
