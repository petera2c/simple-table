import { Select } from "antd";
import { IconLibrary } from "@/utils/getTableIcons";

const ICON_LIBRARY_OPTIONS: IconLibrary[] = ["default", "fontawesome", "mui", "antd"];

const ICON_LIBRARY_LABELS: Record<IconLibrary, string> = {
  default: "Default Simple Table",
  fontawesome: "Font Awesome",
  mui: "Material-UI",
  antd: "Ant Design",
};

interface IconLibrarySelectorProps {
  currentIconLibrary?: IconLibrary;
  onChange: (library: IconLibrary) => void;
}

const IconLibrarySelector = ({
  currentIconLibrary = "default",
  onChange,
}: IconLibrarySelectorProps) => {
  return (
    <Select
      placeholder="Select icon library"
      style={{ width: 200 }}
      onChange={(value) => onChange(value as IconLibrary)}
      options={ICON_LIBRARY_OPTIONS.map((library) => ({
        value: library,
        label: ICON_LIBRARY_LABELS[library],
      }))}
      value={currentIconLibrary}
    />
  );
};

export default IconLibrarySelector;
