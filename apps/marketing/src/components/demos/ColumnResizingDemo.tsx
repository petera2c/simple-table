import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { useState, useEffect } from "react";

// Storage key for persisting column widths
const STORAGE_KEY = "columnResizingDemo_widths";

// Define initial headers
const initialHeaders: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "First Name", width: "1fr", minWidth: 100, type: "string" },
  { accessor: "age", label: "Age", width: "1fr", minWidth: 50, type: "string" },
  { accessor: "role", label: "Role", width: 150, align: "right", type: "number" },
  { accessor: "department", label: "Department", width: "1fr", minWidth: 100, type: "string" },
  { accessor: "startDate", label: "Start Date", width: 150, type: "date" },
];

// Sample data
const EMPLOYEE_DATA = [
  {
    id: 1,
    name: "Dr. Marina Silva",
    age: 38,
    role: "Marine Biologist",
    department: "Research",
    startDate: "2019-03-15",
  },
  {
    id: 2,
    name: "Captain Alex Torres",
    age: 45,
    role: "Research Vessel Captain",
    department: "Operations",
    startDate: "2017-08-20",
  },
  {
    id: 3,
    name: "Dr. Coral Chen",
    age: 34,
    role: "Oceanographer",
    department: "Research",
    startDate: "2020-01-12",
  },
  {
    id: 4,
    name: "Finn O'Brien",
    age: 27,
    role: "Research Assistant",
    department: "Research",
    startDate: "2022-06-08",
  },
  {
    id: 5,
    name: "Reef Nakamura",
    age: 31,
    role: "Dive Safety Officer",
    department: "Safety",
    startDate: "2021-02-14",
  },
  {
    id: 6,
    name: "Tide Rodriguez",
    age: 29,
    role: "Equipment Specialist",
    department: "Technical",
    startDate: "2021-09-03",
  },
  {
    id: 7,
    name: "Dr. Ocean Williams",
    age: 42,
    role: "Research Director",
    department: "Leadership",
    startDate: "2016-05-10",
  },
  {
    id: 8,
    name: "Wave Petrov",
    age: 26,
    role: "Data Analyst",
    department: "Analysis",
    startDate: "2022-11-22",
  },
  {
    id: 9,
    name: "Pearl Kim",
    age: 33,
    role: "Laboratory Manager",
    department: "Laboratory",
    startDate: "2020-07-18",
  },
  {
    id: 10,
    name: "Current Hassan",
    age: 28,
    role: "Field Coordinator",
    department: "Operations",
    startDate: "2021-12-05",
  },
  {
    id: 11,
    name: "Abyss Thompson",
    age: 30,
    role: "ROV Operator",
    department: "Technical",
    startDate: "2021-04-20",
  },
  {
    id: 12,
    name: "Dr. Depth Martinez",
    age: 39,
    role: "Senior Researcher",
    department: "Research",
    startDate: "2018-10-14",
  },
];

const ColumnResizingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [headers, setHeaders] = useState<ReactHeaderObject[]>(initialHeaders);
  const [saveMessage, setSaveMessage] = useState<string>("");

  // Load saved column widths from localStorage on mount
  useEffect(() => {
    try {
      const savedWidths = localStorage.getItem(STORAGE_KEY);
      if (savedWidths) {
        const widthMap = JSON.parse(savedWidths);
        const updatedHeaders = initialHeaders.map((header) => ({
          ...header,
          width: widthMap[header.accessor] ?? header.width,
        }));
        setHeaders(updatedHeaders);
      }
    } catch (error) {
      console.error("Failed to load saved column widths:", error);
    }
  }, []);

  // Handle column width changes
  const handleColumnWidthChange = (updatedHeaders: ReactHeaderObject[]) => {
    try {
      // Extract widths into a simple object
      const widthMap = updatedHeaders.reduce(
        (acc, header) => {
          acc[header.accessor] = header.width;
          return acc;
        },
        {} as Record<string, number | string>,
      );

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widthMap));

      // Update headers state
      setHeaders(updatedHeaders);

      // Show save confirmation
      setSaveMessage("Column widths saved! ✓");
      setTimeout(() => setSaveMessage(""), 2000);
    } catch (error) {
      console.error("Failed to save column widths:", error);
      setSaveMessage("Failed to save widths");
      setTimeout(() => setSaveMessage(""), 2000);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {saveMessage && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "#10b981",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.2s ease-in",
          }}
        >
          {saveMessage}
        </div>
      )}
      <SimpleTable
        columnResizing
        defaultHeaders={headers}
        rows={EMPLOYEE_DATA}
        height={height}
        theme={theme}
        onColumnWidthChange={handleColumnWidthChange}
      />
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ColumnResizingDemo;
