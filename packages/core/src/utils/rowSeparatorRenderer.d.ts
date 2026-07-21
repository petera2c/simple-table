import { HeightOffsets } from "./infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
export interface CreateRowSeparatorOptions {
    position: number;
    rowHeight: number;
    displayStrongBorder: boolean;
    heightOffsets?: HeightOffsets;
    customTheme?: CustomTheme;
    isSticky?: boolean;
    /** Same px width as the body/sticky section (`SectionRenderer` / sticky pane); omit to use 100%. */
    sectionWidthPx?: number;
}
/** Keep separator width in sync with section layout (resize, pinned width changes). */
export declare const applyRowSeparatorSectionWidth: (separator: HTMLElement, sectionWidthPx?: number) => void;
export declare const createRowSeparator: (options: CreateRowSeparatorOptions) => HTMLElement;
export declare const createSpacerRow: (position: number, rowHeight: number, heightOffsets: HeightOffsets | undefined, customTheme: CustomTheme, className: string, height?: number) => HTMLElement;
