import { HEADERS } from "./manufacturing-headers";
import MANUFACTURING_DATA from "./manufacturing-data.json";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import { UniversalTableProps } from "../StoryWrapper";

export const manufacturingExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "70dvh",
};

export default function ManufacturingExampleComponent(props: UniversalTableProps) {
  return (
    <SimpleTable
      columnResizing
      columnReordering
      defaultHeaders={HEADERS}
      rows={MANUFACTURING_DATA}
      rowGrouping={["stations"]}
      rowIdAccessor="id"
      selectableCells
    />
  );
}
