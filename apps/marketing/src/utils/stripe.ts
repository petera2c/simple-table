import { STRIPE_ENTERPRISE_PAYMENT_LINKS, STRIPE_PAYMENT_LINKS } from "@/constants/stripe";

export type StripeCheckoutProduct = "pro" | "enterprise";

export const openStripeCheckout = (product: StripeCheckoutProduct, isAnnual: boolean) => {
  const planType = isAnnual ? "annual" : "monthly";
  const paymentLink =
    product === "pro" ? STRIPE_PAYMENT_LINKS[planType] : STRIPE_ENTERPRISE_PAYMENT_LINKS[planType];

  if (!paymentLink) {
    alert(
      `Payment link not configured for ${product} ${planType} plan. Please create Payment Links in your Stripe Dashboard first.`,
    );
    throw new Error(`Payment link not configured for ${product} ${planType} plan`);
  }

  window.open(paymentLink, "_blank", "noopener,noreferrer");
};
