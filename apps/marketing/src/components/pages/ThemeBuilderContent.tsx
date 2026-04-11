"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button, Input } from "antd";
import PageWrapper from "@/components/PageWrapper";
import type { Color } from "antd/es/color-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaintBrush,
  faDownload,
  faRotateLeft,
  faSearch,
  faChevronDown,
  faChevronUp,
  faTable,
  faTableCells,
  faTableColumns,
  faTableList,
  faPenToSquare,
  faHandPointer,
  faSquareCheck,
  faArrowsUpDownLeftRight,
  faComment,
  faEllipsisVertical,
  faCalendar,
  faCaretDown,
  faFilter,
  faRectangleList,
  faColumns,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { UI_STRINGS } from "@/constants/strings/ui";
import { TECHNICAL_STRINGS } from "@/constants/strings/technical";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useThemeContext } from "@/providers/ThemeProvider";

// Import our reusable components
import PageLayout from "@/components/PageLayout";
import ConfigurableSidebar, { SidebarConfig } from "@/components/ConfigurableSidebar";
import ExpandableSection from "@/components/ExpandableSection";
import ThemeColorPicker from "@/components/ThemeColorPicker";
import ThemeInput from "@/components/ThemeInput";
import MobileUnsupportedPage from "@/components/MobileUnsupported";

import { SimpleTable } from "@simple-table/react";
import type { CellChangeProps, Row, Theme } from "@simple-table/react";
import { SALES_HEADERS } from "@/examples/sales/sales-headers";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import "@simple-table/react/styles.css";

const ROW_HEIGHT = 32;
const HEADER_HEIGHT = 32;

// Function to process the data and add the new fields
const processData = (rawData: Row[]): (Row & { closeDate: string; category: string })[] => {
  return rawData.map((row: Row) => {
    // Generate a random close date in the past 90 days
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - Math.floor(Math.random() * 90));
    const closeDate = pastDate.toISOString().split("T")[0];

    // Assign a random category
    const categories = ["Software", "Hardware", "Services", "Consulting", "Training", "Support"];
    const category = categories[Math.floor(Math.random() * categories.length)];

    return {
      ...row,
      closeDate,
      category,
    };
  });
};

interface ThemeConfig {
  borderColor: string;
  borderRadius: string;
  buttonActiveBackgroundColor: string;
  buttonHoverBackgroundColor: string;
  cellColor: string;
  cellOddRowColor: string;
  cellPadding: string;
  cellFlashColor: string;
  copyFlashColor: string;
  warningFlashColor: string;
  checkboxCheckedBackgroundColor: string;
  checkboxCheckedBorderColor: string;
  checkboxBorderColor: string;
  columnEditorBackgroundColor: string;
  columnEditorPopoutBackgroundColor: string;
  columnEditorTextColor: string;
  draggingBackgroundColor: string;
  editCellShadow: string;
  editableCellFocusBorderColor: string;
  evenRowBackgroundColor: string;
  evenColumnBackgroundColor: string;
  footerBackgroundColor: string;
  headerBackgroundColor: string;
  headerLabelColor: string;
  headerIconColor: string;
  lastGroupRowSeparatorBorderColor: string;
  oddRowBackgroundColor: string;
  oddColumnBackgroundColor: string;
  resizeHandleColor: string;
  resizeHandleSelectedColor: string;
  scrollbarBgColor: string;
  scrollbarThumbColor: string;
  scrollbarWidth: string;
  selectedBorderColor: string;
  selectedCellBackgroundColor: string;
  selectedCellColor: string;
  selectedFirstCellBackgroundColor: string;
  selectedFirstCellColor: string;
  selectedRowBackgroundColor: string;
  separatorBorderColor: string;
  spacingMedium: string;
  spacingSmall: string;
  hoverRowBackgroundColor: string;
  nextPrevBtnColor: string;
  nextPrevBtnDisabledColor: string;
  pageBtnColor: string;
  pageBtnHoverBackgroundColor: string;
  dropdownGroupLabelColor: string;
  datepickerWeekdayColor: string;
  datepickerOtherMonthColor: string;
  filterButtonDisabledBackgroundColor: string;
  filterButtonDisabledTextColor: string;
  tooltipBackgroundColor: string;
  tooltipTextColor: string;
  tooltipBorderRadius: string;
  tooltipPadding: string;
  tooltipFontSize: string;
  tooltipShadow: string;
  headerSelectedBackgroundColor: string;
  headerSelectedLabelColor: string;
  headerSelectedIconColor: string;
  headerHighlightIndicatorColor: string;
  selectionHighlightIndicatorColor: string;
  subHeaderBackgroundColor: string;
  subCellBackgroundColor: string;
  subCellHoverBackgroundColor: string;
  draggingSubHeaderBackgroundColor: string;
  selectedSubCellBackgroundColor: string;
  selectedSubCellColor: string;
  chartColor: string;
  chartFillColor: string;
  dragSeparatorColor: string;
}

