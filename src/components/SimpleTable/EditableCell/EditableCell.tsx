import { ChangeEvent } from "react";
import BooleanEdit from "./BooleanEdit";
import TextEdit from "./TextEdit";
import CellChangeProps from "../../../types/CellChangeProps";

interface EditableCellProps {
  accessor: string;
  onCellChange?: (props: CellChangeProps) => void;
  row: { [key: string]: any };
  rowIndex: number;
  setIsEditing: (isEditing: boolean) => void;
  value: string | boolean;
}

const EditableCell = ({
  accessor,
  onCellChange,
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
      newRowIndex: rowIndex,
      newValue,
      originalRowIndex: rowIndex,
      row,
      accessor,
    });
  };
  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <>
      {typeof value === "boolean" ? (
        <BooleanEdit
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ) : (
        <TextEdit
          defaultValue={value}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default EditableCell;
