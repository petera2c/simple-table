import { SimpleTable } from "../..";
import { STColumn } from "../../types/HeaderObject";
import { UniversalTableProps } from "./StoryWrapper";

type RowData = {
  id: number;
  name: string;
  age: number;
  role: string;
};

// Default args specific to CellRenderer - exported for reuse in stories and tests
export const cellRendererDefaults = {
  columnReordering: true,
  columnResizing: true,
  selectableCells: true,
};

// Export styling constants for testing
export const CELL_RENDERER_STYLES = {
  header: {
    id: {
      backgroundColor: "rgb(139, 0, 0)", // darkred
      color: "rgb(255, 255, 255)", // white
      padding: "4px 8px",
      borderRadius: "4px",
      fontWeight: 700, // bold
    },
    name: {
      backgroundColor: "rgb(0, 0, 139)", // darkblue
      color: "rgb(255, 255, 255)", // white
      padding: "4px 8px",
      borderRadius: "4px",
      fontStyle: "italic",
    },
    age: {
      backgroundColor: "rgb(0, 100, 0)", // darkgreen
      color: "rgb(255, 255, 255)", // white
      padding: "4px 8px",
      borderRadius: "4px",
      textTransform: "uppercase" as const,
    },
    role: {
      backgroundColor: "rgb(255, 165, 0)", // orange
      color: "rgb(255, 255, 255)", // white
      padding: "4px 8px",
      borderRadius: "4px",
      border: "2px solid rgb(255, 140, 0)", // darkorange
    },
  },
  cell: {
    id: {
      backgroundColor: "rgb(255, 0, 0)", // red
      width: "100%",
      overflow: "hidden",
    },
    name: {
      backgroundColor: "rgb(0, 0, 255)", // blue
      width: "100%",
      overflow: "hidden",
    },
    age: {
      backgroundColor: "rgb(0, 128, 0)", // green
      width: "100%",
    },
    role: {
      backgroundColor: "rgb(255, 255, 0)", // yellow
    },
  },
  emojis: {
    id: "🆔",
    name: "👤",
    age: "🎂",
    role: "💼",
  },
  text: {
    id: "ID",
    name: "Name",
    age: "Age",
    role: "Role",
  },
};

export const CELL_RENDERER_DATA = [
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

const CellRendererExample = (props: UniversalTableProps) => {
  // Use the exported data
  const rows = CELL_RENDERER_DATA;

  // Define headers
  const headers: STColumn<RowData>[] = [
    {
      accessor: "id",
      label: "ID",
      width: 80,
      isSortable: true,
      cellRenderer: ({ accessor, row }) => {
        const value = row[accessor] as string | number;
        return <div style={CELL_RENDERER_STYLES.cell.id}>{value}</div>;
      },
      headerRenderer: ({ header }) => (
        <div style={CELL_RENDERER_STYLES.header.id}>
          {CELL_RENDERER_STYLES.emojis.id} {CELL_RENDERER_STYLES.text.id}
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
        return <div style={CELL_RENDERER_STYLES.cell.name}>{value}</div>;
      },
      headerRenderer: ({ header }) => (
        <div style={CELL_RENDERER_STYLES.header.name}>
          {CELL_RENDERER_STYLES.emojis.name} {CELL_RENDERER_STYLES.text.name}
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
        return <div style={CELL_RENDERER_STYLES.cell.age}>{value}</div>;
      },
      headerRenderer: ({ header }) => (
        <div style={CELL_RENDERER_STYLES.header.age}>
          {CELL_RENDERER_STYLES.emojis.age} {CELL_RENDERER_STYLES.text.age}
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
        return <div style={CELL_RENDERER_STYLES.cell.role}>{value}</div>;
      },
      headerRenderer: ({ header }) => (
        <div style={CELL_RENDERER_STYLES.header.role}>
          {CELL_RENDERER_STYLES.emojis.role} {CELL_RENDERER_STYLES.text.role}
        </div>
      ),
    },
  ];

  return (
    <SimpleTable
      {...props}
      defaultHeaders={headers}
      rows={rows}
      rowIdAccessor="id"
      // Default settings for this example
      columnReordering={props.columnReordering ?? true}
      columnResizing={props.columnResizing ?? true}
      selectableCells={props.selectableCells ?? true}
    />
  );
};

export default CellRendererExample;
