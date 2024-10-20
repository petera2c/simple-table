import { ChangeEvent } from "react";
import BooleanEdit from "./BooleanEdit";
import TextEdit from "./TextEdit";
import CellChangeProps from "../../../types/CellChangeProps";

interface EditableCellProps {
  colIndex: number;
  onCellChange?: (props: CellChangeProps) => void;
  rowIndex: number;
  setIsEditing: (isEditing: boolean) => void;
  value: string | boolean;
  row: any;
}

const EditableCell = ({
  colIndex,
  onCellChange,
  rowIndex,
  setIsEditing,
  value,
  row,
}: EditableCellProps) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    onCellChange?.({
      colIndex,
      newValue,
      row,
      rowIndex,
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
