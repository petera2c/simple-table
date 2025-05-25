import { useEffect } from "react";

const useHandleOutsideClick = ({
  selectableColumns,
  selectedCells,
  selectedColumns,
  setSelectedCells,
  setSelectedColumns,
}: {
  selectableColumns: boolean;
  selectedCells: Set<string>;
  selectedColumns: Set<number>;
  setSelectedCells: (cells: Set<string>) => void;
  setSelectedColumns: (columns: Set<number>) => void;
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".st-cell") &&
        (selectableColumns
          ? !target.classList.contains("st-header-cell") &&
            !target.classList.contains("st-header-label")
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
  }, [selectableColumns, selectedCells, selectedColumns, setSelectedCells, setSelectedColumns]);
};

export default useHandleOutsideClick;
