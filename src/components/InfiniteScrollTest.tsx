import React, { useState, useEffect, useRef, useMemo } from "react";
import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import VisibleRow from "../types/VisibleRow";

// Props for the component
interface InfiniteScrollGridProps {
  headers: HeaderObject[];
  pageSize?: number;
  rowHeight?: number;
  containerHeight?: number;
}

// Simulated data fetching function with realistic names
const fetchRows = async (page: number, pageSize: number): Promise<Row[]> => {
  const start = (page - 1) * pageSize;

  const firstNames = [
    "James",
    "Emma",
    "Liam",
    "Olivia",
    "Noah",
    "Ava",
    "Ethan",
    "Sophia",
    "Mason",
    "Isabella",
    "Lucas",
    "Mia",
    "Alexander",
    "Charlotte",
    "Henry",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Brown",
    "Taylor",
    "Wilson",
    "Davis",
    "Clark",
    "Lewis",
    "Walker",
    "Hall",
    "Allen",
    "Young",
    "King",
    "Wright",
    "Scott",
  ];
  const roles = ["Manager", "Engineer", "Analyst", "Designer", "Coordinator"];

  const newRows = Array.from({ length: pageSize / 3 }, (_, i) => {
    const groupIndex = start + i;
    const groupFirstName = firstNames[groupIndex % firstNames.length];
    const groupLastName = lastNames[groupIndex % lastNames.length];

    return {
      rowMeta: {
        rowId: groupIndex,
        isExpanded: false,
        children: Array.from({ length: 2 }, (_, j) => {
          const subgroupIndex = groupIndex * 100 + j;
          const subgroupFirstName = firstNames[subgroupIndex % firstNames.length];
          const subgroupLastName = lastNames[subgroupIndex % lastNames.length];

          return {
            rowMeta: {
              rowId: subgroupIndex,
              isExpanded: false,
              children: Array.from({ length: 3 }, (_, k) => {
                const itemIndex = groupIndex * 10000 + j * 100 + k;
                const itemFirstName = firstNames[itemIndex % firstNames.length];
                const itemLastName = lastNames[itemIndex % lastNames.length];
                const role = roles[itemIndex % roles.length];

                return {
                  rowMeta: { rowId: itemIndex },
                  rowData: {
                    name: `${itemFirstName} ${itemLastName}`,
                    age: Math.floor(Math.random() * (65 - 22) + 22),
                    active: Math.random() > 0.5,
                    role: role,
                  },
                };
              }),
            },
            rowData: {
              name: `${subgroupFirstName} ${subgroupLastName} (Team)`,
              age: Math.floor(Math.random() * (50 - 30) + 30),
              active: true,
            },
          };
        }),
      },
      rowData: {
        name: `${groupFirstName} ${groupLastName} (Dept)`,
        age: Math.floor(Math.random() * (60 - 40) + 40),
        active: true,
      },
    };
  });

  return newRows;
};

// Calculate total row count recursively
const getTotalRowCount = (rows: Row[]): number => {
  let count = 0;
  const countRows = (rowList: Row[]) => {
    rowList.forEach((row) => {
      count += 1;
      if (row.rowMeta.isExpanded && row.rowMeta.children) {
        countRows(row.rowMeta.children);
      }
    });
  };
  countRows(rows);
  return count;
};

// Get visible rows with their absolute positions
const getVisibleRows = (rows: Row[], scrollTop: number, containerHeight: number, rowHeight: number): VisibleRow[] => {
  const visibleRows: VisibleRow[] = [];
  let currentPosition = 0;
  const startOffset = Math.max(0, scrollTop - rowHeight * 5);
  const endOffset = scrollTop + containerHeight + rowHeight * 5;

  const traverseRows = (rowList: Row[], depth: number) => {
    for (const row of rowList) {
      const rowTop = currentPosition * rowHeight;
      if (rowTop >= endOffset) break;

      if (rowTop + rowHeight > startOffset) {
        visibleRows.push({
          row,
          depth,
          position: currentPosition,
          isLastGroupRow: Boolean(row.rowMeta.children?.length) && depth > 1,
        });
      }

      currentPosition += 1;

      if (row.rowMeta.isExpanded && row.rowMeta.children) {
        traverseRows(row.rowMeta.children, depth + 1);
      }
    }
  };

  traverseRows(rows, 0);
  return visibleRows;
};

