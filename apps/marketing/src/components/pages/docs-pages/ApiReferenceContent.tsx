"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import { HEADER_HEIGHT } from "@/constants/global";
import PropTable from "@/components/PropTable";
import useHashNavigation from "@/hooks/useHashNavigation";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";

// Import all prop definitions from centralized location
import {
  UNION_TYPE_DEFINITIONS,
  SIMPLE_TABLE_PROPS,
  HEADER_OBJECT_PROPS,
  ROW_SELECTION_CHANGE_PROPS,
  CELL_CHANGE_PROPS,
  VALUE_FORMATTER_PROPS,
  VALUE_GETTER_PROPS,
  COMPARATOR_PROPS,
  CELL_RENDERER_PROPS,
  EXPORT_VALUE_PROPS,
  CELL_CLICK_PROPS,
  ON_ROW_GROUP_EXPAND_PROPS,
  HEADER_RENDERER_PROPS,
  COLUMN_EDITOR_ROW_RENDERER_PROPS,
  ANIMATIONS_CONFIG_PROPS,
  ENUM_OPTION_PROPS,
  AGGREGATION_CONFIG_PROPS,
  CHART_OPTIONS_PROPS,
  FILTER_CONDITION_PROPS,
  SORT_CONFIG_PROPS,
  TABLE_FILTER_STATE_PROPS,
  COLUMN_VISIBILITY_STATE_PROPS,
  QUICK_FILTER_CONFIG_PROPS,
  QUICK_FILTER_GETTER_PROPS,
  COLUMN_EDITOR_CONFIG_PROPS,
  TABLE_REF_TYPE_METHODS,
  EXPORT_TO_CSV_PROPS,
  FOOTER_RENDERER_PROPS,
  CUSTOM_THEME_PROPS,
} from "@/constants/propDefinitions";

const ApiReferenceContent = () => {
  useHashNavigation();

  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faBook} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">API Reference</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Complete reference for all SimpleTable component props and HeaderObject configuration
        options.
      </motion.p>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        id="simple-table-props"
      >
        SimpleTable Props
      </motion.h2>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        These are all the props available for the main{" "}
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">SimpleTable</code> component.
      </motion.p>

      <PropTable props={SIMPLE_TABLE_PROPS} title="SimpleTable Component Props" />

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        id="header-object"
      >
        HeaderObject Configuration
      </motion.h2>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        These are all the properties available when defining column headers in the{" "}
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">defaultHeaders</code> array.
      </motion.p>

      <PropTable props={HEADER_OBJECT_PROPS} title="Header Object Properties" />

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-12"
        style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        id="custom-theme"
      >
        CustomTheme Configuration
      </motion.h2>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.66 }}
      >
        Custom theme configuration for dimensions and spacing that affect virtualization
        calculations. All properties are optional and will use default values if not specified. For
        a comprehensive guide with examples and use cases, see the{" "}
        <Link
          href="/docs/custom-theme"
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          Custom Theme
        </Link>{" "}
        documentation.
      </motion.p>

      <PropTable props={CUSTOM_THEME_PROPS} title="CustomTheme Properties" />

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-12"
        style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Type Definitions
      </motion.h2>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        All union type values and object type properties used in SimpleTable.
      </motion.p>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="animations-config">
        <PropTable props={ANIMATIONS_CONFIG_PROPS} title="AnimationsConfig" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="enum-option">
        <PropTable props={ENUM_OPTION_PROPS} title="EnumOption" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="aggregation-config">
        <PropTable props={AGGREGATION_CONFIG_PROPS} title="AggregationConfig" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="chart-options">
        <PropTable props={CHART_OPTIONS_PROPS} title="ChartOptions" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="row-selection-change-props">
        <PropTable props={ROW_SELECTION_CHANGE_PROPS} title="RowSelectionChangeProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="cell-change-props">
        <PropTable props={CELL_CHANGE_PROPS} title="CellChangeProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="value-formatter-props">
        <PropTable props={VALUE_FORMATTER_PROPS} title="ValueFormatterProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="value-getter-props">
        <PropTable props={VALUE_GETTER_PROPS} title="ValueGetterProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="comparator-props">
        <PropTable props={COMPARATOR_PROPS} title="ComparatorProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="cell-renderer-props">
        <PropTable props={CELL_RENDERER_PROPS} title="CellRendererProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="export-value-props">
        <PropTable props={EXPORT_VALUE_PROPS} title="ExportValueProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="cell-click-props">
        <PropTable props={CELL_CLICK_PROPS} title="CellClickProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="on-row-group-expand-props">
        <PropTable props={ON_ROW_GROUP_EXPAND_PROPS} title="OnRowGroupExpandProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="header-renderer-props">
        <PropTable props={HEADER_RENDERER_PROPS} title="HeaderRendererProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="column-editor-row-renderer-props">
        <PropTable props={COLUMN_EDITOR_ROW_RENDERER_PROPS} title="ColumnEditorRowRendererProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="filter-condition">
        <PropTable props={FILTER_CONDITION_PROPS} title="FilterCondition" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="union-types">
        <PropTable props={UNION_TYPE_DEFINITIONS} title="Union Type Definitions" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="sort-config">
        <PropTable props={SORT_CONFIG_PROPS} title="SortConfig" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="table-filter-state">
        <PropTable props={TABLE_FILTER_STATE_PROPS} title="TableFilterState" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="column-visibility-state">
        <PropTable props={COLUMN_VISIBILITY_STATE_PROPS} title="ColumnVisibilityState" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="quick-filter-config">
        <PropTable props={QUICK_FILTER_CONFIG_PROPS} title="QuickFilterConfig" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="quick-filter-getter-props">
        <PropTable props={QUICK_FILTER_GETTER_PROPS} title="QuickFilterGetterProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="column-editor-config">
        <PropTable props={COLUMN_EDITOR_CONFIG_PROPS} title="ColumnEditorConfig" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="table-api">
        <PropTable props={TABLE_REF_TYPE_METHODS} title="TableAPI Methods" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="export-to-csv-props">
        <PropTable props={EXPORT_TO_CSV_PROPS} title="ExportToCSVProps" />
      </div>

      <div style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }} id="footer-renderer-props">
        <PropTable props={FOOTER_RENDERER_PROPS} title="FooterRendererProps" />
      </div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ApiReferenceContent;
