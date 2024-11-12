/// <reference types="react" />
import HeaderObject from "../types/HeaderObject";
export type MouseDownProps = {
    rowIndex: number;
    colIndex: number;
};
declare const useSelection: ({ selectableCells, headers, rows, }: {
    selectableCells: boolean;
    headers: HeaderObject[];
    rows: {
        [key: string]: any;
    }[];
}) => {
    selectedCells: Set<string>;
    handleMouseDown: ({ colIndex, rowIndex }: MouseDownProps) => void;
    handleMouseOver: (rowIndex: number, colIndex: number) => void;
    handleMouseUp: () => void;
    isSelected: (rowIndex: number, colIndex: number) => boolean;
    getBorderClass: (rowIndex: number, colIndex: number) => string;
    isTopLeftCell: (rowIndex: number, colIndex: number) => boolean;
    setSelectedCells: import("react").Dispatch<import("react").SetStateAction<Set<string>>>;
};
export default useSelection;
