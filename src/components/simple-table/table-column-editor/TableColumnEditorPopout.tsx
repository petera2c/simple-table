import { ReactNode, useMemo, useState } from "react";
import HeaderObject from "../../../types/HeaderObject";
import ColumnEditorCheckbox from "./ColumnEditorCheckbox";
import {
  ColumnEditorCustomRenderer,
  ColumnEditorSearchFunction,
} from "../../../types/ColumnEditorConfig";
import { FlattenedHeader, flattenHeadersForPanelSection } from "./columnEditorUtils";
import { useTableContext } from "../../../context/TableContext";
import { partitionRootHeadersByPin, type PanelSection } from "../../../utils/pinnedColumnUtils";

type TableColumnEditorPopoutProps = {
  headers: HeaderObject[];
  open: boolean;
  searchEnabled: boolean;
  searchPlaceholder: string;
  searchFunction?: ColumnEditorSearchFunction;
  customRenderer?: ColumnEditorCustomRenderer;
};

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

type HoverSepState = { section: PanelSection; index: number | null } | null;

function renderSectionList({
  title,
  panelSection,
  doesAnyHeaderHaveChildren,
  allHeaders,
  expandedHeaders,
  setExpandedHeaders,
  forceExpanded,
  draggingRow,
  setDraggingRow,
  hoverSep,
  setHoverSep,
  flattenedForSection,
}: {
  title: string;
  panelSection: PanelSection;
  doesAnyHeaderHaveChildren: boolean;
  allHeaders: HeaderObject[];
  expandedHeaders: Set<string>;
  setExpandedHeaders: (s: Set<string>) => void;
  forceExpanded: boolean;
  draggingRow: FlattenedHeader | null;
  setDraggingRow: (row: FlattenedHeader | null) => void;
  hoverSep: HoverSepState;
  setHoverSep: (s: HoverSepState) => void;
  flattenedForSection: FlattenedHeader[];
}): ReactNode {
  const hoveredSeparatorIndex = hoverSep?.section === panelSection ? hoverSep.index : null;

  const setHoveredSeparatorIndex = (index: number | null) => {
    if (index === null) {
      setHoverSep(null);
    } else {
      setHoverSep({ section: panelSection, index });
    }
  };

  return (
    <div className="st-column-editor-section" data-panel-section={panelSection}>
      <div className="st-column-editor-section-label">{title}</div>
      <div className="st-column-editor-list st-column-editor-list-section">
        {flattenedForSection.map((flatItem) => (
          <ColumnEditorCheckbox
            allHeaders={allHeaders}
            clearHoverSeparator={() => setHoverSep(null)}
            doesAnyHeaderHaveChildren={doesAnyHeaderHaveChildren}
            key={`${panelSection}-${flatItem.header.accessor}-${flatItem.visualIndex}`}
            depth={flatItem.depth}
            draggingRow={draggingRow}
            expandedHeaders={expandedHeaders}
            flattenedHeaders={flattenedForSection}
            forceExpanded={forceExpanded}
            header={flatItem.header}
            hoveredSeparatorIndex={hoveredSeparatorIndex}
            panelSection={panelSection}
            rowIndex={flatItem.visualIndex}
            setDraggingRow={setDraggingRow}
            setExpandedHeaders={setExpandedHeaders}
            setHoveredSeparatorIndex={setHoveredSeparatorIndex}
          />
        ))}
      </div>
    </div>
  );
}

