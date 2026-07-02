// Self-contained demo table setup for this example.
import type { HeaderObject, Row } from "simple-table-core";


export const footerRendererHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "product", label: "Product Name", width: 220, type: "string" },
  { accessor: "category", label: "Category", width: 150, type: "string" },
  { accessor: "price", label: "Price", width: 100, type: "number" },
  { accessor: "stock", label: "Stock", width: 100, type: "number" },
  { accessor: "status", label: "Status", width: "1fr", type: "string" },
];

export const footerRendererData: Row[] = [
  { id: 1, product: "MacBook Pro 16-inch M3 Max", category: "Laptops", price: 3499, stock: 28, status: "In Stock" },
  { id: 2, product: "Dell XPS 15 OLED Touchscreen", category: "Laptops", price: 2299, stock: 42, status: "In Stock" },
  { id: 3, product: "ThinkPad X1 Carbon Gen 11", category: "Laptops", price: 1899, stock: 35, status: "In Stock" },
  { id: 4, product: "HP Spectre x360 Convertible", category: "Laptops", price: 1649, stock: 51, status: "In Stock" },
  { id: 5, product: "ASUS ROG Strix Gaming Laptop", category: "Laptops", price: 2199, stock: 19, status: "In Stock" },
  { id: 6, product: "Logitech MX Master 3S Wireless", category: "Accessories", price: 99, stock: 342, status: "In Stock" },
  { id: 7, product: "Apple Magic Mouse Black", category: "Accessories", price: 89, stock: 218, status: "In Stock" },
  { id: 8, product: "Razer DeathAdder V3 Pro", category: "Accessories", price: 149, stock: 167, status: "In Stock" },
  { id: 9, product: "Microsoft Surface Precision Mouse", category: "Accessories", price: 79, stock: 203, status: "In Stock" },
  { id: 10, product: "Corsair K95 RGB Platinum XT", category: "Keyboards", price: 199, stock: 89, status: "In Stock" },
  { id: 11, product: "Keychron Q1 Pro Mechanical", category: "Keyboards", price: 189, stock: 134, status: "In Stock" },
  { id: 12, product: "Ducky One 3 TKL RGB", category: "Keyboards", price: 159, stock: 76, status: "In Stock" },
  { id: 13, product: "Leopold FC900R PD Cherry MX", category: "Keyboards", price: 169, stock: 54, status: "In Stock" },
  { id: 14, product: "LG UltraGear 27-inch 4K 144Hz", category: "Monitors", price: 799, stock: 31, status: "In Stock" },
  { id: 15, product: "Samsung Odyssey G9 Curved", category: "Monitors", price: 1299, stock: 18, status: "In Stock" },
  { id: 16, product: "Dell UltraSharp U2723DE 27in", category: "Monitors", price: 649, stock: 47, status: "In Stock" },
  { id: 17, product: "BenQ PD3220U Designer 32in", category: "Monitors", price: 1099, stock: 23, status: "In Stock" },
  { id: 18, product: "ASUS ProArt Display PA279CRV", category: "Monitors", price: 549, stock: 39, status: "In Stock" },
  { id: 19, product: "Sony WH-1000XM5 Noise Cancelling", category: "Audio", price: 399, stock: 127, status: "In Stock" },
  { id: 20, product: "Bose QuietComfort Ultra", category: "Audio", price: 429, stock: 98, status: "In Stock" },
  { id: 21, product: "Apple AirPods Max Space Gray", category: "Audio", price: 549, stock: 82, status: "In Stock" },
  { id: 22, product: "Sennheiser Momentum 4 Wireless", category: "Audio", price: 349, stock: 104, status: "In Stock" },
  { id: 23, product: "Logitech C920 HD Pro Webcam", category: "Video", price: 79, stock: 245, status: "In Stock" },
  { id: 24, product: "Elgato Facecam Pro 4K60", category: "Video", price: 299, stock: 67, status: "In Stock" },
  { id: 25, product: "Razer Kiyo Pro Ultra 4K", category: "Video", price: 329, stock: 41, status: "In Stock" },
  { id: 26, product: "Herman Miller Aeron Ergonomic", category: "Furniture", price: 1695, stock: 12, status: "Low Stock" },
  { id: 27, product: "Steelcase Leap V2 Office Chair", category: "Furniture", price: 1299, stock: 15, status: "In Stock" },
  { id: 28, product: "Autonomous SmartDesk Pro", category: "Furniture", price: 899, stock: 28, status: "In Stock" },
  { id: 29, product: "Uplift V2 Standing Desk Frame", category: "Furniture", price: 749, stock: 34, status: "In Stock" },
  { id: 30, product: "FlexiSpot E7 Plus Adjustable", category: "Furniture", price: 649, stock: 45, status: "In Stock" },
  { id: 31, product: "Anker PowerCore 20000mAh", category: "Power", price: 49, stock: 412, status: "In Stock" },
  { id: 32, product: "RAVPower 60W USB-C Charger", category: "Power", price: 39, stock: 387, status: "In Stock" },
  { id: 33, product: "Belkin BoostCharge Pro 3-in-1", category: "Power", price: 149, stock: 156, status: "In Stock" },
  { id: 34, product: "Samsung T7 Shield 2TB SSD", category: "Storage", price: 199, stock: 234, status: "In Stock" },
  { id: 35, product: "SanDisk Extreme Pro 1TB Portable", category: "Storage", price: 159, stock: 189, status: "In Stock" },
  { id: 36, product: "WD My Passport 5TB External", category: "Storage", price: 139, stock: 276, status: "In Stock" },
  { id: 37, product: "Crucial X9 Pro 4TB Rugged", category: "Storage", price: 289, stock: 143, status: "In Stock" },
  { id: 38, product: "CalDigit TS4 Thunderbolt 4 Dock", category: "Hubs & Docks", price: 399, stock: 52, status: "In Stock" },
  { id: 39, product: "Anker 577 Thunderbolt Docking", category: "Hubs & Docks", price: 299, stock: 78, status: "In Stock" },
  { id: 40, product: "HyperDrive Gen2 16-Port USB-C", category: "Hubs & Docks", price: 249, stock: 91, status: "In Stock" },
  { id: 41, product: "Blue Yeti X Professional USB", category: "Audio", price: 169, stock: 123, status: "In Stock" },
  { id: 42, product: "Shure MV7 Podcast Microphone", category: "Audio", price: 249, stock: 87, status: "In Stock" },
  { id: 43, product: "Elgato Wave:3 Premium USB", category: "Audio", price: 159, stock: 104, status: "In Stock" },
  { id: 44, product: "Rode NT-USB Mini Studio", category: "Audio", price: 99, stock: 167, status: "In Stock" },
  { id: 45, product: "Audio-Technica AT2020USB+", category: "Audio", price: 149, stock: 145, status: "In Stock" },
];

export const footerRendererConfig = {
  headers: footerRendererHeaders,
  rows: footerRendererData,
  tableProps: {
    shouldPaginate: true,
    rowsPerPage: 10,
  },
} as const;
