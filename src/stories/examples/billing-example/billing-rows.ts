import Row from "../../../types/Row";

// Utility functions
const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate a random date between two dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Current date and last year date
const currentDate = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

// Generate random account name
const generateAccountName = () => {
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
const generateChargeDescription = () => {
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

// Generate monthly data for a row
const generateMonthlyData = (
  startMonth: number,
  startYear: number,
  amount: number,
  monthsToDistribute: number = 12
) => {
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
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // For charges, distribute the amount over the months
  let remainingAmount = amount;
  const monthlyValues: Record<string, number> = {};

  // New revenue and balance records
  const monthlyRevenue: Record<string, number> = {};
  const monthlyBalance: Record<string, number> = {};

  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    const key = `month_${months[monthIndex]}_${year}`;
    const revenueKey = `revenue_${months[monthIndex]}_${year}`;
    const balanceKey = `balance_${months[monthIndex]}_${year}`;

    // If this month is before the start date or we've already distributed all months
    const isBeforeStart = year < startYear || (year === startYear && monthIndex < startMonth);

    if (isBeforeStart || i >= monthsToDistribute) {
      monthlyValues[key] = 0;
      monthlyRevenue[revenueKey] = 0;
      monthlyBalance[balanceKey] = 0;
      continue;
    }

    // For the last month, use all remaining amount
    if (i === monthsToDistribute - 1) {
      monthlyValues[key] = parseFloat(remainingAmount.toFixed(2));
    } else {
      // Distribute with some randomness
      const variability = 0.2; // 20% variability
      const baseMonthlyAmount = remainingAmount / (monthsToDistribute - i);
      const variance = baseMonthlyAmount * variability * (Math.random() * 2 - 1);
      let monthlyAmount = Math.min(remainingAmount, baseMonthlyAmount + variance);

      // Ensure we don't exceed the remaining amount and round to 2 decimals
      monthlyAmount = parseFloat(Math.min(remainingAmount, monthlyAmount).toFixed(2));
      remainingAmount -= monthlyAmount;
      monthlyValues[key] = monthlyAmount;
    }

    // Split the monthly amount between revenue and balance
    // Revenue is typically 70-95% of the amount
    const revenuePercentage = 0.7 + Math.random() * 0.25;
    monthlyRevenue[revenueKey] = parseFloat((monthlyValues[key] * revenuePercentage).toFixed(2));
    monthlyBalance[balanceKey] = parseFloat(
      (monthlyValues[key] - monthlyRevenue[revenueKey]).toFixed(2)
    );
  }

  return {
    ...monthlyValues,
    ...monthlyRevenue,
    ...monthlyBalance,
  };
};

// Generate revenue recognition data
const calculateRevenueRecognition = (amount: number, createdDate: Date) => {
  const diffMonths =
    currentDate.getMonth() -
    createdDate.getMonth() +
    12 * (currentDate.getFullYear() - createdDate.getFullYear());

  // Calculate how much revenue has been recognized based on time elapsed
  const recognitionPeriod = randomBetween(1, 12); // Revenue is recognized over 1-12 months
  const recognizedPercentage = Math.min(1, diffMonths / recognitionPeriod);
  const recognizedRevenue = parseFloat((amount * recognizedPercentage).toFixed(2));
  const deferredRevenue = parseFloat((amount - recognizedRevenue).toFixed(2));

  return {
    recognizedRevenue,
    deferredRevenue,
  };
};

// Generate billing data with accounts -> invoices -> charges
export const generateBillingData = (): Row[] => {
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
  let rowId = 0;
  const accountRows: Row[] = [];

  // Invoice statuses and probabilities
  const invoiceStatuses = ["paid", "overdue", "pending", "partial", "cancelled"];
  const invoiceStatusProbs = [0.6, 0.1, 0.15, 0.1, 0.05]; // 60% paid, 10% overdue, etc.

  // Account statuses
  const accountStatuses = ["active", "pending", "cancelled"];
  const accountStatusProbs = [0.85, 0.1, 0.05]; // 85% active, 10% pending, 5% cancelled

  // Generate 5-8 accounts
  const accountCount = randomBetween(5, 8);

  for (let a = 0; a < accountCount; a++) {
    // Generate account data
    const accountName = generateAccountName();
    const accountId = `ACC-${100000 + randomBetween(1, 99999)}`;
    const accountCreatedDate = randomDate(oneYearAgo, currentDate);

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

    // Generate invoices for this account
    const invoiceCount = randomBetween(3, 8);
    const invoiceChildren: Row[] = [];
    let accountTotal = 0;
    let accountRemaining = 0;
    let accountRecognizedRevenue = 0;
    let accountDeferredRevenue = 0;

    for (let i = 0; i < invoiceCount; i++) {
      // Create invoice with date after account creation but within the last year
      const earliestDate = new Date(Math.max(oneYearAgo.getTime(), accountCreatedDate.getTime()));
      const invoiceCreatedDate = randomDate(earliestDate, currentDate);
      const invoiceMonth = invoiceCreatedDate.getMonth();
      const invoiceYear = invoiceCreatedDate.getFullYear();

      // Generate random due date (10-30 days after invoice date)
      const dueDate = new Date(invoiceCreatedDate);
      dueDate.setDate(dueDate.getDate() + randomBetween(10, 30));

      const invoiceNumber = randomBetween(100, 999);
      const invoiceId = `INV-${invoiceNumber}`;
      // Use I-XXX format for invoice name
      const invoiceName = `I-${invoiceNumber}`;

      const invoiceAmount = randomBetween(500, 10000) + Math.random();
      const invoiceAmountRounded = parseFloat(invoiceAmount.toFixed(2));

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

      // Calculate remaining amount based on status
      let remainingAmount = 0;
      switch (invoiceStatus) {
        case "paid":
          remainingAmount = 0;
          break;
        case "overdue":
        case "pending":
          remainingAmount = invoiceAmountRounded;
          break;
        case "partial":
          remainingAmount = parseFloat((invoiceAmountRounded * Math.random() * 0.8).toFixed(2));
          break;
        case "cancelled":
          remainingAmount = 0;
          break;
      }

      // Generate charges for this invoice
      const chargeCount = randomBetween(2, 5);
      const chargeChildren: Row[] = [];
      let invoiceRecognizedRevenue = 0;
      let invoiceDeferredRevenue = 0;
      const chargeTotalAmount = invoiceAmountRounded;
      let currentChargeTotal = 0;

      for (let c = 0; c < chargeCount; c++) {
        // Calculate charge amount (divide invoice amount among charges)
        let chargeAmount: number;

        if (c === chargeCount - 1) {
          // Last charge gets the remainder to ensure sum equals invoice amount
          chargeAmount = parseFloat((chargeTotalAmount - currentChargeTotal).toFixed(2));
        } else {
          // Random portion of remaining amount
          const remainingForCharges = chargeTotalAmount - currentChargeTotal;
          const portion = Math.random() * 0.7; // Take up to 70% of what's left
          chargeAmount = parseFloat((remainingForCharges * portion).toFixed(2));
          currentChargeTotal += chargeAmount;
        }

        const chargeId = `CHG-${100000 + randomBetween(1, 999999)}`;

        // Calculate revenue recognition
        const { recognizedRevenue, deferredRevenue } = calculateRevenueRecognition(
          chargeAmount,
          invoiceCreatedDate
        );

        invoiceRecognizedRevenue += recognizedRevenue;
        invoiceDeferredRevenue += deferredRevenue;

        // Generate monthly distribution for this charge
        const monthlyData = generateMonthlyData(
          invoiceMonth,
          invoiceYear,
          chargeAmount,
          randomBetween(1, 6) // Distribute over 1-6 months
        );

        // Create charge row
        chargeChildren.push({
          rowMeta: { rowId: rowId++ },
          rowData: {
            type: "charge",
            name: generateChargeDescription(),
            id: chargeId,
            createdDate: invoiceCreatedDate.toISOString(),
            amount: chargeAmount,
            recognizedRevenue,
            deferredRevenue,
            ...monthlyData,
          },
        });
      }

      // Calculate monthly data for the invoice by summing its charges
      const invoiceMonthlyData: Record<string, number> = {};
      const invoiceMonthlyRevenue: Record<string, number> = {};
      const invoiceMonthlyBalance: Record<string, number> = {};

      // For each month
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12;
        const year =
          currentDate.getMonth() - i < 0
            ? currentDate.getFullYear() - 1
            : currentDate.getFullYear();
        const key = `month_${months[monthIndex]}_${year}`;
        const revenueKey = `revenue_${months[monthIndex]}_${year}`;
        const balanceKey = `balance_${months[monthIndex]}_${year}`;

        // Sum this month's value from all charges
        invoiceMonthlyData[key] = chargeChildren.reduce((sum, charge) => {
          return sum + ((charge.rowData[key] as number) || 0);
        }, 0);

        // Sum this month's revenue from all charges
        invoiceMonthlyRevenue[revenueKey] = chargeChildren.reduce((sum, charge) => {
          return sum + ((charge.rowData[revenueKey] as number) || 0);
        }, 0);

        // Sum this month's balance from all charges
        invoiceMonthlyBalance[balanceKey] = chargeChildren.reduce((sum, charge) => {
          return sum + ((charge.rowData[balanceKey] as number) || 0);
        }, 0);
      }

      // Update account totals
      accountTotal += invoiceAmountRounded;
      accountRemaining += remainingAmount;
      accountRecognizedRevenue += invoiceRecognizedRevenue;
      accountDeferredRevenue += invoiceDeferredRevenue;

      // Create invoice row
      invoiceChildren.push({
        rowMeta: { rowId: rowId++, children: chargeChildren, isExpanded: false },
        rowData: {
          type: "invoice",
          name: invoiceName,
          id: invoiceId,
          status: invoiceStatus,
          createdDate: invoiceCreatedDate.toISOString(),
          dueDate: dueDate.toISOString(),
          amount: invoiceAmountRounded,
          remaining: remainingAmount,
          recognizedRevenue: parseFloat(invoiceRecognizedRevenue.toFixed(2)),
          deferredRevenue: parseFloat(invoiceDeferredRevenue.toFixed(2)),
          ...invoiceMonthlyData,
          ...invoiceMonthlyRevenue,
          ...invoiceMonthlyBalance,
        },
      });
    }

    // Calculate monthly data for the account by summing its invoices
    const accountMonthlyData: Record<string, number> = {};
    const accountMonthlyRevenue: Record<string, number> = {};
    const accountMonthlyBalance: Record<string, number> = {};

    // For each month
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      const year =
        currentDate.getMonth() - i < 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
      const key = `month_${months[monthIndex]}_${year}`;
      const revenueKey = `revenue_${months[monthIndex]}_${year}`;
      const balanceKey = `balance_${months[monthIndex]}_${year}`;

      // Sum this month's value from all invoices
      accountMonthlyData[key] = invoiceChildren.reduce((sum, invoice) => {
        return sum + ((invoice.rowData[key] as number) || 0);
      }, 0);

      // Sum this month's revenue from all invoices
      accountMonthlyRevenue[revenueKey] = invoiceChildren.reduce((sum, invoice) => {
        return sum + ((invoice.rowData[revenueKey] as number) || 0);
      }, 0);

      // Sum this month's balance from all invoices
      accountMonthlyBalance[balanceKey] = invoiceChildren.reduce((sum, invoice) => {
        return sum + ((invoice.rowData[balanceKey] as number) || 0);
      }, 0);
    }

    // Create account row
    accountRows.push({
      rowMeta: { rowId: rowId++, children: invoiceChildren, isExpanded: true },
      rowData: {
        type: "account",
        name: accountName,
        id: accountId,
        status: accountStatus,
        createdDate: accountCreatedDate.toISOString(),
        amount: parseFloat(accountTotal.toFixed(2)),
        remaining: parseFloat(accountRemaining.toFixed(2)),
        recognizedRevenue: parseFloat(accountRecognizedRevenue.toFixed(2)),
        deferredRevenue: parseFloat(accountDeferredRevenue.toFixed(2)),
        ...accountMonthlyData,
        ...accountMonthlyRevenue,
        ...accountMonthlyBalance,
      },
    });
  }

  return accountRows;
};
