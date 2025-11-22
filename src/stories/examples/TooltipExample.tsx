import SimpleTable from "../../components/simple-table/SimpleTable";
import { UniversalTableProps } from "./StoryWrapper";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";

const EXAMPLE_DATA: Row[] = [
  {
    id: 1,
    productName: "Laptop Pro",
    category: "Electronics",
    price: 1299.99,
    stock: 45,
    rating: 4.5,
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    productName: "Wireless Mouse",
    category: "Accessories",
    price: 29.99,
    stock: 120,
    rating: 4.2,
    lastUpdated: "2024-01-18",
  },
  {
    id: 3,
    productName: "USB-C Cable",
    category: "Accessories",
    price: 12.99,
    stock: 250,
    rating: 4.0,
    lastUpdated: "2024-01-20",
  },
  {
    id: 4,
    productName: "Gaming Keyboard",
    category: "Electronics",
    price: 149.99,
    stock: 67,
    rating: 4.7,
    lastUpdated: "2024-01-22",
  },
  {
    id: 5,
    productName: "Monitor 27in",
    category: "Electronics",
    price: 349.99,
    stock: 32,
    rating: 4.6,
    lastUpdated: "2024-01-25",
  },
];

const HEADERS: HeaderObject[] = [
  {
    accessor: "productName",
    label: "Product",
    width: 200,
    isSortable: true,
    tooltip: "The name of the product in our inventory",
  },
  {
    accessor: "category",
    label: "Category",
    width: 150,
    isSortable: true,
    filterable: true,
    tooltip: "Product category classification",
  },
  {
    accessor: "price",
    label: "Price",
    width: 120,
    isSortable: true,
    align: "right",
    tooltip: "Current retail price in USD",
    valueFormatter: ({ value }) => `$${(value as number).toFixed(2)}`,
  },
  {
    accessor: "stock",
    label: "Stock",
    width: 100,
    isSortable: true,
    align: "right",
    tooltip: "Available inventory units in warehouse",
  },
  {
    accessor: "rating",
    label: "Rating",
    width: 100,
    isSortable: true,
    align: "center",
    tooltip: "Average customer rating (1-5 stars)",
    valueFormatter: ({ value }) => `${value}/5`,
  },
  {
    accessor: "lastUpdated",
    label: "Last Updated",
    width: 150,
    isSortable: true,
    tooltip: "Date of last inventory update",
  },
];

export const tooltipExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "calc(100dvh - 112px)",
};

const TooltipExample = (props: UniversalTableProps) => {
  return (
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      rows={EXAMPLE_DATA}
      rowIdAccessor="id"
      height={props.height ?? "calc(100dvh - 112px)"}
    />
  );
};

export default TooltipExample;
