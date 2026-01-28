import React from "react";
import { useState, useCallback, useEffect } from "react";
import { SimpleTable, HeaderObject, Row, OnRowGroupExpandProps, SortColumn } from "../../index";
import { UniversalTableProps } from "./StoryWrapper";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Region extends Row {
  id: string;
  name: string;
  type: "region";
  totalSales: number;
  totalRevenue: number;
  activeStores: number;
  avgRating: number;
  lastUpdate: string;
  stores?: Store[];
}

interface Store extends Row {
  id: string;
  name: string;
  type: "store";
  totalSales: number;
  totalRevenue: number;
  activeStores?: number;
  avgRating: number;
  lastUpdate: string;
  products?: Product[];
}

interface Product extends Row {
  id: string;
  name: string;
  type: "product";
  totalSales: number;
  totalRevenue: number;
  activeStores?: number;
  avgRating: number;
  lastUpdate: string;
}

// ============================================================================
// HEADERS CONFIGURATION
// ============================================================================

const HEADERS: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 280,
    expandable: true,
    type: "string",
    pinned: "left",
    isSortable: true,
  },
  {
    accessor: "type",
    label: "Type",
    width: 100,
    type: "string",
    isSortable: true,
  },
  {
    accessor: "totalSales",
    label: "Total Sales",
    width: 120,
    type: "number",
    align: "right",
    isSortable: true,
    aggregation: { type: "sum" },
    valueFormatter: ({ value }) => {
      if (typeof value !== "number") return "—";
      return value.toLocaleString();
    },
  },
  {
    accessor: "totalRevenue",
    label: "Revenue",
    width: 140,
    type: "number",
    align: "right",
    isSortable: true,
    aggregation: { type: "sum" },
    valueFormatter: ({ value }) => {
      if (typeof value !== "number") return "—";
      return `$${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    accessor: "activeStores",
    label: "Stores",
    width: 100,
    type: "number",
    align: "right",
    isSortable: true,
    valueFormatter: ({ value }) => {
      if (typeof value !== "number") return "—";
      return value.toLocaleString();
    },
  },
  {
    accessor: "avgRating",
    label: "Avg Rating",
    width: 120,
    type: "number",
    align: "center",
    isSortable: true,
    valueFormatter: ({ value }) => {
      if (typeof value !== "number") return "—";
      return value.toFixed(1);
    },
  },
  {
    accessor: "lastUpdate",
    label: "Last Updated",
    width: 130,
    type: "date",
    isSortable: true,
  },
];

// ============================================================================
// DATA GENERATION FUNCTIONS
// ============================================================================

const REGION_NAMES = [
  "North America - East",
  "North America - West",
  "Europe - North",
  "Europe - South",
  "Asia Pacific - East",
  "Asia Pacific - Southeast",
  "Middle East",
  "Latin America - North",
  "Latin America - South",
  "Africa - North",
  "Africa - South",
  "Oceania",
  "Caribbean",
  "Central America",
  "Eastern Europe",
  "Western Europe",
  "South Asia",
  "Central Asia",
  "North Africa",
  "Sub-Saharan Africa",
];

const STORE_NAMES = [
  "Manhattan Flagship",
  "Brooklyn Heights",
  "Boston Downtown",
  "Miami Beach",
  "Los Angeles Beverly Hills",
  "San Francisco Union Square",
  "Seattle Downtown",
  "Portland Pearl District",
  "London Oxford Street",
  "Stockholm Gamla Stan",
  "Copenhagen Strøget",
  "Amsterdam Central",
  "Paris Champs-Élysées",
  "Madrid Gran Vía",
  "Rome Via del Corso",
  "Barcelona La Rambla",
  "Tokyo Shibuya",
  "Shanghai Nanjing Road",
  "Hong Kong Central",
  "Seoul Gangnam",
  "Singapore Orchard",
  "Bangkok Siam",
  "Kuala Lumpur Bukit Bintang",
  "Jakarta Grand Indonesia",
  "Dubai Mall",
  "Abu Dhabi Marina",
  "Riyadh Kingdom Centre",
  "Mexico City Reforma",
  "Monterrey Valle",
  "Guadalajara Centro",
  "São Paulo Paulista",
  "Buenos Aires Palermo",
  "Santiago Providencia",
  "Cairo City Stars",
  "Casablanca Morocco Mall",
  "Tunis Centre Urbain",
  "Johannesburg Sandton",
  "Cape Town V&A Waterfront",
  "Sydney Pitt Street",
  "Melbourne Bourke Street",
  "Auckland Queen Street",
];

const PRODUCT_NAMES = [
  "Wireless Headphones Pro",
  "Smart Watch Elite",
  "USB-C Hub Deluxe",
  "Mechanical Keyboard RGB",
  "Ergonomic Mouse",
  "Webcam 4K",
  "Portable SSD 2TB",
  "Wireless Charger Pad",
  "Phone Stand Aluminum",
  "Bluetooth Speaker Mini",
  "Laptop Stand Pro",
  "Cable Organizer Set",
  "Gaming Mouse Elite",
  "Noise Cancelling Headset",
  "RGB Desk Mat XL",
  "Wireless Presenter",
  "Document Camera",
  "Smart Pen Digital",
  "Monitor Arm Dual",
  "Docking Station Pro",
  "Microphone USB Studio",
  "Tablet Stand Adjustable",
  "HDMI Switch 4K",
  "Laptop Cooling Pad",
  "Blue Light Blocking Glasses",
  "Anti-Glare Screen Protector",
  "Laptop Privacy Filter",
  "Wireless Charging Pad Trio",
  "MagSafe Car Mount",
  "Charging Cable Braided 10ft",
  "Ergonomic Vertical Mouse",
  "Trackball Mouse Wireless",
  "Gaming Mouse Pad XXL",
  "Keyboard Wrist Rest",
  "Monitor Privacy Filter",
  "Laptop Sleeve Premium",
  "Desktop Mic Arm",
  "Cable Management Box",
  "USB Hub 7-Port",
  "Ergonomic Chair Cushion",
  "Footrest Adjustable",
  "Desk Lamp LED Smart",
  "Portable Monitor 15.6",
  "Screen Cleaning Kit",
  "Desk Organizer Bamboo",
  "Wireless Trackpad",
  "Numeric Keypad Wireless",
  "Presentation Clicker",
  "Gaming Controller Pro",
  "Racing Wheel Set",
];

// Seeded random number generator for consistent results per ID
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

const getRandomInt = (seed: string, min: number, max: number) => {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
};

const getRandomRating = (seed: string) => {
  const rating = 4.0 + seededRandom(seed + "rating") * 1.0;
  return parseFloat(rating.toFixed(1));
};

const getRandomDate = (seed: string) => {
  const daysAgo = getRandomInt(seed + "date", 0, 5);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// Generate ALL regions (server-side data)
const generateAllRegions = (): Region[] => {
  return REGION_NAMES.map((name, index) => {
    const regionId = `REG-${index + 1}`;
    const numStores = getRandomInt(regionId, 3, 4);

    // Calculate aggregate data for the region
    const totalSales = getRandomInt(regionId, 50000, 150000);
    const avgPrice = getRandomInt(regionId + "price", 25, 35);
    const totalRevenue = totalSales * avgPrice;
    const avgRating = getRandomRating(regionId);

    return {
      id: regionId,
      name,
      type: "region",
      totalSales,
      totalRevenue,
      activeStores: numStores,
      avgRating,
      lastUpdate: getRandomDate(regionId),
    };
  });
};

// Generate stores for a region
const generateStoresForRegion = (regionId: string): Store[] => {
  const regionIndex = parseInt(regionId.split("-")[1]);
  const numStores = getRandomInt(regionId, 3, 4);
  const stores: Store[] = [];

  const startIndex = (regionIndex - 1) * 3; // Ensure unique store names per region

  for (let i = 0; i < numStores; i++) {
    const storeId = `STORE-${regionIndex}${String(i + 1).padStart(2, "0")}`;
    const storeIndex = startIndex + i;
    const storeName = STORE_NAMES[storeIndex % STORE_NAMES.length];

    const totalSales = getRandomInt(storeId, 10000, 25000);
    const avgPrice = getRandomInt(storeId + "price", 25, 35);
    const totalRevenue = totalSales * avgPrice;

    stores.push({
      id: storeId,
      name: storeName,
      type: "store",
      totalSales,
      totalRevenue,
      avgRating: getRandomRating(storeId),
      lastUpdate: getRandomDate(storeId),
    });
  }

  return stores;
};

// Generate products for a store
const generateProductsForStore = (storeId: string): Product[] => {
  const numProducts = getRandomInt(storeId, 3, 5);
  const products: Product[] = [];

  // Use store ID to get consistent but unique product selection
  const storeNumber = parseInt(storeId.split("-")[1]);
  const startIndex = storeNumber * 3;

  for (let i = 0; i < numProducts; i++) {
    const productId = `PROD-${storeId.split("-")[1]}-${i + 1}`;
    const productIndex = (startIndex + i) % PRODUCT_NAMES.length;
    const productName = PRODUCT_NAMES[productIndex];

    const totalSales = getRandomInt(productId, 2000, 8000);
    const avgPrice = getRandomInt(productId + "price", 20, 40);
    const totalRevenue = totalSales * avgPrice;

    products.push({
      id: productId,
      name: productName,
      type: "product",
      totalSales,
      totalRevenue,
      avgRating: getRandomRating(productId),
      lastUpdate: getRandomDate(productId),
    });
  }

  return products;
};

// ============================================================================
// SIMULATED API FUNCTIONS
// ============================================================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Server-side data (2000 regions total)
const SERVER_DATA = generateAllRegions();
const TOTAL_REGIONS = SERVER_DATA.length;

// Simulated API: Fetch paginated and sorted regions
const fetchRegions = async (
  page: number,
  pageSize: number,
  sortColumn: SortColumn | null,
): Promise<{ regions: Region[]; totalCount: number }> => {
  await delay(1000); // Simulate network delay

  let sortedData = [...SERVER_DATA];

  // Sort the data if sortColumn is provided
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const accessor = sortColumn.key.accessor as keyof Region;
      const aValue = a[accessor];
      const bValue = b[accessor];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (sortColumn.key.type === "number") {
        comparison = (aValue as number) - (bValue as number);
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortColumn.direction === "asc" ? comparison : -comparison;
    });
  }

  // Paginate
  const offset = (page - 1) * pageSize;
  const paginatedData = sortedData.slice(offset, offset + pageSize);

  return {
    regions: paginatedData,
    totalCount: TOTAL_REGIONS,
  };
};

// Simulated API: Fetch stores for a region
const fetchStoresForRegion = async (regionId: string): Promise<Store[]> => {
  await delay(800); // Simulate network delay
  return generateStoresForRegion(regionId);
};

// Simulated API: Fetch products for a store
const fetchProductsForStore = async (storeId: string): Promise<Product[]> => {
  await delay(600); // Simulate network delay
  return generateProductsForStore(storeId);
};

// ============================================================================
// COMPONENT
// ============================================================================

export const dynamicRowLoadingWithExternalSortDefaults = {
  height: "600px",
};

const DynamicRowLoadingWithExternalSortExample: React.FC<UniversalTableProps> = (props) => {
  const { theme } = props;
  const [rows, setRows] = useState<Region[]>([]);
  const [, setIsLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(TOTAL_REGIONS);
  const rowsPerPage = 10;

  // Fetch regions when page or sort changes
  useEffect(() => {
    console.log(currentPage);
    const loadRegions = async () => {
      setIsLoading(true);
      try {
        const { regions, totalCount } = await fetchRegions(currentPage, rowsPerPage, sortColumn);
        setRows(regions);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("❌ Error fetching regions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegions();
  }, [currentPage, sortColumn]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSortColumn: SortColumn | null) => {
    setSortColumn(newSortColumn);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, []);

  // Handle row expansion for lazy loading nested data
  const handleRowExpand = useCallback(
    async ({
      row,
      depth,
      groupingKey,
      isExpanded,
      setLoading,
      setError,
      setEmpty,
      rowIndexPath,
    }: OnRowGroupExpandProps) => {
      // Don't fetch if collapsing
      if (!isExpanded) {
        return;
      }

      // Don't fetch if data already exists
      if (groupingKey && row[groupingKey] && (row[groupingKey] as any[]).length > 0) {
        return;
      }

      try {
        if (depth === 0 && groupingKey === "stores") {
          // Set loading state using the helper
          setLoading(true);

          // Fetch stores from "API"
          const stores = await fetchStoresForRegion(String(row.id));

          // Clear loading state
          setLoading(false);

          // Show empty state if no stores
          if (stores.length === 0) {
            setEmpty(true, "No stores found for this region");
            return;
          }

          // Update nested data using rowIndexPath (simple array indices)
          // rowIndexPath = [0] means rows[0]
          setRows((prevRows) => {
            const newRows = [...prevRows];
            const regionIndex = rowIndexPath[0];
            newRows[regionIndex].stores = stores;
            return newRows;
          });
        } else if (depth === 1 && groupingKey === "products") {
          // Set loading state
          setLoading(true);

          // Fetch products from "API"
          const products = await fetchProductsForStore(String(row.id));

          // Clear loading state
          setLoading(false);

          // Show empty state if no products
          if (products.length === 0) {
            setEmpty(true, "No products found for this store");
            return;
          }

          // Update nested data using rowIndexPath (simple array indices)
          // rowIndexPath = [0, 1] means rows[0].stores[1]
          setRows((prevRows) => {
            const newRows = [...prevRows];
            const regionIndex = rowIndexPath[0];
            const storeIndex = rowIndexPath[1];
            const region = newRows[regionIndex];
            if (region.stores && region.stores[storeIndex]) {
              region.stores[storeIndex].products = products;
            }
            return newRows;
          });
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setLoading(false);
        setError(error instanceof Error ? error.message : "Failed to load data");
      }
    },
    [],
  );

  // Handle sort button clicks
  const handleSortButtonClick = useCallback((accessor: string, direction: "asc" | "desc") => {
    const header = HEADERS.find((h) => h.accessor === accessor);
    if (header) {
      const newSortColumn: SortColumn = {
        key: header,
        direction,
      };
      setSortColumn(newSortColumn);
      setCurrentPage(1); // Reset to first page when sorting changes
    }
  }, []);

  // Clear sort
  const handleClearSort = useCallback(() => {
    setSortColumn(null);
    setCurrentPage(1);
  }, []);

  return (
    <div>
      {/* Sort Control Buttons */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: "bold", marginRight: "8px" }}>Quick Sort:</span>

        <button
          onClick={() => handleSortButtonClick("name", "asc")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              sortColumn?.key.accessor === "name" && sortColumn?.direction === "asc"
                ? "#007bff"
                : "#f0f0f0",
            color:
              sortColumn?.key.accessor === "name" && sortColumn?.direction === "asc"
                ? "white"
                : "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Name (A-Z)
        </button>

        <button
          onClick={() => handleSortButtonClick("name", "desc")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              sortColumn?.key.accessor === "name" && sortColumn?.direction === "desc"
                ? "#007bff"
                : "#f0f0f0",
            color:
              sortColumn?.key.accessor === "name" && sortColumn?.direction === "desc"
                ? "white"
                : "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Name (Z-A)
        </button>

        <button
          onClick={() => handleSortButtonClick("totalSales", "desc")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              sortColumn?.key.accessor === "totalSales" && sortColumn?.direction === "desc"
                ? "#007bff"
                : "#f0f0f0",
            color:
              sortColumn?.key.accessor === "totalSales" && sortColumn?.direction === "desc"
                ? "white"
                : "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sales (High-Low)
        </button>

        <button
          onClick={() => handleSortButtonClick("totalSales", "asc")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              sortColumn?.key.accessor === "totalSales" && sortColumn?.direction === "asc"
                ? "#007bff"
                : "#f0f0f0",
            color:
              sortColumn?.key.accessor === "totalSales" && sortColumn?.direction === "asc"
                ? "white"
                : "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sales (Low-High)
        </button>

        <button
          onClick={() => handleSortButtonClick("totalRevenue", "desc")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              sortColumn?.key.accessor === "totalRevenue" && sortColumn?.direction === "desc"
                ? "#007bff"
                : "#f0f0f0",
            color:
              sortColumn?.key.accessor === "totalRevenue" && sortColumn?.direction === "desc"
                ? "white"
                : "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Revenue (High-Low)
        </button>

        <button
          onClick={() => handleSortButtonClick("avgRating", "desc")}
          style={{
            padding: "8px 16px",
            backgroundColor:
              sortColumn?.key.accessor === "avgRating" && sortColumn?.direction === "desc"
                ? "#007bff"
                : "#f0f0f0",
            color:
              sortColumn?.key.accessor === "avgRating" && sortColumn?.direction === "desc"
                ? "white"
                : "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Rating (High-Low)
        </button>

        <button
          onClick={handleClearSort}
          style={{
            padding: "8px 16px",
            backgroundColor: !sortColumn ? "#28a745" : "#f0f0f0",
            color: !sortColumn ? "white" : "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "8px",
          }}
        >
          Clear Sort
        </button>

        {sortColumn && (
          <span style={{ marginLeft: "8px", color: "#666", fontSize: "14px" }}>
            Currently sorted by: <strong>{sortColumn.key.label}</strong> (
            {sortColumn.direction === "asc" ? "Ascending" : "Descending"})
          </span>
        )}
      </div>

      {/* Table */}
      <SimpleTable
        columnResizing
        defaultHeaders={HEADERS}
        editColumns
        expandAll={false}
        onPageChange={handlePageChange}
        onRowGroupExpand={handleRowExpand}
        onSortChange={handleSortChange}
        rowGrouping={["stores", "products"]}
        getRowId={({ row }) => row.id as string | number}
        rows={rows}
        rowsPerPage={rowsPerPage}
        selectableCells
        shouldPaginate
        theme={theme}
        totalRowCount={totalCount}
        useOddEvenRowBackground
        errorStateRenderer={<div style={{ paddingLeft: "16px" }}>Error loading data</div>}
        emptyStateRenderer={<div style={{ paddingLeft: "16px" }}>No data found</div>}
        customTheme={{
          rowHeight: 100,
        }}
      />
    </div>
  );
};

export default DynamicRowLoadingWithExternalSortExample;
