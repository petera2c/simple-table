import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import { generateSaaSData, SAAS_HEADERS } from "../data/saas-data";
import CellChangeProps from "../../types/CellChangeProps";
import { UniversalTableProps } from "./StoryWrapper";

/**
 * # Infinite Scroll Example
 *
 * This example demonstrates the infinite scrolling functionality of Simple Table.
 *
 * ## Features Demonstrated
 * - Loading and displaying large datasets without pagination
 * - Automatically loading more data as the user scrolls
 * - Maintaining performance with large data sets
 * - Combining infinite scroll with cell editing capabilities
 *
 * Infinite scrolling is an alternative to pagination that provides a more
 * continuous user experience, particularly for large datasets where users
 * need to browse through many rows of data.
 */

const EXAMPLE_DATA = generateSaaSData();
const HEADERS = SAAS_HEADERS;

const InfiniteScrollExample = (props: UniversalTableProps) => {
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
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      onCellEdit={updateCell}
      rows={rows}
      rowIdAccessor="id"
      // Default settings for this example
      columnResizing={props.columnResizing ?? true}
      columnReordering={props.columnReordering ?? true}
      selectableCells={props.selectableCells ?? true}
      height={props.height ?? "calc(100dvh - 112px)"}
      shouldPaginate={props.shouldPaginate ?? false} // Disable pagination for infinite scrolling
    />
  );
};

export default InfiniteScrollExample;
