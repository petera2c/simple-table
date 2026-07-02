// Self-contained demo table setup for this example.
import type { AngularHeaderObject, Row } from "@simple-table/angular";


export const PAGINATION_ROWS_PER_PAGE = 9;

export const paginationHeaders: AngularHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", minWidth: 100, type: "string" },
  { accessor: "email", label: "Email", width: 200, type: "string" },
  { accessor: "role", label: "Role", width: 140, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
  { accessor: "status", label: "Status", width: 110, type: "string" },
];

export const paginationData: Row[] = [
  { id: 1, name: "Miguel Santos", email: "miguel.santos@grandhotel.com", role: "Guest Relations Manager", department: "Front Office", status: "Active" },
  { id: 2, name: "Carmen Delacroix", email: "carmen.d@grandhotel.com", role: "Head Concierge", department: "Concierge", status: "Active" },
  { id: 3, name: "Dimitri Petrov", email: "dimitri.p@grandhotel.com", role: "Executive Chef", department: "Culinary", status: "Active" },
  { id: 4, name: "Priya Sharma", email: "priya.sharma@grandhotel.com", role: "Spa Director", department: "Wellness", status: "On Leave" },
  { id: 5, name: "Giovanni Rossi", email: "giovanni.r@grandhotel.com", role: "Banquet Manager", department: "Events", status: "Active" },
  { id: 6, name: "Anastasia Volkov", email: "anastasia.v@grandhotel.com", role: "Housekeeping Supervisor", department: "Housekeeping", status: "Active" },
  { id: 7, name: "Omar Hassan", email: "omar.hassan@grandhotel.com", role: "Night Auditor", department: "Front Office", status: "Active" },
  { id: 8, name: "Lucia Fernandez", email: "lucia.f@grandhotel.com", role: "Restaurant Manager", department: "Food & Beverage", status: "Active" },
  { id: 9, name: "Kenji Nakamura", email: "kenji.n@grandhotel.com", role: "Guest Services Coordinator", department: "Guest Services", status: "Active" },
  { id: 10, name: "Victoria Sterling", email: "victoria.s@grandhotel.com", role: "Sales Director", department: "Sales & Marketing", status: "Active" },
  { id: 11, name: "Rafael Martinez", email: "rafael.m@grandhotel.com", role: "Security Chief", department: "Security", status: "Active" },
  { id: 12, name: "Ingrid Larsson", email: "ingrid.l@grandhotel.com", role: "Event Coordinator", department: "Events", status: "Active" },
  { id: 13, name: "Hassan Al-Rashid", email: "hassan.a@grandhotel.com", role: "Maintenance Supervisor", department: "Engineering", status: "Active" },
  { id: 14, name: "Chloe Bennett", email: "chloe.b@grandhotel.com", role: "Front Desk Agent", department: "Front Office", status: "Active" },
  { id: 15, name: "Akira Tanaka", email: "akira.t@grandhotel.com", role: "Sous Chef", department: "Culinary", status: "Active" },
  { id: 16, name: "Isabella Costa", email: "isabella.c@grandhotel.com", role: "HR Specialist", department: "Human Resources", status: "Active" },
  { id: 17, name: "Yuki Sato", email: "yuki.sato@grandhotel.com", role: "Guest Experience Manager", department: "Guest Services", status: "Active" },
  { id: 18, name: "Marco Benedetti", email: "marco.b@grandhotel.com", role: "Sommelier", department: "Food & Beverage", status: "Active" },
  { id: 19, name: "Fatima Al-Zahra", email: "fatima.a@grandhotel.com", role: "Revenue Manager", department: "Finance", status: "Active" },
  { id: 20, name: "Sebastian Wagner", email: "sebastian.w@grandhotel.com", role: "Bell Captain", department: "Guest Services", status: "Active" },
  { id: 21, name: "Mei Lin Chen", email: "mei.chen@grandhotel.com", role: "Pastry Chef", department: "Culinary", status: "Active" },
  { id: 22, name: "Diego Morales", email: "diego.m@grandhotel.com", role: "Pool Attendant", department: "Recreation", status: "Active" },
  { id: 23, name: "Zara Khan", email: "zara.khan@grandhotel.com", role: "Business Center Manager", department: "Business Services", status: "Active" },
  { id: 24, name: "Matteo Ricci", email: "matteo.r@grandhotel.com", role: "Valet Manager", department: "Guest Services", status: "Active" },
  { id: 25, name: "Camila Gonzalez", email: "camila.g@grandhotel.com", role: "Laundry Supervisor", department: "Housekeeping", status: "Active" },
  { id: 26, name: "Bjorn Larsson", email: "bjorn.l@grandhotel.com", role: "IT Support Specialist", department: "Technology", status: "Active" },
  { id: 27, name: "Amara Okafor", email: "amara.o@grandhotel.com", role: "Training Coordinator", department: "Human Resources", status: "On Leave" },
];

export const paginationConfig = {
  headers: paginationHeaders,
  rows: paginationData,
  tableProps: {
    rowsPerPage: PAGINATION_ROWS_PER_PAGE,
    shouldPaginate: true,
  },
} as const;
