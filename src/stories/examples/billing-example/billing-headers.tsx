import HeaderObject from "../../../types/HeaderObject";
import Row from "../../../types/Row";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Get current month and generate 12 months (current month + 11 previous)
const generateMonthHeaders = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const headers: HeaderObject[] = [];

  // Generate 12 months of headers (current month and 11 previous)
  for (let i = 0; i < months.length; i++) {
    const monthIndex = (currentMonth - i + 12) % 12; // Wrap around for previous year
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    const shortYear = year.toString().slice(2);

    headers.push({
      accessor: `month_${months[monthIndex]}_${year}`,
      label: `${months[monthIndex]} ${shortYear}`,
      width: 200,
      isSortable: true,
      isEditable: false,
      align: "right",
      type: "number",
      children: [
        {
          label: "Balance",
          accessor: `balance_${months[monthIndex]}_${year}`,
          width: 200,
          isSortable: true,
          isEditable: false,
          align: "right",
          type: "number",
        },
        {
          label: "Revenue",
          accessor: `revenue_${months[monthIndex]}_${year}`,
          width: 200,
          isSortable: true,
          isEditable: false,
          align: "right",
          type: "number",
        },
      ],
    });
  }

  return headers;
};

// Main headers
export const HEADERS: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 250,
    expandable: true,
    isSortable: true,
    isEditable: false,
    align: "left",
    pinned: "left",
    type: "string",
    cellRenderer: ({ row }) => {
      const name = row.rowData.name as string;

      return <div className={row.rowData.type === "account" ? "font-semibold" : ""}>{name}</div>;
    },
  },
  {
    accessor: "amount",
    label: "Total Amount",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    cellRenderer: ({ row }) => {
      const amount = row.rowData.amount as number;
      if (!amount) return "—";

      return `$${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    accessor: "deferredRevenue",
    label: "Deferred Revenue",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    cellRenderer: ({ row }: { row: Row }) => {
      const amount = row.rowData.amount as number;
      const deferred = row.rowData.deferredRevenue as number;

      if (deferred === undefined || amount === undefined) return "—";

      return `$${deferred.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  ...generateMonthHeaders(), // Add the monthly columns
];
