/**
 * Custom theme configuration for SimpleTable
 * Contains all customizable dimensions and spacing values used in calculations and styling
 * All properties are optional - missing values will be filled with defaults
 */
export interface CustomThemeProps {
    rowHeight?: number;
    headerHeight?: number;
    footerHeight?: number;
    rowSeparatorWidth?: number;
    borderWidth?: number;
    pinnedBorderWidth?: number;
    nestedGridBorderWidth?: number;
    nestedGridPaddingTop?: number;
    nestedGridPaddingBottom?: number;
    nestedGridPaddingLeft?: number;
    nestedGridPaddingRight?: number;
    nestedGridMaxHeight?: number;
    selectionColumnWidth?: number;
}
export type CustomTheme = Required<CustomThemeProps>;
/**
 * Default theme values
 * These match the original hardcoded constants throughout the codebase
 */
export declare const DEFAULT_CUSTOM_THEME: CustomTheme;
/** Shallow value equality — used to skip layout work when React passes a new `customTheme` object with the same numbers. */
export declare function areCustomThemesEqual(a: CustomTheme, b: CustomTheme): boolean;
