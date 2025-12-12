import SimpleTable from "../../../components/simple-table/SimpleTable";
import HeaderObject from "../../../types/HeaderObject";
import "./CustomTheme.css";

// Define headers
const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", minWidth: 100, width: "1fr", type: "string" },
  { accessor: "email", label: "Email", minWidth: 100, width: "1fr", type: "string" },
  { accessor: "department", label: "Department", minWidth: 100, width: "1fr", type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
  {
    accessor: "number",
    label: "Number",
    width: 150,
    type: "number",
    cellRenderer: ({ accessor, row }) => {
      const number = row[accessor]?.toString() ?? "";
      const areaCode = number.slice(0, 3);
      const prefix = number.slice(3, 6);
      const lineNumber = number.slice(6);
      return (
        <div className="text-blue-500">
          ({areaCode}) {prefix}-{lineNumber}
        </div>
      );
    },
  },
];

// Sample data
const data = [
  {
    id: 1,
    name: "Chef Antoine Dubois",
    email: "antoine@bistrodeluxe.com",
    department: "Kitchen",
    status: "Active",
    number: 5145551234,
  },

  {
    id: 2,
    name: "Sofia Guerrero",
    email: "sofia@bistrodeluxe.com",
    department: "Front of House",
    status: "Active",
    number: 5145556789,
  },

  {
    id: 3,
    name: "Marco Benedetti",
    email: "marco@bistrodeluxe.com",
    department: "Wine Service",
    status: "Active",
    number: 5145554321,
  },

  {
    id: 4,
    name: "Yuki Nakamura",
    email: "yuki@bistrodeluxe.com",
    department: "Pastry",
    status: "Active",
    number: 5145559876,
  },

  {
    id: 5,
    name: "Rosa Martinez",
    email: "rosa@bistrodeluxe.com",
    department: "Service",
    status: "Active",
    number: 5145553456,
  },

  {
    id: 6,
    name: "Dmitri Volkov",
    email: "dmitri@bistrodeluxe.com",
    department: "Kitchen",
    status: "On Break",
    number: 5145557890,
  },

  {
    id: 7,
    name: "Lucia Fernandez",
    email: "lucia@bistrodeluxe.com",
    department: "Management",
    status: "Active",
    number: 5145552345,
  },

  {
    id: 8,
    name: "Omar Hassan",
    email: "omar@bistrodeluxe.com",
    department: "Bar",
    status: "Active",
    number: 5145558765,
  },

  {
    id: 9,
    name: "Chloe Dubois",
    email: "chloe@bistrodeluxe.com",
    department: "Service",
    status: "Active",
    number: 5145556543,
  },
  {
    id: 10,
    name: "Ravi Patel",
    email: "ravi@bistrodeluxe.com",
    department: "Kitchen",
    status: "Active",
    number: 5145557654,
  },
  {
    id: 11,
    name: "Isabella Costa",
    email: "isabella@bistrodeluxe.com",
    department: "Host Station",
    status: "Active",
    number: 5145558765,
  },
  {
    id: 12,
    name: "Hassan Al-Rashid",
    email: "hassan@bistrodeluxe.com",
    department: "Maintenance",
    status: "Active",
    number: 5145559876,
  },
];

const CustomThemeDemo = ({ height = "400px" }: { height?: string | number }) => {
  return (
    <div className="custom-theme-container">
      <SimpleTable
        columnResizing
        defaultHeaders={headers}
        height={height}
        rowIdAccessor="id"
        rows={data}
        selectableCells
        selectableColumns
        theme="custom"
      />
    </div>
  );
};

export default CustomThemeDemo;