const lightThemeDefaults: ThemeConfig = {
  // Layout/Structure variables
  borderRadius: "4px",
  cellPadding: "8px",

  // Spacing variables
  spacingSmall: "4px",
  spacingMedium: "8px",

  // Scrollbar variables
  scrollbarBgColor: "#f8fafc", // slate-50
  scrollbarThumbColor: "#cbd5e1", // slate-300
  scrollbarWidth: "thin",

  // Color variables
  borderColor: "#cbd5e1", // slate-300
  oddRowBackgroundColor: "#ffffff", // white
  evenRowBackgroundColor: "#f8fafc", // slate-50
  oddColumnBackgroundColor: "#f8fafc", // slate-50
  evenColumnBackgroundColor: "#ffffff", // white
  headerBackgroundColor: "#f1f5f9", // slate-100
  headerLabelColor: "#0f172a", // slate-900
  headerIconColor: "#64748b", // slate-500
  draggingBackgroundColor: "#e2e8f0", // slate-200
  selectedCellBackgroundColor: "#dbeafe", // blue-100
  selectedFirstCellBackgroundColor: "#eff6ff", // blue-50
  footerBackgroundColor: "#f8fafc", // slate-50
  cellColor: "#0f172a", // slate-900
  cellOddRowColor: "#1e293b", // slate-800
  editCellShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  selectedCellColor: "#0f172a", // slate-900
  selectedFirstCellColor: "#0f172a", // slate-900
  resizeHandleColor: "#94a3b8", // slate-400
  resizeHandleSelectedColor: "#ffffff", // white
  separatorBorderColor: "#e2e8f0", // slate-200
  lastGroupRowSeparatorBorderColor: "#94a3b8", // slate-400
  cellFlashColor: "#e2e8f0", // slate-200
  copyFlashColor: "#3b82f6", // blue-500
  warningFlashColor: "#fca5a5", // red-300

  // Border colors
  selectedBorderColor: "#3b82f6", // blue-500
  editableCellFocusBorderColor: "#3b82f6", // blue-500

  // Component-specific colors
  checkboxCheckedBackgroundColor: "#2563eb", // blue-600
  checkboxCheckedBorderColor: "#2563eb", // blue-600
  checkboxBorderColor: "#cbd5e1", // slate-300
  columnEditorBackgroundColor: "#ffffff", // white
  columnEditorPopoutBackgroundColor: "#ffffff", // white
  columnEditorTextColor: "#64748b", // slate-500
  buttonHoverBackgroundColor: "#f1f5f9", // slate-100
  buttonActiveBackgroundColor: "#2563eb", // blue-600
  hoverRowBackgroundColor: "#f1f5f9", // slate-100
  selectedRowBackgroundColor: "#eff6ff", // blue-50

  // Header selection colors
  headerSelectedBackgroundColor: "#2563eb", // blue-600
  headerSelectedLabelColor: "#ffffff", // white
  headerSelectedIconColor: "#ffffff", // white

  // Highlight indicator colors
  headerHighlightIndicatorColor: "#cbd5e1", // slate-300
  selectionHighlightIndicatorColor: "#cbd5e1", // slate-300

  // Collapsible column colors
  subHeaderBackgroundColor: "#cbd5e1", // slate-300
  subCellBackgroundColor: "#f8fafc", // slate-50
  subCellHoverBackgroundColor: "#f1f5f9", // slate-100
  draggingSubHeaderBackgroundColor: "#e2e8f0", // slate-200
  selectedSubCellBackgroundColor: "#dbeafe", // blue-100
  selectedSubCellColor: "#0f172a", // slate-900

  // Chart colors
  chartColor: "#93c5fd", // blue-300
  chartFillColor: "#93c5fd", // blue-300

  // Drag separator color
  dragSeparatorColor: "#3b82f6", // blue-500

  // Navigation button colors
  nextPrevBtnColor: "#475569", // slate-600
  nextPrevBtnDisabledColor: "#94a3b8", // slate-400

  // Page button colors
  pageBtnColor: "#475569", // slate-600
  pageBtnHoverBackgroundColor: "#f1f5f9", // slate-100

  // Dropdown colors
  dropdownGroupLabelColor: "#64748b", // slate-500

  // Datepicker colors
  datepickerWeekdayColor: "#64748b", // slate-500
  datepickerOtherMonthColor: "#94a3b8", // slate-400

  // Filter button disabled colors
  filterButtonDisabledBackgroundColor: "#cbd5e1", // slate-300
  filterButtonDisabledTextColor: "#64748b", // slate-500

  // Tooltip colors
  tooltipBackgroundColor: "#0f172a", // slate-900
  tooltipTextColor: "#ffffff", // white
  tooltipBorderRadius: "6px",
  tooltipPadding: "8px 12px",
  tooltipFontSize: "13px",
  tooltipShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
};

