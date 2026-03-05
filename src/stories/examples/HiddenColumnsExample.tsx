import { useState } from "react";
import SimpleTableReact from "../../adapters/SimpleTableReactReact";
import { generateSpaceData, SPACE_HEADERS } from "../data/space-data";
import CellChangeProps from "../../types/CellChangeProps";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to HiddenColumns - exported for reuse in stories and tests
export const hiddenColumnsDefaults = {
  columnResizing: true,
  columnReordering: true,
  editColumns: true,
  editColumnsInitOpen: true,
  height: "80vh",
};

const EXAMPLE_DATA = generateSpaceData();
const HEADERS = SPACE_HEADERS;

const FilterColumnsExample = (props: UniversalTableProps) => {
  const [rows, setRows] = useState(EXAMPLE_DATA);

  const updateCell = ({ accessor, newValue, row }: CellChangeProps) => {
    setRows((prevRows) => {
      const rowIndex = prevRows.findIndex((r) => r.id === row.id);
      if (rowIndex !== -1) {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], [accessor]: newValue };
        return updatedRows;
      }
      return prevRows;
    });
  };

  return (
    <SimpleTableReact
      {...props}
      defaultHeaders={HEADERS}
      onCellEdit={updateCell}
      rows={rows}
      // Default to editColumnsInitOpen for this example, but allow override
      editColumnsInitOpen={props.editColumnsInitOpen ?? true}
    />
  );
};

export default FilterColumnsExample;
