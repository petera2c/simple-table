import HeaderObject from "../../../types/HeaderObject";

// Get current month and generate 12 months (current month + 11 previous)
const generateMonthHeaders = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const headers: HeaderObject[] = [];

  // Generate 12 months of headers (current month and 11 previous)
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - i + 12) % 12; // Wrap around for previous year
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    const shortYear = year.toString().slice(2);

    headers.push({
      accessor: `month_${months[monthIndex]}_${year}`,
      label: `${months[monthIndex]} ${shortYear}`,
      width: 100,
      isSortable: true,
      isEditable: false,
      align: "right",
      cellRenderer: ({ row }) => {
        const value = row.rowData[`month_${months[monthIndex]}_${year}`];
        if (!value || value === 0) return "—";

        const formattedValue = parseFloat(value as string);
        const isNegative = formattedValue < 0;

        // Format as currency
        return (
          <span className={isNegative ? "text-red-600" : "text-green-700"}>
            $
            {Math.abs(formattedValue).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
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
    cellRenderer: ({ row }) => {
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
