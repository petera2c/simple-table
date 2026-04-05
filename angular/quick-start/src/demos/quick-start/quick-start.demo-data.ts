// Self-contained demo table setup for this example.
import type { Row } from "@simple-table/angular";
import type { HeaderObject } from "@simple-table/angular";


export const QUICK_START_DATA: Row[] = [
  {
    id: 1,
    name: "Marcus Rodriguez",
    age: 29,
    role: "Frontend Developer",
    department: "Engineering",
    startDate: "2022-03-15",
  },
  {
    id: 2,
    name: "Sophia Chen",
    age: 27,
    role: "UX/UI Designer",
    department: "Design",
    startDate: "2021-11-08",
  },
  {
    id: 3,
    name: "Raj Patel",
    age: 34,
    role: "Engineering Manager",
    department: "Engineering",
    startDate: "2020-01-20",
  },
  {
    id: 4,
    name: "Luna Martinez",
    age: 23,
    role: "Junior Developer",
    department: "Engineering",
    startDate: "2023-06-12",
  },
  {
    id: 5,
    name: "Tyler Anderson",
    age: 31,
    role: "DevOps Engineer",
    department: "Infrastructure",
    startDate: "2021-08-03",
  },
  {
    id: 6,
    name: "Zara Kim",
    age: 28,
    role: "Product Designer",
    department: "Design",
    startDate: "2022-01-17",
  },
  {
    id: 7,
    name: "Kai Thompson",
    age: 26,
    role: "Full Stack Developer",
    department: "Engineering",
    startDate: "2022-09-05",
  },
  {
    id: 8,
    name: "Ava Singh",
    age: 33,
    role: "Product Manager",
    department: "Product",
    startDate: "2020-07-14",
  },
  {
    id: 9,
    name: "Jordan Walsh",
    age: 25,
    role: "Marketing Specialist",
    department: "Growth",
    startDate: "2023-02-28",
  },
  {
    id: 10,
    name: "Phoenix Lee",
    age: 30,
    role: "Backend Developer",
    department: "Engineering",
    startDate: "2021-05-11",
  },
  {
    id: 11,
    name: "River Jackson",
    age: 24,
    role: "Growth Designer",
    department: "Design",
    startDate: "2023-01-09",
  },
  {
    id: 12,
    name: "Atlas Morgan",
    age: 32,
    role: "Tech Lead",
    department: "Engineering",
    startDate: "2019-12-02",
  },
];


export const quickStartHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
  {
    accessor: "name",
    label: "Name",
    minWidth: 80,
    width: "1fr",
    isSortable: true,
    type: "string",
  },
  { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
  { accessor: "role", label: "Role", width: 150, isSortable: true, type: "string" },
  { accessor: "department", label: "Department", width: 150, isSortable: true, type: "string" },
  { accessor: "startDate", label: "Start Date", width: 150, isSortable: true, type: "date" },
];

export const quickStartConfig = {
  headers: quickStartHeaders,
  rows: QUICK_START_DATA,
  tableProps: {
    editColumns: true,
    selectableCells: true,
    customTheme: { rowHeight: 32 },
  },
} as const;
