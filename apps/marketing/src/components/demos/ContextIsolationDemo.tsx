"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button, Input } from "antd";
import { SimpleTable } from "@simple-table/react";
import type {
  CellChangeProps,
  CellRendererProps,
  ColumnEditorCustomRendererProps,
  ColumnEditorRowRendererProps,
  ColumnVisibilityState,
  FooterRendererProps,
  HeaderDropdownProps,
  HeaderRendererProps,
  ReactColumnDef,
  ReactIconsConfig,
  RowSelectionChangeProps,
  SortColumn,
  TableAPI,
} from "@simple-table/react";
import "@simple-table/react/styles.css";

/**
 * A deliberately maximal `@simple-table/react` example used to stress-test the
 * portal/context bridge fix. EVERY custom renderer below (cells, headers, footer,
 * header dropdown, and column-editor renderers) reads from host React context.
 * Before the fix these rendered empty / threw / dropped DOM slots; now they all
 * work because renderers are portalled into the host tree.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Host contexts (the thing that used to be unreachable from custom renderers)
// ─────────────────────────────────────────────────────────────────────────────
interface AppSettings {
  locale: string;
  currency: string;
  accent: string;
  currentUserId: number;
  /** Live label injected into every custom header from the toolbar input. */
  headerNote: string;
}

const AppSettingsContext = createContext<AppSettings | null>(null);

function useAppSettings(): AppSettings {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within <AppSettingsProvider>");
  return ctx;
}

interface AppSettingsActions {
  setHeaderNote: (note: string) => void;
}

const AppSettingsActionsContext = createContext<AppSettingsActions | null>(null);

function useAppSettingsActions(): AppSettingsActions {
  const ctx = useContext(AppSettingsActionsContext);
  if (!ctx)
    throw new Error("useAppSettingsActions must be used within <AppSettingsProvider>");
  return ctx;
}

interface GlobalAlert {
  notify: (message: string) => void;
}

const GlobalAlertContext = createContext<GlobalAlert | null>(null);

function useGlobalAlert(): GlobalAlert {
  const ctx = useContext(GlobalAlertContext);
  if (!ctx) throw new Error("useGlobalAlert must be used within the GlobalAlertProvider");
  return ctx;
}

function AppProviders({ children }: { children: ReactNode }) {
  const [headerNote, setHeaderNote] = useState("");
  const settings = useMemo<AppSettings>(
    () => ({
      locale: "en-US",
      currency: "USD",
      accent: "#6366f1",
      currentUserId: 3,
      headerNote,
    }),
    [headerNote],
  );
  const actions = useMemo<AppSettingsActions>(() => ({ setHeaderNote }), []);
  const alert = useMemo<GlobalAlert>(
    () => ({ notify: (message: string) => window.alert(message) }),
    [],
  );
  return (
    <AppSettingsContext.Provider value={settings}>
      <AppSettingsActionsContext.Provider value={actions}>
        <GlobalAlertContext.Provider value={alert}>{children}</GlobalAlertContext.Provider>
      </AppSettingsActionsContext.Provider>
    </AppSettingsContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────────────────────────────────────
const buttonStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  background: "#fff",
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const iconBtnStyle: React.CSSProperties = {
  ...buttonStyle,
  minWidth: 30,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

// ─────────────────────────────────────────────────────────────────────────────
// Custom icons (static React nodes serialized by the adapter)
// ─────────────────────────────────────────────────────────────────────────────
const icons: ReactIconsConfig = {
  sortUp: <span style={{ fontSize: 10 }}>▲</span>,
  sortDown: <span style={{ fontSize: 10 }}>▼</span>,
  filter: <span style={{ fontSize: 11 }}>⛛</span>,
  next: <span style={{ fontSize: 12 }}>›</span>,
  prev: <span style={{ fontSize: 12 }}>‹</span>,
  expand: <span style={{ fontSize: 11 }}>▸</span>,
  headerExpand: <span style={{ fontSize: 11 }}>＋</span>,
  headerCollapse: <span style={{ fontSize: 11 }}>－</span>,
  drag: <span style={{ fontSize: 12 }}>⠿</span>,
};

// ─────────────────────────────────────────────────────────────────────────────
// Context-consuming cell renderers
// ─────────────────────────────────────────────────────────────────────────────
function RepCell({ value, row }: CellRendererProps) {
  const { currentUserId, accent } = useAppSettings();
  const name = String(value ?? "");
  const isMe = (row as { id?: number }).id === currentUserId;
  const initials =
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("") || "?";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#fff",
          background: accent,
        }}
      >
        {initials}
      </span>
      <span style={{ fontWeight: 600 }}>
        {name}
        {isMe && <span style={{ marginLeft: 6, fontSize: 10, color: accent }}>(you)</span>}
      </span>
    </span>
  );
}

