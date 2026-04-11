// ES Module version of the billing data generator
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions
const randomBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate a random date between two dates
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Current date and last year date
const currentDate = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

// Generate random account name
const generateAccountName = (): string => {
  const companies = [
    "Acme Corp",
    "Globex",
    "Soylent",
    "Initech",
    "Umbrella",
    "Stark Industries",
    "Wayne Enterprises",
    "Cyberdyne",
    "Massive Dynamic",
    "Aperture Science",
    "Virtucon",
    "LexCorp",
    "Weyland-Yutani",
    "Oscorp",
    "Dharma Initiative",
  ];

  const suffixes = [
    "Inc",
    "LLC",
    "Corp",
    "Industries",
    "Technologies",
    "Solutions",
    "Software",
    "Group",
  ];

  if (Math.random() > 0.5) {
    return `${randomChoice(companies)} ${randomChoice(suffixes)}`;
  } else {
    return randomChoice(companies);
  }
};

// Generate charge description
const generateChargeDescription = (): string => {
  const tiers = ["Small", "Medium", "Large", "Basic", "Premium", "Enterprise", "Standard"];
  const types = [
    "Installation",
    "Setup",
    "Support",
    "Maintenance",
    "Usage",
    "License",
    "Service",
    "Access",
    "Storage",
    "Processing",
  ];

  return `${randomChoice(tiers)} - ${randomChoice(types)}`;
};

// Generate monthly data for a row - only 2024 data
const generateMonthlyData = (startMonth: number, amount: number): Record<string, number> => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const year = 2024;

  // For charges, distribute the amount over the months
  let remainingAmount = amount;
  const monthlyValues: Record<string, number> = {};
  const monthlyRevenue: Record<string, number> = {};
  const monthlyBalance: Record<string, number> = {};

  // Ensure all 2024 months have data
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const key = `month_${months[monthIndex]}_${year}`;
    const revenueKey = `revenue_${months[monthIndex]}_${year}`;
    const balanceKey = `balance_${months[monthIndex]}_${year}`;

    // Calculate monthly amount based on remaining budget
    // Use a balanced distribution with less variance
    const baseMonthlyAmount = remainingAmount / (12 - monthIndex);
    const variability = 0.3; // 30% variability
    const variance = baseMonthlyAmount * variability * (Math.random() * 2 - 1);
    let monthlyAmount = Math.min(remainingAmount, baseMonthlyAmount + variance);

    // Ensure we don't exceed the remaining amount and round to 2 decimals
    monthlyAmount = Math.round(Math.min(remainingAmount, monthlyAmount) * 100) / 100;

    // Ensure non-zero values for all 2024 months
    if (monthlyAmount < 1 && remainingAmount > 0) {
      monthlyAmount = Math.round((1 + Math.random() * 10) * 100) / 100;
    }

    remainingAmount -= monthlyAmount;
    monthlyValues[key] = monthlyAmount;

    // Split the monthly amount between revenue and balance
    // Revenue is typically 70-95% of the amount
    const revenuePercentage = 0.7 + Math.random() * 0.25;
    monthlyRevenue[revenueKey] = Math.round(monthlyValues[key] * revenuePercentage * 100) / 100;
    monthlyBalance[balanceKey] =
      Math.round((monthlyValues[key] - monthlyRevenue[revenueKey]) * 100) / 100;
  }

  // If we still have remaining amount, distribute it
  if (remainingAmount > 0.01) {
    // Add it to a random month
    const randomMonthIndex = randomBetween(0, 11);
    const randomMonthKey = `month_${months[randomMonthIndex]}_${year}`;
    const randomRevenueKey = `revenue_${months[randomMonthIndex]}_${year}`;
    const randomBalanceKey = `balance_${months[randomMonthIndex]}_${year}`;

    monthlyValues[randomMonthKey] += remainingAmount;

    // Recalculate revenue and balance
    const revenuePercentage = 0.7 + Math.random() * 0.25;
    monthlyRevenue[randomRevenueKey] =
      Math.round(monthlyValues[randomMonthKey] * revenuePercentage * 100) / 100;
    monthlyBalance[randomBalanceKey] =
      Math.round((monthlyValues[randomMonthKey] - monthlyRevenue[randomRevenueKey]) * 100) / 100;
  }

  return {
    ...monthlyValues,
    ...monthlyRevenue,
    ...monthlyBalance,
  };
};

