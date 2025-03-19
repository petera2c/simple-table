import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

export const generateRetailSalesData = (): Row[] => {
  const regions = Array.from({ length: 20 }, (_, i) => `Region ${i + 1}`); // 20 top-level regions
  const storeNames = [
    "MegaMart",
    "ShopRite",
    "TrendyGoods",
    "ValueStore",
    "QuickBuy",
  ];
  const cities = [
    "New York",
    "London",
    "Tokyo",
    "Sydney",
    "Paris",
    "Toronto",
    "Berlin",
  ];
  let rowId = 0;

  return regions.map((region) => {
    const numStores = Math.floor(Math.random() * 11) + 5; // 5–15 stores per region
    const children = Array.from({ length: numStores }, () => {
      const storeName =
        storeNames[Math.floor(Math.random() * storeNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const electronicsSales = Math.floor(Math.random() * 100000) + 5000;
      const clothingSales = Math.floor(Math.random() * 80000) + 4000;
      const groceriesSales = Math.floor(Math.random() * 120000) + 6000;
      const furnitureSales = Math.floor(Math.random() * 60000) + 3000;
      const totalSales =
        electronicsSales + clothingSales + groceriesSales + furnitureSales;

      return {
        rowMeta: { rowId: rowId++, isExpanded: true },
        rowData: {
          name: `${storeName} - ${city}`,
          city,
          employees: Math.floor(Math.random() * 200) + 10,
          squareFootage: Math.floor(Math.random() * 10000) + 1000,
          openingDate: `202${Math.floor(Math.random() * 5)}-${
            Math.floor(Math.random() * 12) + 1
          }-${Math.floor(Math.random() * 28) + 1}`,
          customerRating: `${(Math.random() * 5).toFixed(1)}/5`,
          electronicsSales,
          clothingSales,
          groceriesSales,
          furnitureSales,
          totalSales,
        },
      };
    });

    // Calculate the total sales for the region (sum of all child stores' totalSales)
    const regionTotalSales = children.reduce(
      (sum, child) => sum + (child.rowData.totalSales as number),
      0
    );

    return {
      rowMeta: {
        rowId: rowId++,
        isExpanded: true,
        children,
      },
      rowData: {
        name: region, // Parent row uses the region name
        city: "-", // Placeholder for parent row
        employees: children.reduce(
          (sum, child) => sum + (child.rowData.employees as number),
          0
        ), // Sum of employees
        squareFootage: children.reduce(
          (sum, child) => sum + (child.rowData.squareFootage as number),
          0
        ), // Sum of square footage
        openingDate: "-", // Placeholder for parent row
        customerRating: "-", // Placeholder for parent row
        electronicsSales: children.reduce(
          (sum, child) => sum + (child.rowData.electronicsSales as number),
          0
        ), // Sum of electronics sales
        clothingSales: children.reduce(
          (sum, child) => sum + (child.rowData.clothingSales as number),
          0
        ), // Sum of clothing sales
        groceriesSales: children.reduce(
          (sum, child) => sum + (child.rowData.groceriesSales as number),
          0
        ), // Sum of groceries sales
        furnitureSales: children.reduce(
          (sum, child) => sum + (child.rowData.furnitureSales as number),
          0
        ), // Sum of furniture sales
        totalSales: regionTotalSales,
      },
    };
  });
};

export const RETAIL_SALES_HEADERS: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 180,
    expandable: true,
    isSortable: true,
    isEditable: true,
    pinned: "left",
  },
  {
    accessor: "city",
    label: "City",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "employees",
    label: "Employees",
    width: 120,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "squareFootage",
    label: "Square Footage",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "openingDate",
    label: "Opening Date",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "customerRating",
    label: "Customer Rating",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "electronicsSales",
    label: "Electronics Sales ($)",
    width: 160,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "clothingSales",
    label: "Clothing Sales ($)",
    width: 160,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "groceriesSales",
    label: "Groceries Sales ($)",
    width: 160,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "furnitureSales",
    label: "Furniture Sales ($)",
    width: 160,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "totalSales",
    label: "Total Sales ($)",
    width: 160,
    isSortable: true,
    isEditable: true,
    pinned: "right",
  },
];
