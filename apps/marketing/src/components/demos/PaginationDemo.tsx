import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

const ROWS_PER_PAGE = 9;
const HEADERS: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", minWidth: 100, type: "string" },
  { accessor: "email", label: "Email", width: 200, type: "string" },
  { accessor: "role", label: "Role", width: 140, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
  { accessor: "status", label: "Status", width: 110, type: "string" },
];

const ROWS = [
  {
    id: 1,
    name: "Miguel Santos",
    email: "miguel.santos@grandhotel.com",
    role: "Guest Relations Manager",
    department: "Front Office",
    status: "Active",
  },
  {
    id: 2,
    name: "Carmen Delacroix",
    email: "carmen.d@grandhotel.com",
    role: "Head Concierge",
    department: "Concierge",
    status: "Active",
  },
  {
    id: 3,
    name: "Dimitri Petrov",
    email: "dimitri.p@grandhotel.com",
    role: "Executive Chef",
    department: "Culinary",
    status: "Active",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@grandhotel.com",
    role: "Spa Director",
    department: "Wellness",
    status: "On Leave",
  },
  {
    id: 5,
    name: "Giovanni Rossi",
    email: "giovanni.r@grandhotel.com",
    role: "Banquet Manager",
    department: "Events",
    status: "Active",
  },
  {
    id: 6,
    name: "Anastasia Volkov",
    email: "anastasia.v@grandhotel.com",
    role: "Housekeeping Supervisor",
    department: "Housekeeping",
    status: "Active",
  },
  {
    id: 7,
    name: "Omar Hassan",
    email: "omar.hassan@grandhotel.com",
    role: "Night Auditor",
    department: "Front Office",
    status: "Active",
  },
  {
    id: 8,
    name: "Lucia Fernandez",
    email: "lucia.f@grandhotel.com",
    role: "Restaurant Manager",
    department: "Food & Beverage",
    status: "Active",
  },
  {
    id: 9,
    name: "Kenji Nakamura",
    email: "kenji.n@grandhotel.com",
    role: "Guest Services Coordinator",
    department: "Guest Services",
    status: "Active",
  },
  {
    id: 10,
    name: "Victoria Sterling",
    email: "victoria.s@grandhotel.com",
    role: "Sales Director",
    department: "Sales & Marketing",
    status: "Active",
  },
  {
    id: 11,
    name: "Rafael Martinez",
    email: "rafael.m@grandhotel.com",
    role: "Security Chief",
    department: "Security",
    status: "Active",
  },
  {
    id: 12,
    name: "Ingrid Larsson",
    email: "ingrid.l@grandhotel.com",
    role: "Event Coordinator",
    department: "Events",
    status: "Active",
  },
  {
    id: 13,
    name: "Hassan Al-Rashid",
    email: "hassan.a@grandhotel.com",
    role: "Maintenance Supervisor",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 14,
    name: "Chloe Bennett",
    email: "chloe.b@grandhotel.com",
    role: "Front Desk Agent",
    department: "Front Office",
    status: "Active",
  },
  {
    id: 15,
    name: "Akira Tanaka",
    email: "akira.t@grandhotel.com",
    role: "Sous Chef",
    department: "Culinary",
    status: "Active",
  },
  {
    id: 16,
    name: "Isabella Costa",
    email: "isabella.c@grandhotel.com",
    role: "HR Specialist",
    department: "Human Resources",
    status: "Active",
  },
  {
    id: 17,
    name: "Yuki Sato",
    email: "yuki.sato@grandhotel.com",
    role: "Guest Experience Manager",
    department: "Guest Services",
    status: "Active",
  },
  {
    id: 18,
    name: "Marco Benedetti",
    email: "marco.b@grandhotel.com",
    role: "Sommelier",
    department: "Food & Beverage",
    status: "Active",
  },
  {
    id: 19,
    name: "Fatima Al-Zahra",
    email: "fatima.a@grandhotel.com",
    role: "Revenue Manager",
    department: "Finance",
    status: "Active",
  },
  {
    id: 20,
    name: "Sebastian Wagner",
    email: "sebastian.w@grandhotel.com",
    role: "Bell Captain",
    department: "Guest Services",
    status: "Active",
  },
  {
    id: 21,
    name: "Mei Lin Chen",
    email: "mei.chen@grandhotel.com",
    role: "Pastry Chef",
    department: "Culinary",
    status: "Active",
  },
  {
    id: 22,
    name: "Diego Morales",
    email: "diego.m@grandhotel.com",
    role: "Pool Attendant",
    department: "Recreation",
    status: "Active",
  },
  {
    id: 23,
    name: "Zara Khan",
    email: "zara.khan@grandhotel.com",
    role: "Business Center Manager",
    department: "Business Services",
    status: "Active",
  },
  {
    id: 24,
    name: "Matteo Ricci",
    email: "matteo.r@grandhotel.com",
    role: "Valet Manager",
    department: "Guest Services",
    status: "Active",
  },
  {
    id: 25,
    name: "Camila Gonzalez",
    email: "camila.g@grandhotel.com",
    role: "Laundry Supervisor",
    department: "Housekeeping",
    status: "Active",
  },
  {
    id: 26,
    name: "Bjorn Larsson",
    email: "bjorn.l@grandhotel.com",
    role: "IT Support Specialist",
    department: "Technology",
    status: "Active",
  },
  {
    id: 27,
    name: "Amara Okafor",
    email: "amara.o@grandhotel.com",
    role: "Training Coordinator",
    department: "Human Resources",
    status: "On Leave",
  },
  {
    id: 28,
    name: "Leonardo Silva",
    email: "leonardo.s@grandhotel.com",
    role: "Bartender",
    department: "Food & Beverage",
    status: "Active",
  },
  {
    id: 29,
    name: "Stella Oconnor",
    email: "stella.o@grandhotel.com",
    role: "Guest Relations Specialist",
    department: "Guest Services",
    status: "Active",
  },
  {
    id: 30,
    name: "Hiroshi Watanabe",
    email: "hiroshi.w@grandhotel.com",
    role: "Facilities Manager",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 31,
    name: "Valentina Rosso",
    email: "valentina.r@grandhotel.com",
    role: "Wedding Coordinator",
    department: "Events",
    status: "Active",
  },
  {
    id: 32,
    name: "Kwame Asante",
    email: "kwame.a@grandhotel.com",
    role: "Security Officer",
    department: "Security",
    status: "Active",
  },
  {
    id: 33,
    name: "Ingrid Olsen",
    email: "ingrid.o@grandhotel.com",
    role: "Spa Therapist",
    department: "Wellness",
    status: "Active",
  },
  {
    id: 34,
    name: "Ahmed Al-Mahmoud",
    email: "ahmed.a@grandhotel.com",
    role: "Kitchen Manager",
    department: "Culinary",
    status: "Active",
  },
  {
    id: 35,
    name: "Sofia Petrova",
    email: "sofia.p@grandhotel.com",
    role: "Room Service Coordinator",
    department: "Food & Beverage",
    status: "Active",
  },
  {
    id: 36,
    name: "Carlos Mendoza",
    email: "carlos.m@grandhotel.com",
    role: "Pool Manager",
    department: "Recreation",
    status: "Active",
  },
  {
    id: 37,
    name: "Nora Bakker",
    email: "nora.b@grandhotel.com",
    role: "Financial Controller",
    department: "Finance",
    status: "Active",
  },
  {
    id: 38,
    name: "Ravi Bhattacharya",
    email: "ravi.b@grandhotel.com",
    role: "Fitness Instructor",
    department: "Recreation",
    status: "Active",
  },
  {
    id: 39,
    name: "Luna Colombo",
    email: "luna.c@grandhotel.com",
    role: "Guest Experience Analyst",
    department: "Guest Services",
    status: "Active",
  },
  {
    id: 40,
    name: "Tariq Rahman",
    email: "tariq.r@grandhotel.com",
    role: "Conference Services Manager",
    department: "Events",
    status: "Active",
  },
  {
    id: 41,
    name: "Elena Popovic",
    email: "elena.p@grandhotel.com",
    role: "Procurement Specialist",
    department: "Operations",
    status: "Active",
  },
  {
    id: 42,
    name: "Santiago Torres",
    email: "santiago.t@grandhotel.com",
    role: "Maintenance Technician",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 43,
    name: "Aisha Mohamed",
    email: "aisha.m@grandhotel.com",
    role: "Reservation Specialist",
    department: "Front Office",
    status: "Active",
  },
  {
    id: 44,
    name: "Henrik Nielsen",
    email: "henrik.n@grandhotel.com",
    role: "Catering Manager",
    department: "Food & Beverage",
    status: "Active",
  },
  {
    id: 45,
    name: "Aria Nakamura",
    email: "aria.n@grandhotel.com",
    role: "Guest Relations Representative",
    department: "Guest Services",
    status: "Active",
  },
  {
    id: 46,
    name: "Dmitri Kozlov",
    email: "dmitri.k@grandhotel.com",
    role: "Wine Steward",
    department: "Food & Beverage",
    status: "Active",
  },
  {
    id: 47,
    name: "Isabella Moreau",
    email: "isabella.m@grandhotel.com",
    role: "Quality Assurance Manager",
    department: "Operations",
    status: "Active",
  },
  {
    id: 48,
    name: "Rajesh Kumar",
    email: "rajesh.k@grandhotel.com",
    role: "Night Manager",
    department: "Front Office",
    status: "Active",
  },
  {
    id: 49,
    name: "Chiara Bianchi",
    email: "chiara.b@grandhotel.com",
    role: "Marketing Coordinator",
    department: "Sales & Marketing",
    status: "Active",
  },
  {
    id: 50,
    name: "Phoenix Wright",
    email: "phoenix.w@grandhotel.com",
    role: "General Manager",
    department: "Executive",
    status: "Active",
  },
];

const PaginationDemo = ({ theme }: { theme?: Theme }) => {
  // Only hold the current page data, not all data
  const [rows, setRows] = useState(ROWS.slice(0, ROWS_PER_PAGE));
  const [isLoading, setIsLoading] = useState(false);

  // Handler for next page data fetch
  const onNextPage = async (pageIndex: number) => {
    const startIndex = pageIndex * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newPageData = ROWS.slice(startIndex, endIndex);

    if (newPageData.length === 0 || rows.length > startIndex) {
      setIsLoading(false);
      return false;
    }

    setRows((prevRows) => [...prevRows, ...newPageData]);
    setIsLoading(false);
    return true;
  };

  return (
    <SimpleTable
      defaultHeaders={HEADERS}
      height="auto"
      isLoading={isLoading}
      onNextPage={onNextPage}
      rows={rows}
      rowsPerPage={ROWS_PER_PAGE}
      shouldPaginate
      theme={theme}
    />
  );
};

export default PaginationDemo;