// Calculate revenue recognition
const calculateRevenueRecognition = (
  amount: number,
  createdDate: Date
): { recognizedRevenue: number; deferredRevenue: number } => {
  const diffMonths =
    currentDate.getMonth() -
    createdDate.getMonth() +
    12 * (currentDate.getFullYear() - createdDate.getFullYear());

  // Calculate how much revenue has been recognized based on time elapsed
  const recognitionPeriod = randomBetween(1, 12); // Revenue is recognized over 1-12 months
  const recognizedPercentage = Math.min(1, diffMonths / recognitionPeriod);
  const recognizedRevenue = Math.round(amount * recognizedPercentage * 100) / 100;
  const deferredRevenue = Math.round((amount - recognizedRevenue) * 100) / 100;

  return {
    recognizedRevenue,
    deferredRevenue,
  };
};

interface ChargeData {
  id: string;
  type: string;
  name: string;
  createdDate: string;
  amount: number;
  recognizedRevenue: number;
  deferredRevenue: number;
  [key: string]: any; // For monthly data fields
}

interface InvoiceData {
  id: string;
  type: string;
  name: string;
  status: string;
  createdDate: string;
  dueDate: string;
  // Remove aggregated fields - table will calculate these automatically
  charges: ChargeData[];
}

interface AccountData {
  id: string;
  type: string;
  name: string;
  status: string;
  createdDate: string;
  // Remove aggregated fields - table will calculate these automatically
  invoices: InvoiceData[];
}

