import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import { generateSpaceData, SPACE_HEADERS, SpaceData } from "../data/space-data";
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

  const updateCell = ({ accessor, newValue, row }: CellChangeProps<SpaceData>) => {
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
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      onCellEdit={updateCell}
      rows={rows}
      rowIdAccessor="id"
      // Default to editColumnsInitOpen for this example, but allow override
      editColumnsInitOpen={props.editColumnsInitOpen ?? true}
    />
  );
};

export default FilterColumnsExample;
