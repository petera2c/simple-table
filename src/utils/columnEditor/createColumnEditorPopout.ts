import HeaderObject from "../../types/HeaderObject";
import { ColumnEditorSearchFunction, ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import { FlattenedHeader } from "../../types/FlattenedHeader";
import { createColumnEditorRow } from "./createColumnEditorRow";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";

export interface CreateColumnEditorPopoutOptions {
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
}

const defaultHeaderMatchesSearch = (header: HeaderObject, searchTerm: string): boolean => {
  const lowerSearch = searchTerm.toLowerCase();

  if (header.label.toLowerCase().includes(lowerSearch)) {
    return true;
  }

  if (header.children && header.children.length > 0) {
    return header.children.some((child) => defaultHeaderMatchesSearch(child, searchTerm));
  }

  return false;
};

const filterHeaders = (
  headers: HeaderObject[],
  searchTerm: string,
  searchFunction?: ColumnEditorSearchFunction,
): HeaderObject[] => {
  if (!searchTerm.trim()) {
    return headers;
  }

  const matchFunction = searchFunction || defaultHeaderMatchesSearch;

  return headers.filter((header) => {
    if (header.isSelectionColumn || header.excludeFromRender) {
      return false;
    }
    return matchFunction(header, searchTerm);
  });
};

export const createColumnEditorPopout = (initialOptions: CreateColumnEditorPopoutOptions) => {
  let options = initialOptions;
  let {
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
  } = options;

  let searchTerm = "";
  let draggingRow: FlattenedHeader | null = null;
  let hoveredSeparatorIndex: number | null = null;

  const initialExpanded = new Set<string>();
  const collectAccessors = (headerList: HeaderObject[]) => {
    headerList.forEach((header) => {
      if (header.children && header.children.length > 0) {
        initialExpanded.add(header.accessor);
        collectAccessors(header.children);
      }
    });
  };
  collectAccessors(headers);
  let expandedHeaders = initialExpanded;

  const container = document.createElement("div");
  container.className = `st-column-editor-popout ${open ? "open" : ""}`;
  container.addEventListener("click", (e) => e.stopPropagation());

  const content = document.createElement("div");
  content.className = "st-column-editor-popout-content";

  let searchInput: HTMLInputElement | null = null;
  if (searchEnabled) {
    const searchWrapper = document.createElement("div");
    searchWrapper.className = "st-column-editor-search-wrapper";

    const searchContainer = document.createElement("div");
    searchContainer.className = "st-column-editor-search";

    searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.value = searchTerm;
    searchInput.placeholder = searchPlaceholder;
    searchInput.className = "st-filter-input";
    searchInput.addEventListener("click", (e) => e.stopPropagation());
    searchInput.addEventListener("input", (e) => {
      searchTerm = (e.target as HTMLInputElement).value;
      render();
    });

    searchContainer.appendChild(searchInput);
    searchWrapper.appendChild(searchContainer);
    content.appendChild(searchWrapper);
  }

  const listContainer = document.createElement("div");
  listContainer.className = "st-column-editor-list";
  content.appendChild(listContainer);

  container.appendChild(content);

  const setDraggingRow = (row: FlattenedHeader | null) => {
    draggingRow = row;
    render();
  };

  const setHoveredSeparatorIndex = (index: number | null) => {
    hoveredSeparatorIndex = index;
    render();
  };

  const setExpandedHeaders = (headers: Set<string>) => {
    expandedHeaders = headers;
    render();
  };

  const doesAnyHeaderHaveChildren = () => {
    return headers.some((header) => header.children && header.children.length > 0);
  };

  const getFlattenedHeaders = (): FlattenedHeader[] => {
    const filteredHeaders = searchEnabled
      ? filterHeaders(headers, searchTerm, searchFunction)
      : headers;

    const result: FlattenedHeader[] = [];
    const forceExpanded = searchEnabled && searchTerm.trim().length > 0;

    const flatten = ({
      headers,
      depth = 0,
      parent = null,
      currentPath = [],
    }: {
      headers: HeaderObject[];
      depth: number;
      parent: HeaderObject | null;
      currentPath: number[];
    }) => {
      headers.forEach((header, index) => {
        if (header.isSelectionColumn || header.excludeFromRender) {
          return;
        }

        const visualIndex = result.length;
        const indexPath = [...currentPath, index];
        result.push({ header, visualIndex, depth, parent, indexPath });

        const hasChildren = header.children && header.children.length > 0;
        const shouldExpand = forceExpanded || expandedHeaders.has(header.accessor);

        if (hasChildren && shouldExpand && header.children) {
          flatten({
            headers: header.children,
            depth: depth + 1,
            parent: header,
            currentPath: indexPath,
          });
        }
      });
    };

    flatten({ headers: filteredHeaders, depth: 0, parent: null, currentPath: [] });
    return result;
  };

  const render = () => {
    listContainer.innerHTML = "";

    const flattenedHeaders = getFlattenedHeaders();
    const hasChildren = doesAnyHeaderHaveChildren();

    flattenedHeaders.forEach((flatItem) => {
      const rowFragment = createColumnEditorRow({
        allHeaders: headers,
        depth: flatItem.depth,
        doesAnyHeaderHaveChildren: hasChildren,
        draggingRow,
        expandedHeaders,
        flattenedHeaders,
        forceExpanded: searchEnabled && searchTerm.trim().length > 0,
        header: flatItem.header,
        hoveredSeparatorIndex,
        rowIndex: flatItem.visualIndex,
        setDraggingRow,
        setExpandedHeaders,
        setHoveredSeparatorIndex,
        columnEditorConfig,
        headers: contextHeaders,
        setHeaders,
        onColumnVisibilityChange,
        onColumnOrderChange,
      });

      listContainer.appendChild(rowFragment);
    });
  };

  render();

  const update = (newOptions: Partial<CreateColumnEditorPopoutOptions>) => {
    if (newOptions.headers !== undefined) headers = newOptions.headers;
    if (newOptions.searchEnabled !== undefined) searchEnabled = newOptions.searchEnabled;
    if (newOptions.searchPlaceholder !== undefined) searchPlaceholder = newOptions.searchPlaceholder;
    if (newOptions.searchFunction !== undefined) searchFunction = newOptions.searchFunction;
    if (newOptions.columnEditorConfig !== undefined) columnEditorConfig = newOptions.columnEditorConfig;
    if (newOptions.contextHeaders !== undefined) contextHeaders = newOptions.contextHeaders;
    if (newOptions.setHeaders !== undefined) setHeaders = newOptions.setHeaders;
    if (newOptions.onColumnVisibilityChange !== undefined) onColumnVisibilityChange = newOptions.onColumnVisibilityChange;
    if (newOptions.onColumnOrderChange !== undefined) onColumnOrderChange = newOptions.onColumnOrderChange;

    if (newOptions.open !== undefined) {
      open = newOptions.open;
      if (open) {
        container.classList.add("open");
      } else {
        container.classList.remove("open");
      }
    }

    if (searchInput && newOptions.searchPlaceholder !== undefined) {
      searchInput.placeholder = newOptions.searchPlaceholder;
    }

    render();
  };

  const destroy = () => {
    if (searchInput) {
      searchInput.removeEventListener("input", () => {});
      searchInput.removeEventListener("click", () => {});
    }
    container.removeEventListener("click", () => {});
    container.remove();
  };

  return { element: container, update, destroy };
};