const InfiniteScrollGrid: React.FC<InfiniteScrollGridProps> = ({
  headers,
  pageSize = 15,
  rowHeight = 50,
  containerHeight = 600,
}) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    loadMoreRows();
  }, []);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);
    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [rows]);

  const loadMoreRows = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const newRows = await fetchRows(page, pageSize);
    setRows((prevRows) => [...prevRows, ...newRows]);
    setPage((prevPage) => prevPage + 1);
    setIsLoading(false);
    if (newRows.length < pageSize / 3) setHasMore(false);
  };

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoading) {
      loadMoreRows();
    }
  };

  const toggleRow = (rowId: number) => {
    const updateRow = (row: Row): Row => {
      if (row.rowMeta.rowId === rowId && row.rowMeta.children) {
        return { ...row, rowMeta: { ...row.rowMeta, isExpanded: !row.rowMeta.isExpanded } };
      }
      if (row.rowMeta.children) {
        return { ...row, rowMeta: { ...row.rowMeta, children: row.rowMeta.children.map(updateRow) } };
      }
      return row;
    };
    setRows((prevRows) => prevRows.map(updateRow));
  };

  const [scrollTop, setScrollTop] = useState<number>(0);
  const totalRowCount = getTotalRowCount(rows);
  const totalHeight = totalRowCount * rowHeight;

  const visibleRows = useMemo(
    () => getVisibleRows(rows, scrollTop, containerHeight, rowHeight),
    [rows, scrollTop, containerHeight, rowHeight]
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    if (scrollTimeoutRef.current) {
      cancelAnimationFrame(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = requestAnimationFrame(() => {
      setScrollTop(newScrollTop);
    });
  };

  const gridTemplateColumns = headers.map((header) => `${header.width}px`).join(" ");

  return (
    <div
      ref={containerRef}
      style={{
        height: `${containerHeight}px`,
        overflowY: "auto",
        border: "1px solid #e0e6ed",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        position: "relative",
      }}
      onScroll={handleScroll}
    >
      {/* Grid Container */}
      <div
        style={{
          width: "100%",
          position: "relative",
          height: `${totalHeight}px`,
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns,
            position: "sticky",
            top: 0,
            background: "#f7f9fc",
            zIndex: 1,
            borderBottom: "1px solid #d3dce6",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
            color: "#2c3e50",
            padding: "4px 0",
          }}
        >
          {headers.map((header) => (
            <div
              key={header.accessor}
              style={{
                textAlign: header.align || "left",
                padding: "10px",
              }}
            >
              {header.label}
            </div>
          ))}
        </div>

        {/* Virtualized Rows */}
        {visibleRows.map(({ row, depth, position }) => (
          <div
            key={row.rowMeta.rowId}
            style={{
              display: "grid",
              gridTemplateColumns,
              position: "absolute",
              top: `${position * rowHeight}px`,
              width: "100%",
              height: `${rowHeight}px`,
              background: row.rowMeta.children ? "#eef2f7" : "#ffffff",
              transform: "translateZ(0)",
              borderBottom: "1px solid #e0e6ed",
              transition: "background 0.2s ease",
            }}
          >
            {headers.map((header, colIndex) => (
              <div
                key={`${row.rowMeta.rowId}-${header.accessor}`}
                style={{
                  textAlign: header.align || "left",
                  paddingLeft: colIndex === 0 ? `${depth * 20 + 10}px` : "10px",
                  paddingRight: "10px",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Roboto, sans-serif",
                  color: "#34495e",
                  fontSize: "14px",
                  cursor: colIndex === 0 && row.rowMeta.children ? "pointer" : "default",
                }}
                onClick={colIndex === 0 && row.rowMeta.children ? () => toggleRow(row.rowMeta.rowId) : undefined}
              >
                {header.cellRenderer ? header.cellRenderer(row) : row.rowData[header.accessor] ?? ""}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Loading/Footer */}
      <div
        style={{
          height: "20px",
          position: "relative",
          textAlign: "center",
          color: "#7f8c8d",
          fontFamily: "Roboto, sans-serif",
          fontSize: "12px",
        }}
      >
        {isLoading && <p>Loading...</p>}
        {!hasMore && <p>No more rows</p>}
      </div>
    </div>
  );
};

export default InfiniteScrollGrid;

// Usage example:
const headers: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 200 },
  { accessor: "age", label: "Age", width: 100, align: "center" },
  { accessor: "active", label: "Active", width: 100, align: "center" },
];

// <InfiniteScrollGrid headers={headers} pageSize={15} rowHeight={50} containerHeight={600} />
