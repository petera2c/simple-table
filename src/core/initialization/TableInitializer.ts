import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme, DEFAULT_CUSTOM_THEME } from "../../types/CustomTheme";
import { DEFAULT_COLUMN_EDITOR_CONFIG } from "../../types/ColumnEditorConfig";
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
  searchFunction?: (header: HeaderObject, searchText: string) => boolean;
  rowRenderer?: any;
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
      text:
        config.columnEditorConfig?.text ??
        config.columnEditorText ??
        DEFAULT_COLUMN_EDITOR_CONFIG.text,
      searchEnabled:
        config.columnEditorConfig?.searchEnabled ?? DEFAULT_COLUMN_EDITOR_CONFIG.searchEnabled,
      searchPlaceholder:
        config.columnEditorConfig?.searchPlaceholder ??
        DEFAULT_COLUMN_EDITOR_CONFIG.searchPlaceholder,
      searchFunction: config.columnEditorConfig?.searchFunction,
      rowRenderer: config.columnEditorConfig?.rowRenderer,
    };
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
}
