import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

export const generateSaaSData = (): Row[] => {
  const segments = ["Freelancers", "Small Business", "Startups", "Corporations", "Nonprofits"];
  const features = ["Analytics", "Collaboration", "Storage", "API Access"];
  const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Crypto"];
  const tiers = ["Basic", "Pro", "Enterprise", "Premium"];
  let rowId = 0;

  return Array.from({ length: 200 }, () => {
    const segment = segments[Math.floor(Math.random() * segments.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const year = 2023 + Math.floor(Math.random() * 3);
    const monthlyRevenue = Math.floor(Math.random() * 100000) + 1000;
    const churnRate = parseFloat((Math.random() * 5).toFixed(1));
    const avgSessionTime = Math.floor(Math.random() * 60);
    const renewalDate = `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      "0"
    )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`;
    const signUpDate = `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      "0"
    )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`;
    const lastLoginDay2 = Math.floor(Math.random() * 18) + 1;
    const lastLogin = `2025-03-${lastLoginDay2 < 10 ? `0${lastLoginDay2}` : lastLoginDay2}`;
    const supportTickets = Math.floor(Math.random() * 100);
    const activeUsers = Math.floor(Math.random() * 5000) + 50;
    const customerSatisfaction = parseFloat((Math.random() * 5).toFixed(1));

    return {
      id: rowId++,
      tier,
      segment,
      monthlyRevenue,
      activeUsers,
      churnRate,
      avgSessionTime,
      renewalDate,
      supportTickets,
      signUpDate,
      lastLogin,
      featureUsage: features[Math.floor(Math.random() * features.length)],
      customerSatisfaction,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    };
  });
};

export const SAAS_HEADERS: HeaderObject[] = [
  {
    accessor: "tier",
    label: "Tier",
    width: 120,
    isSortable: true,
    isEditable: true,
    align: "left",
    pinned: "left",
    cellRenderer: ({ row, rowIndex, value }) => {
      return (
        <div>
          {rowIndex} {value as string}
        </div>
      );
    },
  },
  {
    accessor: "segment",
    label: "Customer Segment",
    width: 250,
    isSortable: true,
    isEditable: true,
    align: "left",
  },
  {
    accessor: "monthlyRevenue",
    label: "Monthly Revenue",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `$${(row.monthlyRevenue as number).toLocaleString("en-US")}`,
  },
  {
    accessor: "activeUsers",
    label: "Active Users",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  {
    accessor: "churnRate",
    label: "Churn Rate",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `${(row.churnRate as number).toFixed(1)}%`,
  },
  {
    accessor: "avgSessionTime",
    label: "Avg Session Time",
    width: 180,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `${row.avgSessionTime}m`,
  },
  {
    accessor: "renewalDate",
    label: "Renewal Date",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
    cellRenderer: ({ row }) => {
      const date = new Date(row.renewalDate as string);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    accessor: "supportTickets",
    label: "Support Tickets",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  {
    accessor: "signUpDate",
    label: "Sign-Up Date",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
    cellRenderer: ({ row }) => {
      const date = new Date(row.signUpDate as string);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    accessor: "lastLogin",
    label: "Last Login",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
    cellRenderer: ({ row }) => {
      const date = new Date(row.lastLogin as string);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    accessor: "featureUsage",
    label: "Top Feature",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "left",
  },
  {
    accessor: "customerSatisfaction",
    label: "Satisfaction",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
    cellRenderer: ({ row }) => `${(row.customerSatisfaction as number).toFixed(1)}/5`,
  },
  {
    accessor: "paymentMethod",
    label: "Payment Method",
    width: 180,
    isSortable: true,
    isEditable: true,
    align: "left",
  },
];
