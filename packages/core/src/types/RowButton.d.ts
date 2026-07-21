import Row from "./Row";
export interface RowButtonProps {
    row: Row;
    rowIndex: number;
}
export type RowButton = (props: RowButtonProps) => HTMLElement | null;