// Generate billing data with accounts -> invoices -> charges
// Note: Due to nested structure, generating fewer accounts but with full hierarchy
// This creates approximately 100,000 total leaf rows (charges) when fully expanded
const generateBillingData = (): AccountData[] => {
  let rowId = 0;
  const accountRows: AccountData[] = [];

  // Invoice statuses and probabilities
  const invoiceStatuses = ["paid", "overdue", "pending", "partial", "cancelled"];
  const invoiceStatusProbs = [0.6, 0.1, 0.15, 0.1, 0.05]; // 60% paid, 10% overdue, etc.

  // Account statuses
  const accountStatuses = ["active", "pending", "cancelled"];
  const accountStatusProbs = [0.85, 0.1, 0.05]; // 85% active, 10% pending, 5% cancelled

  // Calculate accounts needed for ~18,000 total leaf rows (charges)
  // Average: ~10 invoices per account * 3.5 charges per invoice (1-6 range) = 35 charges per account
  // 18,000 / 35 ≈ 300 accounts
  const accountCount = 300;

  for (let a = 0; a < accountCount; a++) {
    // Generate account data
    const accountName = generateAccountName();
    const accountId = `ACC-${rowId++}`;

    // Create a date in 2024
    const accountCreatedDate = new Date(2024, randomBetween(0, 3), randomBetween(1, 28));

    // Determine account status based on probability
    let accountStatus = "active";
    const statusRoll = Math.random();
    let cumProb = 0;

    for (let i = 0; i < accountStatuses.length; i++) {
      cumProb += accountStatusProbs[i];
      if (statusRoll <= cumProb) {
        accountStatus = accountStatuses[i];
        break;
      }
    }

    // Generate invoices for this account (~10 invoices)
    const invoiceCount = randomBetween(8, 12);
    const invoiceChildren: InvoiceData[] = [];

    for (let i = 0; i < invoiceCount; i++) {
      // Create invoice date in 2024
      const invoiceMonth = randomBetween(0, 11);
      const invoiceCreatedDate = new Date(2024, invoiceMonth, randomBetween(1, 28));

      // Generate random due date (10-30 days after invoice date)
      const dueDate = new Date(invoiceCreatedDate);
      dueDate.setDate(dueDate.getDate() + randomBetween(10, 30));

      const invoiceNumber = randomBetween(100, 999);
      const invoiceId = `INV-${rowId++}`;
      // Use I-XXX format for invoice name
      const invoiceName = `I-${invoiceNumber}`;

      const invoiceAmount = randomBetween(1000, 20000) + Math.random();
      const invoiceAmountRounded = invoiceAmount;

      // Determine invoice status based on probability
      let invoiceStatus = "paid";
      const statusRoll = Math.random();
      let cumProb = 0;

      for (let i = 0; i < invoiceStatuses.length; i++) {
        cumProb += invoiceStatusProbs[i];
        if (statusRoll <= cumProb) {
          invoiceStatus = invoiceStatuses[i];
          break;
        }
      }

      // Generate charges for this invoice (1-6 charges per invoice)
      const chargeCount = randomBetween(1, 6);
      const chargeChildren: ChargeData[] = [];
      const chargeTotalAmount = invoiceAmountRounded;
      let currentChargeTotal = 0;

      for (let c = 0; c < chargeCount; c++) {
        // Calculate charge amount (divide invoice amount among charges)
        let chargeAmount: number;

        if (c === chargeCount - 1) {
          // Last charge gets the remainder to ensure sum equals invoice amount
          chargeAmount = chargeTotalAmount - currentChargeTotal;
        } else {
          // Random portion of remaining amount
          const remainingForCharges = chargeTotalAmount - currentChargeTotal;
          const portion = Math.random() * 0.7; // Take up to 70% of what's left
          chargeAmount = Math.round(remainingForCharges * portion * 100) / 100;
          currentChargeTotal += chargeAmount;
        }

        // Calculate revenue recognition
        const { recognizedRevenue, deferredRevenue } = calculateRevenueRecognition(
          chargeAmount,
          invoiceCreatedDate
        );

        // Generate monthly distribution for this charge - only 2024 data
        const monthlyData = generateMonthlyData(invoiceMonth, chargeAmount);
        const chargeId = `CHG-${rowId++}`;

        // Create charge row - this is the leaf data with actual values
        chargeChildren.push({
          id: chargeId,
          type: "charge",
          name: generateChargeDescription(),
          createdDate: invoiceCreatedDate.toISOString(),
          amount: chargeAmount,
          recognizedRevenue,
          deferredRevenue,
          ...monthlyData,
        });
      }

      // Create invoice row - no aggregated values, table will calculate them
      invoiceChildren.push({
        id: invoiceId,
        type: "invoice",
        name: invoiceName,
        status: invoiceStatus,
        createdDate: invoiceCreatedDate.toISOString(),
        dueDate: dueDate.toISOString(),
        charges: chargeChildren,
      });
    }

    // Create account row - no aggregated values, table will calculate them
    accountRows.push({
      id: accountId,
      type: "account",
      name: accountName,
      status: accountStatus,
      createdDate: accountCreatedDate.toISOString(),
      invoices: invoiceChildren,
    });
  }

  return accountRows;
};

// Run the generation and save to a file
async function saveDataToFile(): Promise<void> {
  console.log("Generating realistic billing dataset...");
  const data = generateBillingData();
  // Count total rows including nested invoices and charges
  let totalRows = data.length;
  data.forEach((account) => {
    totalRows += account.invoices.length;
    account.invoices.forEach((invoice: any) => {
      totalRows += invoice.charges.length;
    });
  });
  console.log(
    `Generated ${data.length} accounts with ~${totalRows} total rows (including invoices and charges)`
  );

  const filePath = path.join(__dirname, "../public/data/billing-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

// Execute the function
saveDataToFile();
