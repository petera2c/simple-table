/**
 * Simple Table public prices — keep in sync with PricingContent (/pricing).
 * Used by the pricing UI, package metadata, and anywhere amounts must not drift.
 */

export const SIMPLE_TABLE_PRICING = {
  freeDisplay: "$0",
  proMonthly: "$85",
  proAnnual: "$850",
  proAnnualStrikethrough: "$1,020",
  enterpriseMonthly: "$350",
  enterpriseAnnual: "$3,500",
  enterpriseAnnualStrikethrough: "$4,200",
} as const;

/** Annual billing: lowest (free tier) through highest paid tier on the pricing page. */
export const SIMPLE_TABLE_ANNUAL_COST_RANGE = `$0–${SIMPLE_TABLE_PRICING.enterpriseAnnual}/year`;
