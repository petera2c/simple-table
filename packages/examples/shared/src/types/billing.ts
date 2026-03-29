export interface BillingRow {
  id: string | number;
  name: string;
  type: string;
  amount: number;
  deferredRevenue: number;
  recognizedRevenue: number;
  invoices?: BillingRow[];
  charges?: BillingRow[];
  [key: `balance_${string}`]: number;
  [key: `revenue_${string}`]: number;
}
