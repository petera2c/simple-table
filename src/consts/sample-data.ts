import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";

export const SAMPLE_HEADERS: HeaderObject[] = [
  {
    accessor: "productName",
    expandable: true,
    isEditable: true,
    isSortable: true,
    label: "Product Name",
    width: 140,
  },
  {
    label: "Category",
    accessor: "category",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Quantity",
    accessor: "quantity",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Price",
    accessor: "price",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Supplier",
    accessor: "supplier",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Location",
    accessor: "location",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Reorder Level",
    accessor: "reorderLevel",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "SKU",
    accessor: "sku",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Description",
    accessor: "description",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Weight",
    accessor: "weight",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Dimensions",
    accessor: "dimensions",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Barcode",
    accessor: "barcode",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    label: "Expiration Date",
    accessor: "expirationDate",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  { label: "Manufacturer", accessor: "manufacturer", width: 140 },
];

export const inventoryData: Row[] = Array.from({ length: 50 }, (_, index) => ({
  rowMeta: {
    rowId: index,
  },
  rowData: {
    productId: `P-${index + 1001}`,
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
  },
}));
