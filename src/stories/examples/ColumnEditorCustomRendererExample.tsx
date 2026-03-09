import React, { useRef } from "react";
import { SimpleTable, TableRefType } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import { ColumnEditorCustomRendererProps } from "../../types/ColumnEditorConfig";
import { UniversalTableProps } from "./StoryWrapper";

/** Returns true if current headers differ from default in position, visibility, width, or pinned section */
function hasHeaderChanged(
  currentHeaders: HeaderObject[],
  defaultHeaders: HeaderObject[],
): boolean {
  const filter = (h: HeaderObject[]) =>
    h.filter((x) => !x.isSelectionColumn && !x.excludeFromRender);
  const current = filter(currentHeaders);
  const defaults = filter(defaultHeaders);

  if (current.length !== defaults.length) return true;

  const headerDiffers = (cur: HeaderObject, def: HeaderObject): boolean => {
    if (cur.accessor !== def.accessor) return true;
    if (!!cur.hide !== !!def.hide) return true;
    if (cur.width !== def.width) return true;
    if (cur.pinned !== def.pinned) return true;
    const curChildren = filter(cur.children ?? []);
    const defChildren = filter(def.children ?? []);
    if (curChildren.length !== defChildren.length) return true;
    return curChildren.some((c, i) => headerDiffers(c, defChildren[i]));
  };

  return current.some((cur, i) => cur.accessor !== defaults[i].accessor || headerDiffers(cur, defaults[i]));
}

// Sample data
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
];

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Employee Name",
    width: 180,
    filterable: true,
    type: "string",
  },
  {
    accessor: "age",
    label: "Age",
    width: 80,
    filterable: true,
    type: "number",
  },
  {
    accessor: "department",
    label: "Department",
    width: 140,
    filterable: true,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    filterable: true,
    type: "number",
    valueFormatter: ({ value }) => `$${(value || 0).toLocaleString()}`,
    align: "right",
  },
  {
    accessor: "status",
    label: "Status",
    width: 100,
    filterable: true,
    type: "string",
  },
  {
    accessor: "location",
    label: "Location",
    width: 140,
    filterable: true,
    type: "string",
  },
];

export const columnEditorCustomRendererExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  editColumns: true,
  maxHeight: "600px",
};

const ColumnEditorCustomRendererExampleComponent: React.FC<UniversalTableProps> = (props) => {
  const tableRef = useRef<TableRefType>(null);
  const defaultHeaders = headers;

  const customRenderer = ({
    searchSection,
    listSection,
    resetColumns,
  }: ColumnEditorCustomRendererProps) => {
    const currentHeaders = tableRef.current?.getHeaders() ?? [];
    const showResetButton = hasHeaderChanged(currentHeaders, defaultHeaders);

    return (
      <>
        {searchSection}
        {listSection}
        {showResetButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetColumns();
            }}
            style={{
              marginTop: 8,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
              border: "1px solid #ccc",
              borderRadius: 4,
              backgroundColor: "#f5f5f5",
            }}
          >
            Reset columns
          </button>
        )}
      </>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <SimpleTable
        {...props}
        defaultHeaders={headers}
        rows={sampleData}
        columnResizing={props.columnResizing ?? true}
        columnReordering={props.columnReordering ?? true}
        editColumns={props.editColumns ?? true}
        columnEditorConfig={{
          text: "Columns",
          searchEnabled: true,
          searchPlaceholder: "Search columns...",
          customRenderer,
        }}
        height={props.height ?? "600px"}
        theme={"light"}
        tableRef={tableRef}
      />
    </div>
  );
};

export default ColumnEditorCustomRendererExampleComponent;
