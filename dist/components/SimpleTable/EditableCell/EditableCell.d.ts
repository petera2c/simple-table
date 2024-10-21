import CellValue from "../../../types/CellValue";
interface EditableCellProps {
    onChange: (newValue: CellValue) => void;
    setIsEditing: (isEditing: boolean) => void;
    value: CellValue;
}
declare const EditableCell: ({ onChange, setIsEditing, value }: EditableCellProps) => import("react/jsx-runtime").JSX.Element;
export default EditableCell;
