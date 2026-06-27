import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { RowSelectionConfig } from "../../types/SimpleTableProps";
import { CustomTheme, DEFAULT_CUSTOM_THEME } from "../../types/CustomTheme";
import { DEFAULT_COLUMN_EDITOR_CONFIG } from "../../types/ColumnEditorConfig";
import { ColumnEditorRowRenderer } from "../../types/ColumnEditorRowRendererProps";
import { ColumnEditorCustomRenderer } from "../../types/ColumnEditorCustomRendererProps";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import {
  createAngleLeftIcon,
  createAngleRightIcon,
  createDescIcon,
  createAscIcon,
  createFilterIcon,
  createDragIcon,
} from "../../icons";
import { initializeExpandedDepths } from "../../hooks/expandedDepths";
import { collectEssentialAccessors } from "../../utils/pinnedColumnUtils";

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
  searchEnabled: boolean;
  searchPlaceholder: string;
  allowColumnPinning: boolean;
  hideToggle: boolean;
  searchFunction?: (header: HeaderObject, searchText: string) => boolean;
  rowRenderer?: ColumnEditorRowRenderer;
  customRenderer?: ColumnEditorCustomRenderer;
}

export class TableInitializer {
  static resolveIcons(config: SimpleTableConfig): ResolvedIcons {
    const defaultIcons = {
      drag: createDragIcon("st-drag-icon"),
      expand: createAngleRightIcon("st-expand-icon"),
      filter: createFilterIcon("st-header-icon"),
      headerCollapse: createAngleRightIcon("st-header-icon"),
      headerExpand: createAngleLeftIcon("st-header-icon"),
      next: createAngleRightIcon("st-next-prev-icon"),
      prev: createAngleLeftIcon("st-next-prev-icon"),
      sortDown: createDescIcon("st-header-icon"),
      sortUp: createAscIcon("st-header-icon"),
    };

    return {
      drag: config.icons?.drag ?? defaultIcons.drag,
      expand: config.icons?.expand ?? defaultIcons.expand,
      filter: config.icons?.filter ?? defaultIcons.filter,
      headerCollapse: config.icons?.headerCollapse ?? defaultIcons.headerCollapse,
      headerExpand: config.icons?.headerExpand ?? defaultIcons.headerExpand,
      next: config.icons?.next ?? defaultIcons.next,
      prev: config.icons?.prev ?? defaultIcons.prev,
      sortDown: config.icons?.sortDown ?? defaultIcons.sortDown,
      sortUp: config.icons?.sortUp ?? defaultIcons.sortUp,
    };
  }

  static mergeCustomTheme(config: SimpleTableConfig): CustomTheme {
    return {
      ...DEFAULT_CUSTOM_THEME,
      ...config.customTheme,
    };
  }

  static mergeColumnEditorConfig(config: SimpleTableConfig): MergedColumnEditorConfig {
    return {
      text: config.columnEditorConfig?.text ?? DEFAULT_COLUMN_EDITOR_CONFIG.text,
      searchEnabled:
        config.columnEditorConfig?.searchEnabled ?? DEFAULT_COLUMN_EDITOR_CONFIG.searchEnabled,
      searchPlaceholder:
        config.columnEditorConfig?.searchPlaceholder ??
        DEFAULT_COLUMN_EDITOR_CONFIG.searchPlaceholder,
      allowColumnPinning:
        config.columnEditorConfig?.allowColumnPinning ??
        DEFAULT_COLUMN_EDITOR_CONFIG.allowColumnPinning,
      hideToggle:
        config.columnEditorConfig?.hideToggle ??
        DEFAULT_COLUMN_EDITOR_CONFIG.hideToggle,
      searchFunction: config.columnEditorConfig?.searchFunction,
      rowRenderer: config.columnEditorConfig?.rowRenderer,
      customRenderer: config.columnEditorConfig?.customRenderer,
    };
  }

  static buildEssentialAccessors(headers: HeaderObject[]): Set<string> {
    return collectEssentialAccessors(headers);
  }

  static getInitialCollapsedHeaders(headers: HeaderObject[]): Set<Accessor> {
    const collapsed = new Set<Accessor>();
    const processHeaders = (hdrs: HeaderObject[]) => {
      hdrs.forEach((header) => {
        if (header.collapseDefault && header.collapsible) {
          collapsed.add(header.accessor);
        }
        if (header.children) {
          processHeaders(header.children);
        }
      });
    };
    processHeaders(headers);
    return collapsed;
  }

  static getInitialExpandedDepths(config: SimpleTableConfig): Set<number> {
    return initializeExpandedDepths(config.expandAll ?? true, config.rowGrouping);
  }

  static resolveConfigDefaults<T extends {
    selectableCells?: boolean;
    selectableColumns?: boolean;
    enableRowSelection?: boolean;
    rowSelectionConfig?: RowSelectionConfig;
  }>(config: T): T {
    const resolved = { ...config };
    if (resolved.selectableCells && resolved.selectableColumns === undefined) {
      resolved.selectableColumns = true;
    }
    if (resolved.enableRowSelection) {
      const originalConfig = resolved.rowSelectionConfig || {};
      const showCheckboxes = originalConfig.showCheckboxes ?? true;
      resolved.rowSelectionConfig = {
        showCheckboxes,
        enableClickSelection: originalConfig.enableClickSelection ?? (!showCheckboxes ? true : false),
        enableKeyboardNavigation: originalConfig.enableKeyboardNavigation ?? (!showCheckboxes ? true : false),
        mode: originalConfig.mode ?? 'multi',
      };
      if (!showCheckboxes) {
        resolved.selectableCells = false;
      }
    }
    return resolved;
  }
}
