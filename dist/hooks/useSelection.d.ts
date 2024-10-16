/// <reference types="react" />
import HeaderObject from "../types/HeaderObject";
interface Cell {
    row: number;
    col: number;
}
declare const useSelection: (rows: {
    [key: string]: any;
}[], headers: HeaderObject[]) => {
    selectedCells: Cell[];
    handleMouseDown: (rowIndex: number, colIndex: number) => void;
    handleMouseOver: (rowIndex: number, colIndex: number) => void;
    handleMouseUp: () => void;
    isSelected: (rowIndex: number, colIndex: number) => boolean;
    getBorderClass: (rowIndex: number, colIndex: number) => string;
    isTopLeftCell: (rowIndex: number, colIndex: number) => boolean;
    setSelectedCells: import("react").Dispatch<import("react").SetStateAction<Cell[]>>;
};
export default useSelection;
