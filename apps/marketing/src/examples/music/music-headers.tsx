import type { ReactHeaderObject, CellRendererProps } from "@simple-table/react";

// Theme-dependent color helper function
const getThemeColors = (theme?: string) => {
  const themes = {
    "modern-light": {
      gray: "#374151",
      grayMuted: "#9ca3af",
      success: "#16a34a",
      successBg: "#f0fdf4",
      successLight: "#dcfce7",
      error: "#dc2626",
      errorBg: "#fef2f2",
      errorLight: "#fee2e2",
      primary: "#2563eb",
      primaryBg: "#eff6ff",
      warning: "#d97706",
      warningBg: "#fffbeb",
      tagBorder: "#e5e7eb",
      tagBg: "#ffffff",
      tagText: "#000000",
      progressBg: "#e5e7eb",
      highScore: "#16a34a",
      mediumScore: "#2563eb",
      lowScore: "#f59e0b",
      veryLowScore: "#ef4444",
    },
    light: {
      gray: "#374151",
      grayMuted: "#9ca3af",
      success: "#16a34a",
      successBg: "#f0fdf4",
      successLight: "#dcfce7",
      error: "#dc2626",
      errorBg: "#fef2f2",
      errorLight: "#fee2e2",
      primary: "#2563eb",
      primaryBg: "#eff6ff",
      warning: "#d97706",
      warningBg: "#fffbeb",
      tagBorder: "#e5e7eb",
      tagBg: "#ffffff",
      tagText: "#000000",
      progressBg: "#e5e7eb",
      highScore: "#16a34a",
      mediumScore: "#2563eb",
      lowScore: "#f59e0b",
      veryLowScore: "#ef4444",
    },
    "modern-dark": {
      gray: "#e5e7eb",
      grayMuted: "#9ca3af",
      success: "#22c55e",
      successBg: "#052e16",
      successLight: "#14532d",
      error: "#ef4444",
      errorBg: "#450a0a",
      errorLight: "#7f1d1d",
      primary: "#60a5fa",
      primaryBg: "#1e3a8a",
      warning: "#f59e0b",
      warningBg: "#451a03",
      tagBorder: "#4b5563",
      tagBg: "#111827",
      tagText: "#f9fafb",
      progressBg: "#374151",
      highScore: "#22c55e",
      mediumScore: "#60a5fa",
      lowScore: "#fbbf24",
      veryLowScore: "#f87171",
    },
    dark: {
      gray: "#e5e7eb",
      grayMuted: "#9ca3af",
      success: "#22c55e",
      successBg: "#052e16",
      successLight: "#14532d",
      error: "#ef4444",
      errorBg: "#450a0a",
      errorLight: "#7f1d1d",
      primary: "#60a5fa",
      primaryBg: "#1e3a8a",
      warning: "#f59e0b",
      warningBg: "#451a03",
      tagBorder: "#4b5563",
      tagBg: "#111827",
      tagText: "#f9fafb",
      progressBg: "#374151",
      highScore: "#22c55e",
      mediumScore: "#60a5fa",
      lowScore: "#fbbf24",
      veryLowScore: "#f87171",
    },
    sky: {
      gray: "#0c4a6e",
      grayMuted: "#64748b",
      success: "#14b8a6",
      successBg: "#ecfeff",
      successLight: "#cffafe",
      error: "#f43f5e",
      errorBg: "#fff1f2",
      errorLight: "#ffe4e6",
      primary: "#0ea5e9",
      primaryBg: "#f0f9ff",
      warning: "#f59e0b",
      warningBg: "#fffbeb",
      tagBorder: "#bae6fd",
      tagBg: "#ffffff",
      tagText: "#0c4a6e",
      progressBg: "#e0f2fe",
      highScore: "#14b8a6",
      mediumScore: "#0ea5e9",
      lowScore: "#f59e0b",
      veryLowScore: "#f43f5e",
    },
    violet: {
      gray: "#4c1d95",
      grayMuted: "#7c3aed",
      success: "#10b981",
      successBg: "#f0fdf4",
      successLight: "#dcfce7",
      error: "#f43f5e",
      errorBg: "#fef2f2",
      errorLight: "#fee2e2",
      primary: "#8b5cf6",
      primaryBg: "#f5f3ff",
      warning: "#f59e0b",
      warningBg: "#fffbeb",
      tagBorder: "#ddd6fe",
      tagBg: "#ffffff",
      tagText: "#4c1d95",
      progressBg: "#ede9fe",
      highScore: "#10b981",
      mediumScore: "#8b5cf6",
      lowScore: "#f59e0b",
      veryLowScore: "#f43f5e",
    },
    neutral: {
      gray: "#171717",
      grayMuted: "#737373",
      success: "#22c55e",
      successBg: "#f7fee7",
      successLight: "#ecfccb",
      error: "#dc2626",
      errorBg: "#fef2f2",
      errorLight: "#fee2e2",
      primary: "#525252",
      primaryBg: "#fafafa",
      warning: "#f59e0b",
      warningBg: "#fffbeb",
      tagBorder: "#d4d4d4",
      tagBg: "#ffffff",
      tagText: "#171717",
      progressBg: "#e5e5e5",
      highScore: "#22c55e",
      mediumScore: "#525252",
      lowScore: "#f59e0b",
      veryLowScore: "#dc2626",
    },
    custom: {
      gray: "#374151",
      grayMuted: "#9ca3af",
      success: "#16a34a",
      successBg: "#f0fdf4",
      successLight: "#dcfce7",
      error: "#dc2626",
      errorBg: "#fef2f2",
      errorLight: "#fee2e2",
      primary: "#2563eb",
      primaryBg: "#eff6ff",
      warning: "#d97706",
      warningBg: "#fffbeb",
      tagBorder: "#e5e7eb",
      tagBg: "#ffffff",
      tagText: "#000000",
      progressBg: "#e5e7eb",
      highScore: "#16a34a",
      mediumScore: "#2563eb",
      lowScore: "#f59e0b",
      veryLowScore: "#ef4444",
    },
  };

  return themes[theme as keyof typeof themes] || themes["modern-light"];
};

