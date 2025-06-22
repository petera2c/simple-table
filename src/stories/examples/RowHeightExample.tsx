import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

interface RowHeightExampleProps {
  rowHeight?: number;
}

const RowHeightExampleComponent = ({ rowHeight = 32 }: RowHeightExampleProps) => {
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
    <div style={{ padding: "2rem" }}>
      <div data-testid="row-height-display">Current Row Height: {rowHeight}px</div>
      <SimpleTable defaultHeaders={headers} rows={rows} rowIdAccessor="id" rowHeight={rowHeight} />
    </div>
  );
};

export default RowHeightExampleComponent;
