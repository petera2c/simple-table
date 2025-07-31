import { useEffect } from "react";
import HeaderObject from "../types/HeaderObject";

const useHandleOutsideClick = ({
  selectableColumns,
  selectedCells,
  selectedColumns,
  setSelectedCells,
  setSelectedColumns,
  activeHeaderDropdown,
  setActiveHeaderDropdown,
}: {
  selectableColumns: boolean;
  selectedCells: Set<string>;
  selectedColumns: Set<number>;
  setSelectedCells: (cells: Set<string>) => void;
  setSelectedColumns: (columns: Set<number>) => void;
  activeHeaderDropdown?: HeaderObject | null;
  setActiveHeaderDropdown?: (header: HeaderObject | null) => void;
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the click is inside an editable header input - if so, don't handle outside click
      if (target.closest(".editable-cell-input") && target.closest(".st-header-cell")) {
        return;
      }

      // Close header dropdown if clicking outside of it
      if (activeHeaderDropdown && setActiveHeaderDropdown) {
        if (!target.closest(".st-header-cell") && !target.closest(".dropdown-content")) {
          setActiveHeaderDropdown(null);
        }
      }

      if (
        !target.closest(".st-cell") &&
        (selectableColumns
          ? !target.classList.contains("st-header-cell") &&
            !target.classList.contains("st-header-label") &&
            !target.classList.contains("st-header-label-text")
          : true)
      ) {
        // Check if there actually are any selected cells
        if (selectedCells.size > 0) {
          setSelectedCells(new Set());
        }
        if (selectedColumns.size > 0) {
          setSelectedColumns(new Set());
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    selectableColumns,
    selectedCells,
    selectedColumns,
    setSelectedCells,
    setSelectedColumns,
    activeHeaderDropdown,
    setActiveHeaderDropdown,
  ]);
};

export default useHandleOutsideClick;
