import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import HeaderObject from "../types/HeaderObject";
import Cell from "../types/Cell";

export type MouseDownProps = {
  rowIndex: number;
  colIndex: number;
};

const useSelection = ({
  selectableCells,
  headers,
  rows,
}: {
  selectableCells: boolean;
  headers: HeaderObject[];
  rows: { [key: string]: any }[];
}) => {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const isSelecting = useRef(false);
  const startCell = useRef<Cell | null>(null);

  const copyToClipboard = useCallback(() => {
    const rowsText = Array.from(selectedCells).reduce((acc, cellKey) => {
      const [row, col] = cellKey.split("-").map(Number);
      if (!acc[row]) acc[row] = [];
      acc[row][col] = rows[row][headers[col].accessor];
      return acc;
    }, {} as { [key: number]: { [key: number]: any } });

    const text = Object.values(rowsText)
      .map((row) => Object.values(row).join("\t"))
      .join("\n");

    if (selectedCells.size > 0) {
      navigator.clipboard.writeText(text);
    }
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
  }, [copyToClipboard]);

  const handleMouseDown = ({ colIndex, rowIndex }: MouseDownProps) => {
    if (!selectableCells) return;
    isSelecting.current = true;
    startCell.current = { row: rowIndex, col: colIndex };
    setSelectedCells(new Set([`${rowIndex}-${colIndex}`]));
  };

  const handleMouseOver = (rowIndex: number, colIndex: number) => {
    if (!selectableCells) return;
    if (isSelecting.current && startCell.current) {
      const newSelectedCells = new Set<string>();
      const startRow = Math.min(startCell.current.row, rowIndex);
      const endRow = Math.max(startCell.current.row, rowIndex);
      const startCol = Math.min(startCell.current.col, colIndex);
      const endCol = Math.max(startCell.current.col, colIndex);

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          newSelectedCells.add(`${row}-${col}`);
        }
      }
      setSelectedCells(newSelectedCells);
    }
  };

  const handleMouseUp = () => {
    isSelecting.current = false;
    startCell.current = null;
  };

  const isSelected = useCallback(
    (rowIndex: number, colIndex: number) => {
      return selectedCells.has(`${rowIndex}-${colIndex}`);
    },
    [selectedCells]
  );

  const getBorderClass = useCallback(
    (rowIndex: number, colIndex: number) => {
      const classes = [];
      if (!isSelected(rowIndex - 1, colIndex)) classes.push("st-selected-top-border");
      if (!isSelected(rowIndex + 1, colIndex)) classes.push("st-selected-bottom-border");
      if (!isSelected(rowIndex, colIndex - 1)) classes.push("st-selected-left-border");
      if (!isSelected(rowIndex, colIndex + 1)) classes.push("st-selected-right-border");
      return classes.join(" ");
    },
    [isSelected]
  );

  const isTopLeftCell = useMemo(() => {
    const minRow = Math.min(...Array.from(selectedCells).map((cell) => parseInt(cell.split("-")[0])));
    const minCol = Math.min(...Array.from(selectedCells).map((cell) => parseInt(cell.split("-")[1])));
    return (rowIndex: number, colIndex: number) => rowIndex === minRow && colIndex === minCol;
  }, [selectedCells]);

  return {
    selectedCells,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isSelected,
    getBorderClass,
    isTopLeftCell,
    setSelectedCells,
  };
};

export default useSelection;
