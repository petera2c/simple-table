import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

const CellRendererExample = () => {
  // Sample data for a quick start demo
  const data = [
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
        const value = row.rowData[accessor];
        return <div style={{ backgroundColor: "red" }}>{value}</div>;
      },
    },
    {
      accessor: "name",
      label: "Name",
      minWidth: 80,
      width: "1fr",
      isSortable: true,
      cellRenderer: ({ accessor, row }) => {
        const value = row.rowData[accessor];
        return <div style={{ backgroundColor: "blue" }}>{value}</div>;
      },
    },
    {
      accessor: "age",
      label: "Age",
      width: 100,
      isSortable: true,
      cellRenderer: ({ accessor, row }) => {
        const value = row.rowData[accessor];
        return <div style={{ backgroundColor: "green" }}>{value}</div>;
      },
    },
    {
      accessor: "role",
      label: "Role",
      width: 150,
      isSortable: true,
      cellRenderer: ({ accessor, row }) => {
        const value = row.rowData[accessor];
        return <div style={{ backgroundColor: "yellow" }}>{value}</div>;
      },
    },
  ];

  // Map data to rows format expected by SimpleTable
  const rows = data.map((item) => ({
    rowMeta: { rowId: item.id, isExpanded: false },
    rowData: item,
  }));

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        defaultHeaders={headers}
        editColumns
        rows={rows}
        selectableCells
      />
    </div>
  );
};

export default CellRendererExample;
