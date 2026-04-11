// Stripe Product and Price Constants
export const STRIPE_CONFIG = {
  // Price IDs
  PRICES: {
    MONTHLY: "price_1SBSUBI7eqwmd5zg42blEFde",
    ANNUAL: "price_1SBSUBI7eqwmd5zgxwBpyiqP",
  },
} as const;

// Helper functions
export const getStripePriceId = (plan: "monthly" | "annual") => {
  return plan === "monthly" ? STRIPE_CONFIG.PRICES.MONTHLY : STRIPE_CONFIG.PRICES.ANNUAL;
};

// Payment Links from Stripe Dashboard
export const STRIPE_PAYMENT_LINKS = {
  monthly: "https://buy.stripe.com/4gMdR95g4bTigCi1m21sQ01",
  annual: "https://buy.stripe.com/28EbJ14c0aPegCi3ua1sQ00",
} as const;

// Customer Portal for subscription management
export const STRIPE_CUSTOMER_PORTAL_URL =
  "https://billing.stripe.com/p/login/28EbJ14c0aPegCi3ua1sQ00";
