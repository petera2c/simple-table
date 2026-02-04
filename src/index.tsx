import SimpleTable from "./components/simple-table/SimpleTable";
import LineAreaChart from "./components/charts/LineAreaChart";
import BarChart from "./components/charts/BarChart";
import DefaultEmptyState from "./components/empty-state/DefaultEmptyState";
import BoundingBox from "./types/BoundingBox";
import Cell from "./types/Cell";
import CellChangeProps from "./types/CellChangeProps";
import CellValue from "./types/CellValue";
import DragHandlerProps from "./types/DragHandlerProps";
import EnumOption from "./types/EnumOption";
import HeaderObject, {
  Accessor,
  ChartOptions,
  ColumnType,
  Comparator,
  ComparatorProps,
  ExportValueGetter,
  ExportValueProps,
  ShowWhen,
  ValueFormatter,
  ValueFormatterProps,
  ValueGetter,
  ValueGetterProps,
} from "./types/HeaderObject";
import { AggregationConfig, AggregationType } from "./types/AggregationTypes";
import OnSortProps from "./types/OnSortProps";
import OnRowGroupExpandProps from "./types/OnRowGroupExpandProps";
import Row from "./types/Row";
import RowState from "./types/RowState";
import SharedTableProps from "./types/SharedTableProps";
import SortColumn from "./types/SortColumn";
import TableCellProps from "./types/TableCellProps";
import TableHeaderProps from "./types/TableHeaderProps";
import TableRefType, { SetHeaderRenameProps, ExportToCSVProps } from "./types/TableRefType";
import TableRowProps from "./types/TableRowProps";
import Theme from "./types/Theme";
import UpdateDataProps from "./types/UpdateCellProps";
import { FilterCondition, TableFilterState } from "./types/FilterTypes";
import { ColumnVisibilityState } from "./types/ColumnVisibilityTypes";
import RowSelectionChangeProps from "./types/RowSelectionChangeProps";
import CellClickProps from "./types/CellClickProps";
import CellRendererProps, { CellRenderer } from "./types/CellRendererProps";
import HeaderRendererProps, {
  HeaderRenderer,
  HeaderRendererComponents,
} from "./types/HeaderRendererProps";
import HeaderDropdownProps, { HeaderDropdown } from "./types/HeaderDropdownProps";
import { RowButtonProps } from "./types/RowButton";
import FooterRendererProps from "./types/FooterRendererProps";
import {
  LoadingStateRenderer,
  ErrorStateRenderer,
  EmptyStateRenderer,
  LoadingStateRendererProps,
  ErrorStateRendererProps,
  EmptyStateRendererProps,
} from "./types/RowStateRendererProps";
import { CustomTheme, DEFAULT_CUSTOM_THEME } from "./types/CustomTheme";
import { ColumnEditorConfig, DEFAULT_COLUMN_EDITOR_CONFIG } from "./types/ColumnEditorConfig";
import { GetRowId, GetRowIdParams } from "./types/GetRowId";
import { rowIdToString } from "./utils/rowUtils";

export {
  SimpleTable,
  LineAreaChart,
  BarChart,
  DefaultEmptyState,
  DEFAULT_CUSTOM_THEME,
  DEFAULT_COLUMN_EDITOR_CONFIG,
  rowIdToString,
};

// Tree-shakeable icon exports (imported separately to reduce bundle size)
export * from "./icons";

export type {
  Accessor,
  AggregationConfig,
  AggregationType,
  BoundingBox,
  Cell,
  CellChangeProps,
  CellClickProps,
  CellRenderer,
  CellRendererProps,
  CellValue,
  ChartOptions,
  ColumnEditorConfig,
  ColumnType,
  ColumnVisibilityState,
  Comparator,
  ComparatorProps,
  CustomTheme,
  DragHandlerProps,
  EmptyStateRenderer,
  EmptyStateRendererProps,
  EnumOption,
  ErrorStateRenderer,
  ErrorStateRendererProps,
  ExportToCSVProps,
  ExportValueGetter,
  ExportValueProps,
  FilterCondition,
  FooterRendererProps,
  GetRowId,
  GetRowIdParams,
  LoadingStateRenderer,
  LoadingStateRendererProps,
  HeaderDropdown,
  HeaderDropdownProps,
  HeaderObject,
  HeaderRenderer,
  HeaderRendererProps,
  HeaderRendererComponents,
  OnRowGroupExpandProps,
  OnSortProps,
  Row,
  RowButtonProps,
  RowSelectionChangeProps,
  RowState,
  SetHeaderRenameProps,
  SharedTableProps,
  ShowWhen,
  SortColumn,
  TableCellProps,
  TableFilterState,
  TableHeaderProps,
  TableRefType,
  TableRowProps,
  Theme,
  UpdateDataProps,
  ValueFormatter,
  ValueFormatterProps,
  ValueGetter,
  ValueGetterProps,
};
