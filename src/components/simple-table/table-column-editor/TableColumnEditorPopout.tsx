import { useMemo, useState } from "react";
import HeaderObject from "../../../types/HeaderObject";
import ColumnEditorCheckbox from "./ColumnEditorCheckbox";
import { ColumnEditorSearchFunction } from "../../../types/ColumnEditorConfig";

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
  searchFunction?: ColumnEditorSearchFunction
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
  const doesAnyHeaderHaveChildren = useMemo(
    () => headers.some((header) => header.children && header.children.length > 0),
    [headers]
  );

  const filteredHeaders = useMemo(
    () => (searchEnabled ? filterHeaders(headers, searchTerm, searchFunction) : headers),
    [headers, searchTerm, searchEnabled, searchFunction]
  );

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
          {filteredHeaders.map((header, index) => {
            if (header.isSelectionColumn || header.excludeFromRender) {
              return null;
            }
            return (
              <ColumnEditorCheckbox
                doesAnyHeaderHaveChildren={doesAnyHeaderHaveChildren}
                key={`${header.accessor}-${index}`}
                header={header}
                allHeaders={headers}
                forceExpanded={searchEnabled && searchTerm.trim().length > 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TableColumnEditorPopout;