const darkThemeDefaults: ThemeConfig = {
  // Layout/Structure variables
  borderRadius: "4px",
  cellPadding: "8px",

  // Spacing variables
  spacingSmall: "4px",
  spacingMedium: "8px",

  // Scrollbar variables
  scrollbarBgColor: "#1e293b", // slate-800
  scrollbarThumbColor: "#475569", // slate-600
  scrollbarWidth: "thin",

  // Color variables
  borderColor: "#475569", // slate-600
  oddRowBackgroundColor: "#0f172a", // slate-900
  evenRowBackgroundColor: "#1e293b", // slate-800
  oddColumnBackgroundColor: "#1e293b", // slate-800
  evenColumnBackgroundColor: "#0f172a", // slate-900
  headerBackgroundColor: "#0f172a", // slate-900
  headerLabelColor: "#f8fafc", // slate-50
  headerIconColor: "#94a3b8", // slate-400
  draggingBackgroundColor: "#334155", // slate-700
  selectedCellBackgroundColor: "#1e3a8a", // blue-900
  selectedFirstCellBackgroundColor: "#172554", // blue-950
  footerBackgroundColor: "#1e293b", // slate-800
  cellColor: "#f8fafc", // slate-50
  cellOddRowColor: "#e2e8f0", // slate-200
  editCellShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
  selectedCellColor: "#f8fafc", // slate-50
  selectedFirstCellColor: "#f8fafc", // slate-50
  resizeHandleColor: "#64748b", // slate-500
  resizeHandleSelectedColor: "#ffffff", // white
  separatorBorderColor: "#334155", // slate-700
  lastGroupRowSeparatorBorderColor: "#64748b", // slate-500
  cellFlashColor: "#334155", // slate-700
  copyFlashColor: "#60a5fa", // blue-400
  warningFlashColor: "#f87171", // red-400
  hoverRowBackgroundColor: "#334155", // slate-700

  // Border colors
  selectedBorderColor: "#60a5fa", // blue-400
  editableCellFocusBorderColor: "#60a5fa", // blue-400

  // Component-specific colors
  checkboxCheckedBackgroundColor: "#3b82f6", // blue-500
  checkboxCheckedBorderColor: "#3b82f6", // blue-500
  checkboxBorderColor: "#475569", // slate-600
  columnEditorBackgroundColor: "#1e293b", // slate-800
  columnEditorPopoutBackgroundColor: "#1e293b", // slate-800
  columnEditorTextColor: "#94a3b8", // slate-400
  buttonHoverBackgroundColor: "#334155", // slate-700
  buttonActiveBackgroundColor: "#3b82f6", // blue-500
  selectedRowBackgroundColor: "#172554", // blue-950

  // Header selection colors
  headerSelectedBackgroundColor: "#3b82f6", // blue-500
  headerSelectedLabelColor: "#ffffff", // white
  headerSelectedIconColor: "#ffffff", // white

  // Highlight indicator colors
  headerHighlightIndicatorColor: "#475569", // slate-600
  selectionHighlightIndicatorColor: "#475569", // slate-600

  // Collapsible column colors
  subHeaderBackgroundColor: "#475569", // slate-600
  subCellBackgroundColor: "#1e293b", // slate-800
  subCellHoverBackgroundColor: "#334155", // slate-700
  draggingSubHeaderBackgroundColor: "#334155", // slate-700
  selectedSubCellBackgroundColor: "#1e3a8a", // blue-900
  selectedSubCellColor: "#f8fafc", // slate-50

  // Chart colors
  chartColor: "#60a5fa", // blue-400
  chartFillColor: "#60a5fa", // blue-400

  // Drag separator color
  dragSeparatorColor: "#60a5fa", // blue-400

  // Navigation button colors
  nextPrevBtnColor: "#94a3b8", // slate-400
  nextPrevBtnDisabledColor: "#64748b", // slate-500

  // Page button colors
  pageBtnColor: "#94a3b8", // slate-400
  pageBtnHoverBackgroundColor: "#334155", // slate-700

  // Dropdown colors
  dropdownGroupLabelColor: "#94a3b8", // slate-400

  // Datepicker colors
  datepickerWeekdayColor: "#94a3b8", // slate-400
  datepickerOtherMonthColor: "#64748b", // slate-500

  // Filter button disabled colors
  filterButtonDisabledBackgroundColor: "#475569", // slate-600
  filterButtonDisabledTextColor: "#94a3b8", // slate-400

  // Tooltip colors
  tooltipBackgroundColor: "#1e293b", // slate-800
  tooltipTextColor: "#f8fafc", // slate-50
  tooltipBorderRadius: "6px",
  tooltipPadding: "8px 12px",
  tooltipFontSize: "13px",
  tooltipShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
};

