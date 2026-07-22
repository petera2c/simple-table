import ColumnDef from "../../types/ColumnDef";
import { ColumnEditorSearchFunction, ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import { ColumnEditorCustomRenderer } from "../../types/ColumnEditorCustomRendererProps";
import { FlattenedHeader } from "../../types/FlattenedHeader";
import { createColumnEditorRow } from "./createColumnEditorRow";
import { HoveredSeparator } from "./columnEditorUtils";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { IconsConfig } from "../../types/IconsConfig";
import { partitionRootHeadersByPin, PanelSection } from "../../utils/pinnedColumnUtils";

export interface CreateColumnEditorPopoutOptions {
  headers: ColumnDef[];
  open: boolean;
  searchEnabled: boolean;
  searchPlaceholder: string;
  searchFunction?: ColumnEditorSearchFunction;
  columnEditorConfig: ColumnEditorConfig;
  icons?: IconsConfig;
  essentialAccessors?: ReadonlySet<string>;
  setHeaders: (headers: ColumnDef[]) => void;
  onColumnVisibilityChange?: (state: ColumnVisibilityState) => void;
  onColumnOrderChange?: (headers: ColumnDef[]) => void;
  resetColumns?: () => void;
}

const defaultHeaderMatchesSearch = (header: ColumnDef, searchTerm: string): boolean => {
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
  headers: ColumnDef[],
  searchTerm: string,
  searchFunction?: ColumnEditorSearchFunction,
): ColumnDef[] => {
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
  headers: ColumnDef[],
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
    icons,
    essentialAccessors,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
    resetColumns,
  } = options;

  let searchTerm = "";
  let draggingRow: FlattenedHeader | null = null;
  let hoveredSeparator: HoveredSeparator = null;
  let isDragging = false;

  const initialExpanded = new Set<string>();
  const collectAccessors = (headerList: ColumnDef[]) => {
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
    hoveredSeparator = null;
  };

  const setHoveredSeparator = (value: HoveredSeparator) => {
    hoveredSeparator = value;

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
    // Separators are scoped per section list. Within a section the separator
    // order is [top, after-row-0, after-row-1, ...], so sepIndex - 1 maps to the
    // section-relative index the row builder uses (-1 = top). The hovered index
    // is only valid for its own panel section, so non-hovered sections clear.
    const sectionLists = listsContainer.querySelectorAll<HTMLElement>(
      ".st-column-editor-list-section",
    );

    sectionLists.forEach((listEl) => {
      const section = listEl.dataset.panelSection as PanelSection | undefined;
      const isHoveredSection = hoveredSeparator !== null && hoveredSeparator.panelSection === section;
      const separators = listEl.querySelectorAll<HTMLElement>(".st-column-editor-drag-separator");

      separators.forEach((separator, sepIndex) => {
        const sepRowIndex = sepIndex - 1;
        separator.style.opacity =
          isHoveredSection && hoveredSeparator!.index === sepRowIndex ? "1" : "0";
      });
    });
  };

  const doesAnyHeaderHaveChildren = (sectionHeaders: ColumnDef[]) => {
    return sectionHeaders.some((header) => header.children && header.children.length > 0);
  };

  const getFlattenedHeaders = (sectionHeaders: ColumnDef[], panelSection: PanelSection): FlattenedHeader[] => {
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
      headers: ColumnDef[];
      depth: number;
      parent: ColumnDef | null;
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
    sectionHeaders: ColumnDef[],
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
    listEl.dataset.panelSection = panelSection;
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
        getHoveredSeparator: () => hoveredSeparator,
        expandedHeaders,
        flattenedHeaders,
        forceExpanded: searchEnabled && searchTerm.trim().length > 0,
        header: flatItem.header,
        hoveredSeparator,
        panelSection,
        rowIndex: flatItem.visualIndex,
        setDraggingRow,
        setExpandedHeaders,
        setHoveredSeparator,
        columnEditorConfig,
        icons,
        essentialAccessors: essentialAccessors ?? new Set(),
        headers,
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
      renderSection(unpinned, "main", "Main", listsContainer, previousExpandedHeaders);
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
    if (newOptions.icons !== undefined) icons = newOptions.icons;
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
