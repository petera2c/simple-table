import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

export const generateRetailSalesData = (): Row[] => {
  const regions = Array.from({ length: 20 }, (_, i) => `Region ${i + 1}`);
  const storeNames = ["MegaMart", "ShopRite", "TrendyGoods", "ValueStore", "QuickBuy"];
  const cities = ["New York", "London", "Tokyo", "Sydney", "Paris", "Toronto", "Berlin"];
  let rowId = 0;

  return regions.map((region) => {
    const numStores = Math.floor(Math.random() * 7) + 2; // 2 to 8 children
    const children = Array.from({ length: numStores }, () => {
      const storeName = storeNames[Math.floor(Math.random() * storeNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const electronicsSales = Math.floor(Math.random() * 100000) + 5000;
      const clothingSales = Math.floor(Math.random() * 80000) + 4000;
      const groceriesSales = Math.floor(Math.random() * 120000) + 6000;
      const furnitureSales = Math.floor(Math.random() * 60000) + 3000;
      const totalSales = electronicsSales + clothingSales + groceriesSales + furnitureSales;
      const openingDate = `202${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 12) + 1}-${
        Math.floor(Math.random() * 28) + 1
      }`;
      const [openingYear, openingMonth, openingDay] = openingDate.split("-");

      return {
        rowMeta: { rowId: rowId++, isExpanded: true },
        rowData: {
          name: `${storeName} - ${city}`,
          city,
          employees: Math.floor(Math.random() * 200) + 10,
          squareFootage: Math.floor(Math.random() * 10000) + 1000,
          openingDate: `${parseInt(openingMonth)}/${parseInt(openingDay)}/${openingYear}`,
          customerRating: `${(Math.random() * 5).toFixed(1)}/5`,
          electronicsSales: `$${electronicsSales.toLocaleString("en-US")}`,
          clothingSales: `$${clothingSales.toLocaleString("en-US")}`,
          groceriesSales: `$${groceriesSales.toLocaleString("en-US")}`,
          furnitureSales: `$${furnitureSales.toLocaleString("en-US")}`,
          totalSales: `$${totalSales.toLocaleString("en-US")}`,
        },
      };
    });

    const regionTotalSales = children.reduce((sum, child) => {
      const totalSalesStr = (child.rowData.totalSales as string).replace("$", "").replace(/,/g, "");
      return sum + parseFloat(totalSalesStr);
    }, 0);

    return {
      rowMeta: { rowId: rowId++, isExpanded: true, children },
      rowData: {
        name: region,
        city: "-",
        employees: children.reduce((sum, child) => sum + (child.rowData.employees as number), 0),
        squareFootage: children.reduce((sum, child) => sum + (child.rowData.squareFootage as number), 0),
        openingDate: "-",
        customerRating: "-",
        electronicsSales: `$${children
          .reduce((sum, child) => {
            const salesStr = (child.rowData.electronicsSales as string).replace("$", "").replace(/,/g, "");
            return sum + parseFloat(salesStr);
          }, 0)
          .toLocaleString("en-US")}`,
        clothingSales: `$${children
          .reduce((sum, child) => {
            const salesStr = (child.rowData.clothingSales as string).replace("$", "").replace(/,/g, "");
            return sum + parseFloat(salesStr);
          }, 0)
          .toLocaleString("en-US")}`,
        groceriesSales: `$${children
          .reduce((sum, child) => {
            const salesStr = (child.rowData.groceriesSales as string).replace("$", "").replace(/,/g, "");
            return sum + parseFloat(salesStr);
          }, 0)
          .toLocaleString("en-US")}`,
        furnitureSales: `$${children
          .reduce((sum, child) => {
            const salesStr = (child.rowData.furnitureSales as string).replace("$", "").replace(/,/g, "");
            return sum + parseFloat(salesStr);
          }, 0)
          .toLocaleString("en-US")}`,
        totalSales: `$${regionTotalSales.toLocaleString("en-US")}`,
      },
    };
  });
};

export const RETAIL_SALES_HEADERS: HeaderObject[] = [
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
    accessor: "electronicsSales",
    label: "Electronics Sales ($)",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  {
    accessor: "clothingSales",
    label: "Clothing Sales ($)",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  {
    accessor: "groceriesSales",
    label: "Groceries Sales ($)",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  {
    accessor: "furnitureSales",
    label: "Furniture Sales ($)",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  {
    accessor: "totalSales",
    label: "Total Sales ($)",
    width: 200,
    isSortable: true,
    isEditable: true,
    pinned: "right",
    align: "right",
  },
];
