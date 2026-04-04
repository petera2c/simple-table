// Self-contained demo table setup for this example.
import type { HeaderObject, Row } from "@simple-table/vue";


export interface DynamicRegion extends Row {
  id: string;
  name: string;
  type: "region";
  totalSales: number;
  totalRevenue: number;
  activeStores: number;
  avgRating: string;
  lastUpdate: string;
  stores?: DynamicStore[];
}

export interface DynamicStore extends Row {
  id: string;
  name: string;
  type: "store";
  totalSales: number;
  totalRevenue: number;
  activeStores?: number;
  avgRating: string;
  lastUpdate: string;
  products?: DynamicProduct[];
}

export interface DynamicProduct extends Row {
  id: string;
  name: string;
  type: "product";
  totalSales: number;
  totalRevenue: number;
  activeStores?: number;
  avgRating: string;
  lastUpdate: string;
}

export const dynamicRowLoadingHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 280, expandable: true, type: "string", pinned: "left" },
  { accessor: "type", label: "Type", width: 100, type: "string" },
  {
    accessor: "totalSales", label: "Total Sales", width: 120, type: "number", align: "right",
    aggregation: { type: "sum" },
    valueFormatter: ({ value }) => typeof value !== "number" ? "—" : value.toLocaleString(),
  },
  {
    accessor: "totalRevenue", label: "Revenue", width: 140, type: "number", align: "right",
    aggregation: { type: "sum" },
    valueFormatter: ({ value }) => typeof value !== "number" ? "—" : `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    accessor: "activeStores", label: "Stores", width: 100, type: "number", align: "right",
    valueFormatter: ({ value }) => typeof value !== "number" ? "—" : value.toLocaleString(),
  },
  { accessor: "avgRating", label: "Avg Rating", width: 120, type: "string", align: "center" },
  { accessor: "lastUpdate", label: "Last Updated", width: 130, type: "date" },
];

const REGION_NAMES = [
  "North America - East", "North America - West", "Europe - North", "Europe - South",
  "Asia Pacific - East", "Asia Pacific - Southeast", "Middle East",
  "Latin America - North", "Latin America - South", "Africa - North", "Africa - South", "Oceania",
];

const STORE_NAMES = [
  "Manhattan Flagship", "Brooklyn Heights", "Boston Downtown", "Miami Beach",
  "Los Angeles Beverly Hills", "San Francisco Union Square", "Seattle Downtown", "Portland Pearl District",
  "London Oxford Street", "Stockholm Gamla Stan", "Copenhagen Strøget", "Amsterdam Central",
  "Paris Champs-Élysées", "Madrid Gran Vía", "Rome Via del Corso", "Barcelona La Rambla",
  "Tokyo Shibuya", "Shanghai Nanjing Road", "Hong Kong Central", "Seoul Gangnam",
  "Singapore Orchard", "Bangkok Siam", "Kuala Lumpur Bukit Bintang", "Jakarta Grand Indonesia",
  "Dubai Mall", "Abu Dhabi Marina", "Riyadh Kingdom Centre",
  "Mexico City Reforma", "Monterrey Valle", "Guadalajara Centro",
  "São Paulo Paulista", "Buenos Aires Palermo", "Santiago Providencia",
  "Cairo City Stars", "Casablanca Morocco Mall", "Tunis Centre Urbain",
  "Johannesburg Sandton", "Cape Town V&A Waterfront",
  "Sydney Pitt Street", "Melbourne Bourke Street", "Auckland Queen Street",
];

const PRODUCT_NAMES = [
  "Wireless Headphones Pro", "Smart Watch Elite", "USB-C Hub Deluxe", "Mechanical Keyboard RGB",
  "Ergonomic Mouse", "Webcam 4K", "Portable SSD 2TB", "Wireless Charger Pad",
  "Phone Stand Aluminum", "Bluetooth Speaker Mini", "Laptop Stand Pro", "Cable Organizer Set",
  "Gaming Mouse Elite", "Noise Cancelling Headset", "RGB Desk Mat XL", "Wireless Presenter",
  "Document Camera", "Smart Pen Digital", "Monitor Arm Dual", "Docking Station Pro",
  "Microphone USB Studio", "Tablet Stand Adjustable", "HDMI Switch 4K", "Laptop Cooling Pad",
  "Blue Light Blocking Glasses", "Anti-Glare Screen Protector", "Laptop Privacy Filter",
  "Wireless Charging Pad Trio", "MagSafe Car Mount", "Charging Cable Braided 10ft",
  "Ergonomic Vertical Mouse", "Trackball Mouse Wireless", "Gaming Mouse Pad XXL",
  "Keyboard Wrist Rest", "Monitor Privacy Filter", "Laptop Sleeve Premium",
  "Desktop Mic Arm", "Cable Management Box", "USB Hub 7-Port", "Ergonomic Chair Cushion",
  "Footrest Adjustable", "Desk Lamp LED Smart", "Portable Monitor 15.6", "Screen Cleaning Kit",
  "Desk Organizer Bamboo", "Wireless Trackpad", "Numeric Keypad Wireless",
  "Presentation Clicker", "Gaming Controller Pro", "Racing Wheel Set",
];

const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

const getRandomInt = (seed: string, min: number, max: number) =>
  Math.floor(seededRandom(seed) * (max - min + 1)) + min;

const getRandomRating = (seed: string) => (4.0 + seededRandom(seed + "rating") * 1.0).toFixed(1);

const getRandomDate = (seed: string) => {
  const daysAgo = getRandomInt(seed + "date", 0, 5);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const generateStoresForRegion = (regionId: string): DynamicStore[] => {
  const regionIndex = parseInt(regionId.split("-")[1]);
  const numStores = getRandomInt(regionId, 3, 4);
  const startIndex = (regionIndex - 1) * 3;
  return Array.from({ length: numStores }, (_, i) => {
    const storeId = `STORE-${regionIndex}${String(i + 1).padStart(2, "0")}`;
    const storeIndex = startIndex + i;
    const totalSales = getRandomInt(storeId, 10000, 25000);
    const avgPrice = getRandomInt(storeId + "price", 25, 35);
    return {
      id: storeId,
      name: STORE_NAMES[storeIndex % STORE_NAMES.length],
      type: "store" as const,
      totalSales,
      totalRevenue: totalSales * avgPrice,
      avgRating: getRandomRating(storeId),
      lastUpdate: getRandomDate(storeId),
    };
  });
};

const generateProductsForStore = (storeId: string): DynamicProduct[] => {
  const numProducts = getRandomInt(storeId, 3, 5);
  const storeNumber = parseInt(storeId.split("-")[1]);
  const startIndex = storeNumber * 3;
  return Array.from({ length: numProducts }, (_, i) => {
    const productId = `PROD-${storeId.split("-")[1]}-${i + 1}`;
    const totalSales = getRandomInt(productId, 2000, 8000);
    const avgPrice = getRandomInt(productId + "price", 20, 40);
    return {
      id: productId,
      name: PRODUCT_NAMES[(startIndex + i) % PRODUCT_NAMES.length],
      type: "product" as const,
      totalSales,
      totalRevenue: totalSales * avgPrice,
      avgRating: getRandomRating(productId),
      lastUpdate: getRandomDate(productId),
    };
  });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchStoresForRegion = async (regionId: string): Promise<DynamicStore[]> => {
  await delay(1500);
  return generateStoresForRegion(regionId);
};

export const fetchProductsForStore = async (storeId: string): Promise<DynamicProduct[]> => {
  await delay(1000);
  return generateProductsForStore(storeId);
};

export const generateInitialRegions = (): DynamicRegion[] => {
  return REGION_NAMES.map((name, index) => {
    const regionId = `REG-${index + 1}`;
    const stores = generateStoresForRegion(regionId);
    const totalSales = stores.reduce((sum, s) => sum + s.totalSales, 0);
    const totalRevenue = stores.reduce((sum, s) => sum + s.totalRevenue, 0);
    const avgRating = (stores.reduce((sum, s) => sum + parseFloat(s.avgRating), 0) / stores.length).toFixed(1);
    return {
      id: regionId,
      name,
      type: "region" as const,
      totalSales,
      totalRevenue,
      activeStores: getRandomInt(regionId, 3, 4),
      avgRating,
      lastUpdate: getRandomDate(regionId),
    };
  });
};

export const dynamicRowLoadingConfig = {
  headers: dynamicRowLoadingHeaders,
  tableProps: {
    rowGrouping: ["stores", "products"] as string[],
    getRowId: ({ row }: { row: Record<string, unknown> }) => row.id as string,
    expandAll: false,
    columnResizing: true,
    selectableCells: true,
    useOddEvenRowBackground: true,
    editColumns: true,
  },
} as const;
