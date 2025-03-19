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
    const renewalDate = `2025-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`;
    const signUpDate = `${year}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`;
    const lastLoginDay2 = Math.floor(Math.random() * 18) + 1;
    const lastLogin = `2025-03-${lastLoginDay2 < 10 ? `0${lastLoginDay2}` : lastLoginDay2}`;
    const [renewalYear, renewalMonth, renewalDay] = renewalDate.split("-");
    const [signUpYear, signUpMonth, signUpDay] = signUpDate.split("-");
    const [lastLoginYear, lastLoginMonth, lastLoginDay] = lastLogin.split("-");

    return {
      rowMeta: { rowId: rowId++, isExpanded: true },
      rowData: {
        tier,
        segment,
        monthlyRevenue: `$${monthlyRevenue.toLocaleString("en-US")}`,
        activeUsers: Math.floor(Math.random() * 5000) + 50,
        churnRate: `${(Math.random() * 5).toFixed(1)}%`,
        avgSessionTime: `${Math.floor(Math.random() * 60)}m`,
        renewalDate: `${parseInt(renewalMonth)}/${parseInt(renewalDay)}/${renewalYear}`,
        supportTickets: Math.floor(Math.random() * 100),
        signUpDate: `${parseInt(signUpMonth)}/${parseInt(signUpDay)}/${signUpYear}`,
        lastLogin: `${parseInt(lastLoginMonth)}/${parseInt(lastLoginDay)}/${lastLoginYear}`,
        featureUsage: features[Math.floor(Math.random() * features.length)],
        customerSatisfaction: `${(Math.random() * 5).toFixed(1)}/5`,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      },
    };
  });
};

export const SAAS_HEADERS: HeaderObject[] = [
  { accessor: "tier", label: "Tier", width: 120, isSortable: true, isEditable: true, align: "left" },
  { accessor: "segment", label: "Customer Segment", width: 250, isSortable: true, isEditable: true, align: "left" },
  {
    accessor: "monthlyRevenue",
    label: "Monthly Revenue ($)",
    width: 200,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  { accessor: "activeUsers", label: "Active Users", width: 150, isSortable: true, isEditable: true, align: "right" },
  { accessor: "churnRate", label: "Churn Rate", width: 150, isSortable: true, isEditable: true, align: "right" },
  {
    accessor: "avgSessionTime",
    label: "Avg Session Time",
    width: 180,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  { accessor: "renewalDate", label: "Renewal Date", width: 150, isSortable: true, isEditable: true, align: "left" },
  {
    accessor: "supportTickets",
    label: "Support Tickets",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  { accessor: "signUpDate", label: "Sign-Up Date", width: 150, isSortable: true, isEditable: true, align: "left" },
  { accessor: "lastLogin", label: "Last Login", width: 150, isSortable: true, isEditable: true, align: "left" },
  { accessor: "featureUsage", label: "Top Feature", width: 150, isSortable: true, isEditable: true, align: "left" },
  {
    accessor: "customerSatisfaction",
    label: "Satisfaction",
    width: 150,
    isSortable: true,
    isEditable: true,
    align: "right",
  },
  { accessor: "paymentMethod", label: "Payment Method", width: 180, isSortable: true, isEditable: true, align: "left" },
];