const TableColumnEditorPopout = ({
  headers,
  open,
  searchEnabled,
  searchPlaceholder,
  searchFunction,
  customRenderer,
}: TableColumnEditorPopoutProps) => {
  const { resetColumns } = useTableContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [draggingRow, setDraggingRow] = useState<FlattenedHeader | null>(null);
  const [hoverSep, setHoverSep] = useState<HoverSepState>(null);

  const [expandedHeaders, setExpandedHeaders] = useState<Set<string>>(() => {
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
    return initialExpanded;
  });

  const doesAnyHeaderHaveChildren = useMemo(
    () => headers.some((header) => header.children && header.children.length > 0),
    [headers],
  );

  const filteredHeaders = useMemo(
    () => (searchEnabled ? filterHeaders(headers, searchTerm, searchFunction) : headers),
    [headers, searchTerm, searchEnabled, searchFunction],
  );

  const { pinnedLeft, unpinned, pinnedRight } = useMemo(
    () => partitionRootHeadersByPin(filteredHeaders),
    [filteredHeaders],
  );

  const forceExpanded = searchEnabled && searchTerm.trim().length > 0;

  const flatLeft = useMemo(
    () =>
      flattenHeadersForPanelSection({
        sectionRoots: pinnedLeft,
        fullRootHeaders: headers,
        panelSection: "left",
        expandedHeaders,
        forceExpanded,
      }),
    [pinnedLeft, headers, expandedHeaders, forceExpanded],
  );

  const flatMain = useMemo(
    () =>
      flattenHeadersForPanelSection({
        sectionRoots: unpinned,
        fullRootHeaders: headers,
        panelSection: "main",
        expandedHeaders,
        forceExpanded,
      }),
    [unpinned, headers, expandedHeaders, forceExpanded],
  );

  const flatRight = useMemo(
    () =>
      flattenHeadersForPanelSection({
        sectionRoots: pinnedRight,
        fullRootHeaders: headers,
        panelSection: "right",
        expandedHeaders,
        forceExpanded,
      }),
    [pinnedRight, headers, expandedHeaders, forceExpanded],
  );

  const flattenedHeadersAll = useMemo(
    () => [...flatLeft, ...flatMain, ...flatRight],
    [flatLeft, flatMain, flatRight],
  );

  const searchSection = searchEnabled ? (
    <div className="st-column-editor-search-wrapper">
      <div className="st-column-editor-search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchPlaceholder}
          className="st-filter-input"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  ) : null;

  const pinnedLeftList =
    pinnedLeft.length > 0
      ? renderSectionList({
          title: "Pinned left",
          panelSection: "left",
          doesAnyHeaderHaveChildren,
          allHeaders: headers,
          expandedHeaders,
          setExpandedHeaders,
          forceExpanded,
          draggingRow,
          setDraggingRow,
          hoverSep,
          setHoverSep,
          flattenedForSection: flatLeft,
        })
      : null;

  const unpinnedList = renderSectionList({
    title: "Columns",
    panelSection: "main",
    doesAnyHeaderHaveChildren,
    allHeaders: headers,
    expandedHeaders,
    setExpandedHeaders,
    forceExpanded,
    draggingRow,
    setDraggingRow,
    hoverSep,
    setHoverSep,
    flattenedForSection: flatMain,
  });

  const pinnedRightList =
    pinnedRight.length > 0
      ? renderSectionList({
          title: "Pinned right",
          panelSection: "right",
          doesAnyHeaderHaveChildren,
          allHeaders: headers,
          expandedHeaders,
          setExpandedHeaders,
          forceExpanded,
          draggingRow,
          setDraggingRow,
          hoverSep,
          setHoverSep,
          flattenedForSection: flatRight,
        })
      : null;

  const listSection = (
    <div className="st-column-editor-lists">
      {pinnedLeftList}
      {unpinnedList}
      {pinnedRightList}
    </div>
  );

  const content = customRenderer ? (
    customRenderer({
      searchSection,
      listSection,
      pinnedLeftList,
      unpinnedList,
      pinnedRightList,
      flattenedHeaders: flattenedHeadersAll,
      searchTerm,
      setSearchTerm,
      searchEnabled,
      searchPlaceholder,
      headers,
      resetColumns,
    })
  ) : (
    <>
      {searchSection}
      {listSection}
    </>
  );

  return (
    <div
      className={`st-column-editor-popout ${open ? "open" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="st-column-editor-popout-content">{content}</div>
    </div>
  );
};

export default TableColumnEditorPopout;
