import SimpleTable from "../../components/simple-table/SimpleTable";
import HeaderObject from "../../types/HeaderObject";
import Theme from "../../types/Theme";

const headers: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 200, expandable: true, type: "string" },
  {
    accessor: "followers",
    label: "Followers",
    width: 120,
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }) => {
      const value = row.followers;
      if (typeof value === "number") {
        return value >= 1000000
          ? `${(value / 1000000).toFixed(1)}M`
          : value >= 1000
          ? `${(value / 1000).toFixed(0)}K`
          : value.toString();
      }
      return "";
    },
  },
  {
    accessor: "revenue",
    label: "Monthly Revenue",
    width: 140,
    type: "string",
    aggregation: {
      type: "sum",
      parseValue: (value: string) => {
        // Parse values like "$15.5K" to numbers
        const numericValue = parseFloat(value.replace(/[$K]/g, ""));
        return isNaN(numericValue) ? 0 : numericValue;
      },
    },
    cellRenderer: ({ row }) => {
      const value = row.revenue;
      if (typeof value === "number") {
        // This is an aggregated value, format as currency
        return `$${value.toFixed(1)}K`;
      }
      if (typeof value === "string") {
        // This is original string value, return as-is
        return value;
      }
      return "";
    },
  },
  {
    accessor: "rating",
    label: "Rating",
    width: 100,
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }) => {
      const value = row.rating;
      if (typeof value === "number") {
        return `${value.toFixed(1)} ⭐`;
      }
      return "";
    },
  },
  {
    accessor: "contentCount",
    label: "Content",
    width: 90,
    type: "number",
    aggregation: { type: "sum" },
  },
  {
    accessor: "avgViewTime",
    label: "Avg Watch Time",
    width: 130,
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }) => {
      const value = row.avgViewTime;
      if (typeof value === "number") {
        return `${Math.round(value)}min`;
      }
      return "";
    },
  },
  { accessor: "status", label: "Status", width: 120, type: "string" },
];

