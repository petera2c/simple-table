import type { HeaderObject } from "simple-table-core";

export const cellHighlightingHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
  { accessor: "name", label: "Name", minWidth: 80, width: "1fr", isSortable: true, type: "string" },
  { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
  { accessor: "role", label: "Role", width: 150, isSortable: true, type: "string" },
  { accessor: "department", label: "Department", width: 150, isSortable: true, type: "string" },
  { accessor: "startDate", label: "Start Date", width: 150, isSortable: true, type: "date" },
];

export const cellHighlightingData = [
  { id: 1, name: "Davi Thompson", age: 29, role: "Personal Trainer", department: "Fitness", startDate: "2021-03-15" },
  { id: 2, name: "Paloma Martinez", age: 26, role: "Yoga Instructor", department: "Group Classes", startDate: "2022-01-10" },
  { id: 3, name: "Jaxon Johnson", age: 34, role: "Fitness Manager", department: "Management", startDate: "2019-08-20" },
  { id: 4, name: "Cleo Silva", age: 22, role: "Front Desk Associate", department: "Customer Service", startDate: "2023-05-12" },
  { id: 5, name: "Bodhi Rodriguez", age: 31, role: "Nutritionist", department: "Wellness", startDate: "2020-11-08" },
  { id: 6, name: "Indie Chen", age: 28, role: "Swim Instructor", department: "Aquatics", startDate: "2021-07-14" },
  { id: 7, name: "Skye Williams", age: 25, role: "Group Fitness Instructor", department: "Group Classes", startDate: "2022-04-03" },
  { id: 8, name: "Rio Garcia", age: 33, role: "Equipment Specialist", department: "Maintenance", startDate: "2020-02-17" },
  { id: 9, name: "Wren Kumar", age: 27, role: "Wellness Coach", department: "Wellness", startDate: "2021-09-25" },
  { id: 10, name: "Storm Lee", age: 30, role: "Pilates Instructor", department: "Group Classes", startDate: "2020-12-01" },
  { id: 11, name: "Vale Davis", age: 24, role: "Membership Coordinator", department: "Sales", startDate: "2023-02-18" },
  { id: 12, name: "Cruz Martinez", age: 36, role: "Head Trainer", department: "Fitness", startDate: "2018-06-12" },
];

export const cellHighlightingConfig = {
  headers: cellHighlightingHeaders,
  rows: cellHighlightingData,
  tableProps: { selectableCells: true, selectableColumns: true },
} as const;
