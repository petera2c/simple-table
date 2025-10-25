import HeaderObject from "../../../types/HeaderObject";

// Custom Tag component for status badges
const Tag = ({ children, color }: { children: React.ReactNode; color?: string }) => {
  const getColorStyles = (color?: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      success: { bg: "#f6ffed", text: "#2a6a0d" },
      warning: { bg: "#fff7e6", text: "#ad4e00" },
      info: { bg: "#e6f7ff", text: "#0050b3" },
      error: { bg: "#fff1f0", text: "#a8071a" },
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
        padding: "2px 8px",
        fontSize: "12px",
        lineHeight: "20px",
        borderRadius: "4px",
        display: "inline-block",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
};

export const LEADS_HEADERS: HeaderObject[] = [
  {
    accessor: "name",
    label: "Contact",
    width: "2fr",
    minWidth: 200,
    isSortable: true,
    isEditable: true,
    type: "string",
    cellRenderer: ({ row }) => {
      const initials = (row.name as string)
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#e0e7ff",
              color: "#4338ca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "600",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: "500" }}>{row.name as string}</span>
              {row.linkedin && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="#0077b5"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              )}
            </div>
            <a
              // Fake linkedin profile link
              href="https://www.example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={{ fontSize: "12px", color: "#6b7280" }}>{row.title as string}</div>
            </a>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>@ {row.company as string}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessor: "signal",
    label: "Signal",
    width: "2fr",
    minWidth: 250,
    isSortable: true,
    isEditable: true,
    type: "string",
    cellRenderer: ({ row }) => {
      return <div style={{ fontSize: "13px", color: "#374151" }}>{row.signal as string}</div>;
    },
  },
  {
    accessor: "aiScore",
    label: "AI Score",
    width: "1fr",
    minWidth: 100,
    isSortable: true,
    align: "center",
    type: "number",
    cellRenderer: ({ row }) => {
      const score = row.aiScore as number;
      const fireEmojis = "🔥".repeat(score);

      return <div style={{ fontSize: "18px", letterSpacing: "2px" }}>{fireEmojis}</div>;
    },
  },
  {
    accessor: "emailStatus",
    label: "Email",
    width: "1fr",
    minWidth: 120,
    isSortable: true,
    align: "center",
    type: "enum",
    enumOptions: [
      { label: "Enrich", value: "Enrich" },
      { label: "Verified", value: "Verified" },
      { label: "Pending", value: "Pending" },
      { label: "Bounced", value: "Bounced" },
    ],
    cellRenderer: ({ row }) => {
      const status = row.emailStatus as string;
      let color = "default";

      switch (status) {
        case "Verified":
          color = "success";
          break;
        case "Enrich":
          color = "info";
          break;
        case "Pending":
          color = "warning";
          break;
        case "Bounced":
          color = "error";
          break;
      }

      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    accessor: "timeAgo",
    label: "Import",
    width: "1fr",
    minWidth: 120,
    isSortable: true,
    align: "center",
    type: "string",
    cellRenderer: ({ row }) => {
      return <div style={{ fontSize: "13px", color: "#6b7280" }}>{row.timeAgo as string}</div>;
    },
  },
  {
    accessor: "list",
    label: "List",
    width: "1fr",
    minWidth: 120,
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
    cellRenderer: ({ row }) => {
      const listName = row.list as string;
      let color = "default";

      switch (listName) {
        case "Hot Leads":
          color = "error";
          break;
        case "Warm Leads":
          color = "warning";
          break;
        case "Leads":
          color = "success";
          break;
        case "Enterprise":
          color = "purple";
          break;
        default:
          color = "info";
          break;
      }

      return <Tag color={color}>{listName}</Tag>;
    },
  },
];
