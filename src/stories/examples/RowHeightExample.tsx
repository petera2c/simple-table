import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to RowHeight - exported for reuse in stories and tests
export const rowHeightDefaults = {
  rowHeight: 24,
};

const RowHeightExampleComponent = (props: UniversalTableProps) => {
  // Sample data for testing row heights
  const rows = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      role: "Developer",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      role: "Designer",
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 45,
      role: "Manager",
    },
  ];

  // Define headers
  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 80 },
    { accessor: "name", label: "Name", width: 150 },
    { accessor: "age", label: "Age", width: 100 },
    { accessor: "role", label: "Role", width: 150 },
  ];

  return (
    <SimpleTable
      {...props}
      defaultHeaders={headers}
      rows={rows}
      rowHeight={props.rowHeight ?? 32}
    />
  );
};

export default RowHeightExampleComponent;
