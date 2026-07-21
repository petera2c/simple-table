import { SimpleTableVanilla } from "./core/SimpleTableVanilla";
import type Cell from "./types/Cell";
import type CellChangeProps from "./types/CellChangeProps";
import type CellValue from "./types/CellValue";
import type EnumOption from "./types/EnumOption";
import type HeaderObject from "./types/HeaderObject";
import type {
  Accessor,
  AutoSizeMode,
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
import type { AggregationConfig, AggregationType } from "./types/AggregationTypes";
import type { PivotConfig, PivotValueConfig, PivotResult } from "./types/PivotTypes";
import {
  PIVOT_CHILDREN_KEY,
  PIVOT_IS_TOTAL_KEY,
  PIVOT_ACCESSOR_PREFIX,
  PIVOT_BLANK_LABEL,
} from "./types/PivotTypes";
import { pivotRows, buildPivotAccessor, buildPivotRowTotalAccessor } from "./utils/pivot/pivotRows";
import type OnRowGroupExpandProps from "./types/OnRowGroupExpandProps";
import type Row from "./types/Row";
import type RowState from "./types/RowState";
import type SortColumn from "./types/SortColumn";
import type { TableAPI, SetHeaderRenameProps, ExportToCSVProps } from "./types/TableAPI";
import type Theme from "./types/Theme";
import type UpdateDataProps from "./types/UpdateCellProps";
import type {
  FilterCondition,
  TableFilterState,
  FilterOperator,
  StringFilterOperator,
  NumberFilterOperator,
  BooleanFilterOperator,
  DateFilterOperator,
  EnumFilterOperator,
} from "./types/FilterTypes";
import type {
  QuickFilterConfig,
  QuickFilterGetter,
  QuickFilterGetterProps,
  QuickFilterMode,
} from "./types/QuickFilterTypes";
import type { ColumnVisibilityState } from "./types/ColumnVisibilityTypes";
import type RowSelectionChangeProps from "./types/RowSelectionChangeProps";
import type { RowSelectionMode } from "./types/RowSelectionMode";
import type CellClickProps from "./types/CellClickProps";
import type CellRendererProps from "./types/CellRendererProps";
import type { CellRenderer } from "./types/CellRendererProps";
import type HeaderRendererProps from "./types/HeaderRendererProps";
import type { HeaderRenderer, HeaderRendererComponents } from "./types/HeaderRendererProps";
import type ColumnEditorRowRendererProps from "./types/ColumnEditorRowRendererProps";
import type {
  ColumnEditorRowRenderer,
  ColumnEditorRowRendererComponents,
} from "./types/ColumnEditorRowRendererProps";
import type {
  ColumnEditorCustomRendererProps,
  ColumnEditorCustomRenderer,
} from "./types/ColumnEditorCustomRendererProps";
import type HeaderDropdownProps from "./types/HeaderDropdownProps";
import type { HeaderDropdown } from "./types/HeaderDropdownProps";
import type { RowButtonProps } from "./types/RowButton";
import type FooterRendererProps from "./types/FooterRendererProps";
import type { FooterPosition } from "./types/FooterPosition";
import type {
  LoadingStateRenderer,
  ErrorStateRenderer,
  EmptyStateRenderer,
  LoadingStateRendererProps,
  ErrorStateRendererProps,
  EmptyStateRendererProps,
} from "./types/RowStateRendererProps";
import type { CustomTheme, CustomThemeProps } from "./types/CustomTheme";
import type { ColumnEditorConfig, ColumnEditorSearchFunction } from "./types/ColumnEditorConfig";
import type { IconsConfig } from "./types/IconsConfig";
import type { GetRowId, GetRowIdParams } from "./types/GetRowId";
import type { SimpleTableConfig } from "./types/SimpleTableConfig";
import type { SimpleTableProps } from "./types/SimpleTableProps";
import type { AnimationsConfig } from "./types/AnimationsConfig";
import type { RowId } from "./types/RowId";
import type { PinnedSectionsState } from "./types/PinnedSectionsState";
import type { Pinned } from "./types/Pinned";
import type TableRow from "./types/TableRow";

export { SimpleTableVanilla };
export { asRows } from "./utils/asRows";
export {
  pivotRows,
  buildPivotAccessor,
  buildPivotRowTotalAccessor,
  PIVOT_CHILDREN_KEY,
  PIVOT_IS_TOTAL_KEY,
  PIVOT_ACCESSOR_PREFIX,
  PIVOT_BLANK_LABEL,
};
export {
  headersStructurallyEqual,
  collectHeaderAccessors,
  rowsShallowUnchanged,
  shallowEqualRow,
  SHALLOW_ROW_COMPARE_MAX,
} from "./utils/propSyncEqual";
export type { HeaderStructureLike, GetRowIdLike } from "./utils/propSyncEqual";

export type {
  Accessor,
  AggregationConfig,
  AggregationType,
  AnimationsConfig,
  AutoSizeMode,
  Cell,
  CellChangeProps,
  CellClickProps,
  CellRenderer,
  CellRendererProps,
  CellValue,
  ChartOptions,
  ColumnEditorConfig,
  ColumnEditorCustomRenderer,
  ColumnEditorCustomRendererProps,
  ColumnEditorRowRenderer,
  ColumnEditorRowRendererComponents,
  ColumnEditorRowRendererProps,
  ColumnEditorSearchFunction,
  ColumnType,
  ColumnVisibilityState,
  Comparator,
  ComparatorProps,
  CustomTheme,
  CustomThemeProps,
  EmptyStateRenderer,
  EmptyStateRendererProps,
  EnumOption,
  ErrorStateRenderer,
  ErrorStateRendererProps,
  ExportToCSVProps,
  ExportValueGetter,
  ExportValueProps,
  FilterCondition,
  FilterOperator,
  StringFilterOperator,
  NumberFilterOperator,
  BooleanFilterOperator,
  DateFilterOperator,
  EnumFilterOperator,
  FooterRendererProps,
  FooterPosition,
  GetRowId,
  GetRowIdParams,
  IconsConfig,
  LoadingStateRenderer,
  LoadingStateRendererProps,
  HeaderDropdown,
  HeaderDropdownProps,
  HeaderObject,
  HeaderRenderer,
  HeaderRendererProps,
  HeaderRendererComponents,
  OnRowGroupExpandProps,
  Pinned,
  PinnedSectionsState,
  PivotConfig,
  PivotValueConfig,
  PivotResult,
  QuickFilterConfig,
  QuickFilterGetter,
  QuickFilterGetterProps,
  QuickFilterMode,
  Row,
  RowButtonProps,
  RowId,
  RowSelectionChangeProps,
  RowSelectionMode,
  RowState,
  SetHeaderRenameProps,
  ShowWhen,
  SimpleTableConfig,
  SimpleTableProps,
  SortColumn,
  TableAPI,
  TableFilterState,
  TableRow,
  Theme,
  UpdateDataProps,
  ValueFormatter,
  ValueFormatterProps,
  ValueGetter,
  ValueGetterProps,
};
