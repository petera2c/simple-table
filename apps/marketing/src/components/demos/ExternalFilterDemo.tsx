import { useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Accessor, TableFilterState, Theme, CellRendererProps } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Type for our sample data
type EmployeeData = {
  id: number;
  name: string;
  age: number;
  email: string;
  salary: number;
  department: string;
  active: boolean;
  location: string;
};

// Sample data - unique and diverse employee data with filtering variety
const sampleData: EmployeeData[] = [
  {
    id: 1,
    name: "Dr. Elena Vasquez",
    age: 42,
    email: "elena.vasquez@techcorp.com",
    salary: 145000,
    department: "AI Research",
    active: true,
    location: "San Francisco",
  },
  {
    id: 2,
    name: "Kai Tanaka",
    age: 29,
    email: "k.tanaka@techcorp.com",
    salary: 95000,
    department: "UX Design",
    active: true,
    location: "Tokyo",
  },
  {
    id: 3,
    name: "Amara Okafor",
    age: 35,
    email: "amara.okafor@techcorp.com",
    salary: 125000,
    department: "DevOps",
    active: false,
    location: "London",
  },
  {
    id: 4,
    name: "Santiago Rodriguez",
    age: 27,
    email: "s.rodriguez@techcorp.com",
    salary: 82000,
    department: "Marketing",
    active: true,
    location: "Barcelona",
  },
  {
    id: 5,
    name: "Priya Chakraborty",
    age: 33,
    email: "priya.c@techcorp.com",
    salary: 118000,
    department: "Engineering",
    active: true,
    location: "Bangalore",
  },
  {
    id: 6,
    name: "Magnus Eriksson",
    age: 38,
    email: "magnus.erik@techcorp.com",
    salary: 110000,
    department: "Product",
    active: true,
    location: "Stockholm",
  },
  {
    id: 7,
    name: "Zara Al-Rashid",
    age: 31,
    email: "zara.alrashid@techcorp.com",
    salary: 98000,
    department: "Sales",
    active: false,
    location: "Dubai",
  },
  {
    id: 8,
    name: "Luca Rossi",
    age: 26,
    email: "luca.rossi@techcorp.com",
    salary: 75000,
    department: "Marketing",
    active: true,
    location: "Milan",
  },
  {
    id: 9,
    name: "Dr. Sarah Kim",
    age: 45,
    email: "sarah.kim@techcorp.com",
    salary: 165000,
    department: "AI Research",
    active: true,
    location: "Seoul",
  },
  {
    id: 10,
    name: "Olumide Adebayo",
    age: 30,
    email: "olumide.a@techcorp.com",
    salary: 105000,
    department: "Engineering",
    active: true,
    location: "Lagos",
  },
  {
    id: 11,
    name: "Isabella Chen",
    age: 24,
    email: "isabella.chen@techcorp.com",
    salary: 68000,
    department: "UX Design",
    active: false,
    location: "Vancouver",
  },
  {
    id: 12,
    name: "Dmitri Volkov",
    age: 39,
    email: "dmitri.volkov@techcorp.com",
    salary: 135000,
    department: "DevOps",
    active: true,
    location: "Moscow",
  },
  {
    id: 13,
    name: "Fatima Al-Zahra",
    age: 28,
    email: "fatima.alzahra@techcorp.com",
    salary: 89000,
    department: "Product",
    active: true,
    location: "Cairo",
  },
  {
    id: 14,
    name: "Rajesh Patel",
    age: 36,
    email: "rajesh.patel@techcorp.com",
    salary: 122000,
    department: "Engineering",
    active: false,
    location: "Mumbai",
  },
  {
    id: 15,
    name: "Amélie Dubois",
    age: 32,
    email: "amelie.dubois@techcorp.com",
    salary: 92000,
    department: "Sales",
    active: true,
    location: "Paris",
  },
  {
    id: 16,
    name: "Jin-Ho Park",
    age: 41,
    email: "jinho.park@techcorp.com",
    salary: 148000,
    department: "AI Research",
    active: true,
    location: "San Francisco",
  },
  {
    id: 17,
    name: "Leila Nakamura",
    age: 25,
    email: "leila.nakamura@techcorp.com",
    salary: 71000,
    department: "Marketing",
    active: true,
    location: "São Paulo",
  },
  {
    id: 18,
    name: "Viktor Petrov",
    age: 34,
    email: "viktor.petrov@techcorp.com",
    salary: 115000,
    department: "Product",
    active: false,
    location: "Prague",
  },
  {
    id: 19,
    name: "Aisha Osman",
    age: 29,
    email: "aisha.osman@techcorp.com",
    salary: 87000,
    department: "UX Design",
    active: true,
    location: "Nairobi",
  },
  {
    id: 20,
    name: "Marco Silva",
    age: 37,
    email: "marco.silva@techcorp.com",
    salary: 128000,
    department: "DevOps",
    active: true,
    location: "Lisbon",
  },
];

