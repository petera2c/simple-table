import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import { ColumnEditorRowRenderer } from "../../types/ColumnEditorRowRendererProps";
import { ColumnEditorCustomRenderer } from "../../types/ColumnEditorCustomRendererProps";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
export interface ResolvedIcons {
    drag: string | HTMLElement | SVGSVGElement;
    expand: string | HTMLElement | SVGSVGElement;
    filter: string | HTMLElement | SVGSVGElement;
    headerCollapse: string | HTMLElement | SVGSVGElement;
    headerExpand: string | HTMLElement | SVGSVGElement;
    next: string | HTMLElement | SVGSVGElement;
    prev: string | HTMLElement | SVGSVGElement;
    sortDown: string | HTMLElement | SVGSVGElement;
    sortUp: string | HTMLElement | SVGSVGElement;
}
export interface MergedColumnEditorConfig {
    text: string;
    showToggle: boolean;
    searchEnabled: boolean;
    searchPlaceholder: string;
    allowColumnPinning: boolean;
    searchFunction?: (header: HeaderObject, searchText: string) => boolean;
    rowRenderer?: ColumnEditorRowRenderer;
    customRenderer?: ColumnEditorCustomRenderer;
}
export declare class TableInitializer {
    static resolveIcons(config: SimpleTableConfig): ResolvedIcons;
    static mergeCustomTheme(config: SimpleTableConfig): CustomTheme;
    static mergeColumnEditorConfig(config: SimpleTableConfig): MergedColumnEditorConfig;
    static buildEssentialAccessors(headers: HeaderObject[]): Set<string>;
    static getInitialCollapsedHeaders(headers: HeaderObject[]): Set<Accessor>;
    static getInitialExpandedDepths(config: SimpleTableConfig): Set<number>;
}