const setThemeToDocument = (theme: ThemeConfig) => {
  const container = document.querySelector(".simple-table-root");
  if (container) {
    // Set each CSS variable
    Object.entries(theme).forEach(([key, value]) => {
      const cssVarName = `--st-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      (container as HTMLElement).style.setProperty(cssVarName, value);
    });
  }
};

export default function ThemeBuilderContent() {
  const isMobile = useIsMobile();
  const { theme: appTheme } = useThemeContext();

  // Track user changes that apply to all themes
  const [userChanges, setUserChanges] = useState<Partial<ThemeConfig>>({});

  // Non-CSS props: keep raw strings so the user can clear the field while editing; derive
  // positive pixel values for the table (last valid number while input is empty/invalid).
  const [rowHeightInput, setRowHeightInput] = useState(String(ROW_HEIGHT));
  const [headerHeightInput, setHeaderHeightInput] = useState(String(HEADER_HEIGHT));
  const lastValidRowHeightRef = useRef(ROW_HEIGHT);
  const lastValidHeaderHeightRef = useRef(HEADER_HEIGHT);

  const rowHeight = useMemo(() => {
    const n = parseInt(rowHeightInput, 10);
    if (!isNaN(n) && n > 0) {
      lastValidRowHeightRef.current = n;
      return n;
    }
    return lastValidRowHeightRef.current;
  }, [rowHeightInput]);

  const headerHeight = useMemo(() => {
    const n = parseInt(headerHeightInput, 10);
    if (!isNaN(n) && n > 0) {
      lastValidHeaderHeightRef.current = n;
      return n;
    }
    return lastValidHeaderHeightRef.current;
  }, [headerHeightInput]);

  // The current theme is a combination of the default theme for the current mode + user changes
  const [theme, setTheme] = useState<ThemeConfig>(
    appTheme === "light"
      ? { ...lightThemeDefaults, ...userChanges }
      : { ...darkThemeDefaults, ...userChanges },
  );

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tableStructure: false,
    rowsAndCells: false,
    columns: false,
    headers: false,
    footer: false,
    selectionAndEditing: false,
    buttons: false,
    checkboxes: false,
    dragAndResize: false,
    tooltip: false,
    scrollbar: false,
    datepicker: false,
    dropdown: false,
    filter: false,
    collapsibleColumns: false,
    charts: false,
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Update the theme when app theme changes or user makes changes
  useEffect(() => {
    const baseTheme = appTheme === "light" ? lightThemeDefaults : darkThemeDefaults;

    // Apply the current theme defaults + any user changes
    setTheme({ ...baseTheme, ...userChanges });
  }, [appTheme, userChanges]);

  useEffect(() => {
    setThemeToDocument(theme);
  }, [theme]);

  const handleColorChange = (key: keyof ThemeConfig) => (color: Color) => {
    const newValue = color.toHexString();

    // Store the change in the user changes object
    setUserChanges((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleValueChange =
    (key: keyof ThemeConfig | "rowHeight" | "headerHeight") => (value: string | number | null) => {
      if (value !== null) {
        // Special handling for non-CSS variable props
        if (key === "rowHeight") {
          setRowHeightInput(typeof value === "number" ? String(value) : value);
          return;
        }

        if (key === "headerHeight") {
          setHeaderHeightInput(typeof value === "number" ? String(value) : value);
          return;
        }

        const stringValue = value.toString();

        // Store the change in the user changes object
        setUserChanges((prev) => ({ ...prev, [key as keyof ThemeConfig]: stringValue }));
      }
    };

  const resetTheme = () => {
    // Clear all user changes, search, and reset non-CSS props
    setUserChanges({});
    setSearchQuery("");
    setRowHeightInput(String(ROW_HEIGHT));
    setHeaderHeightInput(String(HEADER_HEIGHT));
    lastValidRowHeightRef.current = ROW_HEIGHT;
    lastValidHeaderHeightRef.current = HEADER_HEIGHT;
  };

  const generateCSS = (): string => {
    return `
.theme-custom {
  ${Object.entries(theme)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `--st-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
    .join("\n  ")}
}
    `.trim();
  };

  const downloadCSS = () => {
    const cssContent = generateCSS();
    const blob = new Blob([cssContent], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = TECHNICAL_STRINGS.files.theme;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Toggle expanded sections
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Check if all sections are expanded
  const allExpanded = Object.values(expandedSections).every((value) => value);

  // Expand or collapse all sections
  const toggleAllSections = () => {
    const newState = !allExpanded;
    setExpandedSections({
      tableStructure: newState,
      rowsAndCells: newState,
      columns: newState,
      headers: newState,
      footer: newState,
      selectionAndEditing: newState,
      buttons: newState,
      checkboxes: newState,
      dragAndResize: newState,
      tooltip: newState,
      scrollbar: newState,
      datepicker: newState,
      dropdown: newState,
      filter: newState,
      collapsibleColumns: newState,
      charts: newState,
    });
  };

  // Section configurations organized by visual component
  type SectionField = {
    key: keyof ThemeConfig | "rowHeight" | "headerHeight"; // Allow non-CSS config keys
    type: "color" | "text";
    label?: string;
    tooltip?: string;
  };

  type SectionConfig = {
    title: string;
    fields: SectionField[];
  };

  const sectionConfigs: Record<string, SectionConfig[]> = {
    tableStructure: [
      {
        title: "Table Layout (customTheme Props)",
        fields: [
          {
            key: "headerHeight",
            type: "text",
            label: "Header Height (px)",
            tooltip:
              "Height of the table header in pixels. Note: This is passed via the customTheme prop to the table component and used for layout calculations.",
          },
          {
            key: "rowHeight",
            type: "text",
            label: "Row Height (px)",
            tooltip:
              "Height of each row in pixels. Note: This is NOT a CSS variable - it's passed as a prop to the table component and used for virtualization calculations.",
          },
        ],
      },
      {
        title: "Borders",
        fields: [
          { key: "borderColor", type: "color", tooltip: "Main border color for table elements" },
          { key: "borderRadius", type: "text", tooltip: "Border radius for all table elements" },
          {
            key: "separatorBorderColor",
            type: "color",
            label: "Group Separator Border",
            tooltip: "Border color for row group separators (the demo table doesn't use this)",
          },
          {
            key: "lastGroupRowSeparatorBorderColor",
            type: "color",
            tooltip:
              "Border color for the last group row separator (the demo table doesn't use this)",
          },
        ],
      },
      {
        title: "Spacing",
        fields: [
          {
            key: "spacingSmall",
            type: "text",
            tooltip: "Small spacing unit used throughout the table",
          },
          {
            key: "spacingMedium",
            type: "text",
            tooltip: "Medium spacing unit used throughout the table",
          },
        ],
      },
    ],
    rowsAndCells: [
      {
        title: "Row Colors",
        fields: [
          {
            key: "oddRowBackgroundColor",
            type: "color",
            tooltip: "Background color for odd-numbered rows",
          },
          {
            key: "evenRowBackgroundColor",
            type: "color",
            tooltip: "Background color for even-numbered rows",
          },
          {
            key: "hoverRowBackgroundColor",
            type: "color",
            tooltip: "Background color when hovering over a row",
          },
        ],
      },
      {
        title: "Cell Text & Layout",
        fields: [
          { key: "cellColor", type: "color", tooltip: "Text color for cells in the table" },
          {
            key: "cellOddRowColor",
            type: "color",
            tooltip: "Text color for cells in odd-numbered rows",
          },
          {
            key: "cellPadding",
            type: "text",
            label: "Cell Horizontal Padding",
            tooltip: "Horizontal padding inside table cells",
          },
        ],
      },
      {
        title: "Cell Effects",
        fields: [
          {
            key: "cellFlashColor",
            type: "color",
            tooltip: "Color of the cell when it is flashed from a live update",
          },
          {
            key: "copyFlashColor",
            type: "color",
            tooltip: "Color of the cell when it is flashed from a copy operation",
          },
          {
            key: "warningFlashColor",
            type: "color",
            tooltip:
              "Color of the cell when it is flashed from a copy operation on a column that can not be copied",
          },
        ],
      },
    ],
    columns: [
      {
        title: "Column Colors",
        fields: [
          {
            key: "oddColumnBackgroundColor",
            type: "color",
            tooltip: "Background color for odd-numbered columns (not used in the demo table)",
          },
          {
            key: "evenColumnBackgroundColor",
            type: "color",
            tooltip: "Background color for even-numbered columns (not used in the demo table)",
          },
        ],
      },
      {
        title: "Column Editor",
        fields: [
          {
            key: "columnEditorBackgroundColor",
            type: "color",
            tooltip: "Background color for the column editor panel",
          },
          {
            key: "columnEditorPopoutBackgroundColor",
            type: "color",
            tooltip: "Background color for the column editor popout menu",
          },
          {
            key: "columnEditorTextColor",
            type: "color",
            tooltip: "Text color in the column editor",
          },
        ],
      },
    ],
    headers: [
      {
        title: "Header Styles",
        fields: [
          {
            key: "headerBackgroundColor",
            type: "color",
            tooltip: "Background color for column headers",
          },
          { key: "headerLabelColor", type: "color", tooltip: "Text color for header labels" },
          { key: "headerIconColor", type: "color", tooltip: "Color for icons in column headers" },
          {
            key: "headerHighlightIndicatorColor",
            type: "color",
            tooltip: "When a cell is selected, the color of the header",
          },
        ],
      },
      {
        title: "Header Selection",
        fields: [
          {
            key: "headerSelectedBackgroundColor",
            type: "color",
            tooltip: "Background color when a header is selected",
          },
          {
            key: "headerSelectedLabelColor",
            type: "color",
            tooltip: "Text color for selected header labels",
          },
          {
            key: "headerSelectedIconColor",
            type: "color",
            tooltip: "Color for icons in selected headers",
          },
        ],
      },
    ],
    footer: [
      {
        title: "Footer Styles",
        fields: [
          {
            key: "footerBackgroundColor",
            type: "color",
            tooltip: "Background color for the table footer",
          },
        ],
      },
      {
        title: "Pagination",
        fields: [
          {
            key: "pageBtnColor",
            type: "color",
            tooltip: "Text color for pagination page number buttons",
          },
          {
            key: "pageBtnHoverBackgroundColor",
            type: "color",
            tooltip: "Background color when hovering over pagination buttons",
          },
        ],
      },
      {
        title: "Navigation Buttons",
        fields: [
          {
            key: "nextPrevBtnColor",
            type: "color",
            tooltip: "Color for next/previous navigation buttons",
          },
          {
            key: "nextPrevBtnDisabledColor",
            type: "color",
            tooltip: "Color for disabled next/previous buttons",
          },
        ],
      },
    ],
    selectionAndEditing: [
      {
        title: "Selection Colors",
        fields: [
          {
            key: "selectedCellBackgroundColor",
            type: "color",
            tooltip: "Background color for selected cells",
          },
          { key: "selectedCellColor", type: "color", tooltip: "Text color for selected cells" },
          {
            key: "selectedFirstCellBackgroundColor",
            type: "color",
            tooltip: "Background color for the first cell in a selection range",
          },
          {
            key: "selectedFirstCellColor",
            type: "color",
            tooltip: "Text color for the first cell in a selection range",
          },
          {
            key: "selectedRowBackgroundColor",
            type: "color",
            tooltip: "Background color for selected rows",
          },
          {
            key: "selectionHighlightIndicatorColor",
            type: "color",
            tooltip: "Color for the selection highlight indicator line",
          },
        ],
      },
      {
        title: "Selection Borders",
        fields: [
          {
            key: "selectedBorderColor",
            type: "color",
            tooltip: "Border color around selected cells",
          },
        ],
      },
      {
        title: "Editing",
        fields: [
          {
            key: "editableCellFocusBorderColor",
            type: "color",
            tooltip: "Border color for focused editable cells",
          },
          { key: "editCellShadow", type: "text", tooltip: "Shadow effect for cells in edit mode" },
        ],
      },
    ],
    buttons: [
      {
        title: "Button States",
        fields: [
          {
            key: "buttonHoverBackgroundColor",
            type: "color",
            tooltip: "Background color when hovering over buttons",
          },
          {
            key: "buttonActiveBackgroundColor",
            type: "color",
            tooltip: "Background color for active/pressed buttons",
          },
        ],
      },
    ],
    checkboxes: [
      {
        title: "Checkbox Styles",
        fields: [
          {
            key: "checkboxCheckedBackgroundColor",
            type: "color",
            tooltip: "Background color for checked checkboxes (not used in the demo table)",
          },
          {
            key: "checkboxCheckedBorderColor",
            type: "color",
            tooltip: "Border color for checked checkboxes (not used in the demo table)",
          },
          {
            key: "checkboxBorderColor",
            type: "color",
            tooltip: "Border color for unchecked checkboxes (not used in the demo table)",
          },
        ],
      },
    ],
    dragAndResize: [
      {
        title: "Drag & Resize Styles",
        fields: [
          {
            key: "draggingBackgroundColor",
            type: "color",
            tooltip: "Background color for columns while being dragged",
          },
          {
            key: "dragSeparatorColor",
            type: "color",
            tooltip: "Color of the drag drop indicator line in the column editor",
          },
          {
            key: "resizeHandleColor",
            type: "color",
            tooltip: "Color for the column resize handle",
          },
          {
            key: "resizeHandleSelectedColor",
            type: "color",
            tooltip: "Color for the resize handle when the column has been selected",
          },
        ],
      },
    ],
    tooltip: [
      {
        title: "Tooltip Colors",
        fields: [
          {
            key: "tooltipBackgroundColor",
            type: "color",
            tooltip: "Background color for tooltips (column header tooltips)",
          },
          {
            key: "tooltipTextColor",
            type: "color",
            tooltip: "Text color for tooltips (column header tooltips)",
          },
        ],
      },
      {
        title: "Tooltip Layout",
        fields: [
          {
            key: "tooltipBorderRadius",
            type: "text",
            tooltip: "Border radius for rounded tooltip corners",
          },
          { key: "tooltipPadding", type: "text", tooltip: "Padding inside tooltips" },
          { key: "tooltipFontSize", type: "text", tooltip: "Font size for tooltip text" },
          { key: "tooltipShadow", type: "text", tooltip: "Shadow effect for tooltips" },
        ],
      },
    ],
    scrollbar: [
      {
        title: "Scrollbar Styles",
        fields: [
          {
            key: "scrollbarBgColor",
            type: "color",
            tooltip: "Background color for the scrollbar track",
          },
          {
            key: "scrollbarThumbColor",
            type: "color",
            tooltip: "Color for the scrollbar thumb (draggable part)",
          },
          {
            key: "scrollbarWidth",
            type: "text",
            tooltip: "Width of the scrollbar (e.g., 'auto', 'thin', 'none')",
          },
        ],
      },
    ],
    datepicker: [
      {
        title: "Datepicker Styles",
        fields: [
          {
            key: "datepickerWeekdayColor",
            type: "color",
            tooltip: "Text color for weekday labels in the datepicker",
          },
          {
            key: "datepickerOtherMonthColor",
            type: "color",
            tooltip: "Text color for dates from other months in the datepicker",
          },
        ],
      },
    ],
    dropdown: [
      {
        title: "Dropdown Styles",
        fields: [
          {
            key: "dropdownGroupLabelColor",
            type: "color",
            tooltip: "Text color for group labels in dropdown menus (not used in the demo table)",
          },
        ],
      },
    ],
    filter: [
      {
        title: "Filter Button Disabled",
        fields: [
          {
            key: "filterButtonDisabledBackgroundColor",
            type: "color",
            tooltip: "Background color for disabled filter buttons (not used in the demo table)",
          },
          {
            key: "filterButtonDisabledTextColor",
            type: "color",
            tooltip: "Text color for disabled filter buttons (not used in the demo table)",
          },
        ],
      },
    ],
    collapsibleColumns: [
      {
        title: "Collapsible Column Colors",
        fields: [
          {
            key: "subHeaderBackgroundColor",
            type: "color",
            tooltip: "Background color for sub-headers in collapsible columns",
          },
          {
            key: "subCellBackgroundColor",
            type: "color",
            tooltip: "Background color for sub-cells in collapsible columns",
          },
          {
            key: "subCellHoverBackgroundColor",
            type: "color",
            tooltip: "Background color for sub-cells on hover (new in v1.8.6)",
          },
          {
            key: "draggingSubHeaderBackgroundColor",
            type: "color",
            tooltip: "Background color for sub-headers while dragging (new in v1.8.6)",
          },
          {
            key: "selectedSubCellBackgroundColor",
            type: "color",
            tooltip: "Background color for selected sub-cells (new in v1.8.6)",
          },
          {
            key: "selectedSubCellColor",
            type: "color",
            tooltip: "Text color for selected sub-cells (new in v1.8.6)",
          },
        ],
      },
    ],
    charts: [
      {
        title: "Chart Colors",
        fields: [
          {
            key: "chartColor",
            type: "color",
            tooltip: "Default color for chart lines and bars (lineAreaChart and barChart columns)",
          },
          {
            key: "chartFillColor",
            type: "color",
            tooltip: "Default fill color for area charts (lineAreaChart columns)",
          },
        ],
      },
    ],
  };

  // Shorten label names
  const shortenLabel = (key: string) => {
    // Capitalize first letter of each word
    return (
      key.charAt(0).toUpperCase() +
      key
        .slice(1)
        .replace(/([A-Z])/g, " $1")
        .trim()
        .replace("Background Color", "Bg")
        .replace("Border Color", "Border")
        .replace("Color", "")
    );
  };

  // Filter sections based on search query
  const filterSections = (sections: Record<string, SectionConfig[]>) => {
    if (!searchQuery) return sections;

    const filtered: Record<string, SectionConfig[]> = {};

    Object.entries(sections).forEach(([sectionKey, configs]) => {
      const filteredConfigs: SectionConfig[] = [];

      configs.forEach((config) => {
        const matchingFields = config.fields.filter((field) => {
          const label = shortenLabel(field.key.toString()).toLowerCase();
          const keyName = field.key.toString().toLowerCase();
          const configTitle = config.title.toLowerCase();
          const query = searchQuery.toLowerCase();

          return label.includes(query) || keyName.includes(query) || configTitle.includes(query);
        });

        if (matchingFields.length > 0) {
          filteredConfigs.push({
            title: config.title,
            fields: matchingFields,
          });
        }
      });

      if (filteredConfigs.length > 0) {
        filtered[sectionKey] = filteredConfigs;
      }
    });

    return filtered;
  };

  const filteredSections = filterSections(sectionConfigs);

  // Count total filtered variables
  const totalMatches = Object.values(filteredSections).reduce(
    (acc, configs) => acc + configs.reduce((sum, config) => sum + config.fields.length, 0),
    0,
  );

  // Section metadata (titles and icons)
  const sectionMetadata: Record<string, { title: string; icon: any }> = {
    tableStructure: { title: "Table Structure", icon: faTable },
    rowsAndCells: { title: "Rows & Cells", icon: faTableCells },
    columns: { title: "Columns", icon: faTableColumns },
    headers: { title: "Headers", icon: faTableList },
    footer: { title: "Footer", icon: faRectangleList },
    selectionAndEditing: { title: "Selection & Editing", icon: faPenToSquare },
    buttons: { title: "Buttons", icon: faHandPointer },
    checkboxes: { title: "Checkboxes", icon: faSquareCheck },
    dragAndResize: { title: "Drag & Resize", icon: faArrowsUpDownLeftRight },
    tooltip: { title: "Tooltip", icon: faComment },
    scrollbar: { title: "Scrollbar", icon: faEllipsisVertical },
    datepicker: { title: "Datepicker", icon: faCalendar },
    dropdown: { title: "Dropdown", icon: faCaretDown },
    filter: { title: "Filter", icon: faFilter },
    collapsibleColumns: { title: "Collapsible Columns", icon: faColumns },
    charts: { title: "Charts", icon: faChartLine },
  };

  // Render a single section config
  const renderSectionConfig = (config: SectionConfig, sectionKey: string) => {
    // Check if any fields in this config have been modified
    const hasModifications = config.fields.some((field) => {
      if (field.key === "rowHeight") {
        return rowHeightInput !== String(ROW_HEIGHT);
      }
      if (field.key === "headerHeight") {
        return headerHeightInput !== String(HEADER_HEIGHT);
      }
      return userChanges[field.key as keyof ThemeConfig] !== undefined;
    });

    return (
      <div key={config.title} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{config.title}</h4>
          {hasModifications && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
              Modified
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-y-4">
          {config.fields.map((field, index) => {
            // Special handling for non-CSS variable props
            if (field.key === "rowHeight") {
              return (
                <ThemeInput
                  key={index}
                  label={field.label || shortenLabel(field.key.toString())}
                  value={rowHeightInput}
                  onChange={(value) => handleValueChange(field.key)(value)}
                  tooltip={field.tooltip}
                />
              );
            }
            if (field.key === "headerHeight") {
              return (
                <ThemeInput
                  key={index}
                  label={field.label || shortenLabel(field.key.toString())}
                  value={headerHeightInput}
                  onChange={(value) => handleValueChange(field.key)(value)}
                  tooltip={field.tooltip}
                />
              );
            }

            // Regular CSS variables
            if (field.type === "color") {
              return (
                <ThemeColorPicker
                  key={index}
                  label={field.label || shortenLabel(field.key.toString())}
                  value={theme[field.key as keyof ThemeConfig].toString()}
                  onChange={handleColorChange(field.key as keyof ThemeConfig)}
                  tooltip={field.tooltip}
                />
              );
            } else {
              return (
                <ThemeInput
                  key={index}
                  label={field.label || shortenLabel(field.key.toString())}
                  value={theme[field.key as keyof ThemeConfig]}
                  onChange={(value) => handleValueChange(field.key as keyof ThemeConfig)(value)}
                  tooltip={field.tooltip}
                />
              );
            }
          })}
        </div>
      </div>
    );
  };

  // Create sidebar content
  const sidebarContent = (
    <div className="px-1">
      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder="Search theme variables..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          prefix={<FontAwesomeIcon icon={faSearch} className="text-gray-400" />}
          className="w-full"
        />
        <div className="flex items-center justify-between mt-2">
          {searchQuery ? (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Found {totalMatches} matching variable{totalMatches !== 1 ? "s" : ""}
            </div>
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {Object.keys(theme).length} total variables
            </div>
          )}
          {!searchQuery && (
            <Button
              type="text"
              size="small"
              onClick={toggleAllSections}
              className="text-xs"
              icon={<FontAwesomeIcon icon={allExpanded ? faChevronUp : faChevronDown} />}
            >
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          )}
        </div>
      </div>

      {/* Render all sections dynamically */}
      {Object.entries(sectionMetadata).map(([sectionKey, metadata]) => {
        const configs = filteredSections[sectionKey];

        // Don't render section if no configs match search
        if (searchQuery && (!configs || configs.length === 0)) {
          return null;
        }

        return (
          <ExpandableSection
            key={sectionKey}
            title={metadata.title}
            icon={metadata.icon}
            expanded={
              expandedSections[sectionKey as keyof typeof expandedSections] || searchQuery !== ""
            }
            onToggle={() => toggleSection(sectionKey)}
          >
            {configs && configs.length > 0 ? (
              configs.map((config) => renderSectionConfig(config, sectionKey))
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                No matching variables found
              </div>
            )}
          </ExpandableSection>
        );
      })}
    </div>
  );

  // Count modifications (including non-CSS props if changed)
  const modificationCount =
    Object.keys(userChanges).length +
    (rowHeightInput !== String(ROW_HEIGHT) ? 1 : 0) +
    (headerHeightInput !== String(HEADER_HEIGHT) ? 1 : 0);

  // Create footer content
  const footerContent = (
    <div className="space-y-3">
      {modificationCount > 0 && (
        <div className="text-sm text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <span className="font-semibold text-blue-700 dark:text-blue-300">
            {modificationCount}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {" "}
            variable{modificationCount !== 1 ? "s" : ""} modified
          </span>
        </div>
      )}

      <Button
        onClick={resetTheme}
        className="w-full"
        icon={<FontAwesomeIcon icon={faRotateLeft} />}
        disabled={modificationCount === 0}
      >
        Reset to Default
      </Button>

      <Button
        className="w-full"
        type="primary"
        onClick={downloadCSS}
        icon={<FontAwesomeIcon icon={faDownload} />}
      >
        {UI_STRINGS.common.download} {UI_STRINGS.common.theme}
      </Button>
    </div>
  );

  // Create sidebar config
  const sidebarConfig: SidebarConfig = {
    title: UI_STRINGS.themeBuilder.title,
    icon: faPaintBrush,
    sidebarContent,
    footerContent,
    width: "380px", // Slightly smaller width that works better with single column layout
  };

  // If on mobile, return the unsupported page
  if (isMobile) {
    return (
      <PageWrapper>
        <MobileUnsupportedPage featureName="Theme Builder" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageLayout sidebar={<ConfigurableSidebar config={sidebarConfig} />}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {UI_STRINGS.themeBuilder.sections.livePreview}
        </h1>
        <SalesExample
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          onGridReady={() => {
            setThemeToDocument(theme);
          }}
        />
      </PageLayout>
    </PageWrapper>
  );
}

function SalesExample({
  rowHeight,
  headerHeight,
  onGridReady,
}: {
  rowHeight: number;
  headerHeight: number;
  onGridReady?: () => void;
}) {
  const [data, setData] = useState<(Row & { closeDate: string; category: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const containerHeight = useExampleHeight({
    isUsingPagination: true,
    rowHeight,
  });
  const howManyRowsCanFit = containerHeight ? Math.floor(containerHeight / rowHeight) : 10;

  // Fetch sales data from API and process it
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Use relative path for local development, full URL for production/sandboxes
        const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
        const baseUrl = isLocal ? "" : "https://www.simple-table.com";
        const response = await fetch(`${baseUrl}/api/data/sales?rowCount=50`);
        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const salesData = await response.json();
        const processedData = processData(salesData);
        setData(processedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === row.id) {
          return {
            ...item,
            [accessor]: newValue,
          };
        }
        return item;
      }),
    );
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: containerHeight ? `${containerHeight}px` : "70dvh",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Loading sales data...
      </div>
    );
  }

  return (
    <SimpleTable
      columnReordering
      columnResizing
      defaultHeaders={SALES_HEADERS}
      editColumns
      customTheme={{
        headerHeight: headerHeight,
        rowHeight: rowHeight,
      }}
      onCellEdit={handleCellEdit}
      onGridReady={onGridReady}
      rows={data}
      rowsPerPage={howManyRowsCanFit}
      selectableCells
      shouldPaginate
      theme="custom"
      useOddEvenRowBackground
      selectableColumns
    />
  );
}
