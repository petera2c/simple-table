import React from "react";
import Theme from "../../types/Theme";
import ColumnEditorPosition from "../../types/ColumnEditorPosition";

// Universal props that can be controlled via Storybook args
export interface UniversalTableProps {
  // Visual/Styling Props
  theme?: Theme;
  useOddColumnBackground?: boolean;
  useHoverRowBackground?: boolean;
  useOddEvenRowBackground?: boolean;
  allowAnimations?: boolean;
  cellUpdateFlash?: boolean;
  height?: string;
  rowHeight?: number;

  // Feature Toggle Props
  expandAll?: boolean;
  columnReordering?: boolean;
  columnResizing?: boolean;
  editColumns?: boolean;
  editColumnsInitOpen?: boolean;
  selectableCells?: boolean;
  selectableColumns?: boolean;
  shouldPaginate?: boolean;
  hideFooter?: boolean;

  // External Handling Props
  externalSortHandling?: boolean;
  externalFilterHandling?: boolean;

  // Configuration Props
  rowsPerPage?: number;
  columnEditorText?: string;
  columnEditorPosition?: ColumnEditorPosition;
}

interface StoryWrapperProps extends UniversalTableProps {
  ExampleComponent: React.ComponentType<UniversalTableProps>;
  wrapperStyle?: React.CSSProperties;
}

const StoryWrapper: React.FC<StoryWrapperProps> = ({
  ExampleComponent,
  wrapperStyle = { padding: "2rem" },
  ...universalProps
}) => {
  return (
    <div style={wrapperStyle}>
      <ExampleComponent {...universalProps} />
    </div>
  );
};

export default StoryWrapper;

// Default args for universal props
export const defaultUniversalArgs: UniversalTableProps = {
  theme: "light",
  useOddColumnBackground: false,
  useHoverRowBackground: true,
  useOddEvenRowBackground: true,
  cellUpdateFlash: false,
  height: undefined,
  rowHeight: 32,
  expandAll: true,
  columnReordering: false,
  columnResizing: false,
  editColumns: false,
  editColumnsInitOpen: false,
  selectableCells: false,
  selectableColumns: false,
  shouldPaginate: false,
  hideFooter: false,
  externalSortHandling: false,
  externalFilterHandling: false,
  rowsPerPage: 10,
  columnEditorText: "Columns",
  columnEditorPosition: "right",
};

// ArgTypes for universal props
export const universalArgTypes = {
  theme: {
    control: { type: "select" as const },
    options: ["sky", "funky", "neutral", "light", "dark"],
    description: "Select the theme for the table",
  },
  useOddColumnBackground: {
    control: { type: "boolean" as const },
    description: "Enable alternating column background colors",
  },
  useHoverRowBackground: {
    control: { type: "boolean" as const },
    description: "Enable row hover background effect",
  },
  useOddEvenRowBackground: {
    control: { type: "boolean" as const },
    description: "Enable alternating row background colors",
  },
  allowAnimations: {
    control: { type: "boolean" as const },
    description: "Enable table animations",
  },
  cellUpdateFlash: {
    control: { type: "boolean" as const },
    description: "Flash animation when cells are updated",
  },
  height: {
    control: { type: "text" as const },
    description: "Table height (e.g., '500px', '90vh')",
  },
  rowHeight: {
    control: { type: "number" as const, min: 20, max: 100, step: 4 },
    description: "Height of each row in pixels",
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
  editColumns: {
    control: { type: "boolean" as const },
    description: "Enable column visibility editor",
  },
  editColumnsInitOpen: {
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
  shouldPaginate: {
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
  columnEditorText: {
    control: { type: "text" as const },
    description: "Text for the column editor button",
  },
  columnEditorPosition: {
    control: { type: "select" as const },
    options: ["left", "right"],
    description: "Position of the column editor",
  },
};
