import HeaderObject from "../../types/HeaderObject";
import { ColumnEditorSearchFunction, ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { IconsConfig } from "../../types/IconsConfig";
export interface CreateColumnEditorOptions {
    columnEditorText: string;
    editColumns: boolean;
    headers: HeaderObject[];
    open: boolean;
    searchEnabled: boolean;
    searchPlaceholder: string;
    searchFunction?: ColumnEditorSearchFunction;
    columnEditorConfig: ColumnEditorConfig;
    icons?: IconsConfig;
    essentialAccessors?: ReadonlySet<string>;
    resetColumns?: () => void;
    setHeaders: (headers: HeaderObject[]) => void;
    onColumnVisibilityChange?: (state: ColumnVisibilityState) => void;
    onColumnOrderChange?: (headers: HeaderObject[]) => void;
    setOpen: (open: boolean) => void;
}
export declare const createColumnEditor: (options: CreateColumnEditorOptions) => {
    update: (newOptions: Partial<CreateColumnEditorOptions>) => void;
    destroy: () => void;
    element: HTMLDivElement;
};
