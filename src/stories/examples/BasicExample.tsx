import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to BasicExample - exported for reuse in stories and tests
export const basicExampleDefaults = {
  allowAnimations: true,
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
  columnReordering: true,
  height: "500px",
};

const roles = ["Developer", "Designer", "Manager", "Intern", "DevOps", "Engineer"];
const departments = ["Engineering", "Design", "Management", "Internship"];
const createBasicData = (rowLength: number) => {
  return Array.from({ length: rowLength }, (_, index) => ({
    id: index + 1,
    name: `Name ${index + 1}`,
    age: Math.floor(Math.random() * 100),
    role: roles[Math.floor(Math.random() * roles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
  }));
};

const BasicExampleComponent = (props: UniversalTableProps) => {
  // Sample data for a quick start demo - now using the new simplified structure

  // Define headers
  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 120, isSortable: true, filterable: true },
    {
      accessor: "name",
      label: "Name",
      minWidth: 80,
      width: "1fr",
      isSortable: true,
      filterable: true,
    },
    { accessor: "age", label: "Age", width: 100, isSortable: true, filterable: true },
    { accessor: "role", label: "Role", width: 150, isSortable: true, filterable: true },
  ];

  return (
    <div style={{}}>
      <SimpleTable
        {...props}
        defaultHeaders={headers}
        rows={createBasicData(20)}
        rowIdAccessor="id"
      />
    </div>
  );
};

export default BasicExampleComponent;
