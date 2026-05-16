import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import { useState, useCallback, useRef } from "react";
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
  // Synchronous re-entry guard. The `loading` state alone can't block
  // back-to-back invocations: between the first `setLoading(true)` and React's
  // next commit, the callback the table is holding still has `loading=false`
  // in its closure, so multiple scroll-RAF ticks would all sneak past the guard.
  const loadingRef = useRef(false);

  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Compute the next id from the live `prev` so duplicate ids can't appear
      // even if a stale closure ever runs this path.
      setRows((prev) => {
        const nextStartId = prev.length + 1;
        if (nextStartId > 200) {
          setHasMore(false);
          return prev;
        }
        return [...prev, ...generateSampleData(nextStartId, 15)];
      });
    } catch (error) {
      console.error("Failed to load more data:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore]);

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
