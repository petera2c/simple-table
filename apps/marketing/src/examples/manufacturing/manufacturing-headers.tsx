import type { ReactHeaderObject, CellRendererProps, ValueGetterProps } from "@simple-table/react";

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
  status,
}: {
  percent: number;
  size?: string;
  showInfo?: boolean;
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
          backgroundColor: "#f5f5f5",
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
            color: "rgba(0, 0, 0, 0.65)",
          }}
        >
          {`${percent}%`}
        </span>
      )}
    </div>
  );
};

export const HEADERS: ReactHeaderObject[] = [
  {
    accessor: "productLine",
    label: "Production Line",
    width: 180,
    expandable: true,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      return hasChildren ? (
        <span className="font-bold">{row.productLine as string}</span>
      ) : (
        (row.productLine as string)
      );
    },
  },
  {
    accessor: "station",
    label: "Workstation",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) {
        return <span className="text-gray-500">{row.id as string}</span>;
      }
      return (
        <div className="flex items-center gap-1">
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-1.5 py-0.5 rounded">
            {row.id as string}
          </span>
          <span>{row.station as string}</span>
        </div>
      );
    },
  },
  {
    accessor: "machineType",
    label: "Machine Type",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
  },
  {
    accessor: "status",
    label: "Status",
    width: 180,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "string",
    // Sort by operational priority: Unplanned Downtime > Idle > Setup > Scheduled Maintenance > Running
    valueGetter: ({ row }: ValueGetterProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) return 999; // Parent rows sort last

      const status = row.status as string;
      const priorityMap: Record<string, number> = {
        "Unplanned Downtime": 1,
        Idle: 2,
        Setup: 3,
        "Scheduled Maintenance": 4,
        Running: 5,
      };
      return priorityMap[status] || 999;
    },
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) return "—";

      const status = row.status as string;

      // Theme-aware color mapping with improved dark theme visibility
      const getStatusColors = (status: string, theme?: string) => {
        const isModernDark = theme === "modern-dark";
        const isDark = theme === "dark" || isModernDark;
        const isModernLight = theme === "modern-light";
        const isLight = theme === "light" || isModernLight;

        const colorMaps = {
          Running: isModernDark
            ? { bg: "rgba(6, 95, 70, 0.4)", text: "#6ee7b7" }
            : isDark
              ? { bg: "rgba(6, 78, 59, 0.4)", text: "#6ee7b7" }
              : isLight
                ? { bg: "#dcfce7", text: "#16a34a" }
                : { bg: "#f6ffed", text: "#2a6a0d" },
          "Scheduled Maintenance": isModernDark
            ? { bg: "rgba(30, 64, 175, 0.4)", text: "#93c5fd" }
            : isDark
              ? { bg: "rgba(30, 58, 138, 0.4)", text: "#93c5fd" }
              : isLight
                ? { bg: "#dbeafe", text: "#3b82f6" }
                : { bg: "#e6f7ff", text: "#0050b3" },
          "Unplanned Downtime": isModernDark
            ? { bg: "rgba(153, 27, 27, 0.4)", text: "#fca5a5" }
            : isDark
              ? { bg: "rgba(127, 29, 29, 0.4)", text: "#fca5a5" }
              : isLight
                ? { bg: "#fee2e2", text: "#dc2626" }
                : { bg: "#fff1f0", text: "#a8071a" },
          Idle: isModernDark
            ? { bg: "rgba(146, 64, 14, 0.4)", text: "#fcd34d" }
            : isDark
              ? { bg: "rgba(120, 53, 15, 0.4)", text: "#fcd34d" }
              : isLight
                ? { bg: "#fef3c7", text: "#d97706" }
                : { bg: "#fff7e6", text: "#ad4e00" },
          Setup: isModernDark
            ? { bg: "rgba(109, 40, 217, 0.4)", text: "#c4b5fd" }
            : isDark
              ? { bg: "rgba(88, 28, 135, 0.4)", text: "#c4b5fd" }
              : isLight
                ? { bg: "#e9d5ff", text: "#9333ea" }
                : { bg: "#f9f0ff", text: "#391085" },
        };

        return (
          colorMaps[status as keyof typeof colorMaps] ||
          (isModernDark
            ? { bg: "rgba(75, 85, 99, 0.4)", text: "#d1d5db" }
            : isDark
              ? { bg: "rgba(55, 65, 81, 0.4)", text: "#d1d5db" }
              : isLight
                ? { bg: "#f3f4f6", text: "#6b7280" }
                : { bg: "#f0f0f0", text: "rgba(0, 0, 0, 0.85)" })
        );
      };

      const colors = getStatusColors(status, theme);

      return (
        <span
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            padding: "4px 12px",
            fontSize: "12px",
            lineHeight: "20px",
            borderRadius: "4px",
            display: "inline-block",
            fontWeight: "600",
          }}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessor: "outputRate",
    label: "Output (units/shift)",
    width: 200,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      const value = row.outputRate as number;
      return <div className={hasChildren ? "font-bold" : ""}>{value.toLocaleString()}</div>;
    },
  },
  {
    accessor: "cycletime",
    label: "Cycle Time (s)",
    width: 140,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) {
        const value = row.cycletime as number;
        return <span className="font-bold">{value?.toFixed(1)}</span>;
      }
      return <span>{row.cycletime as string}</span>;
    },
  },
  {
    accessor: "efficiency",
    label: "Efficiency",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) {
        const efficiency = row.efficiency as number;
        const getColorByEfficiency = (value: number): "success" | "normal" | "exception" => {
          if (value >= 90) return "success";
          if (value >= 75) return "normal";
          return "exception";
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
              percent={efficiency}
              size="small"
              showInfo={false}
              status={getColorByEfficiency(efficiency)}
            />
            <div className="text-xs text-center mt-1 font-bold">{efficiency?.toFixed(0)}%</div>
          </div>
        );
      }

      const efficiency = row.efficiency as number;
      const getColorByEfficiency = (value: number): "success" | "normal" | "exception" => {
        if (value >= 90) return "success";
        if (value >= 75) return "normal";
        return "exception";
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
            percent={efficiency}
            size="small"
            showInfo={false}
            status={getColorByEfficiency(efficiency)}
          />
          <div className="text-xs text-center mt-1">{efficiency}%</div>
        </div>
      );
    },
  },
  {
    accessor: "defectRate",
    label: "Defect Rate",
    width: 120,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) {
        const rate = row.defectRate as number;
        const color = rate < 1 ? "text-green-600" : rate < 3 ? "text-orange-500" : "text-red-600";
        return <span className={`${color} font-bold`}>{rate?.toFixed(2)}%</span>;
      }
      const rate = parseFloat(row.defectRate as string);
      const color = rate < 1 ? "text-green-600" : rate < 3 ? "text-orange-500" : "text-red-600";
      return <span className={color}>{rate}%</span>;
    },
  },
  {
    accessor: "defectCount",
    label: "Defects",
    width: 120,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      const value = row.defectCount as number;
      return <div className={hasChildren ? "font-bold" : ""}>{value.toLocaleString()}</div>;
    },
  },
  {
    accessor: "downtime",
    label: "Downtime (h)",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) {
        const hours = row.downtime as number;
        const color = hours < 1 ? "text-green-600" : hours < 2 ? "text-orange-500" : "text-red-600";
        return <span className={`${color} font-bold`}>{hours?.toFixed(2)}</span>;
      }
      const hours = parseFloat(row.downtime as string);
      const color = hours < 1 ? "text-green-600" : hours < 2 ? "text-orange-500" : "text-red-600";
      return <span className={color}>{hours}</span>;
    },
  },
  {
    accessor: "utilization",
    label: "Utilization",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) {
        const value = row.utilization as number;
        return <span className="font-bold">{value?.toFixed(0)}%</span>;
      }
      return `${row.utilization}%`;
    },
  },
  {
    accessor: "energy",
    label: "Energy (kWh)",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      const value = row.energy as number;
      return <div className={hasChildren ? "font-bold" : ""}>{value.toLocaleString()}</div>;
    },
  },
  {
    accessor: "maintenanceDate",
    label: "Next Maintenance",
    width: 200,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "date",
    cellRenderer: ({ row }: CellRendererProps) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) return "—";

      // Parse YYYY-MM-DD format correctly without timezone conversion
      const [year, month, day] = (row.maintenanceDate as string).split("-").map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      const today = new Date();
      const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let color = "blue";
      if (diffDays <= 3) color = "red";
      else if (diffDays <= 7) color = "orange";

      return (
        <Tag color={color}>
          {date.toLocaleDateString()} ({diffDays} days)
        </Tag>
      );
    },
  },
];
