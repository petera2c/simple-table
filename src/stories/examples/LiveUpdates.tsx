import { useRef, useEffect } from "react";
import { HeaderObject, SimpleTable, TableRefType, Theme } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to LiveUpdates - exported for reuse in stories and tests
export const liveUpdatesDefaults = {
  cellUpdateFlash: true,
  height: "400px",
};

// Define headers
export const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "product", label: "Product", width: 180, type: "string" },
  {
    accessor: "price",
    label: "Price",
    width: "1fr",
    type: "number",
    cellRenderer: ({ row }) => {
      const price = row.price;
      if (typeof price === "number") {
        return `$${price.toFixed(2)}`;
      }
      return `$0.00`;
    },
  },
  { accessor: "stock", label: "In Stock", width: 120, type: "number" },
  { accessor: "sales", label: "Sales", width: 120, type: "number" },
];

// Sample data
const initialData = [
  {
    id: 1,
    product: "Widget A",
    price: 19.99,
    stock: 42,
    sales: 120,
  },
  {
    id: 2,
    product: "Widget B",
    price: 24.99,
    stock: 28,
    sales: 85,
  },
  {
    id: 3,
    product: "Widget C",
    price: 15.99,
    stock: 53,
    sales: 210,
  },
  {
    id: 4,
    product: "Widget D",
    price: 29.99,
    stock: 14,
    sales: 65,
  },
  {
    id: 5,
    product: "Widget E",
    price: 12.99,
    stock: 78,
    sales: 180,
  },
  {
    id: 6,
    product: "Widget F",
    price: 14.99,
    stock: 32,
    sales: 105,
  },
  {
    id: 7,
    product: "Widget G",
    price: 16.99,
    stock: 45,
    sales: 150,
  },
  {
    id: 8,
    product: "Widget H",
    price: 18.99,
    stock: 22,
    sales: 90,
  },
  {
    id: 9,
    product: "Widget I",
    price: 13.99,
    stock: 50,
    sales: 120,
  },
  {
    id: 10,
    product: "Widget J",
    price: 21.99,
    stock: 35,
    sales: 75,
  },
  {
    id: 11,
    product: "Widget K",
    price: 17.99,
    stock: 41,
    sales: 95,
  },
  {
    id: 12,
    product: "Widget L",
    price: 26.99,
    stock: 19,
    sales: 55,
  },
];

const LiveUpdatesExample = (props: UniversalTableProps) => {
  // Keep a local copy of the data to update
  const tableRef = useRef<TableRefType | null>(null);

  // Set up intervals for automatic updates
  useEffect(() => {
    // Keep a copy of the current data in memory for calculations
    const currentData = JSON.parse(JSON.stringify(initialData));

    // Update price at regular intervals
    const priceInterval = setInterval(() => {
      if (tableRef.current) {
        // Pick a random row to update
        const rowIndex = Math.floor(Math.random() * currentData.length);

        // Generate a new price (±5% from current)
        const currentPrice = currentData[rowIndex].price;
        const randomFactor = 0.95 + Math.random() * 0.1; // between -5% and +5%
        const newPrice = parseFloat((currentPrice * randomFactor).toFixed(2));

        // Update our local copy
        currentData[rowIndex].price = newPrice;

        // Update the table with flash animation
        tableRef.current.updateData({
          accessor: "price",
          rowIndex,
          newValue: newPrice,
        });
      }
    }, 500); // Update every 2 seconds

    // Simulate sales activity (stock/sales updates)
    const salesInterval = setInterval(() => {
      if (tableRef.current) {
        // Pick a random row that has stock
        const availableRows = currentData
          .map((row: (typeof initialData)[0], index: number) => ({
            index,
            stock: row.stock,
          }))
          .filter((item: { index: number; stock: number }) => item.stock > 0);

        if (availableRows.length > 0) {
          const randomItem = availableRows[Math.floor(Math.random() * availableRows.length)];
          const rowIndex = randomItem.index;

          // Decrease stock by 1
          const newStock = currentData[rowIndex].stock - 1;
          currentData[rowIndex].stock = newStock;

          // Update stock in the table
          tableRef.current.updateData({
            accessor: "stock",
            rowIndex,
            newValue: newStock,
          });

          // Increase sales
          const newSales = currentData[rowIndex].sales + 1;
          currentData[rowIndex].sales = newSales;

          // Update sales in the table
          tableRef.current.updateData({
            accessor: "sales",
            rowIndex,
            newValue: newSales,
          });
        }
      }
    }, 5000); // Update every 5 seconds

    // Clean up intervals on unmount
    return () => {
      clearInterval(priceInterval);
      clearInterval(salesInterval);
    };
  }, []);

  return (
    <SimpleTable
      {...props}
      defaultHeaders={headers}
      rowIdAccessor="id"
      rows={initialData}
      tableRef={tableRef}
      // Default settings for this example
      cellUpdateFlash={props.cellUpdateFlash ?? true}
      height={props.height ?? "400px"}
    />
  );
};

export default LiveUpdatesExample;
