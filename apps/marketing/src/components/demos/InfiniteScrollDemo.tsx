import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import { useState, useCallback } from "react";
import "@simple-table/react/styles.css";

// Define headers
const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "User Name", width: "1fr", type: "string" },
  { accessor: "email", label: "Email", width: "1fr", type: "string" },
  { accessor: "department", label: "Department", width: 120, type: "string" },
  { accessor: "status", label: "Status", width: 100, type: "string" },
];

// Generate unique sample data for SimpleTable infinite scroll demo
const generateSampleData = (startId: number, count: number) => {
  const departments = [
    "Data Science",
    "Cloud Architecture",
    "Product Design",
    "DevOps Engineering",
    "AI Research",
    "Cybersecurity",
    "Mobile Development",
    "UI/UX Design",
    "Backend Systems",
    "Frontend Development",
  ];
  const statuses = ["Active", "Remote", "On Leave", "Contractor"];
  const techFirstNames = [
    "Aiden",
    "Blake",
    "Casey",
    "Drew",
    "Ellis",
    "Finley",
    "Gray",
    "Harper",
    "Indigo",
    "Jordan",
    "Kai",
    "Lane",
    "Morgan",
    "Nova",
    "Orion",
    "Phoenix",
    "Quinn",
    "River",
    "Sage",
    "Taylor",
  ];
  const techLastNames = [
    "Chen",
    "Patel",
    "Kim",
    "Singh",
    "Liu",
    "Anderson",
    "Wilson",
    "Brown",
    "Taylor",
    "Moore",
    "Jackson",
    "White",
    "Harris",
    "Clark",
    "Lewis",
    "Walker",
    "Hall",
    "Allen",
    "Young",
    "King",
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    const firstName = techFirstNames[Math.floor(Math.random() * techFirstNames.length)];
    const lastName = techLastNames[Math.floor(Math.random() * techLastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@simpletable.com`;

    return {
      id,
      name: `${firstName} ${lastName}`,
      email,
      department: departments[Math.floor(Math.random() * departments.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  });
};

// Initial data (first 20 records)
const initialData = generateSampleData(1, 20);

const InfiniteScrollDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [rows, setRows] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Simulate loading more data
  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Generate next batch of data
      const nextStartId = rows.length + 1;
      const newData = generateSampleData(nextStartId, 15);

      // Stop loading more after 200 records for demo purposes
      if (nextStartId > 200) {
        setHasMore(false);
      } else {
        setRows((prevRows) => [...prevRows, ...newData]);
      }
    } catch (error) {
      console.error("Failed to load more data:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, rows.length]);

  return (
    <div>
      <SimpleTable
        defaultHeaders={headers}
        rows={rows}
        height={height}
        onLoadMore={handleLoadMore}
        theme={theme}
      />

      {loading && (
        <div className="text-center py-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Loading more data...
          </div>
        </div>
      )}

      {!hasMore && rows.length > 20 && (
        <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-500">
          No more data to load (loaded {rows.length} records)
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollDemo;
