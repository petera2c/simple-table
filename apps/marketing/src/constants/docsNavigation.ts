import {
  faTable,
  faCode,
  faPaintBrush,
  faColumns,
  faEdit,
  faSort,
  faLayerGroup,
  faPager,
  faTableCells,
  faRocket,
  faPuzzlePiece,
  faList,
  faEye,
  faThumbtack,
  faAlignLeft,
  faCopy,
  faPalette,
  faArrowRightArrowLeft,
  faLeftRight,
  faDownload,
  faArrowsUpDown,
  faIcons,
  faBolt,
  faCalculator,
  faFilter,
  faSearch,
  faBook,
  faInfinity,
  faCheckSquare,
  faHandPointer,
  faMousePointer,
  faFolderMinus,
  faCommentAlt,
  faRulerHorizontal,
  faSpinner,
  faChartLine,
  faInbox,
  faUpDown,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// Define section structure type
export interface DocSection {
  id: string;
  label: string;
  icon: IconDefinition;
  subsections: DocSubSection[];
}

export interface DocSubSection {
  id: string;
  label: string;
  path: string;
  icon?: IconDefinition;
}

// Central docs navigation configuration
export const docSections: DocSection[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: faRocket,
    subsections: [
      { id: "installation", label: "Installation", path: "/docs/installation", icon: faDownload },
      { id: "quick-start", label: "Quick Start", path: "/docs/quick-start", icon: faRocket },
      { id: "table-height", label: "Table Height", path: "/docs/table-height", icon: faUpDown },
      { id: "api-reference", label: "API Reference", path: "/docs/api-reference", icon: faBook },
    ],
  },
  {
    id: "columns",
    label: "Column Features",
    icon: faColumns,
    subsections: [
      {
        id: "column-width",
        label: "Column Width",
        path: "/docs/column-width",
        icon: faRulerHorizontal,
      },
      {
        id: "column-resizing",
        label: "Column Resizing",
        path: "/docs/column-resizing",
        icon: faLeftRight,
      },
      {
        id: "column-reordering",
        label: "Column Reordering",
        path: "/docs/column-reordering",
        icon: faArrowRightArrowLeft,
      },
      {
        id: "column-visibility",
        label: "Column Visibility",
        path: "/docs/column-visibility",
        icon: faEye,
      },
      {
        id: "column-pinning",
        label: "Column Pinning",
        path: "/docs/column-pinning",
        icon: faThumbtack,
      },
      {
        id: "column-alignment",
        label: "Column Alignment",
        path: "/docs/column-alignment",
        icon: faAlignLeft,
      },
      { id: "column-sorting", label: "Column Sorting", path: "/docs/column-sorting", icon: faSort },
      {
        id: "column-filtering",
        label: "Column Filtering",
        path: "/docs/column-filtering",
        icon: faFilter,
      },
      {
        id: "column-selection",
        label: "Column Selection",
        path: "/docs/column-selection",
        icon: faMousePointer,
      },
      {
        id: "column-editing",
        label: "Column Editing",
        path: "/docs/column-editing",
        icon: faEdit,
      },
      {
        id: "nested-headers",
        label: "Nested Headers",
        path: "/docs/nested-headers",
        icon: faLayerGroup,
      },
      {
        id: "collapsible-columns",
        label: "Collapsible Columns",
        path: "/docs/collapsible-columns",
        icon: faFolderMinus,
      },
      {
        id: "tooltips",
        label: "Tooltips",
        path: "/docs/tooltips",
        icon: faCommentAlt,
      },
    ],
  },
  {
    id: "rows",
    label: "Row Features",
    icon: faList,
    subsections: [
      {
        id: "row-selection",
        label: "Row Selection",
        path: "/docs/row-selection",
        icon: faCheckSquare,
      },
      { id: "row-grouping", label: "Row Grouping", path: "/docs/row-grouping", icon: faLayerGroup },
      {
        id: "nested-tables",
        label: "Nested Tables",
        path: "/docs/nested-tables",
        icon: faLayerGroup,
      },
      {
        id: "aggregate-functions",
        label: "Aggregate Functions",
        path: "/docs/aggregate-functions",
        icon: faCalculator,
      },
      { id: "row-height", label: "Row Height", path: "/docs/row-height", icon: faArrowsUpDown },
    ],
  },
  {
    id: "cells",
    label: "Cell Features",
    icon: faTableCells,
    subsections: [
      { id: "cell-editing", label: "Cell Editing", path: "/docs/cell-editing", icon: faEdit },
      {
        id: "cell-highlighting",
        label: "Cell Highlighting",
        path: "/docs/cell-highlighting",
        icon: faCopy,
      },
      { id: "cell-renderer", label: "Cell Renderer", path: "/docs/cell-renderer", icon: faCode },
      {
        id: "value-formatter",
        label: "Value Formatter",
        path: "/docs/value-formatter",
        icon: faPaintBrush,
      },
      {
        id: "chart-columns",
        label: "Chart Columns",
        path: "/docs/chart-columns",
        icon: faChartLine,
      },
      {
        id: "cell-clicking",
        label: "Cell Clicking",
        path: "/docs/cell-clicking",
        icon: faHandPointer,
      },
    ],
  },
  {
    id: "advanced-features",
    label: "Advanced Features",
    icon: faPuzzlePiece,
    subsections: [
      {
        id: "quick-filter",
        label: "Quick Filter",
        path: "/docs/quick-filter",
        icon: faSearch,
      },
      {
        id: "header-renderer",
        label: "Header Renderer",
        path: "/docs/header-renderer",
        icon: faCode,
      },
      {
        id: "footer-renderer",
        label: "Footer Renderer",
        path: "/docs/footer-renderer",
        icon: faCode,
      },
      { id: "pagination", label: "Pagination", path: "/docs/pagination", icon: faPager },
      { id: "loading-state", label: "Loading State", path: "/docs/loading-state", icon: faSpinner },
      { id: "empty-state", label: "Empty State", path: "/docs/empty-state", icon: faInbox },
      { id: "live-updates", label: "Live Updates", path: "/docs/live-updates", icon: faBolt },
      {
        id: "infinite-scroll",
        label: "Infinite Scroll",
        path: "/docs/infinite-scroll",
        icon: faInfinity,
      },
      {
        id: "csv-export",
        label: "CSV Export",
        path: "/docs/csv-export",
        icon: faDownload,
      },
      {
        id: "programmatic-control",
        label: "Programmatic Control",
        path: "/docs/programmatic-control",
        icon: faGear,
      },
    ],
  },
  {
    id: "customization",
    label: "Customization",
    icon: faPaintBrush,
    subsections: [
      { id: "themes", label: "Themes", path: "/docs/themes", icon: faPalette },
      { id: "custom-icons", label: "Custom Icons", path: "/docs/custom-icons", icon: faIcons },
      { id: "custom-theme", label: "Custom Theme", path: "/docs/custom-theme", icon: faCode },
    ],
  },
];

// Utility functions for components
export const getAllDocPages = (): Array<{ id: string; path: string; label: string }> => {
  return docSections.flatMap((section) =>
    section.subsections.map((subsection) => ({
      id: subsection.id,
      path: subsection.path,
      label: subsection.label,
    })),
  );
};

export const getPathToLabelMap = (): Record<string, string> => {
  const map: Record<string, string> = {};
  docSections.forEach((section) => {
    section.subsections.forEach((subsection) => {
      map[subsection.path] = subsection.label;
    });
  });
  return map;
};

export const getSubsectionIconMap = (): Record<string, IconDefinition> => {
  const map: Record<string, IconDefinition> = {};
  docSections.forEach((section) => {
    section.subsections.forEach((subsection) => {
      if (subsection.icon) {
        map[subsection.id] = subsection.icon;
      }
    });
  });
  return map;
};
