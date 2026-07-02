import type { ReactHeaderObject, CellRendererProps, ValueGetterProps } from "@simple-table/react";

// Theme-dependent color helper function
const getThemeColors = (theme?: string) => {
  const themes = {
    "modern-light": {
      gray: "#1f2937",
      grayMuted: "#6b7280",
      success: {
        high: { color: "#15803d", fontWeight: "bold" },
        medium: "#16a34a",
        low: "#22c55e",
      },
      info: "#3b82f6",
      warning: "#ca8a04",
      avatar: {
        bg: "#1890ff",
        text: "#ffffff",
      },
      tagColors: {
        green: { bg: "#f6ffed", text: "#2a6a0d" },
        orange: { bg: "#fff7e6", text: "#ad4e00" },
        blue: { bg: "#e6f7ff", text: "#0050b3" },
        purple: { bg: "#f9f0ff", text: "#391085" },
        red: { bg: "#fff1f0", text: "#a8071a" },
        default: { bg: "#f0f0f0", text: "rgba(0, 0, 0, 0.85)" },
      },
      progressColors: {
        success: "#52c41a",
        normal: "#1890ff",
        exception: "#ff4d4f",
        bg: "#f5f5f5",
        text: "rgba(0, 0, 0, 0.65)",
      },
    },
    light: {
      gray: "#1f2937",
      grayMuted: "#6b7280",
      success: {
        high: { color: "#15803d", fontWeight: "bold" },
        medium: "#16a34a",
        low: "#22c55e",
      },
      info: "#3b82f6",
      warning: "#ca8a04",
      avatar: {
        bg: "#1890ff",
        text: "#ffffff",
      },
      tagColors: {
        green: { bg: "#f6ffed", text: "#2a6a0d" },
        orange: { bg: "#fff7e6", text: "#ad4e00" },
        blue: { bg: "#e6f7ff", text: "#0050b3" },
        purple: { bg: "#f9f0ff", text: "#391085" },
        red: { bg: "#fff1f0", text: "#a8071a" },
        default: { bg: "#f0f0f0", text: "rgba(0, 0, 0, 0.85)" },
      },
      progressColors: {
        success: "#52c41a",
        normal: "#1890ff",
        exception: "#ff4d4f",
        bg: "#f5f5f5",
        text: "rgba(0, 0, 0, 0.65)",
      },
    },
    "modern-dark": {
      gray: "#f3f4f6",
      grayMuted: "#f3f4f6",
      success: {
        high: { color: "#86efac", fontWeight: "bold" },
        medium: "#4ade80",
        low: "#22c55e",
      },
      info: "#60a5fa",
      warning: "#facc15",
      avatar: {
        bg: "#3b82f6",
        text: "#ffffff",
      },
      tagColors: {
        green: { bg: "#065f46", text: "#86efac" },
        orange: { bg: "#9a3412", text: "#fed7aa" },
        blue: { bg: "#1e3a8a", text: "#93c5fd" },
        purple: { bg: "#581c87", text: "#c4b5fd" },
        red: { bg: "#991b1b", text: "#fca5a5" },
        default: { bg: "#374151", text: "#e5e7eb" },
      },
      progressColors: {
        success: "#34d399",
        normal: "#60a5fa",
        exception: "#f87171",
        bg: "#374151",
        text: "#d1d5db",
      },
    },
    dark: {
      gray: "#f3f4f6",
      grayMuted: "#f3f4f6",
      success: {
        high: { color: "#86efac", fontWeight: "bold" },
        medium: "#4ade80",
        low: "#22c55e",
      },
      info: "#60a5fa",
      warning: "#facc15",
      avatar: {
        bg: "#3b82f6",
        text: "#ffffff",
      },
      tagColors: {
        green: { bg: "#065f46", text: "#86efac" },
        orange: { bg: "#9a3412", text: "#fed7aa" },
        blue: { bg: "#1e3a8a", text: "#93c5fd" },
        purple: { bg: "#581c87", text: "#c4b5fd" },
        red: { bg: "#991b1b", text: "#fca5a5" },
        default: { bg: "#374151", text: "#e5e7eb" },
      },
      progressColors: {
        success: "#34d399",
        normal: "#60a5fa",
        exception: "#f87171",
        bg: "#374151",
        text: "#d1d5db",
      },
    },
    neutral: {
      gray: "#111827",
      grayMuted: "#4b5563",
      success: {
        high: { color: "#1f2937", fontWeight: "bold" },
        medium: "#374151",
        low: "#4b5563",
      },
      info: "#6b7280",
      warning: "#6b7280",
      avatar: {
        bg: "#6b7280",
        text: "#ffffff",
      },
      tagColors: {
        green: { bg: "#f9fafb", text: "#374151" },
        orange: { bg: "#f9fafb", text: "#374151" },
        blue: { bg: "#f9fafb", text: "#374151" },
        purple: { bg: "#f9fafb", text: "#374151" },
        red: { bg: "#f9fafb", text: "#374151" },
        default: { bg: "#f3f4f6", text: "#374151" },
      },
      progressColors: {
        success: "#6b7280",
        normal: "#9ca3af",
        exception: "#d1d5db",
        bg: "#f3f4f6",
        text: "#6b7280",
      },
    },
    custom: {
      gray: "#374151",
      grayMuted: "#4b5563",
      success: {
        high: { color: "#15803d", fontWeight: "bold" },
        medium: "#16a34a",
        low: "#22c55e",
      },
      info: "#3b82f6",
      warning: "#ca8a04",
      avatar: {
        bg: "#1890ff",
        text: "#ffffff",
      },
      tagColors: {
        green: { bg: "#f6ffed", text: "#2a6a0d" },
        orange: { bg: "#fff7e6", text: "#ad4e00" },
        blue: { bg: "#e6f7ff", text: "#0050b3" },
        purple: { bg: "#f9f0ff", text: "#391085" },
        red: { bg: "#fff1f0", text: "#a8071a" },
        default: { bg: "#f0f0f0", text: "rgba(0, 0, 0, 0.85)" },
      },
      progressColors: {
        success: "#52c41a",
        normal: "#1890ff",
        exception: "#ff4d4f",
        bg: "#f5f5f5",
        text: "rgba(0, 0, 0, 0.65)",
      },
    },
  };

  return themes[theme as keyof typeof themes] || themes["modern-light"];
};

