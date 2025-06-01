import { HeaderObject, SimpleTable } from "../..";

// Define headers with conditional cell styling
const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "product", label: "Product", minWidth: 100, width: "1fr", type: "string" },
  {
    accessor: "sales",
    label: "Sales",
    width: 120,
    align: "right",
    type: "number",
  },
  {
    accessor: "growth",
    label: "Growth %",
    width: 120,
    align: "right",
    type: "number",
  },
  {
    accessor: "status",
    label: "Status",
    width: 150,
    type: "string",
  },
  {
    accessor: "risk",
    label: "Risk",
    width: 120,
    type: "string",
  },
];

// Sample data with values to highlight - using new simplified structure
const data = [
  { id: 1, product: "Laptop", sales: 1250, growth: 15, status: "In Stock", risk: "Low" },
  { id: 2, product: "Smartphone", sales: 2430, growth: -5, status: "Low Stock", risk: "Medium" },
  { id: 3, product: "Tablet", sales: 890, growth: 23, status: "In Stock", risk: "Low" },
  { id: 4, product: "Headphones", sales: 560, growth: -12, status: "Out of Stock", risk: "High" },
  { id: 5, product: "Monitor", sales: 1180, growth: 8, status: "In Stock", risk: "Low" },
  { id: 6, product: "Keyboard", sales: 350, growth: -2, status: "Low Stock", risk: "Medium" },
  { id: 7, product: "Mouse", sales: 410, growth: 5, status: "In Stock", risk: "Low" },
  { id: 8, product: "Speaker", sales: 680, growth: -8, status: "Out of Stock", risk: "High" },
];

const CellHighlightingDemo = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        defaultHeaders={headers}
        rowIdAccessor="id"
        rows={data}
        selectableCells
        selectableColumns
      />
    </div>
  );
};

export default CellHighlightingDemo;
