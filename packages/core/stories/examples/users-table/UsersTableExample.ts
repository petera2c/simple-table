/**
 * Users table – large grouped grid matching the Angular UsersTableComponent.
 * 20 departments, 100k child users, pinned expandable name, resize on,
 * groups start open, row motion off.
 */
import type { ColumnDef, Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";

const DEPARTMENT_COUNT = 20;
const USER_COUNT = 100_000;
const DATA_COLUMN_COUNT = 10;

interface UserRow extends Row {
  id: string;
  name: string;
  dept: string;
}

interface DeptRow extends Row {
  id: string;
  name: string;
  data1: string;
  data2: string;
  users: UserRow[];
}

const DATA_COLUMNS: ColumnDef<DeptRow>[] = Array.from({ length: DATA_COLUMN_COUNT }, (_, i) => {
  const key = `data${i + 1}`;
  return {
    accessor: key,
    label: `Data${i + 1}`,
    width: 110,
    minWidth: 64,
    type: "string",
    sortable: true,
  };
});

const HEADERS: ColumnDef<DeptRow>[] = [
  {
    accessor: "name",
    label: "Name",
    width: 180,
    expandable: true,
    type: "string",
    pinned: "left",
    maxWidth: 180,
    minWidth: 180,
    sortable: true,
  },
  ...DATA_COLUMNS,
];

function buildGroupedUsers(): DeptRow[] {
  const departments: DeptRow[] = Array.from({ length: DEPARTMENT_COUNT }, (_, idx) => ({
    id: `dept-${idx + 1}`,
    name: `Department ${idx + 1}`,
    data1: "Total 1",
    data2: "Total 2",
    users: [],
  }));

  for (let i = 0; i < USER_COUNT; i++) {
    const department = departments[i % DEPARTMENT_COUNT];
    const user: UserRow = {
      id: `u-${i + 1}`,
      name: `User ${i + 1}`,
      dept: department.name,
    };
    for (let d = 1; d <= DATA_COLUMN_COUNT; d++) {
      user[`data${d}`] = `Val ${i + 1}-${d}`;
    }
    department.users.push(user);
  }

  return departments;
}

let cachedRows: DeptRow[] | null = null;

function getGroupedUsers(): DeptRow[] {
  if (!cachedRows) {
    cachedRows = buildGroupedUsers();
  }
  return cachedRows;
}

export const usersTableExampleDefaults = {
  rowGrouping: ["users"] as const,
  animations: { enabled: false },
  customTheme: { rowHeight: 32, headerHeight: 32 },
  expandAll: true,
  height: "500px",
  selectableCells: false,
  columnResizing: true,
};

export function renderUsersTableExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...usersTableExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, getGroupedUsers(), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id ?? ""),
  });
  h2.textContent = "Users Table";
  return wrapper;
}
