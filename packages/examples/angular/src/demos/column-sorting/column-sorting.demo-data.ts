// Self-contained demo table setup for this example.
import type { Row } from "@simple-table/angular";
import type { HeaderObject } from "@simple-table/angular";


export const COLUMN_SORTING_DATA: Row[] = [
  {
    id: 1,
    name: "Dr. Elena Vasquez",
    age: 42,
    role: "Computer Science Professor",
    department: "Computer Science",
    startDate: "2015-08-15",
  },
  {
    id: 2,
    name: "Prof. Michael Chang",
    age: 38,
    role: "Mathematics Professor",
    department: "Mathematics",
    startDate: "2017-01-10",
  },
  {
    id: 3,
    name: "Dr. Sarah Mitchell",
    age: 45,
    role: "Dean of Engineering",
    department: "Administration",
    startDate: "2012-09-01",
  },
  {
    id: 4,
    name: "Alex Parker",
    age: 22,
    role: "Graduate Student",
    department: "Computer Science",
    startDate: "2023-09-01",
  },
  {
    id: 5,
    name: "Dr. James Wilson",
    age: 51,
    role: "Physics Professor",
    department: "Physics",
    startDate: "2008-03-15",
  },
  {
    id: 6,
    name: "Maria Santos",
    age: 24,
    role: "Research Assistant",
    department: "Biology",
    startDate: "2022-06-01",
  },
  {
    id: 7,
    name: "Prof. David Kumar",
    age: 39,
    role: "Biology Professor",
    department: "Biology",
    startDate: "2018-02-14",
  },
  {
    id: 8,
    name: "Rachel Green",
    age: 28,
    role: "Lab Coordinator",
    department: "Chemistry",
    startDate: "2020-11-05",
  },
  {
    id: 9,
    name: "Dr. Lisa Chen",
    age: 47,
    role: "Psychology Professor",
    department: "Psychology",
    startDate: "2014-08-20",
  },
  {
    id: 10,
    name: "Ben Taylor",
    age: 23,
    role: "Teaching Assistant",
    department: "Mathematics",
    startDate: "2023-01-15",
  },
  {
    id: 11,
    name: "Dr. Anna Rodriguez",
    age: 35,
    role: "Chemistry Professor",
    department: "Chemistry",
    startDate: "2019-07-01",
  },
  {
    id: 12,
    name: "Prof. Robert Kim",
    age: 44,
    role: "Department Head",
    department: "Engineering",
    startDate: "2011-04-12",
  },
];


export const columnSortingHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
  { accessor: "name", label: "Name", width: 180, isSortable: true, type: "string" },
  { accessor: "age", label: "Age", width: 80, isSortable: true, type: "number" },
  { accessor: "role", label: "Role", width: 200, isSortable: true, type: "string" },
  {
    accessor: "department",
    label: "Department",
    width: 180,
    isSortable: true,
    type: "string",
    valueFormatter: ({ value }) => {
      return (value as string).charAt(0).toUpperCase() + (value as string).slice(1);
    },
  },
  {
    accessor: "startDate",
    label: "Start Date",
    width: 140,
    isSortable: true,
    type: "date",
    valueFormatter: ({ value }) => {
      if (typeof value === "string") {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return String(value);
    },
  },
];

export const columnSortingConfig = {
  headers: columnSortingHeaders,
  rows: COLUMN_SORTING_DATA,
  tableProps: {
    initialSortColumn: "age",
    initialSortDirection: "desc" as const,
  },
} as const;
