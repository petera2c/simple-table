import HeaderObject from "../../types/HeaderObject";
import { ColumnEditorSearchFunction, ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import { ColumnEditorCustomRenderer } from "../../types/ColumnEditorCustomRendererProps";
import { FlattenedHeader } from "../../types/FlattenedHeader";
import { createColumnEditorRow } from "./createColumnEditorRow";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { partitionRootHeadersByPin, PanelSection } from "../../utils/pinnedColumnUtils";

export interface CreateColumnEditorPopoutOptions {
  headers: HeaderObject[];
  open: boolean;
  searchEnabled: boolean;
  searchPlaceholder: string;
  searchFunction?: ColumnEditorSearchFunction;
  columnEditorConfig: ColumnEditorConfig;
  contextHeaders: HeaderObject[];
  essentialAccessors?: ReadonlySet<string>;
  setHeaders: (headers: HeaderObject[]) => void;
  onColumnVisibilityChange?: (state: ColumnVisibilityState) => void;
  onColumnOrderChange?: (headers: HeaderObject[]) => void;
  resetColumns?: () => void;
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

function buildSearchSection(
  searchPlaceholder: string,
  onSearchInput: (value: string) => void,
): { wrapper: HTMLElement; input: HTMLInputElement } {
  const wrapper = document.createElement("div");
  wrapper.className = "st-column-editor-search-wrapper";

  const searchContainer = document.createElement("div");
  searchContainer.className = "st-column-editor-search";

  const input = document.createElement("input");
  input.type = "text";
  input.value = "";
  input.placeholder = searchPlaceholder;
  input.className = "st-filter-input";
  input.addEventListener("click", (e) => e.stopPropagation());
  input.addEventListener("input", (e) => {
    onSearchInput((e.target as HTMLInputElement).value);
  });

  searchContainer.appendChild(input);
  wrapper.appendChild(searchContainer);

  return { wrapper, input };
}

function buildResetSection(onReset: () => void): HTMLElement {
  const footer = document.createElement("div");
  footer.className = "st-column-editor-footer";

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "st-column-editor-reset-btn";
  resetBtn.textContent = "Reset columns";
  resetBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    onReset();
  });

  footer.appendChild(resetBtn);
  return footer;
}

function assembleDefaultLayout(
  content: HTMLElement,
  searchWrapper: HTMLElement | null,
  listsContainer: HTMLElement,
  resetFooter: HTMLElement | null,
): void {
  if (searchWrapper) content.appendChild(searchWrapper);
  content.appendChild(listsContainer);
  if (resetFooter) content.appendChild(resetFooter);
}

