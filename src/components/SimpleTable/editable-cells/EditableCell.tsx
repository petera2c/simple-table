import BooleanEdit from "./BooleanEdit";
import BooleanDropdownEdit from "./BooleanDropdownEdit";
import StringEdit from "./StringEdit";
import CellValue from "../../../types/CellValue";
import NumberEdit from "./NumberEdit";
import DateDropdownEdit from "./DateDropdownEdit";
import EnumDropdownEdit from "./EnumDropdownEdit";

interface EditableCellProps {
  onChange: (newValue: CellValue) => void;
  setIsEditing: (isEditing: boolean) => void;
  value: CellValue;
  type?: "string" | "number" | "boolean" | "date" | "enum";
  enumOptions?: string[];
  useDropdown?: boolean;
}

const EditableCell = ({
  onChange,
  setIsEditing,
  value,
  type = "string",
  enumOptions = [],
  useDropdown = false,
}: EditableCellProps) => {
  const handleBlur = () => {
    setIsEditing(false);
  };

  // Determine which editor to use based on the type and infer value types
  if (type === "boolean" && typeof value === "boolean") {
    return useDropdown ? (
      <BooleanDropdownEdit
        value={value}
        onChange={(val: boolean) => onChange(val)}
        onBlur={handleBlur}
      />
    ) : (
      <BooleanEdit value={value} onChange={(val: boolean) => onChange(val)} onBlur={handleBlur} />
    );
  }

  if (type === "number" && typeof value === "number") {
    return (
      <NumberEdit
        defaultValue={value}
        onChange={(val: string) => {
          // Convert string back to number for storage
          const numVal = val === "" ? 0 : parseFloat(val);
          onChange(isNaN(numVal) ? 0 : numVal);
        }}
        onBlur={handleBlur}
      />
    );
  }

  if (type === "date") {
    const dateValue = typeof value === "string" ? value : "";
    return (
      <DateDropdownEdit
        value={dateValue}
        onChange={(val: string) => onChange(val)}
        onBlur={handleBlur}
      />
    );
  }

  if (type === "enum") {
    const enumValue = typeof value === "string" ? value : "";
    return (
      <EnumDropdownEdit
        value={enumValue}
        options={enumOptions}
        onChange={(val: string) => onChange(val)}
        onBlur={handleBlur}
      />
    );
  }

  // Default to string type
  const stringValue = value === null || value === undefined ? "" : String(value);
  return (
    <StringEdit
      defaultValue={stringValue}
      onChange={(val: string) => onChange(val)}
      onBlur={handleBlur}
    />
  );
};

export default EditableCell;
