// Self-contained demo table setup for this example.
import type { SolidHeaderObject, Theme } from "@simple-table/solid";

export type CrmShellTheme = Theme | "custom-light" | "custom-dark";

export type CRMLead = {
  id: number;
  name: string;
  title: string;
  company: string;
  linkedin: boolean;
  signal: string;
  aiScore: number;
  emailStatus: string;
  timeAgo: string;
  list: string;
};


const FIRST_NAMES = ["Emma", "Liam", "Sophia", "Noah", "Olivia", "James", "Ava", "William", "Isabella", "Oliver", "Mia", "Benjamin", "Charlotte", "Elijah", "Amelia", "Lucas", "Harper", "Mason", "Evelyn", "Logan"];
const LAST_NAMES = ["Chen", "Rodriguez", "Kim", "Thompson", "Martinez", "Anderson", "Taylor", "Brown", "Wilson", "Johnson", "Lee", "Garcia", "Davis", "Miller", "Moore", "Jackson", "White", "Harris", "Martin", "Clark"];
const TITLES = ["VP of Engineering", "Head of Marketing", "CTO", "Product Manager", "Director of Sales", "CEO", "CFO", "Head of Operations", "Engineering Manager", "Growth Lead", "CMO", "Head of Product", "Director of Engineering", "VP of Sales", "Head of Design"];
const COMPANIES = ["TechCorp", "InnovateLabs", "CloudBase", "DataFlow", "NexGen", "Quantum AI", "CyberPulse", "MetaVision", "ByteForge", "CodeStream", "PixelPerfect", "LogicGate", "CircuitMind", "NetSphere", "DigiCore"];
const SIGNALS = ["cloud infrastructure", "enterprise SaaS", "AI/ML tools", "developer platform", "security solutions", "data analytics", "API management", "DevOps automation", "microservices", "serverless computing"];
const LISTS = ["Hot Leads", "Warm Leads", "Cold Leads", "Enterprise", "SMB", "Leads", "Nurture"];
const TIME_AGOS = ["2 min ago", "5 min ago", "15 min ago", "1 hour ago", "3 hours ago", "6 hours ago", "1 day ago", "2 days ago", "3 days ago", "1 week ago"];

export function generateCRMData(count: number = 100): CRMLead[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    title: TITLES[i % TITLES.length],
    company: COMPANIES[i % COMPANIES.length],
    linkedin: i % 3 !== 0,
    signal: SIGNALS[i % SIGNALS.length],
    aiScore: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1)),
    emailStatus: ["Enrich", "Verified", "Pending", "Bounced"][i % 4],
    timeAgo: TIME_AGOS[i % TIME_AGOS.length],
    list: LISTS[i % LISTS.length],
  }));
}

export const crmData = generateCRMData(100);

export const crmHeaders: SolidHeaderObject[] = [
  {
    accessor: "name",
    label: "CONTACT",
    width: "2fr",
    minWidth: 290,
    isSortable: true,
    isEditable: true,
    type: "string",
  },
  {
    accessor: "signal",
    label: "SIGNAL",
    width: "3fr",
    minWidth: 340,
    isSortable: true,
    isEditable: true,
    type: "string",
  },
  {
    accessor: "aiScore",
    label: "AI SCORE",
    width: "1fr",
    minWidth: 100,
    isSortable: true,
    align: "center",
    type: "number",
  },
  {
    accessor: "emailStatus",
    label: "EMAIL",
    width: "1.5fr",
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
  },
  {
    accessor: "timeAgo",
    label: "IMPORT",
    width: "1fr",
    minWidth: 100,
    isSortable: true,
    align: "center",
    type: "string",
  },
  {
    accessor: "list",
    label: "LIST",
    width: "1.2fr",
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
    valueGetter: ({ row }) => {
      const priorityMap: Record<string, number> = {
        "Hot Leads": 1, "Warm Leads": 2, Enterprise: 3, Leads: 4, SMB: 5, "Cold Leads": 6, Nurture: 7,
      };
      return priorityMap[String(row.list)] || 999;
    },
  },
  {
    accessor: "_fit",
    label: "Fit",
    width: "1fr",
    align: "center",
    minWidth: 120,
  },
  {
    accessor: "_contactNow",
    label: "",
    width: "1.2fr",
    minWidth: 160,
  },
];

export const CRM_FOOTER_COLORS_LIGHT = {
  bg: "white", border: "#e5e7eb", text: "#374151", textBold: "#374151",
  inputBg: "white", inputBorder: "#d1d5db", buttonBg: "white", buttonBorder: "#d1d5db",
  buttonText: "#6b7280", activeBg: "#fff7ed", activeText: "#ea580c",
};

export const CRM_FOOTER_COLORS_DARK = {
  bg: "#0f172a", border: "#334155", text: "#cbd5e1", textBold: "#e2e8f0",
  inputBg: "#1e293b", inputBorder: "#475569", buttonBg: "#1e293b", buttonBorder: "#475569",
  buttonText: "#cbd5e1", activeBg: "#334155", activeText: "#ea580c",
};

export function generateVisiblePages(currentPage: number, totalPages: number): number[] {
  const maxVisible = 5;
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  let start = currentPage - 2;
  let end = currentPage + 2;
  if (start < 1) { start = 1; end = Math.min(maxVisible, totalPages); }
  if (end > totalPages) { end = totalPages; start = Math.max(1, totalPages - maxVisible + 1); }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const CRM_THEME_COLORS_LIGHT = {
  text: "oklch(21% .034 264.665)", textSecondary: "oklch(44.6% .03 256.802)",
  textTertiary: "oklch(55.1% .027 264.364)", link: "oklch(64.6% .222 41.116)",
  accent: "#ea580c", bg: "white", tagBg: "oklch(96.7% .003 264.542)",
  tagText: "oklch(21% .034 264.665)", buttonBg: "oklch(92.8% .006 264.531)",
  buttonText: "oklch(70.7% .022 261.325)", buttonHoverBg: "oklch(87.2% .01 258.338)",
};

export const CRM_THEME_COLORS_DARK = {
  text: "#cbd5e1", textSecondary: "#94a3b8", textTertiary: "#64748b",
  link: "#60a5fa", accent: "#ea580c", bg: "#0f172a", tagBg: "#1e293b",
  tagText: "#cbd5e1", buttonBg: "#1e293b", buttonText: "#cbd5e1", buttonHoverBg: "#334155",
};

export const crmConfig = {
  headers: crmHeaders,
  rows: crmData,
} as const;
