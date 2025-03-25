import BooleanEdit from "./BooleanEdit";
import StringEdit from "./StringEdit";
import CellValue from "../../../types/CellValue";
import NumberEdit from "./NumberEdit";

interface EditableCellProps {
  onChange: (newValue: CellValue) => void;
  setIsEditing: (isEditing: boolean) => void;
  value: CellValue;
}

const EditableCell = ({ onChange, setIsEditing, value }: EditableCellProps) => {
  const handleChange = (value: string | boolean | number) => {
    onChange?.(value);
  };
  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <>
      {typeof value === "string" || value === null || value === undefined ? (
        <StringEdit
          defaultValue={value}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ) : typeof value === "boolean" ? (
        <BooleanEdit
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
        />
      ) : typeof value === "number" ? (
        <NumberEdit
          defaultValue={value}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ) : null}
    </>
  );
};

export default EditableCell;