const STATUS_COLORS: Record<string, string> = {
  Active: "#16a34a",
  Onboarding: "#d97706",
  "At Risk": "#dc2626",
  Churned: "#6b7280",
};

function StatusBadgeCell({ value }: CellRendererProps) {
  const { accent } = useAppSettings();
  const status = String(value ?? "");
  if (!status) return <span />;
  const color = STATUS_COLORS[status] ?? accent;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color,
        background: `${color}1a`,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
      {status}
    </span>
  );
}

function CurrencyCell({ value }: CellRendererProps) {
  const { locale, currency } = useAppSettings();
  if (value === null || value === undefined || value === "") return <span />;
  const num = typeof value === "number" ? value : Number(value) || 0;
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(num);
  return <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{formatted}</span>;
}

function QuotaCell({ value }: CellRendererProps) {
  const { accent } = useAppSettings();
  const pct = Math.max(0, Math.min(130, typeof value === "number" ? value : Number(value) || 0));
  const color = pct >= 100 ? "#16a34a" : pct >= 60 ? accent : "#d97706";
  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: 11, marginBottom: 2 }}>{pct}%</div>
      <div style={{ height: 8, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
        <div
          style={{
            height: 8,
            borderRadius: 999,
            width: `${Math.min(100, pct)}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

function RatingCell({ value }: CellRendererProps) {
  const n = typeof value === "number" ? value : Number(value) || 0;
  if (!n) return <span />;
  const full = Math.max(0, Math.min(5, Math.round(n)));
  return (
    <span title={`${n.toFixed(1)} / 5`} style={{ color: "#f59e0b", letterSpacing: 1 }}>
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
    </span>
  );
}

function ActionsCell({ row }: CellRendererProps) {
  const { notify } = useGlobalAlert();
  const { locale } = useAppSettings();
  const rep = (row as { rep?: string }).rep ?? "rep";
  return (
    <button
      type="button"
      onClick={() => notify(`Pinged ${rep} (locale: ${locale})`)}
      style={buttonStyle}
    >
      Ping
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Context-consuming header renderer (uses sortIcon / filterIcon / labelContent slots)
// ─────────────────────────────────────────────────────────────────────────────
function makeHeader(emoji: string) {
  return function MegaHeader({ header, components }: HeaderRendererProps) {
    const { accent, headerNote } = useAppSettings();
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 700,
          color: accent,
        }}
      >
        <span aria-hidden>{emoji}</span>
        {components?.labelContent ?? header.label}
        {headerNote && (
          <span
            style={{
              padding: "1px 6px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              background: accent,
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            {headerNote}
          </span>
        )}
        {components?.filterIcon}
        {components?.sortIcon}
        {components?.collapseIcon}
      </span>
    );
  };
}

// Context-consuming header dropdown
function MegaHeaderDropdown({
  header,
  isOpen,
  onClose,
  position,
  components,
}: HeaderDropdownProps) {
  const { accent } = useAppSettings();
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: position?.top,
        left: position?.left,
        right: position?.right,
        bottom: position?.bottom,
        zIndex: 1000,
        background: "#fff",
        color: "#111827",
        border: `1px solid ${accent}`,
        borderRadius: 8,
        padding: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        minWidth: 220,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: accent }}
      >
        {components?.filterIcon}
        {header.label}
      </div>
      <p style={{ fontSize: 12, color: "#6b7280", margin: "8px 0 10px" }}>
        Context-powered dropdown — the accent color is read from a host provider.
      </p>
      <button type="button" onClick={onClose} style={buttonStyle}>
        Close
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Context-consuming custom footer (uses bridged nextIcon / prevIcon slots)
// ─────────────────────────────────────────────────────────────────────────────
function MegaFooter(
  props: FooterRendererProps & { pageSize: number; setPageSize: (n: number) => void },
) {
  const {
    currentPage,
    totalPages,
    totalRows,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
    onPageChange,
    nextIcon,
    prevIcon,
    pageSize,
    setPageSize,
  } = props;
  const { locale } = useAppSettings();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "6px 12px",
        width: "100%",
        fontSize: 13,
        background: "#fff",
      }}
    >
      <span style={{ color: "#6b7280" }}>
        {totalRows} reps · {locale}
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <label style={{ color: "#6b7280", display: "inline-flex", alignItems: "center", gap: 4 }}>
          Rows:
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              onPageChange(1);
            }}
          >
            {[3, 6, 9, 12].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button type="button" disabled={!hasPrevPage} onClick={onPrevPage} style={iconBtnStyle}>
          {prevIcon ?? "‹"}
        </button>
        <span style={{ minWidth: 78, textAlign: "center" }}>
          Page {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onNextPage()}
          style={iconBtnStyle}
        >
          {nextIcon ?? "›"}
        </button>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Context-consuming column-editor renderers (row + panel)
// ─────────────────────────────────────────────────────────────────────────────
function EditorRow({ components }: ColumnEditorRowRendererProps) {
  const { accent } = useAppSettings();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "2px 0",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {components?.expandIcon}
        {components?.checkbox}
        <span style={{ color: accent, fontWeight: 600 }}>{components?.labelContent}</span>
      </span>
      {components?.dragIcon}
    </div>
  );
}

function EditorPanel({
  searchSection,
  listSection,
  resetColumns,
}: ColumnEditorCustomRendererProps) {
  const { accent } = useAppSettings();
  return (
    <div>
      <div style={{ fontWeight: 700, color: accent, padding: "6px 8px" }}>Configure columns</div>
      {searchSection}
      {listSection}
      <div style={{ padding: 8 }}>
        <button type="button" onClick={() => resetColumns?.()} style={buttonStyle}>
          Reset columns
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Onboarding", value: "Onboarding" },
  { label: "At Risk", value: "At Risk" },
  { label: "Churned", value: "Churned" },
];

interface RepRow {
  id: number;
  rep: string;
  status: string;
  team: string;
  deals: number;
  revenue: number;
  quota: number;
  rating: number;
  startDate: string;
  active: boolean;
}

const REP_ROWS: RepRow[] = [
  {
    id: 1,
    rep: "Marcus Rodriguez",
    status: "Active",
    team: "Enterprise",
    deals: 24,
    revenue: 482000,
    quota: 112,
    rating: 4.8,
    startDate: "2022-03-15",
    active: true,
  },
  {
    id: 2,
    rep: "Sophia Chen",
    status: "Active",
    team: "Mid-Market",
    deals: 18,
    revenue: 318000,
    quota: 96,
    rating: 4.6,
    startDate: "2021-11-08",
    active: true,
  },
  {
    id: 3,
    rep: "Raj Patel",
    status: "Active",
    team: "Enterprise",
    deals: 31,
    revenue: 690000,
    quota: 128,
    rating: 4.9,
    startDate: "2020-01-20",
    active: true,
  },
  {
    id: 4,
    rep: "Luna Martinez",
    status: "Onboarding",
    team: "SMB",
    deals: 6,
    revenue: 74000,
    quota: 41,
    rating: 3.9,
    startDate: "2023-06-12",
    active: true,
  },
  {
    id: 5,
    rep: "Tyler Anderson",
    status: "Active",
    team: "Mid-Market",
    deals: 21,
    revenue: 401000,
    quota: 103,
    rating: 4.4,
    startDate: "2021-08-03",
    active: true,
  },
  {
    id: 6,
    rep: "Zara Kim",
    status: "At Risk",
    team: "SMB",
    deals: 9,
    revenue: 128000,
    quota: 58,
    rating: 3.6,
    startDate: "2022-01-17",
    active: true,
  },
  {
    id: 7,
    rep: "Kai Thompson",
    status: "Active",
    team: "Enterprise",
    deals: 27,
    revenue: 555000,
    quota: 119,
    rating: 4.7,
    startDate: "2022-09-05",
    active: true,
  },
  {
    id: 8,
    rep: "Ava Singh",
    status: "Churned",
    team: "Mid-Market",
    deals: 12,
    revenue: 0,
    quota: 0,
    rating: 3.1,
    startDate: "2020-07-14",
    active: false,
  },
  {
    id: 9,
    rep: "Jordan Walsh",
    status: "Onboarding",
    team: "SMB",
    deals: 4,
    revenue: 52000,
    quota: 33,
    rating: 4.0,
    startDate: "2023-02-28",
    active: true,
  },
  {
    id: 10,
    rep: "Phoenix Lee",
    status: "Active",
    team: "Enterprise",
    deals: 29,
    revenue: 612000,
    quota: 121,
    rating: 4.8,
    startDate: "2021-05-11",
    active: true,
  },
  {
    id: 11,
    rep: "River Jackson",
    status: "At Risk",
    team: "Mid-Market",
    deals: 11,
    revenue: 164000,
    quota: 62,
    rating: 3.7,
    startDate: "2023-01-09",
    active: true,
  },
  {
    id: 12,
    rep: "Atlas Morgan",
    status: "Active",
    team: "Enterprise",
    deals: 33,
    revenue: 720000,
    quota: 130,
    rating: 5.0,
    startDate: "2019-12-02",
    active: true,
  },
  {
    id: 13,
    rep: "Nora Hughes",
    status: "Active",
    team: "SMB",
    deals: 15,
    revenue: 198000,
    quota: 88,
    rating: 4.2,
    startDate: "2022-04-22",
    active: true,
  },
  {
    id: 14,
    rep: "Diego Flores",
    status: "Onboarding",
    team: "Mid-Market",
    deals: 7,
    revenue: 96000,
    quota: 47,
    rating: 3.8,
    startDate: "2023-05-30",
    active: true,
  },
];

// Hierarchical data for the grouped/aggregated table: regions → teams → members.
interface RegionRow {
  id: string;
  name: string;
  status?: string;
  deals?: number;
  revenue?: number;
  rating?: number;
  teams?: TeamRow[];
}
interface TeamRow {
  id: string;
  name: string;
  status?: string;
  deals?: number;
  revenue?: number;
  rating?: number;
  members?: MemberRow[];
}
interface MemberRow {
  id: string;
  name: string;
  status: string;
  deals: number;
  revenue: number;
  rating: number;
}

const REGION_ROWS: RegionRow[] = [
  {
    id: "r-amer",
    name: "Americas",
    teams: [
      {
        id: "t-amer-ent",
        name: "Enterprise",
        members: [
          {
            id: "m-1",
            name: "Marcus Rodriguez",
            status: "Active",
            deals: 24,
            revenue: 482000,
            rating: 4.8,
          },
          {
            id: "m-3",
            name: "Raj Patel",
            status: "Active",
            deals: 31,
            revenue: 690000,
            rating: 4.9,
          },
          {
            id: "m-12",
            name: "Atlas Morgan",
            status: "Active",
            deals: 33,
            revenue: 720000,
            rating: 5.0,
          },
        ],
      },
      {
        id: "t-amer-smb",
        name: "SMB",
        members: [
          {
            id: "m-4",
            name: "Luna Martinez",
            status: "Onboarding",
            deals: 6,
            revenue: 74000,
            rating: 3.9,
          },
          {
            id: "m-6",
            name: "Zara Kim",
            status: "At Risk",
            deals: 9,
            revenue: 128000,
            rating: 3.6,
          },
          {
            id: "m-13",
            name: "Nora Hughes",
            status: "Active",
            deals: 15,
            revenue: 198000,
            rating: 4.2,
          },
        ],
      },
    ],
  },
  {
    id: "r-emea",
    name: "EMEA",
    teams: [
      {
        id: "t-emea-mm",
        name: "Mid-Market",
        members: [
          {
            id: "m-2",
            name: "Sophia Chen",
            status: "Active",
            deals: 18,
            revenue: 318000,
            rating: 4.6,
          },
          {
            id: "m-5",
            name: "Tyler Anderson",
            status: "Active",
            deals: 21,
            revenue: 401000,
            rating: 4.4,
          },
          {
            id: "m-11",
            name: "River Jackson",
            status: "At Risk",
            deals: 11,
            revenue: 164000,
            rating: 3.7,
          },
        ],
      },
      {
        id: "t-emea-ent",
        name: "Enterprise",
        members: [
          {
            id: "m-7",
            name: "Kai Thompson",
            status: "Active",
            deals: 27,
            revenue: 555000,
            rating: 4.7,
          },
          {
            id: "m-10",
            name: "Phoenix Lee",
            status: "Active",
            deals: 29,
            revenue: 612000,
            rating: 4.8,
          },
        ],
      },
    ],
  },
];

// Recursively update a value by row id across the regions → teams → members tree.
function updateRegionTree(
  rows: RegionRow[],
  id: string | number,
  accessor: string,
  newValue: unknown,
): RegionRow[] {
  const walk = <T extends { id: string; teams?: TeamRow[]; members?: MemberRow[] }>(node: T): T => {
    let next: T = node.id === id ? { ...node, [accessor]: newValue } : node;
    if (next.teams) next = { ...next, teams: next.teams.map(walk) as TeamRow[] };
    if (next.members) next = { ...next, members: next.members.map(walk) as MemberRow[] };
    return next;
  };
  return rows.map(walk);
}

// ─────────────────────────────────────────────────────────────────────────────
// "Saved view" persistence (localStorage) + true-defaults reset
//
// Demonstrates the recommended pattern when persisting column config: the live
// layout (order / width / visibility / pinning / sort) is saved to localStorage
// and restored on mount, while the *pristine* column config is kept in code as
// the single source of truth for "reset to true defaults". The built-in
// `resetColumns` resets to whatever `columns` currently is (the persisted
// snapshot); the custom reset clears storage and remounts from the originals.
// ─────────────────────────────────────────────────────────────────────────────
const SAVED_VIEW_STORAGE_KEY = "st-context-isolation-saved-view";

interface PersistedColumn {
  accessor: string;
  hide?: boolean;
  width?: number;
  pinned?: "left" | "right";
}

interface PersistedLayout {
  columns: PersistedColumn[];
  sort: { accessor: string; direction: "asc" | "desc" } | null;
}

// Pristine, never-mutated column config. Rebuilt fresh so the table never
// mutates the originals we reset back to.
function buildSavedBaseHeaders(): ReactColumnDef[] {
  return [
    {
      accessor: "rep",
      label: "Sales Rep",
      width: 220,
      type: "string",
      pinned: "left",
      sortable: true,
      cellRenderer: RepCell,
      headerRenderer: makeHeader("🧑‍💼"),
    },
    {
      accessor: "status",
      label: "Status",
      width: 150,
      type: "enum",
      enumOptions: STATUS_OPTIONS,
      sortable: true,
      cellRenderer: StatusBadgeCell,
      headerRenderer: makeHeader("🏷️"),
    },
    {
      accessor: "team",
      label: "Team",
      width: 140,
      type: "string",
      sortable: true,
      headerRenderer: makeHeader("👥"),
    },
    {
      accessor: "revenue",
      label: "Revenue",
      width: 150,
      type: "number",
      align: "right",
      sortable: true,
      cellRenderer: CurrencyCell,
      headerRenderer: makeHeader("💰"),
    },
    {
      accessor: "deals",
      label: "Deals",
      width: 110,
      type: "number",
      align: "right",
      sortable: true,
      headerRenderer: makeHeader("🤝"),
    },
    {
      accessor: "quota",
      label: "Quota",
      width: 160,
      type: "number",
      sortable: true,
      cellRenderer: QuotaCell,
      headerRenderer: makeHeader("🎯"),
    },
    {
      accessor: "rating",
      label: "Rating",
      width: 130,
      type: "number",
      sortable: true,
      cellRenderer: RatingCell,
      headerRenderer: makeHeader("⭐"),
    },
    {
      accessor: "startDate",
      label: "Start Date",
      width: 140,
      type: "date",
      sortable: true,
      headerRenderer: makeHeader("📅"),
    },
    {
      accessor: "active",
      label: "Active",
      width: 90,
      type: "boolean",
      headerRenderer: makeHeader("✅"),
    },
  ];
}

function columnsFromHeaders(headers: ReadonlyArray<ReactColumnDef>): PersistedColumn[] {
  return headers.map((h) => {
    const col: PersistedColumn = { accessor: String(h.accessor) };
    if (h.hide) col.hide = true;
    if (typeof h.width === "number") col.width = h.width;
    if (h.pinned === "left" || h.pinned === "right") col.pinned = h.pinned;
    return col;
  });
}

// Merge a persisted layout onto the pristine headers: reorder, then apply
// hide/width/pinning. Columns added since the layout was saved are appended.
function applyLayoutToHeaders(
  base: ReactColumnDef[],
  layout: PersistedLayout | null,
): ReactColumnDef[] {
  if (!layout || layout.columns.length === 0) return base;
  const byAccessor = new Map(base.map((h) => [String(h.accessor), h]));
  const used = new Set<string>();
  const ordered: ReactColumnDef[] = [];
  for (const col of layout.columns) {
    const header = byAccessor.get(col.accessor);
    if (!header) continue;
    used.add(col.accessor);
    ordered.push({
      ...header,
      hide: col.hide ?? false,
      pinned: col.pinned,
      ...(col.width != null ? { width: col.width } : {}),
    });
  }
  for (const header of base) {
    if (!used.has(String(header.accessor))) ordered.push(header);
  }
  return ordered;
}

function loadSavedLayout(): PersistedLayout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SAVED_VIEW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedLayout;
    if (!parsed || !Array.isArray(parsed.columns)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveSavedLayout(layout: PersistedLayout): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVED_VIEW_STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // ignore quota / serialization errors in the demo
  }
}

function clearSavedLayout(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SAVED_VIEW_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// Context-consuming column-editor panel for the saved-view table. Reads the host
// accent via context (proving the portal/context bridge) and exposes BOTH reset
// behaviours so the difference is visible.
function SavedViewEditorPanel({
  searchSection,
  listSection,
  resetColumns,
  onResetTrueDefaults,
}: ColumnEditorCustomRendererProps & { onResetTrueDefaults: () => void }) {
  const { accent } = useAppSettings();
  return (
    <div>
      <div style={{ fontWeight: 700, color: accent, padding: "6px 8px" }}>Saved view columns</div>
      {searchSection}
      {listSection}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: 8,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <button type="button" onClick={() => resetColumns?.()} style={buttonStyle}>
          Reset to saved snapshot
        </button>
        <button
          type="button"
          onClick={onResetTrueDefaults}
          style={{ ...buttonStyle, color: "#fff", background: accent, borderColor: accent }}
        >
          Reset to true defaults
        </button>
        <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>
          “Saved snapshot” uses the built-in <code>resetColumns()</code> → restores the persisted{" "}
          <code>columns</code>. “True defaults” clears localStorage and remounts from the
          original column config.
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
function MegaTables() {
  const { notify } = useGlobalAlert();
  const { setHeaderNote } = useAppSettingsActions();
  const [repRows, setRepRows] = useState<RepRow[]>(REP_ROWS);
  const [regionRows, setRegionRows] = useState<RegionRow[]>(REGION_ROWS);
  const [pageSize, setPageSize] = useState(6);
  const [quickFilter, setQuickFilter] = useState("");
  const [expandAll, setExpandAll] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);
  const [noteDraft, setNoteDraft] = useState("");

  const opsTableRef = useRef<TableAPI>(null);
  const rollupTableRef = useRef<TableAPI>(null);
  const savedTableRef = useRef<TableAPI>(null);

  // Saved-view persistence state. `savedMountKey` bumps to force a clean remount
  // from the pristine config on "reset to true defaults".
  const [savedMountKey, setSavedMountKey] = useState(0);
  const [savedStatus, setSavedStatus] = useState("");
  const savedLayoutRef = useRef<PersistedLayout | null>(null);

  const savedHeaders = useMemo<ReactColumnDef[]>(() => {
    const layout = loadSavedLayout();
    savedLayoutRef.current = layout;
    return applyLayoutToHeaders(buildSavedBaseHeaders(), layout);
    // Re-read persisted layout whenever we remount the saved-view table.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedMountKey]);

  const savedInitialSort = useMemo(
    () => loadSavedLayout()?.sort ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [savedMountKey],
  );

  const persistSavedLayout = useCallback((next: PersistedLayout) => {
    savedLayoutRef.current = next;
    saveSavedLayout(next);
    setSavedStatus(`Saved at ${new Date().toLocaleTimeString()}`);
  }, []);

  const handleSavedColumns = useCallback(
    (headers: ReactColumnDef[]) => {
      persistSavedLayout({
        columns: columnsFromHeaders(headers),
        sort: savedLayoutRef.current?.sort ?? null,
      });
    },
    [persistSavedLayout],
  );

  const handleSavedVisibility = useCallback(
    (visibility: ColumnVisibilityState) => {
      const baseCols =
        savedLayoutRef.current?.columns ?? columnsFromHeaders(buildSavedBaseHeaders());
      const columns = baseCols.map((col) =>
        col.accessor in visibility ? { ...col, hide: !visibility[col.accessor] } : col,
      );
      persistSavedLayout({ columns, sort: savedLayoutRef.current?.sort ?? null });
    },
    [persistSavedLayout],
  );

  const handleSavedSort = useCallback(
    (sort: SortColumn | null) => {
      persistSavedLayout({
        columns: savedLayoutRef.current?.columns ?? columnsFromHeaders(buildSavedBaseHeaders()),
        sort: sort
          ? { accessor: String(sort.key.accessor), direction: sort.direction }
          : null,
      });
    },
    [persistSavedLayout],
  );

  const resetSavedToTrueDefaults = useCallback(() => {
    clearSavedLayout();
    savedLayoutRef.current = null;
    setSavedStatus("Reset to true defaults · localStorage cleared");
    setSavedMountKey((key) => key + 1);
  }, []);

  const savedEditorPanel = useCallback(
    (props: ColumnEditorCustomRendererProps) => (
      <SavedViewEditorPanel {...props} onResetTrueDefaults={resetSavedToTrueDefaults} />
    ),
    [resetSavedToTrueDefaults],
  );

  const handleRepEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    const id = (row as { id?: number }).id;
    setRepRows((prev) => prev.map((r) => (r.id === id ? { ...r, [accessor]: newValue } : r)));
  };

  const handleRegionEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    const id = (row as { id?: string }).id;
    if (id == null) return;
    setRegionRows((prev) => updateRegionTree(prev, id, accessor, newValue));
  };

  const handleSelection = ({ selectedRows }: RowSelectionChangeProps) => {
    setSelectedCount(selectedRows.size);
  };

  const opsHeaders: ReactColumnDef[] = useMemo(
    () => [
      {
        accessor: "rep",
        label: "Sales Rep",
        width: 220,
        type: "string",
        pinned: "left",
        sortable: true,
        editable: true,
        cellRenderer: RepCell,
        headerRenderer: makeHeader("🧑‍💼"),
      },
      {
        accessor: "status",
        label: "Status",
        width: 150,
        type: "enum",
        enumOptions: STATUS_OPTIONS,
        editable: true,
        filterable: true,
        sortable: true,
        cellRenderer: StatusBadgeCell,
        headerRenderer: makeHeader("🏷️"),
      },
      {
        accessor: "team",
        label: "Team",
        width: 140,
        type: "string",
        filterable: true,
        sortable: true,
        headerRenderer: makeHeader("👥"),
      },
      {
        accessor: "performance",
        label: "Performance",
        width: 320,
        collapsible: true,
        collapseDefault: false,
        headerRenderer: makeHeader("📊"),
        children: [
          {
            accessor: "revenue",
            label: "Revenue",
            width: 140,
            type: "number",
            align: "right",
            sortable: true,
            editable: true,
            aggregation: { type: "sum" },
            cellRenderer: CurrencyCell,
            headerRenderer: makeHeader("💰"),
          },
          {
            accessor: "deals",
            label: "Deals",
            width: 110,
            type: "number",
            align: "right",
            sortable: true,
            editable: true,
            showWhen: "parentExpanded",
            aggregation: { type: "sum" },
            headerRenderer: makeHeader("🤝"),
          },
          {
            accessor: "quota",
            label: "Quota",
            width: 160,
            type: "number",
            editable: true,
            showWhen: "parentExpanded",
            cellRenderer: QuotaCell,
            headerRenderer: makeHeader("🎯"),
          },
          {
            accessor: "rating",
            label: "Rating",
            width: 130,
            type: "number",
            showWhen: "parentExpanded",
            aggregation: { type: "average" },
            cellRenderer: RatingCell,
            headerRenderer: makeHeader("⭐"),
          },
        ],
      },
      {
        accessor: "startDate",
        label: "Start Date",
        width: 140,
        type: "date",
        sortable: true,
        editable: true,
        headerRenderer: makeHeader("📅"),
      },
      {
        accessor: "active",
        label: "Active",
        width: 90,
        type: "boolean",
        editable: true,
        headerRenderer: makeHeader("✅"),
      },
      {
        accessor: "actions",
        label: "Actions",
        width: 110,
        type: "string",
        cellRenderer: ActionsCell,
        headerRenderer: makeHeader("⚙️"),
      },
    ],
    [],
  );

  const rollupHeaders: ReactColumnDef[] = useMemo(
    () => [
      {
        accessor: "name",
        label: "Region / Team / Rep",
        width: 260,
        type: "string",
        expandable: true,
        headerRenderer: makeHeader("🌍"),
      },
      {
        accessor: "status",
        label: "Status",
        width: 140,
        type: "enum",
        enumOptions: STATUS_OPTIONS,
        editable: true,
        cellRenderer: StatusBadgeCell,
        headerRenderer: makeHeader("🏷️"),
      },
      {
        accessor: "deals",
        label: "Deals",
        width: 110,
        type: "number",
        align: "right",
        editable: true,
        aggregation: { type: "sum" },
        headerRenderer: makeHeader("🤝"),
      },
      {
        accessor: "revenue",
        label: "Revenue",
        width: 150,
        type: "number",
        align: "right",
        editable: true,
        aggregation: { type: "sum" },
        cellRenderer: CurrencyCell,
        headerRenderer: makeHeader("💰"),
      },
      {
        accessor: "rating",
        label: "Avg Rating",
        width: 140,
        type: "number",
        aggregation: { type: "average" },
        cellRenderer: RatingCell,
        headerRenderer: makeHeader("⭐"),
      },
    ],
    [],
  );

  const applyHeaderNote = () => setHeaderNote(noteDraft.trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Outside-the-table control that writes to host context. Custom headers
          (portalled into the host tree) read it live via useAppSettings(). */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          padding: 12,
          borderRadius: 8,
          border: "1px dashed #c7d2fe",
          background: "#eef2ff",
        }}
      >
        <label style={{ fontSize: 12, fontWeight: 700, color: "#4338ca" }}>
          Header badge:
        </label>
        <Input
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
          onPressEnter={applyHeaderNote}
          allowClear
          placeholder="e.g. Q3, Beta, EMEA…"
          style={{ width: 220 }}
        />
        <Button type="primary" onClick={applyHeaderNote}>
          Apply to headers
        </Button>
        <Button
          onClick={() => {
            setNoteDraft("");
            setHeaderNote("");
          }}
        >
          Clear
        </Button>
        <span style={{ fontSize: 11, color: "#6366f1" }}>
          Updates every custom header in both tables via context.
        </span>
      </div>

      {/* Toolbar exercising quick filter + imperative TableAPI via ref */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
        <input
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
          placeholder="Quick filter reps..."
          style={{ ...buttonStyle, cursor: "text", minWidth: 200 }}
        />
        <button
          type="button"
          style={buttonStyle}
          onClick={() => opsTableRef.current?.clearSelection()}
        >
          Clear selection
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => opsTableRef.current?.exportToCSV()}
        >
          Export CSV
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            setExpandAll(true);
            rollupTableRef.current?.expandAll();
          }}
        >
          Expand groups
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            setExpandAll(false);
            rollupTableRef.current?.collapseAll();
          }}
        >
          Collapse groups
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => notify(`Selected ${selectedCount} row(s)`)}
        >
          Alert selection ({selectedCount})
        </button>
      </div>

      {/* Table 1 — flat, paginated operations console */}
      <div>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Operations Console</h3>
        <SimpleTable
          ref={opsTableRef}
          columns={opsHeaders}
          rows={repRows}
          getRowId={({ row }) => String((row as { id?: number }).id)}
          theme="light"
          customTheme={{
            rowHeight: 46,
            headerHeight: 44,
            footerHeight: 52,
            selectionColumnWidth: 40,
          }}
          icons={icons}
          height="460px"
          enableRowSelection
          onRowSelectionChange={handleSelection}
          onCellEdit={handleRepEdit}
          selectableCells
          columnResizing
          columnReordering
          enableColumnEditor
          columnEditorConfig={{
            text: "Columns",
            searchEnabled: true,
            searchPlaceholder: "Search columns...",
            rowRenderer: EditorRow,
            customRenderer: EditorPanel,
          }}
          quickFilter={{ text: quickFilter, mode: "simple" }}
          enablePagination
          rowsPerPage={pageSize}
          headerDropdown={MegaHeaderDropdown}
          footerRenderer={(props: FooterRendererProps) => (
            <MegaFooter {...props} pageSize={pageSize} setPageSize={setPageSize} />
          )}
        />
      </div>

      {/* Table 2 — grouped + aggregated rollup */}
      <div>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Regional Rollup (grouped + aggregated)</h3>
        <SimpleTable
          ref={rollupTableRef}
          columns={rollupHeaders}
          rows={regionRows}
          rowGrouping={["teams", "members"]}
          getRowId={({ row }) => String((row as { id?: string }).id)}
          theme="light"
          customTheme={{ rowHeight: 40, headerHeight: 44 }}
          icons={icons}
          height="380px"
          enableStickyParents
          expandAll={expandAll}
          selectableCells
          onCellEdit={handleRegionEdit}
        />
      </div>

      {/* Table 3 — localStorage-persisted "saved view" with a true-defaults reset */}
      <div>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
          Saved View (localStorage persistence)
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
            padding: 12,
            borderRadius: 8,
            border: "1px dashed #6ee7b7",
            background: "#ecfdf5",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#047857", fontWeight: 700 }}>
            Column order, width, visibility, pinning &amp; sort persist to localStorage.
          </span>
          <span style={{ color: "#065f46" }}>
            Reorder/resize/hide columns or sort, then reload the page — the layout is restored.
          </span>
          <span style={{ color: "#10b981", fontWeight: 600 }}>
            {savedStatus || "No changes yet"}
          </span>
          <button type="button" onClick={resetSavedToTrueDefaults} style={buttonStyle}>
            Clear saved layout
          </button>
        </div>
        <SimpleTable
          key={`saved-view-${savedMountKey}`}
          ref={savedTableRef}
          columns={savedHeaders}
          rows={repRows}
          getRowId={({ row }) => String((row as { id?: number }).id)}
          theme="light"
          customTheme={{ rowHeight: 44, headerHeight: 44 }}
          icons={icons}
          height="360px"
          selectableCells
          columnResizing
          columnReordering
          enableColumnEditor
          initialSortColumn={savedInitialSort?.accessor}
          initialSortDirection={savedInitialSort?.direction}
          onCellEdit={handleRepEdit}
          onColumnOrderChange={handleSavedColumns}
          onColumnWidthChange={handleSavedColumns}
          onColumnVisibilityChange={handleSavedVisibility}
          onSortChange={handleSavedSort}
          columnEditorConfig={{
            text: "Columns",
            searchEnabled: true,
            searchPlaceholder: "Search columns...",
            rowRenderer: EditorRow,
            customRenderer: savedEditorPanel,
          }}
        />
      </div>
    </div>
  );
}

const ContextIsolationDemo = () => {
  return (
    <AppProviders>
      <MegaTables />
    </AppProviders>
  );
};

export default ContextIsolationDemo;
