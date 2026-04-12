// Self-contained demo table setup for this example.
import type { HeaderObject } from "@simple-table/svelte";


export type CellRendererEmployee = {
  id: number;
  name: string;
  website: string;
  status: string;
  progress: number;
  rating: number;
  verified: boolean;
  tags: string[];
  teamMembers: { name: string; role: string }[];
};

export const cellRendererData: CellRendererEmployee[] = [
  { id: 1, name: "Isabella Romano", website: "isabellaromano.design", status: "active", progress: 92, rating: 4.9, verified: true, tags: ["UI/UX", "Design", "Frontend"], teamMembers: [{ name: "Alice Smith", role: "Designer" }, { name: "Bob Johnson", role: "Developer" }] },
  { id: 2, name: "Ethan McKenzie", website: "ethanmckenzie.dev", status: "active", progress: 87, rating: 4.7, verified: true, tags: ["Web Development", "Backend", "API"], teamMembers: [{ name: "Charlie Brown", role: "Backend Developer" }, { name: "Diana Prince", role: "Frontend Developer" }] },
  { id: 3, name: "Zoe Patterson", website: "zoepatterson.com", status: "pending", progress: 34, rating: 4.2, verified: false, tags: ["Branding", "Marketing"], teamMembers: [{ name: "Eve Adams", role: "Marketing Manager" }] },
  { id: 4, name: "Felix Chang", website: "felixchang.mobile", status: "active", progress: 95, rating: 4.8, verified: true, tags: ["Mobile App", "UX/UI"], teamMembers: [{ name: "Grace Lee", role: "UX Designer" }, { name: "Hank Johnson", role: "Mobile Developer" }] },
  { id: 5, name: "Aria Gonzalez", website: "ariagonzalez.writer", status: "active", progress: 78, rating: 4.6, verified: true, tags: ["Content Writing", "Copywriting"], teamMembers: [{ name: "Ivy White", role: "Content Strategist" }] },
  { id: 6, name: "Jasper Flynn", website: "jasperflynn.tech", status: "inactive", progress: 12, rating: 3.8, verified: false, tags: ["Consulting", "Tech Strategy"], teamMembers: [{ name: "Kate Brown", role: "Consultant" }] },
  { id: 7, name: "Nova Sterling", website: "novasterling.marketing", status: "active", progress: 83, rating: 4.5, verified: true, tags: ["Digital Marketing", "SEO"], teamMembers: [{ name: "Leo Wilson", role: "SEO Specialist" }, { name: "Mia Davis", role: "Marketing Analyst" }] },
  { id: 8, name: "Cruz Martinez", website: "cruzmartinez.photo", status: "active", progress: 71, rating: 4.4, verified: true, tags: ["Photography", "Videography"], teamMembers: [{ name: "Nina Smith", role: "Photographer" }, { name: "Owen Johnson", role: "Videographer" }] },
  { id: 9, name: "Sage Thompson", website: "sagethompson.ux", status: "active", progress: 89, rating: 4.7, verified: true, tags: ["UX Design", "UI Design"], teamMembers: [{ name: "Pete White", role: "UX Lead" }, { name: "Quinn Brown", role: "UI Designer" }] },
  { id: 10, name: "River Davis", website: "riverdavis.content", status: "pending", progress: 45, rating: 4.1, verified: false, tags: ["Content Strategy", "Copywriting"], teamMembers: [{ name: "Riley Adams", role: "Content Writer" }] },
  { id: 11, name: "Phoenix Williams", website: "phoenixwilliams.digital", status: "active", progress: 93, rating: 4.8, verified: true, tags: ["Digital Consulting", "Strategy"], teamMembers: [{ name: "Sofia Lee", role: "Consultant" }, { name: "Tucker Brown", role: "Digital Strategist" }] },
  { id: 12, name: "Atlas Johnson", website: "atlasjohnson.brand", status: "inactive", progress: 28, rating: 3.6, verified: false, tags: ["Brand Design", "Graphic Design"], teamMembers: [{ name: "Uma Patel", role: "Graphic Designer" }] },
];

export const cellRendererHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: 180, type: "string" },
  { accessor: "teamMembers", label: "Team", width: 280, type: "string" },
  { accessor: "website", label: "Website", width: 180, type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
  { accessor: "progress", label: "Progress", width: 150, type: "number" },
  { accessor: "rating", label: "Rating", width: 150, type: "number" },
  { accessor: "verified", label: "Verified", width: 100, type: "boolean" },
  { accessor: "tags", label: "Tags", width: 250, type: "string" },
];

export const cellRendererConfig = {
  headers: cellRendererHeaders,
  rows: cellRendererData,
  tableProps: {
    selectableCells: true,
    customTheme: { rowHeight: 48 },
  },
} as const;
