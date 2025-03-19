import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

export const generateFinanceData = (): Row[] => {
  const sectors = Array.from({ length: 20 }, (_, i) => `Sector ${i + 1}`);
  const companyPrefixes = ["Tech", "Fin", "Health", "Energy", "Goods"];
  const companySuffixes = ["Corp", "Inc", "Ltd", "Group", "Solutions"];
  const locations = ["New York", "London", "Tokyo", "Shanghai", "San Francisco"];
  let rowId = 0;

  return sectors.map((sector) => {
    const numCompanies = Math.floor(Math.random() * 7) + 2; // 2 to 8 children
    const children = Array.from({ length: numCompanies }, () => {
      const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
      const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
      const year = 1950 + Math.floor(Math.random() * 75);
      const price = (Math.random() * 500 + 10).toFixed(2);
      const marketCap = (Math.random() * 3).toFixed(1);
      const revenue = (Math.random() * 100).toFixed(1);
      const lastUpdatedDay = Math.floor(Math.random() * 18) + 1;
      const lastUpdated = `2025-03-${lastUpdatedDay < 10 ? `0${lastUpdatedDay}` : lastUpdatedDay}`;
      const [lastUpdatedYear, lastUpdatedMonth, lastUpdatedDate] = lastUpdated.split("-");

      return {
        rowMeta: { rowId: rowId++, isExpanded: true },
        rowData: {
          sectorName: sector,
          ticker: `${sector.slice(0, 2).toUpperCase()}${Math.floor(Math.random() * 1000)}`,
          companyName: `${prefix} ${suffix}`,
          price: `$${parseFloat(price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          marketCap: `$${parseFloat(marketCap).toLocaleString("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}T`,
          peRatio: (Math.random() * 40 + 5).toFixed(1),
          dividendYield: `${(Math.random() * 5).toFixed(2)}%`,
          volume: `${Math.floor(Math.random() * 100)}M`,
          lastUpdated: `${lastUpdatedMonth}/${lastUpdatedDate}/${lastUpdatedYear}`,
          revenue: `$${parseFloat(revenue).toLocaleString("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}B`,
          employees: Math.floor(Math.random() * 100000) + 1000,
          founded: `${year}`,
          hqLocation: locations[Math.floor(Math.random() * locations.length)],
          analystRating: `${(Math.random() * 5).toFixed(1)}/5`,
        },
      };
    });

    const sectorTotalEmployees = children.reduce((sum, child) => sum + (child.rowData.employees as number), 0);
    const sectorTotalRevenue = children
      .reduce((sum, child) => {
        const revenueStr = (child.rowData.revenue as string).replace("$", "").replace("B", "");
        return sum + parseFloat(revenueStr);
      }, 0)
      .toFixed(1);

    return {
      rowMeta: { rowId: rowId++, isExpanded: true, children },
      rowData: {
        sectorName: sector,
        ticker: "-",
        companyName: "-",
        price: "-",
        marketCap: "-",
        peRatio: "-",
        dividendYield: "-",
        volume: "-",
        lastUpdated: "-",
        revenue: `$${parseFloat(sectorTotalRevenue).toLocaleString("en-US", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}B`,
        employees: sectorTotalEmployees,
        founded: "-",
        hqLocation: "-",
        analystRating: "-",
      },
    };
  });
};

export const FINANCE_HEADERS: HeaderObject[] = [
  {
    accessor: "sectorName",
    label: "Sector",
    width: 150,
    expandable: true,
    isSortable: true,
    isEditable: true,
    align: "left",
  },
  { accessor: "ticker", label: "Ticker", width: 120, isSortable: true, isEditable: true, align: "left" },
  { accessor: "companyName", label: "Company Name", width: 250, isSortable: true, isEditable: true, align: "left" },
  { accessor: "price", label: "Price ($)", width: 120, isSortable: true, isEditable: true, align: "right" },
  { accessor: "marketCap", label: "Market Cap", width: 150, isSortable: true, isEditable: true, align: "right" },
  { accessor: "peRatio", label: "P/E Ratio", width: 120, isSortable: true, isEditable: true, align: "right" },
  {
    accessor: "dividendYield",
    label: "Dividend Yield",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  { accessor: "volume", label: "Volume", width: 120, isSortable: true, isEditable: true, align: "right" },
  { accessor: "lastUpdated", label: "Last Updated", width: 150, isSortable: true, isEditable: true, align: "left" },
  { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, isEditable: true, align: "right" },
  { accessor: "employees", label: "Employees", width: 120, isSortable: true, isEditable: true, align: "right" },
  { accessor: "founded", label: "Founded", width: 120, isSortable: true, isEditable: true, align: "left" },
  { accessor: "hqLocation", label: "HQ Location", width: 180, isSortable: true, isEditable: true, align: "left" },
  {
    accessor: "analystRating",
    label: "Analyst Rating",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
];
