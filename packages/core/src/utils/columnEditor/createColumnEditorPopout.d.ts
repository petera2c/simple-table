import HeaderObject from "../../types/HeaderObject";
import { ColumnEditorSearchFunction, ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { IconsConfig } from "../../types/IconsConfig";
export interface CreateColumnEditorPopoutOptions {
    headers: HeaderObject[];
    open: boolean;
    searchEnabled: boolean;
    searchPlaceholder: string;
    searchFunction?: ColumnEditorSearchFunction;
    columnEditorConfig: ColumnEditorConfig;
    icons?: IconsConfig;
    essentialAccessors?: ReadonlySet<string>;
    setHeaders: (headers: HeaderObject[]) => void;
    onColumnVisibilityChange?: (state: ColumnVisibilityState) => void;
    onColumnOrderChange?: (headers: HeaderObject[]) => void;
    resetColumns?: () => void;
}
export declare const createColumnEditorPopout: (initialOptions: CreateColumnEditorPopoutOptions) => {
    element: HTMLDivElement;
    update: (newOptions: Partial<CreateColumnEditorPopoutOptions>) => void;
    destroy: () => void;
};
