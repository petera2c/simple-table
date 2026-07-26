import Row from "./Row";
import type { RowData } from "./Row";

export interface RowButtonProps<TData extends RowData = Row> {
  row: TData;
  rowIndex: number; // The position of the row in the table
}

// BREAKING CHANGE: RowButton now returns HTMLElement instead of ReactNode
// Users must provide vanilla JS functions that create DOM elements
// Example:
//   rowButtons={[(props) => {
//     const button = document.createElement('button');
//     button.textContent = 'Edit';
//     button.onclick = () => handleEdit(props.row);
//     return button;
//   }]}
export type RowButton<TData extends RowData = Row> = (
  props: RowButtonProps<TData>
) => HTMLElement | null;
