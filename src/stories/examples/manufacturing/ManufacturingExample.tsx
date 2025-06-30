import { HEADERS } from "./manufacturing-headers";
import MANUFACTURING_DATA from "./manufacturing-data.json";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import { UniversalTableProps } from "../StoryWrapper";

export const manufacturingExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  rowGrouping: ["stations"],
  height: "70dvh",
};

export default function ManufacturingExampleComponent(props: UniversalTableProps) {
  return (
    <SimpleTable
      defaultHeaders={HEADERS}
      rows={MANUFACTURING_DATA}
      rowIdAccessor="id"
      {...props}
      expandAll={false}
    />
  );
}
