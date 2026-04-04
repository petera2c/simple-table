// Self-contained demo table setup for this example.
import type { HeaderObject } from "@simple-table/vue";

export interface HREmployee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  performanceScore: number;
  department: string;
  email: string;
  location: string;
  hireDate: string;
  yearsOfService: number;
  salary: number;
  status: string;
  isRemoteEligible: boolean;
}


const HR_FIRST_NAMES = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const HR_LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const POSITIONS = ["Software Engineer", "Senior Engineer", "Tech Lead", "Engineering Manager", "Product Manager", "Designer", "Data Scientist", "DevOps Engineer", "QA Engineer", "Solutions Architect"];
const DEPARTMENTS = ["Engineering", "Marketing", "Sales", "Finance", "HR", "Operations", "Customer Support"];
const LOCATIONS = ["New York", "Los Angeles", "Chicago", "San Francisco", "Austin", "Boston", "Seattle", "Remote"];
const HR_STATUSES = ["Active", "On Leave", "Probation", "Contract", "Terminated"];

export function generateHRData(count: number = 100): HREmployee[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = HR_FIRST_NAMES[i % HR_FIRST_NAMES.length];
    const lastName = HR_LAST_NAMES[i % HR_LAST_NAMES.length];
    const yearsOfService = Math.floor(Math.random() * 15);
    const hireYear = 2024 - yearsOfService;
    const hireMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
    const hireDay = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
    return {
      id: i + 1,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      position: POSITIONS[i % POSITIONS.length],
      performanceScore: Math.floor(40 + Math.random() * 60),
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      location: LOCATIONS[i % LOCATIONS.length],
      hireDate: `${hireYear}-${hireMonth}-${hireDay}`,
      yearsOfService,
      salary: Math.floor(50000 + Math.random() * 150000),
      status: HR_STATUSES[i % 10 === 9 ? 4 : i % 7 === 0 ? 1 : i % 11 === 0 ? 2 : i % 13 === 0 ? 3 : 0],
      isRemoteEligible: Math.random() > 0.3,
    };
  });
}

export const hrData = generateHRData(100);

export const hrHeaders: HeaderObject[] = [
  { accessor: "fullName", label: "Employee", width: 220, isSortable: true, isEditable: false, align: "left", pinned: "left", type: "string" },
  {
    accessor: "performanceScore", label: "Performance", width: 160, isSortable: true, isEditable: true, align: "center", type: "number",
    valueFormatter: ({ value }) => `${value}/100`,
    useFormattedValueForClipboard: true,
    exportValueGetter: ({ value }) => `${value}%`,
  },
  {
    accessor: "department", label: "Department", width: 150, isSortable: true, isEditable: true, align: "left", type: "enum",
    enumOptions: [
      { label: "Engineering", value: "Engineering" }, { label: "Marketing", value: "Marketing" },
      { label: "Sales", value: "Sales" }, { label: "Finance", value: "Finance" },
      { label: "HR", value: "HR" }, { label: "Operations", value: "Operations" },
      { label: "Customer Support", value: "Customer Support" },
    ],
  },
  { accessor: "email", label: "Email", width: 280, isSortable: true, isEditable: true, align: "left", type: "string" },
  {
    accessor: "location", label: "Location", width: 130, isSortable: true, isEditable: true, align: "left", type: "enum",
    enumOptions: LOCATIONS.map((l) => ({ label: l, value: l })),
  },
  { accessor: "hireDate", label: "Hire Date", width: 120, isSortable: true, isEditable: true, align: "left", type: "date" },
  { accessor: "yearsOfService", label: "Service", width: 100, isSortable: true, isEditable: false, align: "center", type: "number" },
  { accessor: "salary", label: "Salary", width: 130, isSortable: true, isEditable: true, align: "right", type: "number", valueFormatter: ({ value }) => { if (typeof value !== "number") return ""; return `$${value.toLocaleString()}`; }, useFormattedValueForClipboard: true, useFormattedValueForCSV: true },
  {
    accessor: "status", label: "Status", width: 120, isSortable: true, isEditable: true, align: "center", pinned: "right", type: "enum",
    enumOptions: [
      { label: "Active", value: "Active" }, { label: "On Leave", value: "On Leave" },
      { label: "Probation", value: "Probation" }, { label: "Contract", value: "Contract" },
      { label: "Terminated", value: "Terminated" },
    ],
    valueGetter: ({ row }) => {
      const priorityMap: Record<string, number> = { Terminated: 1, Probation: 2, Contract: 3, "On Leave": 4, Active: 5 };
      return priorityMap[String(row.status)] || 999;
    },
  },
  { accessor: "isRemoteEligible", label: "Remote Eligible", width: 140, isSortable: true, isEditable: true, align: "center", type: "boolean" },
];

export function getHRThemeColors(theme?: string) {
  const isDark = theme === "dark" || theme === "modern-dark";
  const tagColors: Record<HRTagColorKey, { bg: string; text: string }> = isDark
    ? { green: { bg: "#065f46", text: "#86efac" }, orange: { bg: "#9a3412", text: "#fed7aa" }, blue: { bg: "#1e3a8a", text: "#93c5fd" }, purple: { bg: "#581c87", text: "#c4b5fd" }, red: { bg: "#991b1b", text: "#fca5a5" }, default: { bg: "#374151", text: "#e5e7eb" } }
    : { green: { bg: "#f6ffed", text: "#2a6a0d" }, orange: { bg: "#fff7e6", text: "#ad4e00" }, blue: { bg: "#e6f7ff", text: "#0050b3" }, purple: { bg: "#f9f0ff", text: "#391085" }, red: { bg: "#fff1f0", text: "#a8071a" }, default: { bg: "#f0f0f0", text: "rgba(0, 0, 0, 0.85)" } };
  return {
    gray: isDark ? "#f3f4f6" : "#1f2937",
    grayMuted: isDark ? "#f3f4f6" : "#6b7280",
    avatarBg: isDark ? "#3b82f6" : "#1890ff",
    avatarText: "#ffffff",
    progressSuccess: isDark ? "#34d399" : "#52c41a",
    progressNormal: isDark ? "#60a5fa" : "#1890ff",
    progressException: isDark ? "#f87171" : "#ff4d4f",
    progressBg: isDark ? "#374151" : "#f5f5f5",
    progressText: isDark ? "#d1d5db" : "rgba(0, 0, 0, 0.65)",
    tagColors,
  };
}

export type HRTagColorKey = "green" | "orange" | "blue" | "purple" | "red" | "default";

export const HR_STATUS_COLOR_MAP: Record<string, HRTagColorKey> = {
  Active: "green", "On Leave": "orange", Probation: "blue", Contract: "purple", Terminated: "red",
};

export const hrConfig = {
  headers: hrHeaders,
  rows: hrData,
} as const;
