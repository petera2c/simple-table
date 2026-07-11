import { useRef, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, TableAPI, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

type Employee = {
  id: number;
  name: string;
  department: string;
  role: string;
};

const EMPLOYEES: Employee[] = [
  { id: 1, name: "Alice Johnson", department: "Engineering", role: "Staff Engineer" },
  { id: 2, name: "Bob Smith", department: "Design", role: "Product Designer" },
  { id: 3, name: "Charlie Brown", department: "Engineering", role: "Frontend Engineer" },
  { id: 4, name: "Diana Prince", department: "Marketing", role: "Growth Lead" },
  { id: 5, name: "Eve Adams", department: "Sales", role: "Account Executive" },
  { id: 6, name: "Frank Miller", department: "Engineering", role: "Platform Engineer" },
];

const HEADERS: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 70, type: "number", isSortable: true },
  { accessor: "name", label: "Name", width: "1fr", minWidth: 140, type: "string", isSortable: true },
  { accessor: "department", label: "Department", width: 140, type: "string", isSortable: true },
  { accessor: "role", label: "Role", width: 160, type: "string", isSortable: true },
];

type DemoProps = { height?: string | number; theme?: Theme };

const selectedLabel = (selected: Employee[]) =>
  selected.length ? selected.map((e) => e.name).join(", ") : "None";

export function RowSelectionSingleDemo({ height = "260px", theme }: DemoProps) {
  const tableRef = useRef<TableAPI>(null);
  const [selected, setSelected] = useState<Employee[]>([]);

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
          Selected: {selectedLabel(selected)}
        </p>
      </div>
      <SimpleTable
        ref={tableRef}
        defaultHeaders={HEADERS}
        rows={EMPLOYEES}
        enableRowSelection
        rowSelectionMode="single"
        getRowId={({ row }) => String((row as Employee).id)}
        onRowSelectionChange={() => {
          setSelected((tableRef.current?.getSelectedRowsData() as Employee[]) ?? []);
        }}
        height={height}
        theme={theme}
        columnResizing
      />
    </div>
  );
}

export function RowSelectionClickDemo({ height = "260px", theme }: DemoProps) {
  const tableRef = useRef<TableAPI>(null);
  const [selected, setSelected] = useState<Employee[]>([]);

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
          Selected: {selectedLabel(selected)}
        </p>
      </div>
      <SimpleTable
        ref={tableRef}
        defaultHeaders={HEADERS}
        rows={EMPLOYEES}
        enableRowSelection
        selectRowOnClick
        showRowSelectionColumn={false}
        selectableCells={false}
        getRowId={({ row }) => String((row as Employee).id)}
        onRowSelectionChange={() => {
          setSelected((tableRef.current?.getSelectedRowsData() as Employee[]) ?? []);
        }}
        height={height}
        theme={theme}
        columnResizing
      />
    </div>
  );
}

export function RowSelectionApiDemo({ height = "260px", theme }: DemoProps) {
  const tableRef = useRef<TableAPI>(null);
  const [selected, setSelected] = useState<Employee[]>([]);
  const [statusMessage, setStatusMessage] = useState("Ready");

  const syncSelection = () => {
    setSelected((tableRef.current?.getSelectedRowsData() as Employee[]) ?? []);
  };

  const selectFirst = () => {
    const row = tableRef.current?.getVisibleRows()[0];
    if (!row) return;
    const id = Array.isArray(row.rowId) ? row.rowId.join("-") : String(row.rowId);
    tableRef.current?.selectRow(id);
    setStatusMessage(`selectRow("${id}")`);
    syncSelection();
  };

  const toggleSecond = () => {
    const row = tableRef.current?.getVisibleRows()[1];
    if (!row) return;
    const id = Array.isArray(row.rowId) ? row.rowId.join("-") : String(row.rowId);
    tableRef.current?.toggleRowSelection(id);
    setStatusMessage(`toggleRowSelection("${id}")`);
    syncSelection();
  };

  const clearAll = () => {
    tableRef.current?.clearRowSelection();
    setStatusMessage("clearRowSelection()");
    syncSelection();
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
          {statusMessage} · Selected: {selectedLabel(selected)}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={selectFirst}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Select first row
        </button>
        <button
          type="button"
          onClick={toggleSecond}
          className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Toggle second row
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Clear selection
        </button>
      </div>

      <SimpleTable
        ref={tableRef}
        defaultHeaders={HEADERS}
        rows={EMPLOYEES}
        enableRowSelection
        getRowId={({ row }) => String((row as Employee).id)}
        onRowSelectionChange={syncSelection}
        height={height}
        theme={theme}
        columnResizing
      />
    </div>
  );
}

export default RowSelectionSingleDemo;
