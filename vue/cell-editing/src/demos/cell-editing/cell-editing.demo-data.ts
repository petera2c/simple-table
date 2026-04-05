// Self-contained demo table setup for this example.
import type { HeaderObject } from "@simple-table/vue";


export const cellEditingHeaders: HeaderObject[] = [
  { accessor: "firstName", label: "First Name", width: "1fr", minWidth: 100, isEditable: true, type: "string" },
  { accessor: "lastName", label: "Last Name", width: 120, isEditable: true, type: "string" },
  { accessor: "role", label: "Role", width: 120, isEditable: true, type: "enum", enumOptions: [
    { label: "Developer", value: "Developer" },
    { label: "Designer", value: "Designer" },
    { label: "Manager", value: "Manager" },
    { label: "Marketing", value: "Marketing" },
    { label: "QA", value: "QA" },
  ]},
  { accessor: "hireDate", label: "Hire Date", width: 120, isEditable: true, type: "date" },
  { accessor: "isActive", label: "Active", width: 100, isEditable: true, type: "boolean" },
  { accessor: "salary", label: "Salary", width: 120, isEditable: true, type: "number" },
];

export const cellEditingData = [
  { id: 1, firstName: "Ranger", lastName: "Wilde", role: "Manager", hireDate: "2019-03-12", isActive: true, salary: 89000 },
  { id: 2, firstName: "Safari", lastName: "Brooks", role: "Designer", hireDate: "2021-07-18", isActive: true, salary: 74000 },
  { id: 3, firstName: "Forest", lastName: "Rivers", role: "Manager", hireDate: "2018-11-08", isActive: true, salary: 94000 },
  { id: 4, firstName: "Savanna", lastName: "Fields", role: "Developer", hireDate: "2022-02-14", isActive: false, salary: 81000 },
  { id: 5, firstName: "Canyon", lastName: "Stone", role: "Marketing", hireDate: "2021-09-20", isActive: true, salary: 73000 },
  { id: 6, firstName: "Meadow", lastName: "Vale", role: "QA", hireDate: "2020-06-25", isActive: true, salary: 79000 },
  { id: 7, firstName: "Ridge", lastName: "Peak", role: "Manager", hireDate: "2019-01-20", isActive: true, salary: 92000 },
  { id: 8, firstName: "Tundra", lastName: "Frost", role: "Developer", hireDate: "2022-05-03", isActive: false, salary: 85000 },
  { id: 9, firstName: "Prairie", lastName: "Wind", role: "Designer", hireDate: "2021-10-12", isActive: true, salary: 77000 },
  { id: 10, firstName: "Delta", lastName: "Flow", role: "Developer", hireDate: "2020-08-17", isActive: true, salary: 83000 },
  { id: 11, firstName: "Grove", lastName: "Shade", role: "Designer", hireDate: "2022-01-09", isActive: true, salary: 76000 },
  { id: 12, firstName: "Cliff", lastName: "Edge", role: "QA", hireDate: "2019-12-04", isActive: false, salary: 82000 },
];

export const cellEditingConfig = {
  headers: cellEditingHeaders,
  rows: cellEditingData,
} as const;
