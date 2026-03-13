import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

/**
 * Example that reproduces the table collapse bug when no column is visible.
 *
 * When neither height nor maxHeight is passed (responsive table height) and the user
 * deselects every column via the column config toggle, st-body-main is not rendered
 * (canDisplaySection is false because every header has hide: true). The table collapses
 * and the reset button becomes inaccessible.
 *
 * This example starts with only one column visible (Name). Use the column editor to
 * hide that column too — the table will collapse and the reset button will be unreachable.
 */
export const allColumnsHiddenCollapseExampleDefaults = {
  shouldPaginate: true,
  rowsPerPage: 10,
  columnResizing: true,
  editColumns: true,
  editColumnsInitOpen: false,
  columnReordering: true,
  // Intentionally no height or maxHeight — responsive height triggers the collapse bug
  height: undefined,
  // maxHeight: "500px",
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

const AllColumnsHiddenCollapseExampleComponent = (props: UniversalTableProps) => {
  const headers: HeaderObject[] = [
    {
      accessor: "id",
      label: "ID",
      width: 80,
      isSortable: true,
      filterable: true,
      hide: true,
    },
    {
      accessor: "name",
      label: "Name",
      minWidth: 80,
      width: "1fr",
      isSortable: true,
      filterable: true,
      // Only this column visible by default — hide it via column editor to reproduce collapse
    },
    { accessor: "age", label: "Age", width: 100, isSortable: true, filterable: true, hide: true },
    { accessor: "role", label: "Role", width: 150, isSortable: true, filterable: true, hide: true },
  ];

  return (
    <div style={{ minHeight: 400 }}>
      <SimpleTable {...props} defaultHeaders={headers} rows={createBasicData(100)} />
    </div>
  );
};

export default AllColumnsHiddenCollapseExampleComponent;
