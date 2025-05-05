import BooleanDropdownEdit from "./BooleanDropdownEdit";
import StringEdit from "./StringEdit";
import CellValue from "../../../types/CellValue";
import NumberEdit from "./NumberEdit";
import DateDropdownEdit from "./DateDropdownEdit";
import EnumDropdownEdit from "./EnumDropdownEdit";

interface EditableCellProps {
  enumOptions?: string[];
  onChange: (newValue: CellValue) => void;
  setIsEditing: (isEditing: boolean) => void;
  type?: "string" | "number" | "boolean" | "date" | "enum";
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
    const dateValue = typeof value === "string" ? value : "";
    return (
      <DateDropdownEdit
        onBlur={handleBlur}
        onChange={(val: string) => onChange(val)}
        open
        setOpen={setIsEditing}
        value={dateValue}
      />
    );
  }

  if (type === "enum") {
    const enumValue = typeof value === "string" ? value : "";
    return (
      <EnumDropdownEdit
        onBlur={handleBlur}
        onChange={(val: string) => onChange(val)}
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
  return (
    <StringEdit
      defaultValue={stringValue}
      onBlur={handleBlur}
      onChange={(val: string) => onChange(val)}
    />
  );
};

export default EditableCell;
