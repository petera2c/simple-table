import SimpleTable from "./components/SimpleTable/SimpleTable";
import { inventoryData } from "./consts/SampleData";
import HeaderObject from "./types/HeaderObject";

const HEADERS: HeaderObject[] = [
  { label: "Product ID", accessor: "id", width: 150 },
  { label: "Product Name", accessor: "productName", width: 200 },
  { label: "Category", accessor: "category", width: 150 },
  { label: "Quantity", accessor: "quantity", width: 100 },
  { label: "Price", accessor: "price", width: 100 },
  { label: "Supplier", accessor: "supplier", width: 150 },
  { label: "Location", accessor: "location", width: 150 },
  { label: "Reorder Level", accessor: "reorderLevel", width: 150 },
  { label: "SKU", accessor: "sku", width: 150 },
  { label: "Description", accessor: "description", width: 250 },
  { label: "Weight", accessor: "weight", width: 100 },
  { label: "Dimensions", accessor: "dimensions", width: 150 },
  { label: "Barcode", accessor: "barcode", width: 150 },
  { label: "Expiration Date", accessor: "expirationDate", width: 150 },
  { label: "Manufacturer", accessor: "manufacturer", width: 150 },
];

const App = () => {
  return (
    <div className="app" style={{ padding: "2rem" }}>
      <SimpleTable
        defaultHeaders={HEADERS}
        // height="auto"
        height="calc(100dvh - 4rem)"
        rows={inventoryData}
        shouldPaginate={true}
      />
    </div>
  );
};

export default App;
