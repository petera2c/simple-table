import { useMemo, useState } from "react";
import HeaderObject from "../../../types/HeaderObject";
import ColumnEditorCheckbox from "./ColumnEditorCheckbox";
import { ColumnEditorSearchFunction } from "../../../types/ColumnEditorConfig";
import { FlattenedHeader } from "./columnEditorUtils";

type TableColumnEditorPopoutProps = {
  headers: HeaderObject[];
  open: boolean;
  searchEnabled: boolean;
  searchPlaceholder: string;
  searchFunction?: ColumnEditorSearchFunction;
};

// Default search function - checks if a header or any of its children match the search term
const defaultHeaderMatchesSearch = (header: HeaderObject, searchTerm: string): boolean => {
  const lowerSearch = searchTerm.toLowerCase();

  // Check if the current header matches
  if (header.label.toLowerCase().includes(lowerSearch)) {
    return true;
  }

  // Check if any children match
  if (header.children && header.children.length > 0) {
    return header.children.some((child) => defaultHeaderMatchesSearch(child, searchTerm));
  }

  return false;
};

// Helper function to filter headers based on search term
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

const TableColumnEditorPopout = ({
  headers,
  open,
  searchEnabled,
  searchPlaceholder,
  searchFunction,
}: TableColumnEditorPopoutProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [draggingRow, setDraggingRow] = useState<FlattenedHeader | null>(null);
  const [hoveredSeparatorIndex, setHoveredSeparatorIndex] = useState<number | null>(null);

  // Initialize with all headers expanded by default
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

  const flattenedHeaders = useMemo(() => {
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
        // Skip selection columns and excluded headers
        if (header.isSelectionColumn || header.excludeFromRender) {
          return;
        }

        const visualIndex = result.length;
        const indexPath = [...currentPath, index];
        result.push({ header, visualIndex, depth, parent, indexPath });

        // Check if this header should be expanded
        const hasChildren = header.children && header.children.length > 0;
        const shouldExpand = forceExpanded || expandedHeaders.has(header.accessor);

        // Recursively flatten children if expanded
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
  }, [filteredHeaders, expandedHeaders, searchEnabled, searchTerm]);

  return (
    <div
      className={`st-column-editor-popout ${open ? "open" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="st-column-editor-popout-content">
        {searchEnabled && (
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
        )}
        <div className="st-column-editor-list">
          {flattenedHeaders.map((flatItem) => (
            <ColumnEditorCheckbox
              doesAnyHeaderHaveChildren={doesAnyHeaderHaveChildren}
              key={`${flatItem.header.accessor}-${flatItem.visualIndex}`}
              header={flatItem.header}
              allHeaders={headers}
              depth={flatItem.depth}
              forceExpanded={searchEnabled && searchTerm.trim().length > 0}
              rowIndex={flatItem.visualIndex}
              draggingRow={draggingRow}
              setDraggingRow={setDraggingRow}
              hoveredSeparatorIndex={hoveredSeparatorIndex}
              setHoveredSeparatorIndex={setHoveredSeparatorIndex}
              expandedHeaders={expandedHeaders}
              setExpandedHeaders={setExpandedHeaders}
              flattenedHeaders={flattenedHeaders}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableColumnEditorPopout;
