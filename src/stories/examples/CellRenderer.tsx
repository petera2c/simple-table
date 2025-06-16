import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

const CellRendererExample = () => {
  // Sample data for a quick start demo - using the new simplified structure
  const rows = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      role: "Developer",
      department: "Engineering",
      startDate: "2020-01-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      role: "Designer",
      department: "Design",
      startDate: "2020-01-01",
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 45,
      role: "Manager",
      department: "Management",
      startDate: "2020-01-01",
    },
    {
      id: 4,
      name: "Alice Williams",
      age: 24,
      role: "Intern",
      department: "Internship",
      startDate: "2020-01-01",
    },
    {
      id: 5,
      name: "Charlie Brown",
      age: 37,
      role: "DevOps",
      department: "Engineering",
      startDate: "2020-01-01",
    },
  ];

  // Define headers
  const headers: HeaderObject[] = [
    {
      accessor: "id",
      label: "ID",
      width: 80,
      isSortable: true,
      cellRenderer: ({ accessor, row }) => {
        const value = row[accessor] as string | number;
        return (
          <div style={{ backgroundColor: "red", width: "100%", overflow: "hidden" }}>{value}</div>
        );
      },
      headerRenderer: ({ header }) => (
        <div
          style={{
            backgroundColor: "darkred",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          🆔 {header.label}
        </div>
      ),
    },
    {
      accessor: "name",
      label: "Name",
      width: 100,
      isSortable: true,
      cellRenderer: ({ accessor, row }) => {
        const value = row[accessor] as string | number;
        return (
          <div style={{ backgroundColor: "blue", width: "100%", overflow: "hidden" }}>{value}</div>
        );
      },
      headerRenderer: ({ header }) => (
        <div
          style={{
            backgroundColor: "darkblue",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontStyle: "italic",
          }}
        >
          👤 {header.label}
        </div>
      ),
    },
    {
      accessor: "age",
      label: "Age",
      width: 100,
      isSortable: true,
      cellRenderer: ({ accessor, row }) => {
        const value = row[accessor] as string | number;
        return <div style={{ backgroundColor: "green", width: "100%" }}>{value}</div>;
      },
      headerRenderer: ({ header }) => (
        <div
          style={{
            backgroundColor: "darkgreen",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            textTransform: "uppercase",
          }}
        >
          🎂 {header.label}
        </div>
      ),
    },
    {
      accessor: "role",
      label: "Role",
      width: 150,
      isSortable: true,
      cellRenderer: ({ accessor, row }) => {
        const value = row[accessor] as string | number;
        return <div style={{ backgroundColor: "yellow" }}>{value}</div>;
      },
      headerRenderer: ({ header }) => (
        <div
          style={{
            backgroundColor: "orange",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "2px solid darkorange",
          }}
        >
          💼 {header.label}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnReordering
        columnResizing
        defaultHeaders={headers}
        rows={rows}
        rowIdAccessor="id"
        selectableCells
      />
    </div>
  );
};

export default CellRendererExample;
