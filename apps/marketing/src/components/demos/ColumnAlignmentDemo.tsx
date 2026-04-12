import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Initial headers with different alignments
const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, align: "left", type: "number" },
  { accessor: "name", label: "Name", minWidth: 100, width: "1fr", align: "center", type: "string" },
  { accessor: "score", label: "Score", width: 120, align: "right", type: "number" },
  { accessor: "rating", label: "Rating", width: 120, align: "right", type: "number" },
  { accessor: "status", label: "Status", width: 120, align: "left", type: "string" },
];

// Sample data
const EMPLOYEE_DATA = [
  {
    id: 1,
    name: "Camila Rodriguez",
    score: 94,
    rating: 4.9,
    status: "Active",
  },
  {
    id: 2,
    name: "Enzo Silva",
    score: 89,
    rating: 4.6,
    status: "Active",
  },
  {
    id: 3,
    name: "Yuki Kim",
    score: 96,
    rating: 4.8,
    status: "Active",
  },
  {
    id: 4,
    name: "Leandro Nakamura",
    score: 81,
    rating: 4.2,
    status: "Injured",
  },
  {
    id: 5,
    name: "Nadia Petrov",
    score: 87,
    rating: 4.4,
    status: "Active",
  },
  {
    id: 6,
    name: "Taj Chen",
    score: 92,
    rating: 4.7,
    status: "Active",
  },
  {
    id: 7,
    name: "Mira Thompson",
    score: 90,
    rating: 4.5,
    status: "Active",
  },
  {
    id: 8,
    name: "Juno Garcia",
    score: 84,
    rating: 4.3,
    status: "Inactive",
  },
  {
    id: 9,
    name: "Caspian Williams",
    score: 95,
    rating: 4.9,
    status: "Active",
  },
  {
    id: 10,
    name: "Vera Martinez",
    score: 88,
    rating: 4.4,
    status: "Active",
  },
  {
    id: 11,
    name: "Zion Hassan",
    score: 93,
    rating: 4.8,
    status: "Active",
  },
  {
    id: 12,
    name: "Kira Kumar",
    score: 91,
    rating: 4.6,
    status: "Resting",
  },
];

const ColumnAlignmentDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  // Change column alignment
  const onColumnOrderChange = (newHeaders: ReactHeaderObject[]) => {
    void newHeaders;
    // Call api to change alignment in the database
  };

  return (
    <SimpleTable
      defaultHeaders={headers}
      onColumnOrderChange={onColumnOrderChange}
      rows={EMPLOYEE_DATA}
      height={height}
      theme={theme}
    />
  );
};

export default ColumnAlignmentDemo;
