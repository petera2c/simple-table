import { STRIPE_ENTERPRISE_PAYMENT_LINKS, STRIPE_PAYMENT_LINKS } from "@/constants/stripe";
import { trackBeginCheckout } from "@/lib/analytics";

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

  trackBeginCheckout({
    plan: product,
    billing: planType,
  });

  // Prefer success redirect when configured on the Payment Link in Stripe Dashboard:
  // https://www.simple-table.com/checkout/success?plan=pro&billing=annual
  window.open(paymentLink, "_blank", "noopener,noreferrer");
};
