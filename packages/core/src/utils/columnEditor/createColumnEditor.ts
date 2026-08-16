import ColumnDef from "../../types/ColumnDef";
import { ColumnEditorSearchFunction, ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import type { PivotConfig } from "../../types/PivotTypes";
import { createColumnEditorPopout } from "./createColumnEditorPopout";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { IconsConfig } from "../../types/IconsConfig";
import { COLUMN_EDIT_WIDTH } from "../../consts/general-consts";

export interface CreateColumnEditorOptions {
  columnEditorText: string;
  enableColumnEditor: boolean;
  enablePivotPanel?: boolean;
  headers: ColumnDef[];
  /** Source field catalog for the pivot panel (pristine columns). */
  pivotFields?: ColumnDef[];
  pivot?: PivotConfig | null;
  setPivot?: (pivot: PivotConfig | null) => void;
  open: boolean;
  searchEnabled: boolean;
  searchPlaceholder: string;
  searchFunction?: ColumnEditorSearchFunction;
  columnEditorConfig: ColumnEditorConfig;
  icons?: IconsConfig;
  essentialAccessors?: ReadonlySet<string>;
  resetColumns?: () => void;
  setHeaders: (headers: ColumnDef[]) => void;
  onColumnVisibilityChange?: (state: ColumnVisibilityState) => void;
  onColumnOrderChange?: (headers: ColumnDef[]) => void;
  setOpen: (open: boolean) => void;
}

export const createColumnEditor = (options: CreateColumnEditorOptions) => {
  let {
    columnEditorText,
    enableColumnEditor,
    enablePivotPanel = false,
    headers,
    pivotFields,
    pivot = null,
    setPivot,
    open,
    searchEnabled,
    searchPlaceholder,
    searchFunction,
    columnEditorConfig,
    icons,
    essentialAccessors,
    resetColumns,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
    setOpen,
  } = options;

  if (!enableColumnEditor) {
    const emptyDiv = document.createElement("div");
    return {
      element: emptyDiv,
      update: () => {},
      destroy: () => {},
    };
  }

  const showToggle = columnEditorConfig.showToggle !== false;

  const container = document.createElement("div");
  container.className = `st-column-editor${showToggle ? "" : " st-column-editor--no-toggle"}${
    open ? " open" : ""
  }`;
  container.style.width = showToggle ? `${COLUMN_EDIT_WIDTH}px` : "0px";

  const handleClick = () => {
    setOpen(!open);
  };

  let textDiv: HTMLDivElement | null = null;
  if (showToggle) {
    textDiv = document.createElement("div");
    textDiv.className = "st-column-editor-text";
    textDiv.textContent = columnEditorText;
    container.addEventListener("click", handleClick);
    container.appendChild(textDiv);
  }

  const popout = createColumnEditorPopout({
    headers,
    open,
    enablePivotPanel,
    pivotFields,
    pivot,
    setPivot,
    searchEnabled,
    searchPlaceholder,
    searchFunction,
    columnEditorConfig,
    icons,
    essentialAccessors,
    resetColumns,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
  });

  container.appendChild(popout.element);

  const instance = {
    update: (newOptions: Partial<CreateColumnEditorOptions>) => {
      if (newOptions.open !== undefined) {
        open = newOptions.open;
        if (newOptions.open) {
          container.classList.add("open");
        } else {
          container.classList.remove("open");
        }
      }

      if (newOptions.setOpen !== undefined) {
        setOpen = newOptions.setOpen;
      }

      if (newOptions.columnEditorText !== undefined && textDiv) {
        textDiv.textContent = newOptions.columnEditorText;
      }

      if (newOptions.essentialAccessors !== undefined) {
        essentialAccessors = newOptions.essentialAccessors;
      }
      if (newOptions.icons !== undefined) {
        icons = newOptions.icons;
      }
      if (newOptions.resetColumns !== undefined) {
        resetColumns = newOptions.resetColumns;
      }
      if (newOptions.enablePivotPanel !== undefined) {
        enablePivotPanel = newOptions.enablePivotPanel;
      }
      if (newOptions.pivotFields !== undefined) pivotFields = newOptions.pivotFields;
      if (newOptions.pivot !== undefined) pivot = newOptions.pivot;
      if (newOptions.setPivot !== undefined) setPivot = newOptions.setPivot;
      popout.update({
        headers: newOptions.headers,
        open: newOptions.open,
        enablePivotPanel:
          newOptions.enablePivotPanel !== undefined ? enablePivotPanel : undefined,
        pivotFields: newOptions.pivotFields,
        pivot: newOptions.pivot,
        setPivot: newOptions.setPivot,
        searchEnabled: newOptions.searchEnabled,
        searchPlaceholder: newOptions.searchPlaceholder,
        searchFunction: newOptions.searchFunction,
        columnEditorConfig: newOptions.columnEditorConfig,
        icons: newOptions.icons,
        essentialAccessors: newOptions.essentialAccessors,
        resetColumns: newOptions.resetColumns,
        setHeaders: newOptions.setHeaders,
        onColumnVisibilityChange: newOptions.onColumnVisibilityChange,
        onColumnOrderChange: newOptions.onColumnOrderChange,
      });
    },
    destroy: () => {
      if (showToggle) {
        container.removeEventListener("click", handleClick);
      }
      popout.destroy();
      container.remove();
    },
  };

  (container as any).__columnEditor = instance;

  return { element: container, ...instance };
};
