import { SimpleTable } from "@simple-table/react";
import type {
  ColumnEditorCustomRendererProps,
  ReactHeaderObject,
  Row,
  TableAPI,
  Theme,
  ValueFormatterProps,
} from "@simple-table/react";
import "@simple-table/react/styles.css";
import { useRef } from "react";

const sampleData: Row[] = [
  {
    id: 1,
    name: "Alice Johnson",
    age: 28,
    department: "Engineering",
    salary: 95000,
    status: "Active",
    location: "New York",
  },
  {
    id: 2,
    name: "Bob Smith",
    age: 35,
    department: "Sales",
    salary: 75000,
    status: "Active",
    location: "Los Angeles",
  },
  {
    id: 3,
    name: "Charlie Davis",
    age: 42,
    department: "Engineering",
    salary: 110000,
    status: "Active",
    location: "San Francisco",
  },
  {
    id: 4,
    name: "Diana Prince",
    age: 31,
    department: "Marketing",
    salary: 82000,
    status: "Inactive",
    location: "Chicago",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    age: 29,
    department: "Sales",
    salary: 78000,
    status: "Active",
    location: "Boston",
  },
  {
    id: 6,
    name: "Frank Johnson",
    age: 32,
    department: "Engineering",
    salary: 105000,
    status: "Active",
    location: "Seattle",
  },
  {
    id: 7,
    name: "Grace Lee",
    age: 28,
    department: "Marketing",
    salary: 85000,
    status: "Active",
    location: "New York",
  },
  {
    id: 8,
    name: "Henry Brown",
    age: 33,
    department: "Sales",
    salary: 80000,
    status: "Active",
    location: "New York",
  },

  {
    id: 9,
    name: "Ivy Patel",
    age: 29,
    department: "Engineering",
    salary: 115000,
    status: "Active",
    location: "New York",
  },
];

const headers: ReactHeaderObject[] = [
  { accessor: "name", label: "Employee Name", width: 180, filterable: true, type: "string" },
  { accessor: "age", label: "Age", width: 80, filterable: true, type: "number" },
  { accessor: "department", label: "Department", width: 140, filterable: true, type: "string" },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    filterable: true,
    type: "number",
    valueFormatter: ({ value }: ValueFormatterProps) => `$${(value || 0).toLocaleString()}`,
    align: "right",
  },
  { accessor: "status", label: "Status", width: 100, filterable: true, type: "string" },
  { accessor: "location", label: "Location", width: 140, filterable: true, type: "string" },
];

function hasHeaderChanged(
  currentHeaders: readonly ReactHeaderObject[],
  defaultHeaders: readonly ReactHeaderObject[],
): boolean {
  const filter = (h: readonly ReactHeaderObject[]) =>
    h.filter(
      (x) =>
        !(x as ReactHeaderObject & { isSelectionColumn?: boolean }).isSelectionColumn &&
        !x.excludeFromRender,
    );
  const current = filter(currentHeaders);
  const defaults = filter(defaultHeaders);

  if (current.length !== defaults.length) return true;

  const headerDiffers = (cur: ReactHeaderObject, def: ReactHeaderObject): boolean => {
    if (cur.accessor !== def.accessor) {
      console.log("accessor differs", cur.accessor, def.accessor);
      return true;
    }
    if (!!cur.hide !== !!def.hide) {
      console.log("hide differs", cur.hide, def.hide);
      return true;
    }

    if (cur.pinned !== def.pinned) {
      console.log("pinned differs", cur.pinned, def.pinned);
      return true;
    }
    const curChildren = filter((cur.children ?? []) as ReactHeaderObject[]);
    const defChildren = filter((def.children ?? []) as ReactHeaderObject[]);
    if (curChildren.length !== defChildren.length) return true;
    return curChildren.some((c, i) => headerDiffers(c, defChildren[i]));
  };

  return current.some(
    (cur, i) => cur.accessor !== defaults[i].accessor || headerDiffers(cur, defaults[i]),
  );
}

const ColumnEditorCustomRendererDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI>(null);
  const defaultHeaders = headers;
  console.log("defaultHeaders", defaultHeaders);

  const customRenderer = ({
    searchSection,
    listSection,
    resetColumns,
    headers: currentHeaders,
  }: ColumnEditorCustomRendererProps) => {
    const showResetButton = hasHeaderChanged(
      currentHeaders as ReactHeaderObject[],
      defaultHeaders,
    );

    return (
      <>
        {searchSection}
        {listSection}
        {showResetButton && (
          <div style={{ padding: "4px 8px" }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetColumns?.();
              }}
              style={{
                width: "100%",
                padding: "4px 8px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                backgroundColor: "#f9fafb",
                color: "#374151",
                transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
              }}
            >
              Reset columns
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <SimpleTable
        autoExpandColumns
        defaultHeaders={headers}
        rows={sampleData}
        columnResizing
        columnReordering
        editColumns
        columnEditorConfig={{
          text: "Columns",
          searchEnabled: true,
          searchPlaceholder: "Search columns...",
          customRenderer,
        }}
        height={height}
        theme={theme}
        ref={tableRef}
      />
    </div>
  );
};

export default ColumnEditorCustomRendererDemo;
