import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme, CellRendererProps } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Define headers with custom cell renderers
const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: 180, type: "string" },
  {
    accessor: "teamMembers",
    label: "Team",
    width: 280,
    type: "string",
    cellRenderer: ({ row }: CellRendererProps) => {
      const teamMembers = row.teamMembers as { name: string; role: string }[];
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
          {teamMembers?.map((member, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#DBEAFE",
                  color: "#1E40AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {member.name.charAt(0)}
              </div>
              <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}>{member.name}</span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessor: "website",
    label: "Website",
    width: 180,
    type: "string",
    cellRenderer: ({ row }: CellRendererProps) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ color: "#6B7280", marginRight: "8px" }}>🌐</span>
        <a
          href={`https://${row.website}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2563EB", textDecoration: "none" }}
          onMouseOver={(e) => ((e.target as HTMLAnchorElement).style.textDecoration = "underline")}
          onMouseOut={(e) => ((e.target as HTMLAnchorElement).style.textDecoration = "none")}
        >
          {row.website as string}
        </a>
      </div>
    ),
  },
  {
    accessor: "status",
    label: "Status",
    width: 120,
    type: "string",
    cellRenderer: ({ row }: CellRendererProps) => {
      const status = row.status as string;
      let color = "#6B7280";
      let icon = "•";

      if (status === "active") {
        color = "#10B981";
        icon = "✓";
      } else if (status === "inactive") {
        color = "#EF4444";
        icon = "✕";
      } else if (status === "pending") {
        color = "#F59E0B";
        icon = "!";
      }

      return (
        <div style={{ display: "flex", alignItems: "center", color, textTransform: "capitalize" }}>
          <span style={{ marginRight: "4px", fontWeight: "bold" }}>{icon}</span>
          {status}
        </div>
      );
    },
  },
  {
    accessor: "progress",
    label: "Progress",
    width: 150,
    type: "number",
    cellRenderer: ({ row }: CellRendererProps) => {
      const progress = row.progress as number;
      let color = "#3B82F6";

      if (progress < 30) color = "#EF4444";
      else if (progress < 70) color = "#F59E0B";
      else color = "#10B981";

      return (
        <div style={{ flex: 1, minWidth: 0, width: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "12px", marginBottom: "4px" }}>{progress}%</div>
          <div
            style={{
              width: "100%",
              minWidth: 0,
              backgroundColor: "#E5E7EB",
              borderRadius: "9999px",
              height: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: color,
                height: "10px",
                borderRadius: "9999px",
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessor: "rating",
    label: "Rating",
    width: 150,
    type: "number",
    cellRenderer: ({ row }: CellRendererProps) => {
      const rating = row.rating as number;
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", color: "#FBBF24", marginRight: "8px" }}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                style={{
                  color:
                    i < fullStars
                      ? "#FBBF24"
                      : i === fullStars && hasHalfStar
                        ? "#FBBF24"
                        : "#D1D5DB",
                  opacity: i === fullStars && hasHalfStar ? 0.5 : 1,
                }}
              >
                ★
              </span>
            ))}
          </div>
          <span>{rating.toFixed(1)}</span>
        </div>
      );
    },
  },
  {
    accessor: "verified",
    label: "Verified",
    width: 100,
    type: "boolean",
    cellRenderer: ({ row }: CellRendererProps) => {
      const verified = row.verified as boolean;

      return verified ? (
        <span style={{ display: "inline-flex", alignItems: "center", color: "#10B981" }}>
          <span style={{ marginRight: "4px", fontWeight: "bold" }}>✓</span>
          Yes
        </span>
      ) : (
        <span style={{ display: "inline-flex", alignItems: "center", color: "#EF4444" }}>
          <span style={{ marginRight: "4px", fontWeight: "bold" }}>✕</span>
          No
        </span>
      );
    },
  },
  {
    accessor: "tags",
    label: "Tags",
    width: 250,
    type: "string",
    cellRenderer: ({ row }: CellRendererProps) => {
      const tags = row.tags as string[];
      return (
        <div style={{ display: "flex", flexWrap: "nowrap", gap: "4px", overflow: "hidden" }}>
          {tags?.map((tag, index) => (
            <span
              key={index}
              style={{
                padding: "4px 8px",
                backgroundColor: "#DBEAFE",
                color: "#1E40AF",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      );
    },
  },
];

// Sample data
const EMPLOYEE_DATA = [
  {
    id: 1,
    name: "Isabella Romano",
    website: "isabellaromano.design",
    status: "active",
    progress: 92,
    rating: 4.9,
    verified: true,
    tags: ["UI/UX", "Design", "Frontend"],
    teamMembers: [
      { name: "Alice Smith", role: "Designer" },
      { name: "Bob Johnson", role: "Developer" },
    ],
  },
  {
    id: 2,
    name: "Ethan McKenzie",
    website: "ethanmckenzie.dev",
    status: "active",
    progress: 87,
    rating: 4.7,
    verified: true,
    tags: ["Web Development", "Backend", "API"],
    teamMembers: [
      { name: "Charlie Brown", role: "Backend Developer" },
      { name: "Diana Prince", role: "Frontend Developer" },
    ],
  },
  {
    id: 3,
    name: "Zoe Patterson",
    website: "zoepatterson.com",
    status: "pending",
    progress: 34,
    rating: 4.2,
    verified: false,
    tags: ["Branding", "Marketing"],
    teamMembers: [{ name: "Eve Adams", role: "Marketing Manager" }],
  },
  {
    id: 4,
    name: "Felix Chang",
    website: "felixchang.mobile",
    status: "active",
    progress: 95,
    rating: 4.8,
    verified: true,
    tags: ["Mobile App", "UX/UI"],
    teamMembers: [
      { name: "Grace Lee", role: "UX Designer" },
      { name: "Hank Johnson", role: "Mobile Developer" },
    ],
  },
  {
    id: 5,
    name: "Aria Gonzalez",
    website: "ariagonzalez.writer",
    status: "active",
    progress: 78,
    rating: 4.6,
    verified: true,
    tags: ["Content Writing", "Copywriting"],
    teamMembers: [{ name: "Ivy White", role: "Content Strategist" }],
  },
  {
    id: 6,
    name: "Jasper Flynn",
    website: "jasperflynn.tech",
    status: "inactive",
    progress: 12,
    rating: 3.8,
    verified: false,
    tags: ["Consulting", "Tech Strategy"],
    teamMembers: [{ name: "Kate Brown", role: "Consultant" }],
  },
  {
    id: 7,
    name: "Nova Sterling",
    website: "novasterling.marketing",
    status: "active",
    progress: 83,
    rating: 4.5,
    verified: true,
    tags: ["Digital Marketing", "SEO"],
    teamMembers: [
      { name: "Leo Wilson", role: "SEO Specialist" },
      { name: "Mia Davis", role: "Marketing Analyst" },
    ],
  },
  {
    id: 8,
    name: "Cruz Martinez",
    website: "cruzmartinez.photo",
    status: "active",
    progress: 71,
    rating: 4.4,
    verified: true,
    tags: ["Photography", "Videography"],
    teamMembers: [
      { name: "Nina Smith", role: "Photographer" },
      { name: "Owen Johnson", role: "Videographer" },
    ],
  },
  {
    id: 9,
    name: "Sage Thompson",
    website: "sagethompson.ux",
    status: "active",
    progress: 89,
    rating: 4.7,
    verified: true,
    tags: ["UX Design", "UI Design"],
    teamMembers: [
      { name: "Pete White", role: "UX Lead" },
      { name: "Quinn Brown", role: "UI Designer" },
    ],
  },
  {
    id: 10,
    name: "River Davis",
    website: "riverdavis.content",
    status: "pending",
    progress: 45,
    rating: 4.1,
    verified: false,
    tags: ["Content Strategy", "Copywriting"],
    teamMembers: [{ name: "Riley Adams", role: "Content Writer" }],
  },
  {
    id: 11,
    name: "Phoenix Williams",
    website: "phoenixwilliams.digital",
    status: "active",
    progress: 93,
    rating: 4.8,
    verified: true,
    tags: ["Digital Consulting", "Strategy"],
    teamMembers: [
      { name: "Sofia Lee", role: "Consultant" },
      { name: "Tucker Brown", role: "Digital Strategist" },
    ],
  },
  {
    id: 12,
    name: "Atlas Johnson",
    website: "atlasjohnson.brand",
    status: "inactive",
    progress: 28,
    rating: 3.6,
    verified: false,
    tags: ["Brand Design", "Graphic Design"],
    teamMembers: [{ name: "Uma Patel", role: "Graphic Designer" }],
  },
];

const CellRendererDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={headers}
      height={height}
      rows={EMPLOYEE_DATA}
      selectableCells
      theme={theme}
      customTheme={{
        rowHeight: 48,
      }}
    />
  );
};

export default CellRendererDemo;
