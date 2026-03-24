/**
 * Leads example headers – ported from React leads-headers (vanilla-compatible).
 * Cell renderers return strings; no React-specific components.
 */
import type { HeaderObject } from "../../../src/index";

export const LEADS_HEADERS: HeaderObject[] = [
  {
    accessor: "name",
    label: "CONTACT",
    width: 290,
    minWidth: 290,
    isSortable: true,
    isEditable: true,
    type: "string",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      `${row.name ?? ""} | ${row.title ?? ""} @ ${row.company ?? ""}`.trim(),
  },
  {
    accessor: "signal",
    label: "SIGNAL",
    width: 340,
    minWidth: 340,
    isSortable: true,
    isEditable: true,
    type: "string",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      `Keyword: ${String(row.signal ?? "")}`,
  },
  {
    accessor: "aiScore",
    label: "AI SCORE",
    width: 100,
    minWidth: 100,
    isSortable: true,
    align: "center",
    type: "number",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const score = Number(row.aiScore ?? 0);
      return "🔥".repeat(score) || "—";
    },
  },
  {
    accessor: "emailStatus",
    label: "EMAIL",
    width: 210,
    minWidth: 210,
    isSortable: true,
    align: "center",
    type: "enum",
    enumOptions: [
      { label: "Enrich", value: "Enrich" },
      { label: "Verified", value: "Verified" },
      { label: "Pending", value: "Pending" },
      { label: "Bounced", value: "Bounced" },
    ],
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      String(row.emailStatus ?? "—"),
  },
  {
    accessor: "timeAgo",
    label: "IMPORT",
    width: 100,
    minWidth: 100,
    isSortable: true,
    align: "center",
    type: "string",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      String(row.timeAgo ?? "—"),
  },
  {
    accessor: "list",
    label: "LIST",
    width: 160,
    minWidth: 160,
    isSortable: true,
    align: "center",
    type: "enum",
    enumOptions: [
      { label: "Leads", value: "Leads" },
      { label: "Hot Leads", value: "Hot Leads" },
      { label: "Warm Leads", value: "Warm Leads" },
      { label: "Cold Leads", value: "Cold Leads" },
      { label: "Enterprise", value: "Enterprise" },
      { label: "SMB", value: "SMB" },
      { label: "Nurture", value: "Nurture" },
    ],
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      String(row.list ?? "—"),
  },
  {
    accessor: "_fit",
    label: "Fit",
    width: 120,
    minWidth: 120,
    cellRenderer: () => "—",
  },
  {
    accessor: "_contactNow",
    label: "",
    width: 160,
    minWidth: 160,
    cellRenderer: () => "Contact Now",
  },
];
