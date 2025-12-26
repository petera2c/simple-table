import { useRef } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import HeaderObject from "../../types/HeaderObject";
import TableRefType from "../../types/TableRefType";
import { UniversalTableProps } from "./StoryWrapper";

// Sample data for demonstration
const generateSampleData = () => {
  return Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    product: `Product ${i + 1}`,
    category: ["Electronics", "Clothing", "Food", "Books", "Sports"][i % 5],
    price: Math.floor(Math.random() * 1000) + 10,
    quantity: Math.floor(Math.random() * 100) + 1,
    revenue: Math.floor(Math.random() * 10000) + 100,
    status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Inactive",
  }));
};

const SAMPLE_DATA = generateSampleData();

// Headers demonstrating different icon positioning approaches
const HEADERS: HeaderObject[] = [
  {
    accessor: "product",
    label: "Product Name",
    width: 200,
    align: "left",
    isSortable: true,
    filterable: true,
    // Default behavior (no headerRenderer) - icons on left for left-aligned
  },
  {
    accessor: "category",
    label: "Category",
    width: 150,
    align: "left",
    isSortable: true,
    filterable: true,
    // Example 1: Icons on the right for left-aligned column
    headerRenderer: ({ components }) => (
      <>
        {components?.labelContent}
        {components?.sortIcon}
        {components?.filterIcon}
      </>
    ),
  },
  {
    accessor: "price",
    label: "Price",
    width: 120,
    align: "right",
    isSortable: true,
    filterable: true,
    headerRenderer: ({ components }) => (
      <>
        {components?.labelContent}
        {components?.sortIcon}
        {components?.filterIcon}
      </>
    ),
  },
  {
    accessor: "quantity",
    label: "Quantity",
    width: 120,
    align: "right",
    isSortable: true,
    filterable: true,
    // Example 2: Icons on left for right-aligned column
    headerRenderer: ({ components }) => (
      <>
        {components?.sortIcon}
        {components?.filterIcon}
        {components?.labelContent}
      </>
    ),
  },
  {
    accessor: "revenue",
    label: "Revenue",
    width: 150,
    align: "center",
    isSortable: true,
    filterable: true,
    // Default behavior (no headerRenderer) - icons on left for center-aligned
  },
  {
    accessor: "status",
    label: "Status",
    width: 120,
    align: "center",
    isSortable: true,
    filterable: true,
    // Example 3: Icons on right for center-aligned column
    headerRenderer: ({ components }) => (
      <>
        {components?.labelContent}
        {components?.sortIcon}
        {components?.filterIcon}
      </>
    ),
  },
];

// Default args specific to CustomHeaderRenderingExample
export const customHeaderRenderingExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  selectableColumns: true,
  height: "calc(100dvh - 112px)",
};

const CustomHeaderRenderingExample = (props: UniversalTableProps) => {
  const tableRef = useRef<TableRefType>(null);

  return (
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      rows={SAMPLE_DATA}
      rowIdAccessor="id"
      height={props.height ?? "600px"}
      tableRef={tableRef}
    />
  );
};

export default CustomHeaderRenderingExample;