// Custom Tag component with theme support
const Tag = ({
  children,
  color,
  theme,
}: {
  children: React.ReactNode;
  color?: string;
  theme?: string;
}) => {
  const themeColors = getThemeColors(theme);

  const getColorStyles = (color?: string) => {
    const colors: Record<string, { bg: string; text: string; border?: string }> = {
      green: { bg: themeColors.successBg, text: themeColors.success },
      blue: { bg: themeColors.primaryBg, text: themeColors.primary },
      yellow: { bg: themeColors.warningBg, text: themeColors.warning },
      red: { bg: themeColors.errorBg, text: themeColors.error },
      default: {
        bg: themeColors.tagBg,
        text: themeColors.tagText,
        border: `1px solid ${themeColors.tagBorder}`,
      },
    };

    return colors[color || "default"];
  };

  const colorStyles = getColorStyles(color);

  return (
    <span
      style={{
        backgroundColor: colorStyles.bg,
        color: colorStyles.text,
        padding: "0 7px",
        fontSize: "11px",
        lineHeight: "20px",
        borderRadius: "4px",
        display: "inline-block",
        ...(colorStyles.border && { border: colorStyles.border }),
      }}
    >
      {children}
    </span>
  );
};

// Custom Growth Metric component
const GrowthMetric = ({
  value,
  growthPercent,
  isPositive = true,
  theme,
  align = "left",
  showSign = true,
}: {
  value: string | number;
  growthPercent: number;
  isPositive?: boolean;
  theme?: string;
  align?: "left" | "right";
  showSign?: boolean;
}) => {
  const colors = getThemeColors(theme);
  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        alignItems: align === "right" ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ fontSize: "14px", color: colors.gray }}>
        {showSign && (isPositive ? "+" : "")}
        {displayValue}
      </div>
      <Tag color={isPositive ? "green" : "red"} theme={theme}>
        {isPositive ? "↑" : "↓"} {Math.abs(growthPercent).toFixed(2)}%
      </Tag>
    </div>
  );
};

