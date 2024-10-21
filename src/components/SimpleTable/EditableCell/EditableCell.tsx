import { ChangeEvent } from "react";
import BooleanEdit from "./BooleanEdit";
import TextEdit from "./TextEdit";
import CellChangeProps from "../../../types/CellChangeProps";
import CellValue from "../../../types/CellValue";

interface EditableCellProps {
  onChange: (newValue: CellValue) => void;
  setIsEditing: (isEditing: boolean) => void;
  value: CellValue;
}

const EditableCell = ({ onChange, setIsEditing, value }: EditableCellProps) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    onChange?.(newValue);
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
