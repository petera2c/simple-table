import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

export const generateSaaSData = (): Row[] => {
  const segments = [
    "Freelancers",
    "Small Business",
    "Startups",
    "Corporations",
    "Nonprofits",
  ];
  const features = ["Analytics", "Collaboration", "Storage", "API Access"];
  const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Crypto"];
  const tiers = ["Basic", "Pro", "Enterprise", "Premium"];
  let rowId = 0;

  return Array.from({ length: 200 }, () => {
    const segment = segments[Math.floor(Math.random() * segments.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const year = 2023 + Math.floor(Math.random() * 3);
    return {
      rowMeta: { rowId: rowId++ },
      rowData: {
        tier,
        segment,
        monthlyRevenue: Math.floor(Math.random() * 100000) + 1000,
        activeUsers: Math.floor(Math.random() * 5000) + 50,
        churnRate: `${(Math.random() * 5).toFixed(1)}%`,
        avgSessionTime: `${Math.floor(Math.random() * 60)}m`,
        renewalDate: `2025-${Math.floor(Math.random() * 12) + 1}-${
          Math.floor(Math.random() * 28) + 1
        }`,
        supportTickets: Math.floor(Math.random() * 100),
        signUpDate: `${year}-${Math.floor(Math.random() * 12) + 1}-${
          Math.floor(Math.random() * 28) + 1
        }`,
        lastLogin: `2025-03-${Math.floor(Math.random() * 18) + 1}`,
        featureUsage: features[Math.floor(Math.random() * features.length)],
        customerSatisfaction: `${(Math.random() * 5).toFixed(1)}/5`,
        paymentMethod:
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      },
    };
  });
};

export const SAAS_HEADERS: HeaderObject[] = [
  {
    accessor: "tier",
    label: "Tier",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "segment",
    label: "Customer Segment",
    width: 160,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "monthlyRevenue",
    label: "Monthly Revenue ($)",
    width: 160,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "activeUsers",
    label: "Active Users",
    width: 120,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "churnRate",
    label: "Churn Rate",
    width: 120,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "avgSessionTime",
    label: "Avg Session Time",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "renewalDate",
    label: "Renewal Date",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "supportTickets",
    label: "Support Tickets",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "signUpDate",
    label: "Sign-Up Date",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "lastLogin",
    label: "Last Login",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "featureUsage",
    label: "Top Feature",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "customerSatisfaction",
    label: "Satisfaction",
    width: 140,
    isSortable: true,
    isEditable: true,
  },
  {
    accessor: "paymentMethod",
    label: "Payment Method",
    width: 160,
    isSortable: true,
    isEditable: true,
  },
];
