import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
export interface CreateNumberFilterOptions {
    header: HeaderObject;
    currentFilter?: FilterCondition;
    onApplyFilter: (filter: FilterCondition) => void;
    onClearFilter: () => void;
    containerRef?: HTMLElement;
    mainBodyRef?: HTMLElement;
}
export declare const createNumberFilter: (options: CreateNumberFilterOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateNumberFilterOptions>) => void;
    destroy: () => void;
};
