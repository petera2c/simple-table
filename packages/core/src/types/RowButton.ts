import Row from "./Row";

export interface RowButtonProps {
  row: Row;
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
export type RowButton = (props: RowButtonProps) => HTMLElement | null;
