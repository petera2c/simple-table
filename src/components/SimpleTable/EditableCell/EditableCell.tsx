import { ChangeEvent } from "react";
import BooleanEdit from "./BooleanEdit";
import TextEdit from "./TextEdit";
import CellChangeProps from "../../../types/CellChangeProps";
import CellValue from "../../../types/CellValue";

interface EditableCellProps {
  accessor: string;
  onCellChange?: (props: CellChangeProps) => void;
  originalRowIndex: number;
  row: { [key: string]: CellValue };
  rowIndex: number;
  setIsEditing: (isEditing: boolean) => void;
  value: CellValue;
}

const EditableCell = ({
  accessor,
  onCellChange,
  originalRowIndex,
  row,
  rowIndex,
  setIsEditing,
  value,
}: EditableCellProps) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    onCellChange?.({
      accessor,
      newRowIndex: rowIndex,
      newValue,
      originalRowIndex,
      row,
    });
  };
  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <>
      {typeof value === "string" ? (
        <TextEdit
          defaultValue={value}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ) : typeof value === "boolean" ? (
        <BooleanEdit
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ) : null}
    </>
  );
};

export default EditableCell;
