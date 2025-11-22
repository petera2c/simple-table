import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to ChartsExample - exported for reuse in stories and tests
export const chartsExampleDefaults = {
  columnReordering: true,
  columnResizing: true,
  selectableCells: true,
};

// Generate sample data with trends
const generateTrendData = (
  baseValue: number,
  volatility: number,
  length: number = 12
): number[] => {
  const data: number[] = [];
  let current = baseValue;

  for (let i = 0; i < length; i++) {
    const change = (Math.random() - 0.5) * volatility;
    current = Math.max(0, current + change);
    data.push(Math.round(current * 100) / 100);
  }

  return data;
};

// Export data for reuse in tests
export const CHARTS_EXAMPLE_DATA = [
  {
    id: 1,
    product: "Laptop Pro",
    category: "Electronics",
    monthlySales: generateTrendData(150, 30, 12),
    dailyViews: generateTrendData(500, 100, 30),
    quarterlyRevenue: [45000, 52000, 48000, 61000],
    weeklyOrders: [23, 28, 31, 25, 29, 35, 38],
    rating: 4.5,
  },
  {
    id: 2,
    product: "Wireless Mouse",
    category: "Accessories",
    monthlySales: generateTrendData(300, 50, 12),
    dailyViews: generateTrendData(800, 150, 30),
    quarterlyRevenue: [12000, 15000, 18000, 21000],
    weeklyOrders: [45, 52, 48, 61, 58, 67, 71],
    rating: 4.2,
  },
  {
    id: 3,
    product: "USB-C Cable",
    category: "Accessories",
    monthlySales: generateTrendData(500, 80, 12),
    dailyViews: generateTrendData(1200, 200, 30),
    quarterlyRevenue: [8000, 9000, 7500, 10000],
    weeklyOrders: [78, 82, 75, 88, 91, 85, 93],
    rating: 4.7,
  },
  {
    id: 4,
    product: 'Monitor 27"',
    category: "Electronics",
    monthlySales: generateTrendData(100, 25, 12),
    dailyViews: generateTrendData(400, 80, 30),
    quarterlyRevenue: [35000, 38000, 42000, 45000],
    weeklyOrders: [15, 18, 22, 19, 21, 24, 27],
    rating: 4.6,
  },
  {
    id: 5,
    product: "Keyboard Mechanical",
    category: "Accessories",
    monthlySales: generateTrendData(200, 40, 12),
    dailyViews: generateTrendData(600, 120, 30),
    quarterlyRevenue: [18000, 22000, 25000, 28000],
    weeklyOrders: [32, 38, 35, 42, 45, 48, 52],
    rating: 4.8,
  },
  {
    id: 6,
    product: "Webcam HD",
    category: "Electronics",
    monthlySales: generateTrendData(120, 30, 12),
    dailyViews: generateTrendData(450, 90, 30),
    quarterlyRevenue: [15000, 17000, 16000, 19000],
    weeklyOrders: [18, 22, 20, 25, 28, 31, 29],
    rating: 4.3,
  },
  {
    id: 7,
    product: "Headphones Bluetooth",
    category: "Audio",
    monthlySales: generateTrendData(250, 60, 12),
    dailyViews: generateTrendData(900, 180, 30),
    quarterlyRevenue: [28000, 32000, 35000, 38000],
    weeklyOrders: [42, 48, 45, 52, 55, 58, 62],
    rating: 4.4,
  },
  {
    id: 8,
    product: "Phone Case",
    category: "Accessories",
    monthlySales: generateTrendData(600, 100, 12),
    dailyViews: generateTrendData(1500, 250, 30),
    quarterlyRevenue: [5000, 6000, 7000, 8500],
    weeklyOrders: [95, 102, 98, 108, 115, 120, 125],
    rating: 4.1,
  },
];

const ChartsExample = (props: UniversalTableProps) => {
  // Use the exported data
  const rows = CHARTS_EXAMPLE_DATA;

  // Define headers with chart types
  const headers: HeaderObject[] = [
    {
      accessor: "id",
      label: "ID",
      width: 70,
      isSortable: true,
      type: "number",
    },
    {
      accessor: "product",
      label: "Product",
      width: 180,
      isSortable: true,
      type: "string",
    },
    {
      accessor: "category",
      label: "Category",
      width: 120,
      isSortable: true,
      type: "string",
    },
    {
      accessor: "monthlySales",
      label: "Monthly Sales (12mo)",
      width: 150,
      type: "lineAreaChart",
      tooltip: "Sales trend over the past 12 months",
      align: "center",
    },
    {
      accessor: "dailyViews",
      label: "Daily Views (30d)",
      width: 150,
      type: "lineAreaChart",
      tooltip: "Daily page views for the past 30 days (scaled 0-2000)",
      align: "center",
      chartOptions: {
        min: 0,
        max: 2000,
      },
    },
    {
      accessor: "quarterlyRevenue",
      label: "Quarterly Revenue",
      width: 140,
      type: "barChart",
      tooltip: "Revenue by quarter (scaled 0-70k)",
      align: "center",
      chartOptions: {
        min: 0,
        max: 70000,
      },
    },
    {
      accessor: "weeklyOrders",
      label: "Weekly Orders",
      width: 130,
      type: "barChart",
      tooltip: "Orders per week over the past 7 weeks",
      align: "center",
    },
    {
      accessor: "rating",
      label: "Rating",
      width: 80,
      isSortable: true,
      type: "number",
      align: "center",
    },
  ];

  return (
    <SimpleTable
      {...props}
      defaultHeaders={headers}
      rows={rows}
      rowIdAccessor="id"
      // Default settings for this example
      columnReordering={props.columnReordering ?? chartsExampleDefaults.columnReordering}
      columnResizing={props.columnResizing ?? chartsExampleDefaults.columnResizing}
      selectableCells={props.selectableCells ?? chartsExampleDefaults.selectableCells}
    />
  );
};

export default ChartsExample;