function assembleCustomLayout(
  content: HTMLElement,
  customRenderer: ColumnEditorCustomRenderer,
  headers: HeaderObject[],
  searchWrapper: HTMLElement | null,
  listsContainer: HTMLElement,
  resetFooter: HTMLElement | null,
  resetColumns?: () => void,
): void {
  const rendered = customRenderer({
    headers,
    searchSection: searchWrapper,
    listSection: listsContainer,
    resetSection: resetFooter,
    resetColumns,
  });

  if (rendered instanceof HTMLElement) {
    content.appendChild(rendered);
  } else if (typeof rendered === "string") {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = rendered;
    content.appendChild(wrapper);
  }
}

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
    essentialAccessors,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
    resetColumns,
  } = options;

  let searchTerm = "";
  let draggingRow: FlattenedHeader | null = null;
  let hoveredSeparatorIndex: number | null = null;
  let isDragging = false;

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

  const content = document.createElement("div");
  content.className = "st-column-editor-popout-content";
  content.addEventListener("click", (e) => e.stopPropagation());

  const onSearchInput = (value: string) => {
    searchTerm = value;
    render();
  };

  let searchInput: HTMLInputElement | null = null;
  let searchWrapper: HTMLElement | null = null;
  if (searchEnabled) {
    const search = buildSearchSection(searchPlaceholder, onSearchInput);
    searchWrapper = search.wrapper;
    searchInput = search.input;
  }

  const listsContainer = document.createElement("div");
  listsContainer.className = "st-column-editor-lists";

  let resetFooter: HTMLElement | null = null;
  if (resetColumns) {
    resetFooter = buildResetSection(resetColumns);
  }

  let activeCustomRenderer = columnEditorConfig.customRenderer;

  if (activeCustomRenderer) {
    assembleCustomLayout(
      content, activeCustomRenderer, headers,
      searchWrapper, listsContainer, resetFooter, resetColumns,
    );
  } else {
    assembleDefaultLayout(content, searchWrapper, listsContainer, resetFooter);
  }

  container.appendChild(content);

  const setDraggingRow = (row: FlattenedHeader | null) => {
    draggingRow = row;

    if (row !== null) {
      isDragging = true;
    } else {
      isDragging = false;
      render();
    }
  };

  const clearHoverSeparator = () => {
    hoveredSeparatorIndex = null;
  };

  const setHoveredSeparatorIndex = (index: number | null) => {
    hoveredSeparatorIndex = index;

    if (!isDragging) {
      render();
    } else {
      updateSeparatorVisibility();
    }
  };

  const setExpandedHeaders = (newHeaders: Set<string>) => {
    const previousExpandedHeaders = expandedHeaders;
    expandedHeaders = newHeaders;
    render(previousExpandedHeaders);
  };

  const updateSeparatorVisibility = () => {
    const separators = listsContainer.querySelectorAll(".st-column-editor-drag-separator");

    separators.forEach((separator, sepIndex) => {
      const htmlSeparator = separator as HTMLElement;

      if (sepIndex === 0) {
        htmlSeparator.style.opacity = hoveredSeparatorIndex === -1 ? "1" : "0";
      } else {
        const rowIndex = sepIndex - 1;
        htmlSeparator.style.opacity = hoveredSeparatorIndex === rowIndex ? "1" : "0";
      }
    });
  };

  const doesAnyHeaderHaveChildren = (sectionHeaders: HeaderObject[]) => {
    return sectionHeaders.some((header) => header.children && header.children.length > 0);
  };

  const getFlattenedHeaders = (sectionHeaders: HeaderObject[], panelSection: PanelSection): FlattenedHeader[] => {
    const filteredHeaders = searchEnabled
      ? filterHeaders(sectionHeaders, searchTerm, searchFunction)
      : sectionHeaders;

    const result: FlattenedHeader[] = [];
    const forceExpanded = searchEnabled && searchTerm.trim().length > 0;

    const flatten = ({
      headers: list,
      depth = 0,
      parent = null,
      currentPath = [],
    }: {
      headers: HeaderObject[];
      depth: number;
      parent: HeaderObject | null;
      currentPath: number[];
    }) => {
      list.forEach((header, index) => {
        if (header.isSelectionColumn || header.excludeFromRender) {
          return;
        }

        const visualIndex = result.length;
        const indexPath = [...currentPath, index];
        result.push({ header, visualIndex, depth, parent, indexPath, panelSection });

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

  const renderSection = (
    sectionHeaders: HeaderObject[],
    panelSection: PanelSection,
    label: string | null,
    targetContainer: HTMLElement,
    previousExpandedHeaders?: ReadonlySet<string>,
  ) => {
    if (sectionHeaders.length === 0) return;

    const visibleHeaders = sectionHeaders.filter(
      (h) => !h.isSelectionColumn && !h.excludeFromRender,
    );
    const filteredVisible = searchEnabled
      ? filterHeaders(visibleHeaders, searchTerm, searchFunction)
      : visibleHeaders;

    if (filteredVisible.length === 0) return;

    if (label) {
      const sectionLabel = document.createElement("div");
      sectionLabel.className = "st-column-editor-section-label";
      sectionLabel.textContent = label;
      targetContainer.appendChild(sectionLabel);
    }

    const listEl = document.createElement("div");
    listEl.className = "st-column-editor-list st-column-editor-list-section";
    targetContainer.appendChild(listEl);

    const flattenedHeaders = getFlattenedHeaders(sectionHeaders, panelSection);
    const hasChildren = doesAnyHeaderHaveChildren(sectionHeaders);

    flattenedHeaders.forEach((flatItem) => {
      const rowResult = createColumnEditorRow({
        allHeaders: headers,
        clearHoverSeparator,
        depth: flatItem.depth,
        doesAnyHeaderHaveChildren: hasChildren,
        draggingRow,
        getDraggingRow: () => draggingRow,
        getHoveredSeparatorIndex: () => hoveredSeparatorIndex,
        expandedHeaders,
        flattenedHeaders,
        forceExpanded: searchEnabled && searchTerm.trim().length > 0,
        header: flatItem.header,
        hoveredSeparatorIndex,
        panelSection,
        rowIndex: flatItem.visualIndex,
        setDraggingRow,
        setExpandedHeaders,
        setHoveredSeparatorIndex,
        columnEditorConfig,
        essentialAccessors: essentialAccessors ?? new Set(),
        headers: contextHeaders,
        setHeaders,
        onColumnVisibilityChange,
        onColumnOrderChange,
        previousExpandedHeaders,
      });

      listEl.appendChild(rowResult.fragment);
      rowResult.scheduleExpandIconAnimation?.();
    });
  };

  const render = (previousExpandedHeaders?: ReadonlySet<string>) => {
    listsContainer.innerHTML = "";

    const allowColumnPinning = columnEditorConfig.allowColumnPinning !== false;
    const { pinnedLeft, unpinned, pinnedRight } = partitionRootHeadersByPin(headers);

    if (allowColumnPinning) {
      renderSection(pinnedLeft, "left", "Pinned Left", listsContainer, previousExpandedHeaders);
      renderSection(unpinned, "main", null, listsContainer, previousExpandedHeaders);
      renderSection(pinnedRight, "right", "Pinned Right", listsContainer, previousExpandedHeaders);
    } else {
      const allHeaders = [...pinnedLeft, ...unpinned, ...pinnedRight];
      renderSection(allHeaders, "main", null, listsContainer, previousExpandedHeaders);
    }
  };

  render();

  const rebuildContentLayout = () => {
    content.innerHTML = "";

    if (activeCustomRenderer) {
      assembleCustomLayout(
        content, activeCustomRenderer, headers,
        searchWrapper, listsContainer, resetFooter, resetColumns,
      );
    } else {
      assembleDefaultLayout(content, searchWrapper, listsContainer, resetFooter);
    }
  };

  const update = (newOptions: Partial<CreateColumnEditorPopoutOptions>) => {
    if (newOptions.headers !== undefined) headers = newOptions.headers;
    if (newOptions.searchEnabled !== undefined) searchEnabled = newOptions.searchEnabled;
    if (newOptions.searchPlaceholder !== undefined)
      searchPlaceholder = newOptions.searchPlaceholder;
    if (newOptions.searchFunction !== undefined) searchFunction = newOptions.searchFunction;
    if (newOptions.contextHeaders !== undefined) contextHeaders = newOptions.contextHeaders;
    if (newOptions.essentialAccessors !== undefined) essentialAccessors = newOptions.essentialAccessors;
    if (newOptions.setHeaders !== undefined) setHeaders = newOptions.setHeaders;
    if (newOptions.onColumnVisibilityChange !== undefined)
      onColumnVisibilityChange = newOptions.onColumnVisibilityChange;
    if (newOptions.onColumnOrderChange !== undefined)
      onColumnOrderChange = newOptions.onColumnOrderChange;
    if (newOptions.resetColumns !== undefined) resetColumns = newOptions.resetColumns;

    let needsLayoutRebuild = false;

    if (newOptions.columnEditorConfig !== undefined) {
      const newCustomRenderer = newOptions.columnEditorConfig.customRenderer;
      if (newCustomRenderer !== activeCustomRenderer) {
        activeCustomRenderer = newCustomRenderer;
        needsLayoutRebuild = true;
      }
      columnEditorConfig = newOptions.columnEditorConfig;
    }

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

    if (needsLayoutRebuild) {
      rebuildContentLayout();
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
