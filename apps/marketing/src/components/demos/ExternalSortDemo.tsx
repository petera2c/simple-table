import { useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, SortColumn, Theme, CellRendererProps } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Type for our sample data
type EmployeeData = {
  id: number;
  name: string;
  age: number;
  email: string;
  salary: number;
  department: string;
};

// Sample data - unique and diverse employee data
const sampleData: EmployeeData[] = [
  {
    id: 1,
    name: "Dr. Elena Vasquez",
    age: 42,
    email: "elena.vasquez@techcorp.com",
    salary: 145000,
    department: "AI Research",
  },
  {
    id: 2,
    name: "Kai Tanaka",
    age: 29,
    email: "k.tanaka@techcorp.com",
    salary: 95000,
    department: "UX Design",
  },
  {
    id: 3,
    name: "Amara Okafor",
    age: 35,
    email: "amara.okafor@techcorp.com",
    salary: 125000,
    department: "DevOps",
  },
  {
    id: 4,
    name: "Santiago Rodriguez",
    age: 27,
    email: "s.rodriguez@techcorp.com",
    salary: 82000,
    department: "Marketing",
  },
  {
    id: 5,
    name: "Priya Chakraborty",
    age: 33,
    email: "priya.c@techcorp.com",
    salary: 118000,
    department: "Engineering",
  },
  {
    id: 6,
    name: "Magnus Eriksson",
    age: 38,
    email: "magnus.erik@techcorp.com",
    salary: 110000,
    department: "Product",
  },
  {
    id: 7,
    name: "Zara Al-Rashid",
    age: 31,
    email: "zara.alrashid@techcorp.com",
    salary: 98000,
    department: "Sales",
  },
  {
    id: 8,
    name: "Luca Rossi",
    age: 26,
    email: "luca.rossi@techcorp.com",
    salary: 75000,
    department: "Marketing",
  },
  {
    id: 9,
    name: "Dr. Sarah Kim",
    age: 45,
    email: "sarah.kim@techcorp.com",
    salary: 165000,
    department: "AI Research",
  },
  {
    id: 10,
    name: "Olumide Adebayo",
    age: 30,
    email: "olumide.a@techcorp.com",
    salary: 105000,
    department: "Engineering",
  },
  {
    id: 11,
    name: "Isabella Chen",
    age: 24,
    email: "isabella.chen@techcorp.com",
    salary: 68000,
    department: "UX Design",
  },
  {
    id: 12,
    name: "Dmitri Volkov",
    age: 39,
    email: "dmitri.volkov@techcorp.com",
    salary: 135000,
    department: "DevOps",
  },
  {
    id: 13,
    name: "Fatima Al-Zahra",
    age: 28,
    email: "fatima.alzahra@techcorp.com",
    salary: 89000,
    department: "Product",
  },
  {
    id: 14,
    name: "Rajesh Patel",
    age: 36,
    email: "rajesh.patel@techcorp.com",
    salary: 122000,
    department: "Engineering",
  },
  {
    id: 15,
    name: "Amélie Dubois",
    age: 32,
    email: "amelie.dubois@techcorp.com",
    salary: 92000,
    department: "Sales",
  },
  {
    id: 16,
    name: "Jin-Ho Park",
    age: 41,
    email: "jinho.park@techcorp.com",
    salary: 148000,
    department: "AI Research",
  },
  {
    id: 17,
    name: "Leila Nakamura",
    age: 25,
    email: "leila.nakamura@techcorp.com",
    salary: 71000,
    department: "Marketing",
  },
  {
    id: 18,
    name: "Viktor Petrov",
    age: 34,
    email: "viktor.petrov@techcorp.com",
    salary: 115000,
    department: "Product",
  },
  {
    id: 19,
    name: "Aisha Osman",
    age: 29,
    email: "aisha.osman@techcorp.com",
    salary: 87000,
    department: "UX Design",
  },
  {
    id: 20,
    name: "Marco Silva",
    age: 37,
    email: "marco.silva@techcorp.com",
    salary: 128000,
    department: "DevOps",
  },
];

const headers: ReactHeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: "1fr",
    isSortable: true,
    type: "string",
  },
  {
    accessor: "age",
    label: "Age",
    width: 120,
    isSortable: true,
    type: "number",
  },
  {
    accessor: "department",
    label: "Department",
    width: 150,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "email",
    label: "Email",
    width: 200,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    isSortable: true,
    type: "number",
    cellRenderer: ({ row }: CellRendererProps) => `$${(row.salary || 0).toLocaleString()}`,
    align: "right",
  },
];

const ExternalSortDemo = ({ theme }: { theme?: Theme }) => {
  const [sortConfig, setSortConfig] = useState<SortColumn | null>(null);

  // Sort data externally based on sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig) return sampleData;

    const sorted = [...sampleData].sort((a, b) => {
      const accessor = sortConfig.key.accessor as keyof EmployeeData;
      const aValue = a[accessor];
      const bValue = b[accessor];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (sortConfig.key.type === "number") {
        comparison = (aValue as number) - (bValue as number);
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [sortConfig]);

  return (
    <div className="space-y-4">
      {/* Display current sort info */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>External Sort Status:</strong>{" "}
          {sortConfig
            ? `Sorting by ${sortConfig.key.label} (${sortConfig.direction})`
            : "No sorting applied"}
        </p>
      </div>

      <SimpleTable
        defaultHeaders={headers}
        rows={sortedData} // We provide the pre-sorted data
        onSortChange={setSortConfig} // Handle sort changes externally
        externalSortHandling={true} // Disable internal sorting logic
        columnResizing={true}
        columnReordering={true}
        height={"338px"}
        theme={theme}
      />
    </div>
  );
};

export default ExternalSortDemo;
