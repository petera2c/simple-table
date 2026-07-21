import HeaderObject from "../../types/HeaderObject";
import { ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import { IconsConfig } from "../../types/IconsConfig";
import { FlattenedHeader, HoveredSeparator } from "./columnEditorUtils";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { PanelSection } from "../pinnedColumnUtils";
export interface CreateColumnEditorRowOptions {
    allHeaders: HeaderObject[];
    clearHoverSeparator?: () => void;
    depth: number;
    doesAnyHeaderHaveChildren: boolean;
    draggingRow: FlattenedHeader | null;
    getDraggingRow?: () => FlattenedHeader | null;
    getHoveredSeparator?: () => HoveredSeparator;
    expandedHeaders: Set<string>;
    flattenedHeaders: FlattenedHeader[];
    forceExpanded: boolean;
    header: HeaderObject;
    hoveredSeparator: HoveredSeparator;
    panelSection?: PanelSection;
    rowIndex: number;
    setDraggingRow: (row: FlattenedHeader | null) => void;
    setExpandedHeaders: (headers: Set<string>) => void;
    setHoveredSeparator: (value: HoveredSeparator) => void;
    columnEditorConfig: ColumnEditorConfig;
    /** Resolved table icons; `icons.drag` overrides the default column-editor drag handle. */
    icons?: IconsConfig;
    essentialAccessors?: ReadonlySet<string>;
    headers: HeaderObject[];
    setHeaders: (headers: HeaderObject[]) => void;
    onColumnVisibilityChange?: (state: ColumnVisibilityState) => void;
    onColumnOrderChange?: (headers: HeaderObject[]) => void;
    /** When set (e.g. after expand toggle), used with updateExpandIconState so the chevron animates like table cells. */
    previousExpandedHeaders?: ReadonlySet<string>;
}
export interface CreateColumnEditorRowResult {
    fragment: DocumentFragment;
    /** Run after the row fragment is connected to the document (e.g. listEl.appendChild). */
    scheduleExpandIconAnimation?: () => void;
}
export declare const createColumnEditorRow: (options: CreateColumnEditorRowOptions) => CreateColumnEditorRowResult;
