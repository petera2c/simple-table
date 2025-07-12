import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to BasicExample - exported for reuse in stories and tests
export const basicExampleDefaults = {
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
  columnReordering: true,
  height: "200px",
};

const BasicExampleComponent = (props: UniversalTableProps) => {
  // Sample data for a quick start demo - now using the new simplified structure
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
    // {
    //   id: 4,
    //   name: "Alice Williams",
    //   age: 24,
    //   role: "Intern",
    //   department: "Internship",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 5,
    //   name: "Charlie Brown",
    //   age: 37,
    //   role: "DevOps",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 6,
    //   name: "Diana Prince",
    //   age: 29,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 7,
    //   name: "Ethan Hunt",
    //   age: 31,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 8,
    //   name: "Frank Underwood",
    //   age: 40,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 9,
    //   name: "Grace Hopper",
    //   age: 35,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 10,
    //   name: "Hannah Montana",
    //   age: 22,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 11,
    //   name: "Ian Somerhalder",
    //   age: 33,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 12,
    //   name: "Jake Gyllenhaal",
    //   age: 38,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 13,
    //   name: "Kyle Chandler",
    //   age: 42,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 14,
    //   name: "Liam Neeson",
    //   age: 48,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 15,
    //   name: "abdelrahman",
    //   age: 30,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 16,
    //   name: "Nina Dobrev",
    //   age: 34,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 17,
    //   name: "Omar Sy",
    //   age: 41,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 18,
    //   name: "Pablo Escobar",
    //   age: 50,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 19,
    //   name: "Qasim",
    //   age: 22,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
    // {
    //   id: 20,
    //   name: "Rajesh",
    //   age: 22,
    //   role: "Developer",
    //   department: "Engineering",
    //   startDate: "2020-01-01",
    // },
  ];

  // Define headers
  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 80, isSortable: true },
    { accessor: "name", label: "Name", minWidth: 80, width: "1fr", isSortable: true },
    { accessor: "age", label: "Age", width: 100, isSortable: true },
    { accessor: "role", label: "Role", width: 150, isSortable: true },
  ];

  return <SimpleTable {...props} defaultHeaders={headers} rows={rows} rowIdAccessor="id" />;
};

export default BasicExampleComponent;
