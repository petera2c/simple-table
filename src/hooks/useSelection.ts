import { useState, useRef, useEffect, useCallback } from "react";
import HeaderObject from "../types/HeaderObject";

interface Cell {
  row: number;
  col: number;
}

const useSelection = (
  rows: { [key: string]: any }[],
  headers: HeaderObject[]
) => {
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const isSelecting = useRef(false);
  const startCell = useRef<Cell | null>(null);

  const copyToClipboard = useCallback(() => {
    const rowsText = selectedCells.reduce((acc, { row, col }) => {
      if (!acc[row]) acc[row] = [];
      acc[row][col] = rows[row][headers[col].accessor];
      return acc;
    }, {} as { [key: number]: { [key: number]: any } });

    const text = Object.values(rowsText)
      .map((row) => Object.values(row).join("\t"))
      .join("\n");

    navigator.clipboard.writeText(text);
  }, [selectedCells, rows, headers]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        copyToClipboard();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [copyToClipboard, selectedCells]);

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    isSelecting.current = true;
    startCell.current = { row: rowIndex, col: colIndex };
    setSelectedCells([{ row: rowIndex, col: colIndex }]);
  };

  const handleMouseOver = (rowIndex: number, colIndex: number) => {
    if (isSelecting.current && startCell.current) {
      const newSelectedCells = [];
      const startRow = Math.min(startCell.current.row, rowIndex);
      const endRow = Math.max(startCell.current.row, rowIndex);
      const startCol = Math.min(startCell.current.col, colIndex);
      const endCol = Math.max(startCell.current.col, colIndex);

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          newSelectedCells.push({ row, col });
        }
      }
      setSelectedCells(newSelectedCells);
    }
  };

  const handleMouseUp = () => {
    isSelecting.current = false;
    startCell.current = null;
  };

  const isSelected = (rowIndex: number, colIndex: number) => {
    return selectedCells.some(
      (cell) => cell.row === rowIndex && cell.col === colIndex
    );
  };

  const getBorderClass = (rowIndex: number, colIndex: number) => {
    const classes = [];
    if (!isSelected(rowIndex - 1, colIndex)) classes.push("border-top-blue");
    if (!isSelected(rowIndex + 1, colIndex)) classes.push("border-bottom-blue");
    if (!isSelected(rowIndex, colIndex - 1)) classes.push("border-left-blue");
    if (!isSelected(rowIndex, colIndex + 1)) classes.push("border-right-blue");
    return classes.join(" ");
  };

  const isTopLeftCell = (rowIndex: number, colIndex: number) => {
    return (
      rowIndex === Math.min(...selectedCells.map((cell) => cell.row)) &&
      colIndex === Math.min(...selectedCells.map((cell) => cell.col))
    );
  };

  return {
    selectedCells,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isSelected,
    getBorderClass,
    isTopLeftCell,
  };
};

export default useSelection;
