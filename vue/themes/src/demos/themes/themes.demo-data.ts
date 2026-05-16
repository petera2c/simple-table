// Self-contained demo table setup for this example.
import type { VueHeaderObject, Theme } from "@simple-table/vue";


export const AVAILABLE_THEMES: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "modern-light", label: "Modern Light" },
  { value: "modern-dark", label: "Modern Dark" },
  { value: "sky", label: "Sky" },
  { value: "violet", label: "Violet" },
  { value: "neutral", label: "Neutral" },
  { value: "frost", label: "Frost" },
];

export const themesHeaders: VueHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", minWidth: 100, width: "1fr", type: "string" },
  { accessor: "email", label: "Email", width: 220, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
];

export const themesData = [
  { id: 1, name: "Dr. Sarah Mitchell", email: "s.mitchell@cityhospital.org", department: "Cardiology", status: "Active" },
  { id: 2, name: "Nurse Emily Chen", email: "e.chen@cityhospital.org", department: "Emergency", status: "Active" },
  { id: 3, name: "Dr. Marcus Williams", email: "m.williams@cityhospital.org", department: "Neurology", status: "Active" },
  { id: 4, name: "Therapist Ana Rodriguez", email: "a.rodriguez@cityhospital.org", department: "Physical Therapy", status: "Active" },
  { id: 5, name: "Dr. Yuki Tanaka", email: "y.tanaka@cityhospital.org", department: "Pediatrics", status: "On Call" },
  { id: 6, name: "Technician Omar Hassan", email: "o.hassan@cityhospital.org", department: "Radiology", status: "Active" },
  { id: 7, name: "Dr. Priya Patel", email: "p.patel@cityhospital.org", department: "Oncology", status: "Active" },
  { id: 8, name: "Coordinator Lisa Kim", email: "l.kim@cityhospital.org", department: "Patient Care", status: "Active" },
  { id: 9, name: "Dr. Giovanni Rossi", email: "g.rossi@cityhospital.org", department: "Surgery", status: "Active" },
  { id: 10, name: "Pharmacist David Lee", email: "d.lee@cityhospital.org", department: "Pharmacy", status: "Active" },
  { id: 11, name: "Nurse Zara Singh", email: "z.singh@cityhospital.org", department: "ICU", status: "Active" },
  { id: 12, name: "Dr. Felix Martinez", email: "f.martinez@cityhospital.org", department: "Orthopedics", status: "Active" },
];

export const themesConfig = {
  headers: themesHeaders,
  rows: themesData,
} as const;
