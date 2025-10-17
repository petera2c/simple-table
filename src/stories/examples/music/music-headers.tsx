import HeaderObject from "../../../types/HeaderObject";

// Theme-dependent color helper function
const getThemeColors = (theme?: string) => {
  const themes = {
    light: {
      gray: "#374151",
      grayMuted: "#9ca3af",
      avatarBg: "#1890ff",
      avatarText: "#ffffff",
    },
    dark: {
      gray: "#f3f4f6",
      grayMuted: "#d1d5db",
      avatarBg: "#3b82f6",
      avatarText: "#ffffff",
    },
    sky: {
      gray: "#334155",
      grayMuted: "#94a3b8",
      avatarBg: "#0ea5e9",
      avatarText: "#ffffff",
    },
    violet: {
      gray: "#374151",
      grayMuted: "#9ca3af",
      avatarBg: "#8b5cf6",
      avatarText: "#ffffff",
    },
    neutral: {
      gray: "#1f2937",
      grayMuted: "#9ca3af",
      avatarBg: "#6b7280",
      avatarText: "#ffffff",
    },
    custom: {
      gray: "#374151",
      grayMuted: "#9ca3af",
      avatarBg: "#1890ff",
      avatarText: "#ffffff",
    },
  };

  return themes[theme as keyof typeof themes] || themes.light;
};

// Custom cell renderer for artist avatar (circle with first letter)
const ArtistAvatarCell = ({ row, theme }: { row: any; theme?: string }) => {
  const name = row.artistName as string;
  const firstLetter = name?.charAt(0).toUpperCase() || "?";

  // Generate a consistent color based on the name
  const getColorFromName = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: getColorFromName(name),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          flexShrink: 0,
        }}
      >
        {firstLetter}
      </div>
      <span style={{ fontWeight: "500" }}>{name}</span>
    </div>
  );
};

