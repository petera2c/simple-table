export interface SalesInboundRow {
  id: string;
  repName: string;
  dealSize: number;
  isWon: boolean;
  profitMargin: number;
  closeDate: string;
  category: string;
}

export interface SalesRow extends SalesInboundRow {
  dealValue: number;
  commission: number;
  dealProfit: number;
}

function processSalesData(salesData: SalesInboundRow[]): SalesRow[] {
  return salesData.map((sale) => {
    const dealValue = sale.dealSize / sale.profitMargin;
    const commission = dealValue * 0.1;
    const dealProfit = sale.dealSize - commission;
    return {
      ...sale,
      dealValue: parseFloat(dealValue.toFixed(2)),
      commission: parseFloat(commission.toFixed(2)),
      dealProfit: parseFloat(dealProfit.toFixed(2)),
    };
  });
}

const SALES_SAMPLE_INBOUND: SalesInboundRow[] = [
  { id: "SALE-0", repName: "Sophie Dubois", dealSize: 27430.48, isWon: true, profitMargin: 0.49, closeDate: "2026-02-08", category: "Support" },
  { id: "SALE-1", repName: "Akira Tanaka", dealSize: 16112.14, isWon: false, profitMargin: 0.31, closeDate: "2026-01-25", category: "Training" },
  { id: "SALE-2", repName: "Thomas Müller", dealSize: 523.99, isWon: true, profitMargin: 0.56, closeDate: "2026-01-20", category: "Training" },
  { id: "SALE-3", repName: "Valentina Diaz", dealSize: 373.94, isWon: true, profitMargin: 0.61, closeDate: "2026-03-06", category: "Services" },
  { id: "SALE-4", repName: "Isabella Fernandez", dealSize: 5955.97, isWon: true, profitMargin: 0.31, closeDate: "2026-01-12", category: "Software" },
  { id: "SALE-5", repName: "Emily Davis", dealSize: 126.47, isWon: true, profitMargin: 0.69, closeDate: "2026-02-13", category: "Services" },
  { id: "SALE-6", repName: "Olivia Bennett", dealSize: 128.85, isWon: false, profitMargin: 0.42, closeDate: "2026-03-01", category: "Hardware" },
  { id: "SALE-7", repName: "Marcus Webb", dealSize: 89200.0, isWon: true, profitMargin: 0.55, closeDate: "2026-02-28", category: "Software" },
  { id: "SALE-8", repName: "Nina Kowalski", dealSize: 42000.0, isWon: true, profitMargin: 0.48, closeDate: "2026-01-18", category: "Consulting" },
  { id: "SALE-9", repName: "James Okafor", dealSize: 125000.0, isWon: true, profitMargin: 0.72, closeDate: "2026-03-15", category: "Software" },
  { id: "SALE-10", repName: "Elena Rossi", dealSize: 9800.0, isWon: false, profitMargin: 0.35, closeDate: "2026-02-02", category: "Hardware" },
  { id: "SALE-11", repName: "Chen Wei", dealSize: 156000.0, isWon: true, profitMargin: 0.68, closeDate: "2026-03-10", category: "Software" },
  { id: "SALE-12", repName: "Priya Sharma", dealSize: 22400.0, isWon: true, profitMargin: 0.44, closeDate: "2026-01-30", category: "Services" },
  { id: "SALE-13", repName: "Lars Hansen", dealSize: 51200.0, isWon: true, profitMargin: 0.52, closeDate: "2026-02-20", category: "Consulting" },
  { id: "SALE-14", repName: "Amélie Laurent", dealSize: 3100.0, isWon: true, profitMargin: 0.28, closeDate: "2026-03-22", category: "Training" },
  { id: "SALE-15", repName: "Diego Alvarez", dealSize: 67800.0, isWon: false, profitMargin: 0.5, closeDate: "2026-02-11", category: "Hardware" },
  { id: "SALE-16", repName: "Fatima Al-Farsi", dealSize: 18900.0, isWon: true, profitMargin: 0.63, closeDate: "2026-03-03", category: "Support" },
  { id: "SALE-17", repName: "Henrik Berg", dealSize: 94500.0, isWon: true, profitMargin: 0.58, closeDate: "2026-01-08", category: "Software" },
  { id: "SALE-18", repName: "Yuki Sato", dealSize: 7600.0, isWon: false, profitMargin: 0.33, closeDate: "2026-02-25", category: "Services" },
  { id: "SALE-19", repName: "Grace O'Malley", dealSize: 203500.0, isWon: true, profitMargin: 0.71, closeDate: "2026-03-18", category: "Software" },
];

export const salesSampleRows: SalesRow[] = processSalesData(SALES_SAMPLE_INBOUND);
