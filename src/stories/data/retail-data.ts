import { STColumn } from "../../types/HeaderObject";

type RetailStore = {
  id: number;
  name: string;
  city: string;
  employees: number;
  squareFootage: number;
  openingDate: string;
  customerRating: string;
  electronicsSales: number;
  clothingSales: number;
  groceriesSales: number;
  furnitureSales: number;
  totalSales: number;
};

export type RetailRegion = {
  id: number;
  name: string;
  city: string; // Will be "-" for regions
  employees: number; // Aggregated from stores
  squareFootage: number; // Aggregated from stores
  openingDate: string; // Will be "-" for regions
  customerRating: string; // Will be "-" for regions
  electronicsSales: number; // Aggregated from stores
  clothingSales: number; // Aggregated from stores
  groceriesSales: number; // Aggregated from stores
  furnitureSales: number; // Aggregated from stores
  totalSales: number; // Aggregated from stores
  stores: RetailStore[];
};

export type RetailSalesData = RetailStore | RetailRegion;

export const generateRetailSalesData = (): RetailRegion[] => {
  const regions = Array.from({ length: 20 }, (_, i) => `Region ${i + 1}`);
  const storeNames = ["MegaMart", "ShopRite", "TrendyGoods", "ValueStore", "QuickBuy"];
  const cities = ["New York", "London", "Tokyo", "Sydney", "Paris", "Toronto", "Berlin"];
  let rowId = 0;

  return regions.map((region) => {
    const numStores = Math.floor(Math.random() * 7) + 2; // 2 to 8 children
    const stores: RetailStore[] = Array.from({ length: numStores }, () => {
      const storeName = storeNames[Math.floor(Math.random() * storeNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const electronicsSales = Math.floor(Math.random() * 100000) + 5000;
      const clothingSales = Math.floor(Math.random() * 80000) + 4000;
      const groceriesSales = Math.floor(Math.random() * 120000) + 6000;
      const furnitureSales = Math.floor(Math.random() * 60000) + 3000;
      const totalSales = electronicsSales + clothingSales + groceriesSales + furnitureSales;
      const openingDate = `202${Math.floor(Math.random() * 5)}-${String(
        Math.floor(Math.random() * 12) + 1
      ).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`;

      return {
        id: rowId++,
        name: `${storeName} - ${city}`,
        city,
        employees: Math.floor(Math.random() * 200) + 10,
        squareFootage: Math.floor(Math.random() * 10000) + 1000,
        openingDate,
        customerRating: (Math.random() * 5).toFixed(1),
        electronicsSales,
        clothingSales,
        groceriesSales,
        furnitureSales,
        totalSales,
      };
    });

    const regionTotalElectronicsSales = stores.reduce(
      (sum, store) => sum + store.electronicsSales,
      0
    );
    const regionTotalClothingSales = stores.reduce((sum, store) => sum + store.clothingSales, 0);
    const regionTotalGroceriesSales = stores.reduce((sum, store) => sum + store.groceriesSales, 0);
    const regionTotalFurnitureSales = stores.reduce((sum, store) => sum + store.furnitureSales, 0);
    const regionTotalSales =
      regionTotalElectronicsSales +
      regionTotalClothingSales +
      regionTotalGroceriesSales +
      regionTotalFurnitureSales;

    return {
      id: rowId++,
      name: region,
      city: "-",
      employees: stores.reduce((sum, store) => sum + store.employees, 0),
      squareFootage: stores.reduce((sum, store) => sum + store.squareFootage, 0),
      openingDate: "-",
      customerRating: "-",
      electronicsSales: regionTotalElectronicsSales,
      clothingSales: regionTotalClothingSales,
      groceriesSales: regionTotalGroceriesSales,
      furnitureSales: regionTotalFurnitureSales,
      totalSales: regionTotalSales,
      stores: stores, // Nested stores for row grouping
    };
  });
};

export const RETAIL_SALES_HEADERS: STColumn<RetailSalesData>[] = [
  {
    accessor: "name",
    label: "Name",
    width: 250,
    expandable: true,
    isSortable: true,
    isEditable: true,
    align: "left",
    pinned: "left",
  },
  {
    accessor: "city",
    label: "City",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
    pinned: "left",
  },
  {
    accessor: "employees",
    label: "Employees",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  {
    accessor: "squareFootage",
    label: "Square Footage",
    width: 180,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  {
    accessor: "openingDate",
    label: "Opening Date",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
    cellRenderer: ({ row }) => {
      if (row.openingDate === "-") return "-";
      const date = new Date(row.openingDate as string);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    accessor: "customerRating",
    label: "Customer Rating",
    width: 180,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => (row.customerRating === "-" ? "-" : `${row.customerRating}/5`),
  },
  {
    accessor: "electronicsSales",
    label: "Electronics Sales",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "center",
    cellRenderer: ({ row }) => `$${(row.electronicsSales as number).toLocaleString("en-US")}`,
  },
  {
    accessor: "clothingSales",
    label: "Clothing Sales",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "left",
    cellRenderer: ({ row }) => `$${(row.clothingSales as number).toLocaleString("en-US")}`,
  },
  {
    accessor: "groceriesSales",
    label: "Groceries Sales",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `$${(row.groceriesSales as number).toLocaleString("en-US")}`,
  },
  {
    accessor: "furnitureSales",
    label: "Furniture Sales",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "center",
    cellRenderer: ({ row }) => `$${(row.furnitureSales as number).toLocaleString("en-US")}`,
  },
  {
    accessor: "totalSales",
    label: "Total Sales",
    width: 200,
    isSortable: true,
    isEditable: true,
    pinned: "right",
    align: "center",
    cellRenderer: ({ row }) => `$${(row.totalSales as number).toLocaleString("en-US")}`,
  },
];
