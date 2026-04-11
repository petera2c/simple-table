// ES Module version of the sales data generator
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product interface
interface Product {
  id: string;
  name: string;
  basePrice: number;
  category: string;
}

// Sales rep interface
interface SalesRep {
  id: string;
  name: string;
  experience: number;
  performanceRating: number;
}

// Sale record interface
interface SaleRecord {
  id: string;
  repName: string;
  dealSize: number;
  isWon: boolean;
  commission: number;
  dealProfit: number;
  dealValue: number;
  profitMargin: number;
  closeDate: string;
  category: string;
}

// Products data
const PRODUCTS: Product[] = [
  { id: "SAAS-BASIC", name: "Basic SaaS Plan", basePrice: 99, category: "Software" },
  { id: "SAAS-PRO", name: "Professional SaaS Plan", basePrice: 299, category: "Software" },
  { id: "SAAS-ENT", name: "Enterprise SaaS Plan", basePrice: 999, category: "Software" },
  { id: "CONSULT-STD", name: "Standard Consulting", basePrice: 5000, category: "Services" },
  { id: "CONSULT-PREM", name: "Premium Consulting", basePrice: 15000, category: "Services" },
  { id: "TRAIN-BASIC", name: "Basic Training", basePrice: 1999, category: "Training" },
  { id: "TRAIN-ADV", name: "Advanced Training", basePrice: 3999, category: "Training" },
  { id: "HW-SERVER", name: "Server Hardware", basePrice: 8999, category: "Hardware" },
  { id: "HW-NETWORK", name: "Network Equipment", basePrice: 4599, category: "Hardware" },
  { id: "SUPPORT-STD", name: "Standard Support", basePrice: 499, category: "Support" },
  { id: "SUPPORT-24x7", name: "24x7 Premium Support", basePrice: 1499, category: "Support" },
];

// Sales representatives data
const SALES_REPS: SalesRep[] = [
  // North America Team
  {
    id: "REP001",
    name: "James Wilson",
    experience: 8,
    performanceRating: 0.85,
  },
  {
    id: "REP002",
    name: "Emily Davis",
    experience: 6,
    performanceRating: 0.78,
  },
  {
    id: "REP003",
    name: "Michael Johnson",
    experience: 5,
    performanceRating: 0.72,
  },
  {
    id: "REP004",
    name: "Sarah Martinez",
    experience: 4,
    performanceRating: 0.65,
  },
  {
    id: "REP005",
    name: "David Thompson",
    experience: 3,
    performanceRating: 0.62,
  },
  {
    id: "REP006",
    name: "Jessica Lee",
    experience: 2,
    performanceRating: 0.58,
  },
  {
    id: "REP007",
    name: "Robert Garcia",
    experience: 1,
    performanceRating: 0.55,
  },
  {
    id: "REP008",
    name: "Thomas Müller",
    experience: 7,
    performanceRating: 0.8,
  },
  {
    id: "REP009",
    name: "Sophie Dubois",
    experience: 5,
    performanceRating: 0.75,
  },
  {
    id: "REP010",
    name: "Andreas Schmitt",
    experience: 4,
    performanceRating: 0.68,
  },
  {
    id: "REP011",
    name: "Olivia Bennett",
    experience: 3,
    performanceRating: 0.63,
  },
  {
    id: "REP012",
    name: "Pierre Laurent",
    experience: 2,
    performanceRating: 0.6,
  },
  {
    id: "REP013",
    name: "Emma Fischer",
    experience: 1,
    performanceRating: 0.52,
  },
  {
    id: "REP014",
    name: "Liu Wei",
    experience: 6,
    performanceRating: 0.77,
  },
  {
    id: "REP015",
    name: "Akira Tanaka",
    experience: 5,
    performanceRating: 0.76,
  },
  {
    id: "REP016",
    name: "Ravi Patel",
    experience: 4,
    performanceRating: 0.7,
  },
  {
    id: "REP017",
    name: "Mei Chen",
    experience: 2,
    performanceRating: 0.59,
  },
  {
    id: "REP018",
    name: "Kim Seung-Min",
    experience: 1,
    performanceRating: 0.51,
  },
  {
    id: "REP019",
    name: "Carlos Rodriguez",
    experience: 5,
    performanceRating: 0.73,
  },
  {
    id: "REP020",
    name: "Isabella Fernandez",
    experience: 3,
    performanceRating: 0.64,
  },
  {
    id: "REP021",
    name: "Mateo Lopez",
    experience: 2,
    performanceRating: 0.57,
  },
  {
    id: "REP022",
    name: "Valentina Diaz",
    experience: 1,
    performanceRating: 0.53,
  },
];

