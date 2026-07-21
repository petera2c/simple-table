import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
export interface CreateEnumFilterOptions {
    header: HeaderObject;
    currentFilter?: FilterCondition;
    onApplyFilter: (filter: FilterCondition) => void;
    onClearFilter: () => void;
    containerRef?: HTMLElement;
    mainBodyRef?: HTMLElement;
}
export declare const createEnumFilter: (options: CreateEnumFilterOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateEnumFilterOptions>) => void;
    destroy: () => void;
};
