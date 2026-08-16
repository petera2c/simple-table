/**
 * Simple Table public prices — keep in sync with PricingContent (/pricing).
 * Used by the pricing UI, package metadata, and anywhere amounts must not drift.
 */

export const SIMPLE_TABLE_PRICING = {
  freeDisplay: "$0",
  proMonthly: "$85",
  proAnnual: "$850",
  proAnnualStrikethrough: "$1,020",
  enterpriseDisplay: "Contact us",
} as const;

/** Published annual range (free through Pro). Enterprise is custom — contact us. */
export const SIMPLE_TABLE_ANNUAL_COST_RANGE = `$0–${SIMPLE_TABLE_PRICING.proAnnual}/year`;
