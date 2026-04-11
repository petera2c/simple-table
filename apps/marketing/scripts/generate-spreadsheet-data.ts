// ES Module version of the spreadsheet data generator
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROW_COUNT = 10000;

export interface SpreadsheetRow {
  id: number;
  principal: number;
  interestRate: number;
  monthlyPayment: number;
  remainingBalance: number;
  totalPaid: number;
  interestPaid: number;
  [key: string]: any;
}

// Generate realistic loan/investment calculation data
const generateSpreadsheetData = (): SpreadsheetRow[] => {
  const data: SpreadsheetRow[] = [];

  for (let i = 0; i < ROW_COUNT; i++) {
    // Generate principal between $10,000 and $500,000
    const principal = Math.floor(Math.random() * 490000) + 10000;

    // Generate interest rate between 3% and 8%
    const interestRate = parseFloat((Math.random() * 5 + 3).toFixed(2));

    // Calculate monthly payment using simplified amortization formula
    // P = (r * PV) / (1 - (1 + r)^(-n))
    // Using 30 years (360 months) as standard
    const monthlyRate = interestRate / 100 / 12;
    const numMonths = 360;
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numMonths))) /
      (Math.pow(1 + monthlyRate, numMonths) - 1);

    // Simulate progress: random number of payments made (0-120 months)
    const paymentsMade = Math.floor(Math.random() * 120);

    // Calculate remaining balance
    const remainingBalance =
      (principal *
        (Math.pow(1 + monthlyRate, numMonths) - Math.pow(1 + monthlyRate, paymentsMade))) /
      (Math.pow(1 + monthlyRate, numMonths) - 1);

    // Calculate total paid
    const totalPaid = monthlyPayment * paymentsMade;

    // Calculate interest paid (total paid - principal reduction)
    const principalReduction = principal - Math.max(0, remainingBalance);
    const interestPaid = totalPaid - principalReduction;

    data.push({
      id: i + 1,
      principal: parseFloat(principal.toFixed(2)),
      interestRate: parseFloat(interestRate.toFixed(2)),
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      remainingBalance: parseFloat(Math.max(0, remainingBalance).toFixed(2)),
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      interestPaid: parseFloat(Math.max(0, interestPaid).toFixed(2)),
    });
  }

  return data;
};

// Run the generation and save to a file
async function saveDataToFile(): Promise<void> {
  console.log("Generating realistic spreadsheet dataset...");
  const data = generateSpreadsheetData();
  console.log(`Generated ${data.length} spreadsheet rows`);

  const filePath = path.join(__dirname, "../public/data/spreadsheet-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

// Execute the function
saveDataToFile();