// Custom Tag component
const Tag = ({ children, color }: { children: React.ReactNode; color?: string }) => {
  const getColorStyles = (color?: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      green: { bg: "#f6ffed", text: "#2a6a0d" },
      blue: { bg: "#e6f7ff", text: "#0050b3" },
      yellow: { bg: "#fffbe6", text: "#ad6800" },
      red: { bg: "#fff1f0", text: "#a8071a" },
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
}: {
  percent: number;
  size?: string;
  showInfo?: boolean;
  strokeColor?: string;
}) => {
  const height = size === "small" ? 6 : 8;
  const color = strokeColor || "#1890ff";

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

export const HEADERS: HeaderObject[] = [
  {
    accessor: "rank",
    label: "#",
    width: 60,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "number",
  },
  {
    accessor: "artistName",
    label: "Artist",
    width: 250,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
    pinned: "left",
    cellRenderer: ({ row, theme }) => {
      const name = row.artistName as string;
      const firstLetter = name?.charAt(0).toUpperCase() || "?";
      const growthStatus = row.growthStatus as string;
      const mood = row.mood as string;
      const genre = row.genre as string;
      const colors = getThemeColors(theme);

      // Generate a consistent color based on the name
      const getColorFromName = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 65%, 55%)`;
      };

      // Status color mapping
      const statusColorMap: Record<string, string> = {
        Growth: "green",
        Trending: "blue",
        Steady: "yellow",
        Declining: "red",
      };

      return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: getColorFromName(name),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              flexShrink: 0,
            }}
          >
            {firstLetter}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
            <span style={{ fontWeight: "500", fontSize: "14px" }}>{name}</span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <Tag color={statusColorMap[growthStatus] || "default"}>{growthStatus}</Tag>
              <span style={{ fontSize: "12px", color: colors.grayMuted }}>{mood}</span>
              <span style={{ fontSize: "12px", color: colors.grayMuted }}>{genre}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessor: "artistType",
    label: "Identity",
    width: 280,
    isSortable: false,
    isEditable: false,
    align: "left",
    type: "string",
    cellRenderer: ({ row, theme }) => {
      const artistType = row.artistType as string;
      const pronouns = row.pronouns as string;
      const recordLabel = row.recordLabel as string;
      const language = row.lyricsLanguage as string;
      const colors = getThemeColors(theme);

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ fontSize: "13px", color: colors.gray }}>
            {artistType}, {pronouns}
          </div>
          <div style={{ fontSize: "12px", color: colors.grayMuted }}>{recordLabel}</div>
          <div style={{ fontSize: "12px", color: colors.grayMuted }}>
            Lyrics Language: {language}
          </div>
        </div>
      );
    },
  },
  {
    accessor: "followersGroup",
    label: "Followers",
    width: 700,
    collapsible: true,
    children: [
      {
        accessor: "followers",
        label: "Total Followers",
        width: 180,
        summaryColumn: true,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const formatted = row.followersFormatted as string;
          const growth = row.followersGrowthFormatted as string;
          const growthPercent = row.followersGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontWeight: "600", fontSize: "14px", color: colors.gray }}>
                {formatted}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>↑</span>
                <span>
                  {growth} ({growthPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessor: "followers7DayGrowth",
        label: "7-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.followers7DayGrowth as number;
          const growthPercent = row.followers7DayGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div style={{ color: colors.gray }}>
              +{growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
      {
        accessor: "followers28DayGrowth",
        label: "28-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.followers28DayGrowth as number;
          const growthPercent = row.followers28DayGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div style={{ color: colors.gray }}>
              +{growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
      {
        accessor: "followers60DayGrowth",
        label: "60-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.followers60DayGrowth as number;
          const growthPercent = row.followers60DayGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div style={{ color: colors.gray }}>
              +{growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
    ],
  },
  {
    accessor: "popularity",
    label: "Popularity",
    width: 180,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "number",
    cellRenderer: ({ row }) => {
      const score = row.popularity as number;
      const getColor = (val: number) => {
        if (val >= 90) return "#22c55e";
        if (val >= 75) return "#3b82f6";
        if (val >= 50) return "#f59e0b";
        return "#ef4444";
      };

      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              flex: 1,
              height: "8px",
              backgroundColor: "#e5e7eb",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${score}%`,
                height: "100%",
                backgroundColor: getColor(score),
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span style={{ fontWeight: "600", minWidth: "45px" }}>{score}/100</span>
        </div>
      );
    },
  },
  {
    accessor: "playlistReachGroup",
    label: "Playlist Reach",
    width: 700,
    collapsible: true,
    children: [
      {
        accessor: "playlistReach",
        label: "Total Reach",
        width: 180,
        summaryColumn: true,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const formattedValue = row.playlistReachFormatted as string;
          const growth = row.playlistReachChange as number;
          const growthFormatted = row.playlistReachChangeFormatted as string;
          const growthPercent = row.playlistReachChangePercent as number;
          const isPositive = growth >= 0;
          const colors = getThemeColors(theme);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontWeight: "600", fontSize: "14px", color: colors.gray }}>
                {formattedValue}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: isPositive ? "#16a34a" : "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>{isPositive ? "↑" : "↓"}</span>
                <span>
                  {growthFormatted} ({Math.abs(growthPercent).toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessor: "playlistReach7DayGrowth",
        label: "7-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.playlistReach7DayGrowth as number;
          const growthPercent = row.playlistReach7DayGrowthPercent as number;
          const colors = getThemeColors(theme);
          const isPositive = growth >= 0;

          return (
            <div style={{ color: isPositive ? "#16a34a" : "#dc2626" }}>
              {isPositive ? "+" : ""}
              {growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
      {
        accessor: "playlistReach28DayGrowth",
        label: "28-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.playlistReach28DayGrowth as number;
          const growthPercent = row.playlistReach28DayGrowthPercent as number;
          const colors = getThemeColors(theme);
          const isPositive = growth >= 0;

          return (
            <div style={{ color: isPositive ? "#16a34a" : "#dc2626" }}>
              {isPositive ? "+" : ""}
              {growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
      {
        accessor: "playlistReach60DayGrowth",
        label: "60-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.playlistReach60DayGrowth as number;
          const growthPercent = row.playlistReach60DayGrowthPercent as number;
          const colors = getThemeColors(theme);
          const isPositive = growth >= 0;

          return (
            <div style={{ color: isPositive ? "#16a34a" : "#dc2626" }}>
              {isPositive ? "+" : ""}
              {growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
    ],
  },
  {
    accessor: "playlistCountGroup",
    label: "Playlist Count",
    width: 700,
    collapsible: true,
    children: [
      {
        accessor: "playlistCount",
        label: "Total Count",
        width: 180,
        summaryColumn: true,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const count = row.playlistCount as number;
          const growth = row.playlistCountGrowth as number;
          const growthPercent = row.playlistCountGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontWeight: "600", fontSize: "14px", color: colors.gray }}>
                {count.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>↑</span>
                <span>
                  {growth} ({growthPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessor: "playlistCount7DayGrowth",
        label: "7-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.playlistCount7DayGrowth as number;
          const growthPercent = row.playlistCount7DayGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div style={{ color: colors.gray }}>
              +{growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
      {
        accessor: "playlistCount28DayGrowth",
        label: "28-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.playlistCount28DayGrowth as number;
          const growthPercent = row.playlistCount28DayGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div style={{ color: colors.gray }}>
              +{growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
      {
        accessor: "playlistCount60DayGrowth",
        label: "60-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.playlistCount60DayGrowth as number;
          const growthPercent = row.playlistCount60DayGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div style={{ color: colors.gray }}>
              +{growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
    ],
  },
  {
    accessor: "monthlyListenersGroup",
    label: "Monthly Listeners",
    width: 700,
    collapsible: true,
    children: [
      {
        accessor: "monthlyListeners",
        label: "Total Listeners",
        width: 180,
        summaryColumn: true,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const formattedValue = row.monthlyListenersFormatted as string;
          const growth = row.monthlyListenersChange as number;
          const growthFormatted = row.monthlyListenersChangeFormatted as string;
          const growthPercent = row.monthlyListenersChangePercent as number;
          const isPositive = growth >= 0;
          const colors = getThemeColors(theme);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontWeight: "600", fontSize: "14px", color: colors.gray }}>
                {formattedValue}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: isPositive ? "#16a34a" : "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>{isPositive ? "↑" : "↓"}</span>
                <span>
                  {growthFormatted} ({Math.abs(growthPercent).toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessor: "monthlyListeners7DayGrowth",
        label: "7-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.monthlyListeners7DayGrowth as number;
          const growthPercent = row.monthlyListeners7DayGrowthPercent as number;
          const colors = getThemeColors(theme);
          const isPositive = growth >= 0;

          return (
            <div style={{ color: isPositive ? "#16a34a" : "#dc2626" }}>
              {isPositive ? "+" : ""}
              {growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
      {
        accessor: "monthlyListeners28DayGrowth",
        label: "28-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.monthlyListeners28DayGrowth as number;
          const growthPercent = row.monthlyListeners28DayGrowthPercent as number;
          const colors = getThemeColors(theme);
          const isPositive = growth >= 0;

          return (
            <div style={{ color: isPositive ? "#16a34a" : "#dc2626" }}>
              {isPositive ? "+" : ""}
              {growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
      {
        accessor: "monthlyListeners60DayGrowth",
        label: "60-Day Growth",
        width: 160,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row, theme }) => {
          const growth = row.monthlyListeners60DayGrowth as number;
          const growthPercent = row.monthlyListeners60DayGrowthPercent as number;
          const colors = getThemeColors(theme);
          const isPositive = growth >= 0;

          return (
            <div style={{ color: isPositive ? "#16a34a" : "#dc2626" }}>
              {isPositive ? "+" : ""}
              {growth.toLocaleString()} ({growthPercent}%)
            </div>
          );
        },
      },
    ],
  },
  {
    accessor: "conversionRate",
    label: "Conversion Rate",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    cellRenderer: ({ row, theme }) => {
      const percent = row.conversionRate as number;
      const colors = getThemeColors(theme);
      return <span style={{ fontWeight: "600", color: colors.gray }}>{percent.toFixed(2)}%</span>;
    },
  },
  {
    accessor: "reachFollowersRatio",
    label: "Reach/Followers Ratio",
    width: 180,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    cellRenderer: ({ row, theme }) => {
      const percent = row.reachFollowersRatio as number;
      const colors = getThemeColors(theme);
      return <span style={{ fontWeight: "600", color: colors.gray }}>{percent.toFixed(1)}%</span>;
    },
  },
];
