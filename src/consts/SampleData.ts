export const inventoryData: {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  price: string;
  supplier: string;
  location: string;
  reorderLevel: number;
  sku: string;
  description: string;
  weight: string;
  dimensions: string;
  barcode: string;
  expirationDate: string;
  manufacturer: string;
}[] = Array.from({ length: 50 }, (_, index) => ({
  id: `P-${index + 1001}`,
  productName: [
    "Wireless Mouse",
    "Bluetooth Speaker",
    "LED Monitor",
    "Gaming Keyboard",
    "Smartphone",
    "Laptop",
    "Tablet",
    "Headphones",
    "Smartwatch",
    "External Hard Drive",
  ][index % 10],
  category: ["Electronics", "Furniture", "Clothing", "Food", "Books"][
    Math.floor(Math.random() * 5)
  ],
  quantity: Math.floor(Math.random() * 100) + 1,
  price: (Math.random() * 100).toFixed(2),
  supplier: [
    "Tech Supplies Co.",
    "Gadget World",
    "Office Essentials",
    "Home Comforts",
    "Fashion Hub",
  ][Math.floor(Math.random() * 5)],
  location: [
    "Warehouse A - New York",
    "Warehouse B - Los Angeles",
    "Warehouse C - Chicago",
    "Warehouse D - Houston",
    "Warehouse E - Miami",
  ][Math.floor(Math.random() * 5)],
  reorderLevel: Math.floor(Math.random() * 20) + 5,
  sku: `SKU-${index + 1001}`,
  description: `High-quality ${
    [
      "wireless mouse",
      "bluetooth speaker",
      "LED monitor",
      "gaming keyboard",
      "smartphone",
      "laptop",
      "tablet",
      "headphones",
      "smartwatch",
      "external hard drive",
    ][index % 10]
  } for everyday use.`,
  weight: `${(Math.random() * 10).toFixed(2)} kg`,
  dimensions: `${(Math.random() * 100).toFixed(2)}x${(
    Math.random() * 100
  ).toFixed(2)}x${(Math.random() * 100).toFixed(2)} cm`,
  barcode: `1234567890${index}`,
  expirationDate: `2024-${Math.floor(Math.random() * 12) + 1}-${
    Math.floor(Math.random() * 28) + 1
  }`,
  manufacturer: [
    "Tech Innovators Inc.",
    "Gadget Makers Ltd.",
    "Office Producers",
    "Home Creators",
    "Fashion Designers",
  ][Math.floor(Math.random() * 5)],
}));
