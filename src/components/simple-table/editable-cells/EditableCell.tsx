import BooleanDropdownEdit from "./BooleanDropdownEdit";
import StringEdit from "./StringEdit";
import CellValue from "../../../types/CellValue";
import NumberEdit from "./NumberEdit";
import DateDropdownEdit from "./DateDropdownEdit";
import EnumDropdownEdit from "./EnumDropdownEdit";
import EnumOption from "../../../types/EnumOption";
import { ColumnType } from "../../../types/HeaderObject";

interface EditableCellProps {
  enumOptions?: EnumOption[];
  onChange: (newValue: CellValue) => void;
  setIsEditing: (isEditing: boolean) => void;
  type?: ColumnType;
  value: CellValue;
}

const EditableCell = ({
  enumOptions = [],
  onChange,
  setIsEditing,
  type = "string",
  value,
}: EditableCellProps) => {
  const handleBlur = () => {
    setIsEditing(false);
  };

  // Determine which editor to use based on the type and infer value types
  if (type === "boolean" && typeof value === "boolean") {
    return (
      <BooleanDropdownEdit
        onBlur={handleBlur}
        onChange={(val: boolean) => onChange(val)}
        open
        setOpen={setIsEditing}
        value={value}
      />
    );
  }

  if (type === "date") {
    return (
      <DateDropdownEdit
        onBlur={handleBlur}
        onChange={onChange}
        open
        setOpen={setIsEditing}
        value={value}
      />
    );
  }

  if (type === "enum") {
    const enumValue = typeof value === "string" ? value : "";
    return (
      <EnumDropdownEdit
        onBlur={handleBlur}
        onChange={onChange}
        open
        options={enumOptions}
        setOpen={setIsEditing}
        value={enumValue}
      />
    );
  }

  if (type === "number" && typeof value === "number") {
    return (
      <NumberEdit
        defaultValue={value}
        onBlur={handleBlur}
        onChange={(val: string) => {
          // Convert string back to number for storage
          const numVal = val === "" ? 0 : parseFloat(val);
          onChange(isNaN(numVal) ? 0 : numVal);
        }}
      />
    );
  }

  // Default to string type
  const stringValue = value === null || value === undefined ? "" : String(value);
  return <StringEdit defaultValue={stringValue} onBlur={handleBlur} onChange={onChange} />;
};

export default EditableCell;
