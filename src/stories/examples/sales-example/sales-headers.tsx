import HeaderObject from "../../../types/HeaderObject";

// Theme-dependent color helper function
const getThemeColors = (theme?: string) => {
  const themes = {
    light: {
      gray: "#374151",
      grayMuted: "#9ca3af",
      success: {
        high: { color: "#15803d", fontWeight: "bold" },
        medium: "#16a34a",
        low: "#22c55e",
      },
      info: "#3b82f6",
      warning: "#ca8a04",
      progressColors: {
        high: "#10B981",
        medium: "#3B82F6",
        low: "#D97706",
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
      progressColors: {
        high: "#34D399",
        medium: "#60A5FA",
        low: "#FBBF24",
      },
    },
    sky: {
      gray: "#334155",
      grayMuted: "#94a3b8",
      success: {
        high: { color: "#0369a1", fontWeight: "bold" },
        medium: "#0284c7",
        low: "#0ea5e9",
      },
      info: "#06b6d4",
      warning: "#f59e0b",
      progressColors: {
        high: "#0EA5E9",
        medium: "#06B6D4",
        low: "#F59E0B",
      },
    },
    violet: {
      gray: "#374151",
      grayMuted: "#9ca3af",
      success: {
        high: { color: "#059669", fontWeight: "bold" },
        medium: "#65a30d",
        low: "#22c55e",
      },
      info: "#8b5cf6",
      warning: "#f97316",
      progressColors: {
        high: "#10B981",
        medium: "#8B5CF6",
        low: "#F97316",
      },
    },
    neutral: {
      gray: "#1f2937",
      grayMuted: "#9ca3af",
      success: {
        high: { color: "#1f2937", fontWeight: "bold" },
        medium: "#374151",
        low: "#4b5563",
      },
      info: "#6b7280",
      warning: "#6b7280",
      progressColors: {
        high: "#6B7280",
        medium: "#9CA3AF",
        low: "#D1D5DB",
      },
    },
    custom: {
      gray: "#9ca3af",
      grayMuted: "#e5e7eb",
      success: {
        high: { color: "#15803d", fontWeight: "bold" },
        medium: "#16a34a",
        low: "#22c55e",
      },
      info: "#3b82f6",
      warning: "#ca8a04",
      progressColors: {
        high: "#10B981",
        medium: "#3B82F6",
        low: "#D97706",
      },
    },
  };

  return themes[theme as keyof typeof themes] || themes.light;
};

// Custom Tag component
const Tag = ({
  children,
  color,
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) => {
  const getColorStyles = (color?: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      success: { bg: "#f6ffed", text: "#2a6a0d" },
      error: { bg: "#fff1f0", text: "#a8071a" },
      green: { bg: "#f6ffed", text: "#2a6a0d" },
      blue: { bg: "#e6f7ff", text: "#0050b3" },
      red: { bg: "#fff1f0", text: "#a8071a" },
      orange: { bg: "#fff7e6", text: "#ad4e00" },
      purple: { bg: "#f9f0ff", text: "#391085" },
      default: { bg: "#f0f0f0", text: "rgba(0, 0, 0, 0.85)" },
    };

    return colors[color || "default"];
  };

  const { bg, text } = getColorStyles(color);

  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        padding: "0 7px",
        fontSize: "12px",
        lineHeight: "20px",
        borderRadius: "2px",
        display: "inline-block",
      }}
      className={className}
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
  strokeColor,
  status,
}: {
  percent: number;
  size?: string;
  showInfo?: boolean;
  strokeColor?: string;
  status?: "success" | "normal" | "exception";
}) => {
  const getColorByStatus = (status?: string) => {
    switch (status) {
      case "success":
        return "#52c41a";
      case "exception":
        return "#ff4d4f";
      case "normal":
      default:
        return "#1890ff";
    }
  };

  const height = size === "small" ? 6 : 8;
  const color = strokeColor || getColorByStatus(status);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        marginRight: showInfo ? "50px" : "0",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#f5f5f5",
          height: `${height}px`,
          width: "100%",
          borderRadius: "100px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            backgroundColor: color,
            borderRadius: "100px",
          }}
        />
      </div>
      {showInfo && (
        <span
          style={{
            marginLeft: "8px",
            fontSize: "14px",
            color: "rgba(0, 0, 0, 0.65)",
          }}
        >
          {`${percent}%`}
        </span>
      )}
    </div>
  );
};

