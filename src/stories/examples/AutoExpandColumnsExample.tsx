import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to AutoExpandColumns - exported for reuse in stories and tests
export const autoExpandColumnsExampleDefaults = {
  autoExpandColumns: true,
  columnResizing: true,
  height: "500px",
  columnReordering: true,
  editColumns: true,
};

const AutoExpandColumnsExampleComponent = (props: UniversalTableProps) => {
  // Sample data with nested properties for Q1 and Q2
  const rows = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    product: `Product ${index + 1}`,
    price: Math.floor(Math.random() * 1000) + 100,
    quantity: Math.floor(Math.random() * 100) + 1,
    status: ["Active", "Pending", "Inactive"][Math.floor(Math.random() * 3)],
    // Q1 data
    q1_jan: Math.floor(Math.random() * 10000) + 1000,
    q1_feb: Math.floor(Math.random() * 10000) + 1000,
    q1_mar: Math.floor(Math.random() * 10000) + 1000,
    // Q2 data
    q2_apr: Math.floor(Math.random() * 10000) + 1000,
    q2_may: Math.floor(Math.random() * 10000) + 1000,
    q2_jun: Math.floor(Math.random() * 10000) + 1000,
  }));

  // Define headers with nested structure and pixel widths
  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 70, isSortable: true, pinned: "left" },
    { accessor: "product", label: "Product", width: 150, isSortable: true },
    { accessor: "price", label: "Price", width: 100, isSortable: true, align: "right" },
    { accessor: "quantity", label: "Quantity", width: 100, isSortable: true, align: "right" },
    {
      accessor: "q1",
      label: "Q1 2024",
      width: 300,
      isSortable: false,
      children: [
        {
          accessor: "q1_jan",
          label: "January",
          width: 100,
          isSortable: true,
          align: "right",
          valueFormatter: ({ value }) =>
            `$${(value as number).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
        },
        {
          accessor: "q1_feb",
          label: "February",
          width: 100,
          isSortable: true,
          align: "right",
          valueFormatter: ({ value }) =>
            `$${(value as number).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
        },
        {
          accessor: "q1_mar",
          label: "March",
          width: 100,
          isSortable: true,
          align: "right",
          valueFormatter: ({ value }) =>
            `$${(value as number).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
        },
      ],
    },
    {
      accessor: "q2",
      label: "Q2 2024",
      width: 300,
      isSortable: false,
      children: [
        {
          accessor: "q2_apr",
          label: "April",
          width: 100,
          isSortable: true,
          align: "right",
          valueFormatter: ({ value }) =>
            `$${(value as number).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
        },
        {
          accessor: "q2_may",
          label: "May",
          width: 100,
          isSortable: true,
          align: "right",
          valueFormatter: ({ value }) =>
            `$${(value as number).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
        },
        {
          accessor: "q2_jun",
          label: "June",
          width: 100,
          isSortable: true,
          align: "right",
          valueFormatter: ({ value }) =>
            `$${(value as number).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
        },
      ],
    },
    { accessor: "status", label: "Status", width: 100, isSortable: true },
  ];

  return <SimpleTable {...props} defaultHeaders={headers} rows={rows} rowIdAccessor="id" />;
};

export default AutoExpandColumnsExampleComponent;
