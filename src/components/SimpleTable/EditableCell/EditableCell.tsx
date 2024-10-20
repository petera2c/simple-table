import { ChangeEvent } from "react";
import BooleanEdit from "./BooleanEdit";
import TextEdit from "./TextEdit";

interface EditableCellProps {
  onChange: (newValue: string | boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  value: string | boolean;
}

const EditableCell = ({ onChange, setIsEditing, value }: EditableCellProps) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    onChange(typeof value === "boolean" ? newValue === "true" : newValue);
  };
  const handleBlur = () => {
    // setIsEditing(false);
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