// Deterministic HSL color from a string seed (gives each employee a distinct avatar).
const colorFromName = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 60%, 50%)`;
};

// Custom Avatar component
const Avatar = ({
  children,
  size,
  theme,
  bgColor,
}: {
  children: React.ReactNode;
  size?: string;
  theme?: string;
  bgColor?: string;
}) => {
  const sizePx = size === "small" ? 24 : 32;
  const colors = getThemeColors(theme);

  return (
    <div
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor ?? colors.avatar.bg,
        color: colors.avatar.text,
        fontSize: size === "small" ? "12px" : "14px",
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
};

// Custom Tag component
const Tag = ({
  children,
  color,
  theme,
}: {
  children: React.ReactNode;
  color?: string;
  theme?: string;
}) => {
  const colors = getThemeColors(theme);
  const tagColor =
    colors.tagColors[color as keyof typeof colors.tagColors] || colors.tagColors.default;

  return (
    <span
      style={{
        backgroundColor: tagColor.bg,
        color: tagColor.text,
        padding: "0 7px",
        fontSize: "12px",
        lineHeight: "20px",
        borderRadius: "2px",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};

// Custom Progress component
const Progress = ({
  percent,
  size,
  showInfo = true,
  status,
  theme,
}: {
  percent: number;
  size?: string;
  showInfo?: boolean;
  status?: "success" | "normal" | "exception";
  theme?: string;
}) => {
  const colors = getThemeColors(theme);
  const getColorByStatus = (status?: string) => {
    switch (status) {
      case "success":
        return colors.progressColors.success;
      case "exception":
        return colors.progressColors.exception;
      case "normal":
      default:
        return colors.progressColors.normal;
    }
  };

  const height = size === "small" ? 6 : 8;

  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        position: "relative",
        marginRight: showInfo ? "50px" : "0",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: colors.progressColors.bg,
          height: `${height}px`,
          borderRadius: "100px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            backgroundColor: getColorByStatus(status),
            borderRadius: "100px",
          }}
        />
      </div>
      {showInfo && (
        <span
          style={{
            flexShrink: 0,
            marginLeft: "8px",
            fontSize: "14px",
            color: colors.progressColors.text,
          }}
        >
          {`${percent}%`}
        </span>
      )}
    </div>
  );
};

// Define our table headers
export const HEADERS: ReactHeaderObject[] = [
  {
    accessor: "fullName",
    label: "Employee",
    width: 220,
    isSortable: true,
    isEditable: false,
    align: "left",
    pinned: "left",
    type: "string",
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      // Employee row, render with avatar and details
      const initials = `${row.firstName?.toString().charAt(0) || ""}${
        row.lastName?.toString().charAt(0) || ""
      }`;
      const name = row.fullName as string;
      const position = row.position as string;
      const colors = getThemeColors(theme);

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar size="small" theme={theme} bgColor={colorFromName(name || initials)}>
            {initials}
          </Avatar>
          <div style={{ marginLeft: "8px" }}>
            <div>{name}</div>
            <div style={{ fontSize: "12px", color: colors.grayMuted }}>{position}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessor: "performanceScore",
    label: "Performance",
    width: "auto",
    isSortable: true,
    isEditable: true,
    align: "center",
    type: "number",
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const score = row.performanceScore as number;
      const colors = getThemeColors(theme);

      const getColorByScore = (score: number): "success" | "normal" | "exception" => {
        if (score >= 90) return "success";
        if (score >= 65) return "normal";
        return "exception"; // Default case for low scores
      };

      return (
        <div
          style={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Progress
            percent={score}
            size="small"
            showInfo={false}
            status={getColorByScore(score)}
            theme={theme}
          />
          <div
            style={{ fontSize: "12px", textAlign: "center", marginTop: "4px", color: colors.gray }}
          >
            {score}/100
          </div>
        </div>
      );
    },
    valueFormatter: ({ value }) => {
      return `${value}/100`;
    },
    useFormattedValueForClipboard: true, // Copy as "85/100"
    exportValueGetter: ({ value }) => {
      // Export as percentage for CSV
      return `${value}%`;
    },
  },
  {
    accessor: "department",
    label: "Department",
    width: "auto",
    isSortable: true,
    isEditable: true,
    align: "left",
    type: "enum",
    enumOptions: [
      { label: "Engineering", value: "Engineering" },
      { label: "Marketing", value: "Marketing" },
      { label: "Sales", value: "Sales" },
      { label: "Finance", value: "Finance" },
      { label: "HR", value: "HR" },
      { label: "Operations", value: "Operations" },
      { label: "Customer Support", value: "Customer Support" },
    ],
  },
  {
    accessor: "email",
    label: "Email",
    width: "auto",
    isSortable: true,
    isEditable: true,
    align: "left",
    type: "string",
  },
  {
    accessor: "location",
    label: "Location",
    width: "auto",
    isSortable: true,
    isEditable: true,
    align: "left",
    type: "enum",
    enumOptions: [
      { label: "New York", value: "New York" },
      { label: "Los Angeles", value: "Los Angeles" },
      { label: "Chicago", value: "Chicago" },
      { label: "San Francisco", value: "San Francisco" },
      { label: "Austin", value: "Austin" },
      { label: "Boston", value: "Boston" },
      { label: "Seattle", value: "Seattle" },
      { label: "Remote", value: "Remote" },
    ],
  },
  {
    accessor: "hireDate",
    label: "Hire Date",
    width: 120,
    isSortable: true,
    isEditable: true,
    align: "left",
    type: "date",
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      if (!row.hireDate) return "";
      // Parse YYYY-MM-DD format correctly without timezone conversion
      const [year, month, day] = (row.hireDate as string).split("-").map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      const colors = getThemeColors(theme);

      return (
        <span style={{ color: colors.gray }}>
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessor: "yearsOfService",
    label: "Service",
    width: 100,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "number",
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      if (row.yearsOfService === null) return "";
      const colors = getThemeColors(theme);

      return <span style={{ color: colors.gray }}>{`${row.yearsOfService} yrs`}</span>;
    },
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 130,
    isSortable: true,
    isEditable: true,
    align: "right",
    type: "number",
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const colors = getThemeColors(theme);

      return (
        <span style={{ color: colors.gray }}>{`$${(row.salary as number).toLocaleString()}`}</span>
      );
    },
    useFormattedValueForClipboard: true, // Copy formatted salary with $
    useFormattedValueForCSV: true, // Export formatted salary
    valueFormatter: ({ value }) => {
      return `$${(value as number).toLocaleString()}`;
    },
  },
  {
    accessor: "status",
    label: "Status",
    width: 120,
    isSortable: true,
    isEditable: true,
    align: "center",
    pinned: "right",
    type: "enum",
    enumOptions: [
      { label: "Active", value: "Active" },
      { label: "On Leave", value: "On Leave" },
      { label: "Probation", value: "Probation" },
      { label: "Contract", value: "Contract" },
      { label: "Terminated", value: "Terminated" },
    ],
    // Sort by HR priority: Terminated > Probation > Contract > On Leave > Active
    valueGetter: ({ row }: ValueGetterProps) => {
      const status = row.status as string;
      const priorityMap: Record<string, number> = {
        Terminated: 1,
        Probation: 2,
        Contract: 3,
        "On Leave": 4,
        Active: 5,
      };
      return priorityMap[status] || 999;
    },
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      if (!row.status) return "";

      const status = row.status as string;
      const statusColor =
        {
          Active: "green",
          "On Leave": "orange",
          Probation: "blue",
          Contract: "purple",
          Terminated: "red",
        }[status] || "default";

      return (
        <Tag color={statusColor} theme={theme}>
          {status}
        </Tag>
      );
    },
  },
  {
    accessor: "isRemoteEligible",
    label: "Remote Eligible",
    width: "auto",
    isSortable: true,
    isEditable: true,
    align: "center",
    type: "boolean",
  },
];
