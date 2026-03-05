import { HEADERS } from "./manufacturing-headers";
import MANUFACTURING_DATA from "./manufacturing-data.json";
import SimpleTableReact from "../../../components/simple-table/SimpleTableReact";
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
    <SimpleTableReact
      defaultHeaders={HEADERS}
      rows={MANUFACTURING_DATA}
      {...props}
      expandAll={false}
    />
  );
}
