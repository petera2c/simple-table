import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
export interface CreateDateFilterOptions {
    header: HeaderObject;
    currentFilter?: FilterCondition;
    onApplyFilter: (filter: FilterCondition) => void;
    onClearFilter: () => void;
    containerRef?: HTMLElement;
    mainBodyRef?: HTMLElement;
}
export declare const createDateFilter: (options: CreateDateFilterOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateDateFilterOptions>) => void;
    destroy: () => void;
};