// Streaming platform data with categories and creators
const rows = [
  // StreamFlix Platform
  {
    id: 1,
    name: "StreamFlix",
    status: "Leading Platform",
    categories: [
      {
        id: 101,
        name: "Gaming",
        status: "Trending",
        creators: [
          {
            id: 1001,
            name: "PixelMaster",
            followers: 2800000,
            revenue: "$45.2K",
            rating: 4.8,
            contentCount: 328,
            avgViewTime: 45,
            status: "Partner",
          },
          {
            id: 1002,
            name: "RetroGamer93",
            followers: 1200000,
            revenue: "$28.5K",
            rating: 4.6,
            contentCount: 156,
            avgViewTime: 52,
            status: "Partner",
          },
          {
            id: 1003,
            name: "SpeedrunQueen",
            followers: 890000,
            revenue: "$22.1K",
            rating: 4.9,
            contentCount: 89,
            avgViewTime: 38,
            status: "Partner",
          },
        ],
      },
      {
        id: 102,
        name: "Music & Arts",
        status: "Growing",
        creators: [
          {
            id: 1101,
            name: "MelodyMaker",
            followers: 1650000,
            revenue: "$31.8K",
            rating: 4.7,
            contentCount: 203,
            avgViewTime: 28,
            status: "Partner",
          },
          {
            id: 1102,
            name: "DigitalArtist",
            followers: 720000,
            revenue: "$18.9K",
            rating: 4.5,
            contentCount: 127,
            avgViewTime: 35,
            status: "Affiliate",
          },
          {
            id: 1103,
            name: "JazzVibez",
            followers: 430000,
            revenue: "$12.4K",
            rating: 4.8,
            contentCount: 78,
            avgViewTime: 42,
            status: "Affiliate",
          },
        ],
      },
      {
        id: 103,
        name: "Cooking & Lifestyle",
        status: "Stable",
        creators: [
          {
            id: 1201,
            name: "ChefExtraordinaire",
            followers: 3200000,
            revenue: "$58.7K",
            rating: 4.9,
            contentCount: 245,
            avgViewTime: 22,
            status: "Partner",
          },
          {
            id: 1202,
            name: "HomeDecorGuru",
            followers: 980000,
            revenue: "$19.3K",
            rating: 4.4,
            contentCount: 134,
            avgViewTime: 18,
            status: "Affiliate",
          },
        ],
      },
    ],
  },
  // WatchNow Platform
  {
    id: 2,
    name: "WatchNow",
    status: "Competitor",
    categories: [
      {
        id: 201,
        name: "Tech Reviews",
        status: "Hot",
        creators: [
          {
            id: 2001,
            name: "TechGuru2024",
            followers: 2100000,
            revenue: "$42.6K",
            rating: 4.6,
            contentCount: 189,
            avgViewTime: 35,
            status: "Partner",
          },
          {
            id: 2002,
            name: "GadgetWhisperer",
            followers: 1450000,
            revenue: "$29.1K",
            rating: 4.7,
            contentCount: 156,
            avgViewTime: 31,
            status: "Partner",
          },
          {
            id: 2003,
            name: "CodeReviewer",
            followers: 680000,
            revenue: "$16.8K",
            rating: 4.8,
            contentCount: 94,
            avgViewTime: 48,
            status: "Affiliate",
          },
        ],
      },
      {
        id: 202,
        name: "Fitness & Health",
        status: "Growing",
        creators: [
          {
            id: 2101,
            name: "FitnessPhenom",
            followers: 1890000,
            revenue: "$35.4K",
            rating: 4.5,
            contentCount: 312,
            avgViewTime: 25,
            status: "Partner",
          },
          {
            id: 2102,
            name: "YogaMaster",
            followers: 1100000,
            revenue: "$21.7K",
            rating: 4.9,
            contentCount: 178,
            avgViewTime: 33,
            status: "Partner",
          },
        ],
      },
    ],
  },
  // CreativeSpace Platform
  {
    id: 3,
    name: "CreativeSpace",
    status: "Emerging",
    categories: [
      {
        id: 301,
        name: "Photography",
        status: "Niche",
        creators: [
          {
            id: 3001,
            name: "LensArtist",
            followers: 750000,
            revenue: "$18.2K",
            rating: 4.7,
            contentCount: 145,
            avgViewTime: 27,
            status: "Partner",
          },
          {
            id: 3002,
            name: "NatureShooter",
            followers: 520000,
            revenue: "$13.5K",
            rating: 4.6,
            contentCount: 98,
            avgViewTime: 29,
            status: "Affiliate",
          },
          {
            id: 3003,
            name: "PortraitPro",
            followers: 390000,
            revenue: "$9.8K",
            rating: 4.8,
            contentCount: 67,
            avgViewTime: 24,
            status: "Affiliate",
          },
        ],
      },
      {
        id: 302,
        name: "Animation & VFX",
        status: "Specialized",
        creators: [
          {
            id: 3101,
            name: "3DAnimator",
            followers: 640000,
            revenue: "$15.9K",
            rating: 4.9,
            contentCount: 58,
            avgViewTime: 41,
            status: "Partner",
          },
          {
            id: 3102,
            name: "VFXWizard",
            followers: 480000,
            revenue: "$12.3K",
            rating: 4.7,
            contentCount: 42,
            avgViewTime: 38,
            status: "Affiliate",
          },
        ],
      },
    ],
  },
  // EduStream Platform
  {
    id: 4,
    name: "EduStream",
    status: "Educational Focus",
    categories: [
      {
        id: 401,
        name: "Science & Math",
        status: "Educational",
        creators: [
          {
            id: 4001,
            name: "MathExplainer",
            followers: 1340000,
            revenue: "$26.8K",
            rating: 4.8,
            contentCount: 234,
            avgViewTime: 36,
            status: "Partner",
          },
          {
            id: 4002,
            name: "PhysicsPhun",
            followers: 890000,
            revenue: "$19.4K",
            rating: 4.6,
            contentCount: 167,
            avgViewTime: 42,
            status: "Partner",
          },
          {
            id: 4003,
            name: "ChemistryLab",
            followers: 560000,
            revenue: "$14.2K",
            rating: 4.7,
            contentCount: 89,
            avgViewTime: 33,
            status: "Affiliate",
          },
        ],
      },
      {
        id: 402,
        name: "History & Culture",
        status: "Informative",
        creators: [
          {
            id: 4101,
            name: "HistoryBuff",
            followers: 920000,
            revenue: "$18.6K",
            rating: 4.5,
            contentCount: 145,
            avgViewTime: 39,
            status: "Partner",
          },
          {
            id: 4102,
            name: "CultureExplorer",
            followers: 670000,
            revenue: "$15.1K",
            rating: 4.8,
            contentCount: 112,
            avgViewTime: 45,
            status: "Affiliate",
          },
        ],
      },
    ],
  },
];

const AggregateFunctionsDemo = ({
  height = "400px",
  theme,
}: {
  height?: string;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      columnResizing
      defaultHeaders={headers}
      rows={rows}
      rowGrouping={["categories", "creators"]}
      rowIdAccessor="id"
      height={height}
      theme={theme}
    />
  );
};

export default AggregateFunctionsDemo;
