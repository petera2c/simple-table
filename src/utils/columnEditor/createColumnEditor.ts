import HeaderObject from "../../types/HeaderObject";
import { ColumnEditorSearchFunction, ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import { createColumnEditorPopout } from "./createColumnEditorPopout";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { COLUMN_EDIT_WIDTH } from "../../consts/general-consts";

export interface CreateColumnEditorOptions {
  columnEditorText: string;
  editColumns: boolean;
  headers: HeaderObject[];
  open: boolean;
  searchEnabled: boolean;
  searchPlaceholder: string;
  searchFunction?: ColumnEditorSearchFunction;
  columnEditorConfig: ColumnEditorConfig;
  contextHeaders: HeaderObject[];
  setHeaders: (headers: HeaderObject[]) => void;
  onColumnVisibilityChange?: (state: ColumnVisibilityState) => void;
  onColumnOrderChange?: (headers: HeaderObject[]) => void;
  setOpen: (open: boolean) => void;
}

export const createColumnEditor = (options: CreateColumnEditorOptions) => {
  let {
    columnEditorText,
    editColumns,
    headers,
    open,
    searchEnabled,
    searchPlaceholder,
    searchFunction,
    columnEditorConfig,
    contextHeaders,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
    setOpen,
  } = options;

  if (!editColumns) {
    const emptyDiv = document.createElement("div");
    return {
      element: emptyDiv,
      update: () => {},
      destroy: () => {},
    };
  }

  const container = document.createElement("div");
  container.className = `st-column-editor ${open ? "open" : ""}`;
  container.style.width = `${COLUMN_EDIT_WIDTH}px`;

  const handleClick = (e: MouseEvent) => {
    setOpen(!open);
  };

  const textDiv = document.createElement("div");
  textDiv.className = "st-column-editor-text";
  textDiv.textContent = columnEditorText;
  container.addEventListener("click", handleClick);
  container.appendChild(textDiv);

  const popout = createColumnEditorPopout({
    headers,
    open,
    searchEnabled,
    searchPlaceholder,
    searchFunction,
    columnEditorConfig,
    contextHeaders,
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

      if (newOptions.columnEditorText !== undefined) {
        textDiv.textContent = newOptions.columnEditorText;
      }

      popout.update({
        headers: newOptions.headers,
        open: newOptions.open,
        searchEnabled: newOptions.searchEnabled,
        searchPlaceholder: newOptions.searchPlaceholder,
        searchFunction: newOptions.searchFunction,
        columnEditorConfig: newOptions.columnEditorConfig,
        contextHeaders: newOptions.contextHeaders,
        setHeaders: newOptions.setHeaders,
        onColumnVisibilityChange: newOptions.onColumnVisibilityChange,
        onColumnOrderChange: newOptions.onColumnOrderChange,
      });
    },
    destroy: () => {
      container.removeEventListener("click", handleClick);
      popout.destroy();
      container.remove();
    },
  };

  (container as any).__columnEditor = instance;

  return { element: container, ...instance };
};
