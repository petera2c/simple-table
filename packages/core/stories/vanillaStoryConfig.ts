/**
 * Shared default args and argTypes for vanilla Docs & Examples stories.
 * Mirrors the React StoryWrapper pattern so Controls (theme, height, etc.) are consistent.
 */
import type { Theme, CustomThemeProps, PivotConfig } from "../src/index";

export interface UniversalVanillaArgs {
  autoExpandColumns?: boolean;
  cellUpdateFlash?: boolean;
  columnReordering?: boolean;
  columnResizing?: boolean;
  customTheme?: CustomThemeProps;
  enableColumnEditor?: boolean;
  enableColumnEditorInitOpen?: boolean;
  expandAll?: boolean;
  externalFilterHandling?: boolean;
  externalSortHandling?: boolean;
  height?: string;
  hideFooter?: boolean;
  /** Declarative matrix pivot (passed through to SimpleTableConfig). */
  pivot?: PivotConfig | null;
  rowsPerPage?: number;
  selectableCells?: boolean;
  selectableColumns?: boolean;
  enablePagination?: boolean;
  theme?: Theme;
  hoverRowBackground?: boolean;
  oddColumnBackground?: boolean;
  oddEvenRowBackground?: boolean;
}

export const defaultVanillaArgs: UniversalVanillaArgs = {
  cellUpdateFlash: false,
  columnReordering: false,
  columnResizing: false,
  customTheme: undefined,
  enableColumnEditor: false,
  enableColumnEditorInitOpen: false,
  expandAll: true,
  externalFilterHandling: false,
  externalSortHandling: false,
  height: undefined,
  hideFooter: false,
  rowsPerPage: 10,
  selectableCells: false,
  selectableColumns: false,
  enablePagination: false,
  theme: "modern-light" as Theme,
  hoverRowBackground: true,
  oddColumnBackground: false,
  oddEvenRowBackground: false,
};

export const vanillaArgTypes = {
  theme: {
    control: { type: "select" as const },
    options: ["modern-light", "modern-dark", "light", "dark", "neutral"],
    description: "Select the theme for the table",
  },
  oddColumnBackground: {
    control: { type: "boolean" as const },
    description: "Enable alternating column background colors",
  },
  hoverRowBackground: {
    control: { type: "boolean" as const },
    description: "Enable row hover background effect",
  },
  oddEvenRowBackground: {
    control: { type: "boolean" as const },
    description: "Enable alternating row background colors",
  },
  cellUpdateFlash: {
    control: { type: "boolean" as const },
    description: "Flash animation when cells are updated",
  },
  height: {
    control: { type: "text" as const },
    description: "Table height (e.g., '500px', '90vh')",
  },
  customTheme: {
    control: { type: "object" as const },
    description: "Custom theme configuration for dimensions and spacing",
  },
  autoExpandColumns: {
    control: { type: "boolean" as const },
    description:
      "Convert pixel widths to proportional fr units that fill table width with smart resizing",
  },
  expandAll: {
    control: { type: "boolean" as const },
    description: "Expand all row groups by default",
  },
  columnReordering: {
    control: { type: "boolean" as const },
    description: "Enable column drag-and-drop reordering",
  },
  columnResizing: {
    control: { type: "boolean" as const },
    description: "Enable column resizing",
  },
  enableColumnEditor: {
    control: { type: "boolean" as const },
    description: "Enable column visibility editor",
  },
  enableColumnEditorInitOpen: {
    control: { type: "boolean" as const },
    description: "Open column editor on initial load",
  },
  selectableCells: {
    control: { type: "boolean" as const },
    description: "Enable cell selection",
  },
  selectableColumns: {
    control: { type: "boolean" as const },
    description: "Enable column header selection",
  },
  enablePagination: {
    control: { type: "boolean" as const },
    description: "Enable pagination",
  },
  hideFooter: {
    control: { type: "boolean" as const },
    description: "Hide the table footer",
  },
  externalSortHandling: {
    control: { type: "boolean" as const },
    description: "Handle sorting externally (table provides UI only)",
  },
  externalFilterHandling: {
    control: { type: "boolean" as const },
    description: "Handle filtering externally (table provides UI only)",
  },
  rowsPerPage: {
    control: { type: "number" as const, min: 5, max: 100, step: 5 },
    description: "Number of rows per page (when pagination is enabled)",
  },
};
