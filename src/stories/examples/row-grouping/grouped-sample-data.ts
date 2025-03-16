import Row from "../../../types/Row";

export const groupedInventoryData: Row[] = [
  {
    rowMeta: {
      rowId: 0,
      isExpanded: false,
      children: [
        {
          rowMeta: {
            rowId: 1,
            isExpanded: false,
            children: [
              {
                rowMeta: { rowId: 2 },
                rowData: {
                  productId: "P-1001",
                  productName: "Wireless Mouse",
                  category: "Electronics",
                  quantity: 45,
                  price: "29.99",
                  supplier: "Tech Supplies Co.",
                  location: "Warehouse A - New York",
                  reorderLevel: 10,
                  sku: "SKU-1001",
                  description:
                    "High-quality wireless mouse with ergonomic design",
                  weight: "0.25 kg",
                  dimensions: "12x7x4 cm",
                  barcode: "1234567890123",
                  expirationDate: "N/A",
                  manufacturer: "Tech Innovators Inc.",
                },
              },
              {
                rowMeta: { rowId: 3 },
                rowData: {
                  productId: "P-1002",
                  productName: "Bluetooth Speaker",
                  category: "Electronics",
                  quantity: 30,
                  price: "79.99",
                  supplier: "Tech Supplies Co.",
                  location: "Warehouse A - New York",
                  reorderLevel: 8,
                  sku: "SKU-1002",
                  description:
                    "Portable bluetooth speaker with superior sound quality",
                  weight: "0.5 kg",
                  dimensions: "15x8x8 cm",
                  barcode: "1234567890124",
                  expirationDate: "N/A",
                  manufacturer: "Tech Innovators Inc.",
                },
              },
            ],
          },
          rowData: {
            productName: "Tech Innovators Inc.",
          },
        },
        {
          rowMeta: {
            rowId: 2,
            children: [
              {
                rowMeta: { rowId: 3 },
                rowData: {
                  productId: "P-1003",
                  productName: "LED Monitor",
                  category: "Electronics",
                  quantity: 20,
                  price: "299.99",
                  supplier: "Gadget World",
                  location: "Warehouse B - Los Angeles",
                  reorderLevel: 5,
                  sku: "SKU-1003",
                  description: "27-inch 4K LED Monitor",
                  weight: "4.5 kg",
                  dimensions: "61x37x21 cm",
                  barcode: "1234567890125",
                  expirationDate: "N/A",
                  manufacturer: "Gadget Makers Ltd.",
                },
              },
            ],
          },
          rowData: {
            productName: "Gadget Makers Ltd.",
          },
        },
      ],
    },
    rowData: {
      productName: "Electronics",
    },
  },
];
