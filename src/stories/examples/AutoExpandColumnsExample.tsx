import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to AutoExpandColumns - exported for reuse in stories and tests
export const autoExpandColumnsExampleDefaults = {
  autoExpandColumns: true,
  columnResizing: true,
  height: "500px",
};

const AutoExpandColumnsExampleComponent = (props: UniversalTableProps) => {
  // Sample data
  const rows = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    product: `Product ${index + 1}`,
    price: Math.floor(Math.random() * 1000) + 100,
    quantity: Math.floor(Math.random() * 100) + 1,
    revenue: Math.floor(Math.random() * 50000) + 1000,
    status: ["Active", "Pending", "Inactive"][Math.floor(Math.random() * 3)],
  }));

  // Define headers with pixel widths that will be converted to proportional fr units
  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 70, isSortable: true },
    { accessor: "product", label: "Product", width: 150, isSortable: true },
    { accessor: "price", label: "Price", width: 100, isSortable: true },
    { accessor: "quantity", label: "Quantity", width: 100, isSortable: true },
    { accessor: "revenue", label: "Revenue", width: 120, isSortable: true },
    { accessor: "status", label: "Status", width: 100, isSortable: true },
  ];

  return <SimpleTable {...props} defaultHeaders={headers} rows={rows} rowIdAccessor="id" />;
};

export default AutoExpandColumnsExampleComponent;