export const HEADERS: ReactHeaderObject[] = [
  {
    accessor: "rank",
    label: "#",
    width: 60,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "number",
    pinned: "left",
  },
  {
    accessor: "artistName",
    label: "Artist",
    width: 330,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
    pinned: "left",
    cellRenderer: ({ row, theme }: CellRendererProps) => {
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

      return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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

              flexShrink: 0,
            }}
          >
            {firstLetter}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
            <span style={{ fontWeight: "500", fontSize: "14px", color: colors.gray }}>{name}</span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <Tag color="default" theme={theme}>
                {growthStatus}
              </Tag>
              <Tag color="default" theme={theme}>
                {mood}
              </Tag>
              <Tag color="default" theme={theme}>
                {genre}
              </Tag>
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
    cellRenderer: ({ row, theme }: CellRendererProps) => {
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
          <div style={{ fontSize: "12px", color: colors.gray }}>{recordLabel}</div>
          <div style={{ fontSize: "12px", color: colors.gray }}>Lyrics Language: {language}</div>
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
        showWhen: "always",
        isSortable: true,
        isEditable: false,
        type: "number",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const formatted = row.followersFormatted as string;
          const growth = row.followersGrowthFormatted as string;
          const growthPercent = row.followersGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontSize: "14px", color: colors.gray }}>{formatted}</div>
              <Tag color="green" theme={theme}>
                ↑ +{growth} ({growthPercent.toFixed(2)}%)
              </Tag>
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.followers7DayGrowth as number;
          const growthPercent = row.followers7DayGrowthPercent as number;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              theme={theme}
              align="right"
            />
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.followers28DayGrowth as number;
          const growthPercent = row.followers28DayGrowthPercent as number;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              theme={theme}
              align="right"
            />
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.followers60DayGrowth as number;
          const growthPercent = row.followers60DayGrowthPercent as number;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              theme={theme}
              align="right"
            />
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
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const score = row.popularity as number;
      const changePercent = row.popularityChangePercent as number;
      const isPositive = changePercent >= 0;

      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GrowthMetric
            value={`${score}/100`}
            growthPercent={changePercent}
            isPositive={isPositive}
            theme={theme}
            showSign={false}
          />
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
        showWhen: "always",
        isSortable: true,
        isEditable: false,
        type: "number",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const formattedValue = row.playlistReachFormatted as string;
          const growth = row.playlistReachChange as number;
          const growthFormatted = row.playlistReachChangeFormatted as string;
          const growthPercent = row.playlistReachChangePercent as number;
          const isPositive = growth >= 0;
          const colors = getThemeColors(theme);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: "14px", color: colors.gray }}>{formattedValue}</div>
              <Tag color={isPositive ? "green" : "red"} theme={theme}>
                {isPositive ? "↑" : "↓"} {isPositive ? "+" : ""}
                {growthFormatted} ({Math.abs(growthPercent).toFixed(2)}%)
              </Tag>
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.playlistReach7DayGrowth as number;
          const growthPercent = row.playlistReach7DayGrowthPercent as number;
          const isPositive = growth >= 0;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              isPositive={isPositive}
              theme={theme}
              align="right"
            />
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.playlistReach28DayGrowth as number;
          const growthPercent = row.playlistReach28DayGrowthPercent as number;
          const isPositive = growth >= 0;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              isPositive={isPositive}
              theme={theme}
              align="right"
            />
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.playlistReach60DayGrowth as number;
          const growthPercent = row.playlistReach60DayGrowthPercent as number;
          const isPositive = growth >= 0;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              isPositive={isPositive}
              theme={theme}
              align="right"
            />
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
        showWhen: "always",
        isSortable: true,
        isEditable: false,
        type: "number",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const count = row.playlistCount as number;
          const growth = row.playlistCountGrowth as number;
          const growthPercent = row.playlistCountGrowthPercent as number;
          const colors = getThemeColors(theme);

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontSize: "14px", color: colors.gray }}>{count.toLocaleString()}</div>
              <Tag color="green" theme={theme}>
                ↑ +{growth} ({growthPercent.toFixed(2)}%)
              </Tag>
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.playlistCount7DayGrowth as number;
          const growthPercent = row.playlistCount7DayGrowthPercent as number;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              theme={theme}
              align="right"
            />
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.playlistCount28DayGrowth as number;
          const growthPercent = row.playlistCount28DayGrowthPercent as number;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              theme={theme}
              align="right"
            />
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.playlistCount60DayGrowth as number;
          const growthPercent = row.playlistCount60DayGrowthPercent as number;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              theme={theme}
              align="right"
            />
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
        showWhen: "always",
        isSortable: true,
        isEditable: false,
        type: "number",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const formattedValue = row.monthlyListenersFormatted as string;
          const growth = row.monthlyListenersChange as number;
          const growthFormatted = row.monthlyListenersChangeFormatted as string;
          const growthPercent = row.monthlyListenersChangePercent as number;
          const isPositive = growth >= 0;
          const colors = getThemeColors(theme);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: "14px", color: colors.gray }}>{formattedValue}</div>
              <Tag color={isPositive ? "green" : "red"} theme={theme}>
                {isPositive ? "↑" : "↓"} {isPositive ? "+" : ""}
                {growthFormatted} ({Math.abs(growthPercent).toFixed(2)}%)
              </Tag>
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.monthlyListeners7DayGrowth as number;
          const growthPercent = row.monthlyListeners7DayGrowthPercent as number;
          const isPositive = growth >= 0;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              isPositive={isPositive}
              theme={theme}
              align="right"
            />
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.monthlyListeners28DayGrowth as number;
          const growthPercent = row.monthlyListeners28DayGrowthPercent as number;
          const isPositive = growth >= 0;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              isPositive={isPositive}
              theme={theme}
              align="right"
            />
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
        showWhen: "parentExpanded",
        cellRenderer: ({ row, theme }: CellRendererProps) => {
          const growth = row.monthlyListeners60DayGrowth as number;
          const growthPercent = row.monthlyListeners60DayGrowthPercent as number;
          const isPositive = growth >= 0;
          return (
            <GrowthMetric
              value={growth}
              growthPercent={growthPercent}
              isPositive={isPositive}
              theme={theme}
              align="right"
            />
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
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const percent = row.conversionRate as number;
      const colors = getThemeColors(theme);
      return <span style={{ color: colors.gray }}>{percent.toFixed(2)}%</span>;
    },
  },
  {
    accessor: "reachFollowersRatio",
    label: "Reach/Followers Ratio",
    width: 220,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const percent = row.reachFollowersRatio as number;
      const colors = getThemeColors(theme);
      return <span style={{ color: colors.gray }}>{percent.toFixed(1)}x</span>;
    },
  },
];