// Generate realistic sales record
function generateRealisticSaleRecord(repData: SalesRep, rowId: number): SaleRecord {
  // Product tier selection - more experienced reps sell more enterprise products
  const repExperienceWeight = repData.experience / 10;
  const tierWeights = [
    0.7 - repExperienceWeight * 0.4, // Lower tier products
    0.2, // Mid tier products
    0.1 + repExperienceWeight * 0.4, // Higher tier products
  ];

  let productTier: number;
  const tierRoll = Math.random();
  if (tierRoll < tierWeights[0]) {
    productTier = 0; // Lower tier
  } else if (tierRoll < tierWeights[0] + tierWeights[1]) {
    productTier = 1; // Mid tier
  } else {
    productTier = 2; // Higher tier
  }

  // Select product based on tier
  let product: Product;
  if (productTier === 0) {
    // Lower price products (SAAS-BASIC, SUPPORT-STD)
    const lowerTierProducts = PRODUCTS.filter((p) => p.basePrice < 500);
    product = lowerTierProducts[Math.floor(Math.random() * lowerTierProducts.length)];
  } else if (productTier === 1) {
    // Mid price products (SAAS-PRO, TRAIN-BASIC)
    const midTierProducts = PRODUCTS.filter((p) => p.basePrice >= 500 && p.basePrice < 4000);
    product = midTierProducts[Math.floor(Math.random() * midTierProducts.length)];
  } else {
    // Higher price products (SAAS-ENT, CONSULT-PREM, HW-SERVER)
    const highTierProducts = PRODUCTS.filter((p) => p.basePrice >= 4000);
    product = highTierProducts[Math.floor(Math.random() * highTierProducts.length)];
  }

  // Calculate deal size with reasonable multiplier
  const baseMultiplier = 1 + Math.random() * 0.4; // Base 1-1.4x multiplier
  const tierMultiplier = 1 + productTier * 0.3; // Higher tier means potentially larger deals
  const finalMultiplier = baseMultiplier * tierMultiplier;
  const dealSize = Math.round(product.basePrice * finalMultiplier * 100) / 100;

  // Win probability influenced by rep performance and experience
  const baseWinRate = 0.35 + repData.performanceRating * 0.3;
  const experienceBonus = repData.experience * 0.02;
  const finalWinRate = Math.min(0.85, baseWinRate + experienceBonus);

  // Determine if this was a won deal
  const isWon = Math.random() < finalWinRate;

  // Number of units sold - varies by product type and price point
  let units: number;
  if (product.basePrice < 500) {
    // Cheaper products sell in larger quantities
    units = Math.floor(Math.random() * 200) + 1;
  } else if (product.basePrice < 5000) {
    // Mid-tier products
    units = Math.floor(Math.random() * 20) + 1;
  } else {
    // Expensive products
    units = Math.floor(Math.random() * 3) + 1;
  }

  // Calculate deal value
  const dealValue = Math.round(dealSize * units * 100) / 100;

  // Profit margin varies by product category
  let baseProfitMargin: number;
  switch (product.category) {
    case "Software":
      baseProfitMargin = 0.7; // Software has high margins
      break;
    case "Hardware":
      baseProfitMargin = 0.25; // Hardware has lower margins
      break;
    case "Services":
    case "Training":
      baseProfitMargin = 0.4; // Services have medium margins
      break;
    case "Support":
      baseProfitMargin = 0.55; // Support has good margins
      break;
    default:
      baseProfitMargin = 0.45;
  }

  // Add some variability to profit margin
  const profitMargin = Math.round((baseProfitMargin + (Math.random() * 0.2 - 0.1)) * 100) / 100;

  // Calculate profit only for won deals
  const dealProfit = isWon ? Math.round(dealValue * profitMargin * 100) / 100 : 0;

  // Commission rates vary by product and rep experience
  const baseCommissionRate = product.category === "Software" ? 0.1 : 0.08;
  const experienceCommissionBonus = (repData.experience / 10) * 0.03;
  const commissionRate = Math.round((baseCommissionRate + experienceCommissionBonus) * 1000) / 1000;

  // Calculate commission only for won deals
  const commission = isWon ? Math.round(dealValue * commissionRate * 100) / 100 : 0;

  // Generate a random close date in the past 90 days (YYYY-MM-DD format)
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 90));
  const closeDate = pastDate.toISOString().split("T")[0];

  // Assign a random category
  const categories = ["Software", "Hardware", "Services", "Consulting", "Training", "Support"];
  const category = categories[Math.floor(Math.random() * categories.length)];

  return {
    id: `SALE-${rowId}`,
    repName: repData.name,
    dealSize: dealSize,
    isWon: isWon,
    commission: commission,
    dealProfit: dealProfit,
    dealValue: dealValue,
    profitMargin: profitMargin,
    closeDate: closeDate,
    category: category,
  };
}

// Generate realistic dataset
function generateRealisticSalesDataset(numRecords: number = 10000): SaleRecord[] {
  const data: SaleRecord[] = [];

  for (let i = 0; i < numRecords; i++) {
    // Pick a random sales rep, but weight by experience for more realistic distribution
    // More experienced reps will have more deals
    const repIndex = weightedRandomIndex(SALES_REPS.map((rep) => rep.experience));
    const rep = SALES_REPS[repIndex];

    const saleData = generateRealisticSaleRecord(rep, i);
    data.push(saleData);
  }

  return data;
}

// Helper function for weighted random selection
function weightedRandomIndex(weights: number[]): number {
  const totalWeight = weights.reduce((sum: number, weight: number) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return i;
    }
  }

  return weights.length - 1; // Fallback
}

// Run the generation and save to a file
async function saveDataToFile(): Promise<void> {
  console.log("Generating realistic sales dataset...");
  const data = generateRealisticSalesDataset();
  console.log(`Generated ${data.length} sales records`);

  const filePath = path.join(__dirname, "../public/data/sales-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

// Execute the function
saveDataToFile();
