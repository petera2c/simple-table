// Payment Links from Stripe Dashboard.
// The Pro monthly link was created for the old $85/month commercial license.
// Replace it with an $850/month support subscription before publishing this pricing change.
// The annual links are the old $850/year plan and are not used by the pricing page.
export const STRIPE_PAYMENT_LINKS = {
  monthly: "https://buy.stripe.com/4gMdR95g4bTigCi1m21sQ01",
  annual: "https://buy.stripe.com/28EbJ14c0aPegCi3ua1sQ00",
} as const;

// Enterprise tier payment links
export const STRIPE_ENTERPRISE_PAYMENT_LINKS = {
  monthly: "https://buy.stripe.com/6oUdR94c02iI3Pwc0G1sQ02",
  annual: "https://buy.stripe.com/cNi4gz6k80aAeua5Ci1sQ03",
} as const;

// Customer Portal for subscription management
export const STRIPE_CUSTOMER_PORTAL_URL =
  "https://billing.stripe.com/p/login/28EbJ14c0aPegCi3ua1sQ00";