const headers: ReactHeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: "1fr",
    type: "string",
    filterable: true,
  },
  {
    accessor: "age",
    label: "Age",
    width: 120,
    type: "number",
    filterable: true,
  },
  {
    accessor: "department",
    label: "Department",
    width: 150,
    type: "enum",
    filterable: true,
    enumOptions: [
      { value: "AI Research", label: "AI Research" },
      { value: "UX Design", label: "UX Design" },
      { value: "DevOps", label: "DevOps" },
      { value: "Marketing", label: "Marketing" },
      { value: "Engineering", label: "Engineering" },
      { value: "Product", label: "Product" },
      { value: "Sales", label: "Sales" },
    ],
  },
  {
    accessor: "location",
    label: "Location",
    width: 150,
    type: "enum",
    filterable: true,
    enumOptions: [
      { value: "San Francisco", label: "San Francisco" },
      { value: "Tokyo", label: "Tokyo" },
      { value: "London", label: "London" },
      { value: "Barcelona", label: "Barcelona" },
      { value: "Bangalore", label: "Bangalore" },
      { value: "Stockholm", label: "Stockholm" },
      { value: "Dubai", label: "Dubai" },
      { value: "Milan", label: "Milan" },
      { value: "Seoul", label: "Seoul" },
      { value: "Lagos", label: "Lagos" },
      { value: "Vancouver", label: "Vancouver" },
      { value: "Moscow", label: "Moscow" },
      { value: "Cairo", label: "Cairo" },
      { value: "Mumbai", label: "Mumbai" },
      { value: "Paris", label: "Paris" },
      { value: "São Paulo", label: "São Paulo" },
      { value: "Prague", label: "Prague" },
      { value: "Nairobi", label: "Nairobi" },
      { value: "Lisbon", label: "Lisbon" },
    ],
  },
  {
    accessor: "active",
    label: "Active",
    width: 120,
    type: "boolean",
    filterable: true,
    cellRenderer: ({ row }: CellRendererProps) => (row.active ? "✓ Yes" : "✗ No"),
    align: "center",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    filterable: true,
    cellRenderer: ({ row }: CellRendererProps) => `$${(row.salary || 0).toLocaleString()}`,
    align: "right",
  },
];

const ExternalFilterDemo = ({ theme }: { theme?: Theme }) => {
  const [filters, setFilters] = useState<TableFilterState>({});

  // Filter data externally based on filters
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return sampleData;

    return sampleData.filter((row) => {
      return Object.values(filters).every((filter) => {
        const cellValue = row[filter.accessor as keyof EmployeeData];

        // Apply filter based on operator
        switch (filter.operator) {
          case "equals":
            return cellValue === filter.value;
          case "notEquals":
            return cellValue !== filter.value;
          case "contains":
            return String(cellValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case "notContains":
            return !String(cellValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case "startsWith":
            return String(cellValue).toLowerCase().startsWith(String(filter.value).toLowerCase());
          case "endsWith":
            return String(cellValue).toLowerCase().endsWith(String(filter.value).toLowerCase());
          case "greaterThan":
            return Number(cellValue) > Number(filter.value);
          case "greaterThanOrEqual":
            return Number(cellValue) >= Number(filter.value);
          case "lessThan":
            return Number(cellValue) < Number(filter.value);
          case "lessThanOrEqual":
            return Number(cellValue) <= Number(filter.value);
          case "in":
            return Array.isArray(filter.values) && filter.values.includes(cellValue);
          case "notIn":
            return !Array.isArray(filter.values) || !filter.values.includes(cellValue);
          case "isEmpty":
            return !cellValue || cellValue === "";
          case "isNotEmpty":
            return cellValue && cellValue !== "";
          default:
            return true;
        }
      });
    });
  }, [filters]);

  const handleFilterChange = (newFilters: TableFilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Display current filter info */}
      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <p className="text-sm text-green-800 dark:text-green-200">
          <strong>External Filter Status:</strong>{" "}
          {Object.keys(filters).length > 0
            ? `${Object.keys(filters).length} filter${
                Object.keys(filters).length === 1 ? "" : "s"
              } active • Showing ${filteredData.length} of ${sampleData.length} rows`
            : "No filters applied"}
        </p>
        {Object.keys(filters).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, filter]) => (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
              >
                {headers.find((h) => h.accessor === filter.accessor)?.label}: {filter.operator}{" "}
                {filter.values ? filter.values.join(", ") : String(filter.value)}
              </span>
            ))}
          </div>
        )}
      </div>

      <SimpleTable
        defaultHeaders={headers}
        rows={filteredData} // We provide the pre-filtered data
        onFilterChange={handleFilterChange} // Handle filter changes externally
        externalFilterHandling={true} // Disable internal filtering logic
        columnResizing={true}
        columnReordering={true}
        height={"338px"}
        theme={theme}
      />
    </div>
  );
};

export default ExternalFilterDemo;
