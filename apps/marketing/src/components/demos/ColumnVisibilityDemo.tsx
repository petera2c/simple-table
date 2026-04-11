import { SimpleTable } from "@simple-table/react";
import type { ColumnEditorRowRendererProps, ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { useMemo, useCallback } from "react";

const STORAGE_KEY = "columnVisibilityDemo";

// Define base headers structure
const BASE_HEADERS: ReactHeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 60,
    type: "number",
  },
  { accessor: "name", label: "Name", minWidth: 100, width: "1fr", type: "string" },
  { accessor: "email", label: "Email", minWidth: 100, width: "1fr", type: "string" },
  { accessor: "role", label: "Role", width: 150, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
];

// Sample data
const EMPLOYEE_DATA = [
  {
    id: 1,
    name: "Valentino Rosso",
    email: "valentino.rosso@fashion.com",
    age: 35,
    role: "Creative Director",
    department: "Design",
    startDate: "2017-04-12",
  },
  {
    id: 2,
    name: "Coco Delacroix",
    email: "coco.delacroix@fashion.com",
    age: 28,
    role: "Fashion Designer",
    department: "Design",
    startDate: "2020-08-15",
  },
  {
    id: 3,
    name: "Armando Silva",
    email: "armando.silva@fashion.com",
    age: 42,
    role: "Studio Manager",
    department: "Operations",
    startDate: "2016-02-08",
  },
  {
    id: 4,
    name: "Chanel Kumar",
    email: "chanel.kumar@fashion.com",
    age: 25,
    role: "Pattern Maker",
    department: "Production",
    startDate: "2022-06-20",
  },
  {
    id: 5,
    name: "Versace Chen",
    email: "versace.chen@fashion.com",
    age: 31,
    role: "Textile Designer",
    department: "Materials",
    startDate: "2019-11-03",
  },
  {
    id: 6,
    name: "Gucci Hassan",
    email: "gucci.hassan@fashion.com",
    age: 29,
    role: "Sample Coordinator",
    department: "Production",
    startDate: "2021-03-18",
  },
  {
    id: 7,
    name: "Prada Williams",
    email: "prada.williams@fashion.com",
    age: 33,
    role: "Fashion Stylist",
    department: "Styling",
    startDate: "2020-01-22",
  },
  {
    id: 8,
    name: "Dior Martinez",
    email: "dior.martinez@fashion.com",
    age: 27,
    role: "Technical Designer",
    department: "Technical",
    startDate: "2021-09-14",
  },
  {
    id: 9,
    name: "Hermès Okafor",
    email: "hermes.okafor@fashion.com",
    age: 30,
    role: "Color Specialist",
    department: "Design",
    startDate: "2020-05-07",
  },
  {
    id: 10,
    name: "Balenciaga Kim",
    email: "balenciaga.kim@fashion.com",
    age: 32,
    role: "Fit Specialist",
    department: "Production",
    startDate: "2019-07-11",
  },
  {
    id: 11,
    name: "Yves Thompson",
    email: "yves.thompson@fashion.com",
    age: 26,
    role: "Trend Researcher",
    department: "Research",
    startDate: "2022-02-28",
  },
  {
    id: 12,
    name: "Givenchy Nakamura",
    email: "givenchy.nakamura@fashion.com",
    age: 38,
    role: "Production Manager",
    department: "Production",
    startDate: "2018-10-05",
  },
];

const ColumnVisibilityDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  // Load saved visibility state from localStorage
  const getSavedVisibility = useCallback(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, []);

  // Memoize headers with saved visibility state applied
  const headers = useMemo(() => {
    const savedVisibility = getSavedVisibility();

    return BASE_HEADERS.map((header) => ({
      ...header,
      // Apply saved visibility state, defaulting email to hidden if no saved state
      hide:
        savedVisibility[header.accessor] === false ||
        (savedVisibility[header.accessor] === undefined && header.accessor === "email"),
    }));
  }, [getSavedVisibility]);

  // Save visibility changes to localStorage
  const handleVisibilityChange = useCallback((visibilityState: Record<string, boolean>) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibilityState));
    } catch (error) {
      console.error("Failed to save column visibility:", error);
    }
  }, []);

  return (
    <SimpleTable
      defaultHeaders={headers}
      editColumns
      editColumnsInitOpen
      rows={EMPLOYEE_DATA}
      height={height}
      theme={theme}
      onColumnVisibilityChange={handleVisibilityChange}
      columnEditorConfig={{
        rowRenderer: ({ components }: ColumnEditorRowRendererProps) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              paddingRight: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {components?.expandIcon}
              {components?.checkbox}
              {components?.labelContent}
            </div>
            <div>{components?.dragIcon}</div>
          </div>
        ),
      }}
    />
  );
};

export default ColumnVisibilityDemo;