export const SALES_HEADERS: HeaderObject[] = [
  {
    accessor: "repName",
    label: "Sales Representative",
    width: "2fr",
    minWidth: 200,
    isSortable: true,
    isEditable: true,
    type: "string",
  },
  {
    accessor: "salesMetrics",
    label: "Sales Metrics",
    width: 600,
    isSortable: false,
    children: [
      {
        accessor: "dealSize",
        label: "Deal Size",
        width: "1fr",
        minWidth: 140,
        isSortable: true,
        isEditable: true,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.dealSize === "—") return "—";
          return `$${(row.dealSize as number).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "dealValue",
        label: "Deal Value",
        width: "1fr",
        minWidth: 140,
        isSortable: true,
        isEditable: true,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          if (row.dealValue === "—") return "—";
          const value = row.dealValue as number;
          const colors = getThemeColors(theme);

          // Color code based on value tiers
          let valueStyle: React.CSSProperties = { color: colors.gray };
          if (value > 100000) valueStyle = colors.success.high;
          else if (value > 50000) valueStyle = { color: colors.success.medium };
          else if (value > 10000) valueStyle = { color: colors.success.low };

          return (
            <span style={valueStyle}>
              $
              {value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        accessor: "isWon",
        label: "Status",
        width: "1fr",
        minWidth: 140,
        isSortable: true,
        isEditable: true,
        align: "center",
        type: "boolean",
        cellRenderer: ({ row }) => {
          if (row.isWon === "—") return "—";
          const isWon = row.isWon as boolean;
          return (
            <Tag color={isWon ? "success" : "error"} className="py-1 px-2">
              {isWon ? "Won" : "Lost"}
            </Tag>
          );
        },
      },
      {
        accessor: "closeDate",
        label: "Close Date",
        width: "1fr",
        minWidth: 140,
        isSortable: true,
        isEditable: true,
        align: "center",
        type: "date",
        cellRenderer: ({ row }) => {
          if (!row.closeDate) return "—";
          // Parse date string properly to avoid timezone issues
          const [year, month, day] = (row.closeDate as string).split("-").map(Number);
          const date = new Date(year, month - 1, day, 12, 0, 0);
          return (
            <div className="flex items-center justify-center">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          );
        },
      },
    ],
  },
  {
    accessor: "financialMetrics",
    label: "Financial Metrics",
    width: "1fr",
    minWidth: 140,
    isSortable: false,
    children: [
      {
        accessor: "commission",
        label: "Commission",
        width: "1fr",
        minWidth: 140,
        isSortable: true,
        isEditable: true,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          if (row.commission === "—") return "—";
          const value = row.commission as number;
          const colors = getThemeColors(theme);

          if (value === 0) return <span style={{ color: colors.grayMuted }}>$0.00</span>;

          return `$${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "profitMargin",
        label: "Profit Margin",
        width: "1fr",
        minWidth: 140,
        isSortable: true,
        isEditable: true,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          if (row.profitMargin === "—") return "—";
          const value = row.profitMargin as number;
          const colors = getThemeColors(theme);

          // Enhanced color coding based on profit margin tiers
          let colorStyle: React.CSSProperties = { color: colors.gray };
          if (value >= 0.7) colorStyle = colors.success.high; // Software-like margins
          else if (value >= 0.5) colorStyle = { color: colors.success.medium };
          else if (value >= 0.4) colorStyle = { color: colors.success.low };
          else if (value >= 0.3) colorStyle = { color: colors.info };
          else colorStyle = { color: colors.warning }; // Hardware-like margins

          return (
            <div className="flex items-center justify-end">
              <span style={colorStyle}>{(value * 100).toFixed(1)}%</span>
              <div className="ml-2 w-12">
                <Progress
                  percent={value * 100}
                  size="small"
                  showInfo={false}
                  strokeColor={
                    value >= 0.5
                      ? colors.progressColors.high
                      : value >= 0.3
                      ? colors.progressColors.medium
                      : colors.progressColors.low
                  }
                />
              </div>
            </div>
          );
        },
      },
      {
        accessor: "dealProfit",
        label: "Deal Profit",
        width: "1fr",
        minWidth: 140,
        isSortable: true,
        isEditable: true,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          if (row.dealProfit === "—") return "—";
          const value = row.dealProfit as number;
          const colors = getThemeColors(theme);

          if (value === 0) return <span style={{ color: colors.grayMuted }}>$0.00</span>;

          // Color code based on profit tiers
          let profitStyle: React.CSSProperties = { color: colors.gray };
          if (value > 50000) profitStyle = colors.success.high;
          else if (value > 20000) profitStyle = { color: colors.success.medium };
          else if (value > 10000) profitStyle = { color: colors.success.low };

          return (
            <span style={profitStyle}>
              $
              {value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        accessor: "category",
        label: "Category",
        width: "1fr",
        minWidth: 140,
        isSortable: true,
        isEditable: true,
        align: "center",
        type: "enum",
        enumOptions: [
          { label: "Software", value: "Software" },
          { label: "Hardware", value: "Hardware" },
          { label: "Services", value: "Services" },
          { label: "Consulting", value: "Consulting" },
          { label: "Training", value: "Training" },
          { label: "Support", value: "Support" },
        ],
      },
    ],
  },
];
