import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

export const generateFinanceData = (): Row[] => {
  const sectors = Array.from({ length: 20 }, (_, i) => `Sector ${i + 1}`); // 20 top-level sectors
  const companyPrefixes = ["Tech", "Fin", "Health", "Energy", "Goods"];
  const companySuffixes = ["Corp", "Inc", "Ltd", "Group", "Solutions"];
  const locations = [
    "New York",
    "London",
    "Tokyo",
    "Shanghai",
    "San Francisco",
  ];
  let rowId = 0;

  return sectors.map((sector) => {
    const numCompanies = Math.floor(Math.random() * 11) + 5; // 5–15 companies per sector
    const children = Array.from({ length: numCompanies }, () => {
      const prefix =
        companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
      const suffix =
        companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
      const year = 1950 + Math.floor(Math.random() * 75);
      return {
        rowMeta: { rowId: rowId++ },
        rowData: {
          ticker: `${sector.slice(0, 2).toUpperCase()}${Math.floor(
            Math.random() * 1000
          )}`,
          companyName: `${prefix} ${suffix}`,
          price: (Math.random() * 500 + 10).toFixed(2),
          marketCap: `${(Math.random() * 3).toFixed(1)}T`,
          peRatio: (Math.random() * 40 + 5).toFixed(1),
          dividendYield: `${(Math.random() * 5).toFixed(2)}%`,
          volume: `${Math.floor(Math.random() * 100)}M`,
          lastUpdated: `2025-03-${Math.floor(Math.random() * 18) + 1}`,
          revenue: `${(Math.random() * 100).toFixed(1)}B`,
          employees: Math.floor(Math.random() * 100000) + 1000,
          founded: `${year}`,
          hqLocation: locations[Math.floor(Math.random() * locations.length)],
          analystRating: `${(Math.random() * 5).toFixed(1)}/5`,
        },
      };
    });

    return {
      rowMeta: {
        rowId: rowId++,
        isExpanded: false,
        children,
      },
      rowData: {
        sectorName: sector,
      },
    };
  });
};

export const FINANCE_HEADERS: HeaderObject[] = [
  {
    accessor: "sectorName",
    label: "Sector",
    width: 140,
    expandable: true,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "ticker",
    label: "Ticker",
    width: 100,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "companyName",
    label: "Company Name",
    width: 180,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "price",
    label: "Price ($)",
    width: 120,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "marketCap",
    label: "Market Cap",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "peRatio",
    label: "P/E Ratio",
    width: 120,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "dividendYield",
    label: "Dividend Yield",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "volume",
    label: "Volume",
    width: 120,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "lastUpdated",
    label: "Last Updated",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "revenue",
    label: "Revenue",
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
    accessor: "founded",
    label: "Founded",
    width: 120,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "hqLocation",
    label: "HQ Location",
    width: 160,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "analystRating",
    label: "Analyst Rating",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
];
