"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageWrapper from "@/components/PageWrapper";
import {
  faCheck,
  faCreditCard,
  faCalendarCheck,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { openStripeCheckout } from "@/utils/stripe";
import { STRIPE_CUSTOMER_PORTAL_URL } from "@/constants/stripe";
import { SIMPLE_TABLE_PRICING } from "@/constants/simpleTablePricing";
import { TECHNICAL_STRINGS } from "@/constants/strings/technical";
import {
  trackBookACall,
  trackCtaClick,
  trackPricingCtaClick,
  trackViewPricing,
} from "@/lib/analytics";
import ContactModal, { type PlanInterest } from "@/components/ContactModal";

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface Plan {
  name: "FREE" | "PRO" | "ENTERPRISE";
  subtitle: string;
  price: string;
  originalPrice?: string;
  billingCycle?: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  ctaVariant: "default" | "primary";
  recommended?: boolean;
}

const PLAN_CAPACITY_NOTE = "MIT license. Unlimited products and users.";

const PLANS: Plan[] = [
  {
    name: "FREE",
    subtitle: "Free to use",
    price: SIMPLE_TABLE_PRICING.freeDisplay,
    billingCycle: "forever",
    description: "The full library. Free to use in any product.",
    features: [
      { text: "All grid features", included: true, highlight: true },
      { text: "Official adapters for every framework", included: true, highlight: true },
      { text: "Community Discord support", included: true, highlight: true },
    ],
    cta: "Install free",
    ctaVariant: "primary",
    recommended: true,
  },
  {
    name: "PRO",
    subtitle: "Support and bug fixes",
    price: SIMPLE_TABLE_PRICING.proMonthly,
    billingCycle: "per month",
    description: "Same MIT license. You are paying for help, not for permission to use the library.",
    features: [
      { text: "Support", included: true, highlight: true },
    ],
    cta: "Start Pro",
    ctaVariant: "default",
  },
  {
    name: "ENTERPRISE",
    subtitle: "Custom help",
    price: SIMPLE_TABLE_PRICING.enterpriseDisplay,
    description: "Scoped to what you need.",
    features: [
      { text: "Direct access to the people who build Simple Table", included: true, highlight: true },
    ],
    cta: "Contact us",
    ctaVariant: "default",
  },
];

const PricingContent: React.FC = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePlanInterest, setQuotePlanInterest] = useState<PlanInterest>("pro");

  useEffect(() => {
    trackViewPricing("pricing_page");
  }, []);

  const calendlyUrl = TECHNICAL_STRINGS.links.calendly;

  const openBookACall = (ctaId: string, ctaText: string) => {
    trackBookACall({
      cta_id: ctaId,
      cta_text: ctaText,
      destination: calendlyUrl,
      location: "pricing_page",
    });
    trackPricingCtaClick({
      plan: "unsure",
      cta_id: ctaId,
      cta_text: ctaText,
      destination: calendlyUrl,
    });
    window.open(calendlyUrl, "_blank", "noopener,noreferrer");
  };

  const openLicenseQuote = (
    planInterest: PlanInterest = "unsure",
    ctaId?: string,
    ctaText = "Contact us",
  ) => {
    trackCtaClick({
      cta_id: ctaId ?? `pricing_license_quote_${planInterest}`,
      cta_text: ctaText,
      destination: "license_quote_modal",
      location: "pricing_page",
    });
    trackPricingCtaClick({
      plan: planInterest === "enterprise" || planInterest === "pro" ? planInterest : "unsure",
      cta_id: ctaId ?? `pricing_license_quote_${planInterest}`,
      cta_text: ctaText,
      destination: "license_quote_modal",
    });
    setQuotePlanInterest(planInterest);
    setIsQuoteModalOpen(true);
  };

  const handleGetStarted = (planName: Plan["name"]) => {
    if (planName === "FREE") {
      trackCtaClick({
        cta_id: "pricing_install_free",
        cta_text: "Install free",
        destination: "/docs/installation",
        location: "pricing_page",
      });
      trackPricingCtaClick({
        plan: "free",
        cta_id: "pricing_install_free",
        cta_text: "Install free",
        destination: "/docs/installation",
      });
      window.location.assign("/docs/installation");
      return;
    }
    if (planName === "ENTERPRISE") {
      openLicenseQuote("enterprise", "pricing_contact_enterprise", "Contact us");
      return;
    }
    trackCtaClick({
      cta_id: "pricing_start_pro",
      cta_text: "Start Pro",
      destination: "stripe_checkout",
      location: "pricing_page",
    });
    trackPricingCtaClick({
      plan: "pro",
      cta_id: "pricing_start_pro",
      cta_text: "Start Pro",
      destination: "stripe_checkout",
    });
    try {
      openStripeCheckout("pro", false);
    } catch (error) {
      console.error("Error starting checkout:", error);
      alert("There was an error starting the checkout process. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren" as const, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <PageWrapper>
      <div className="site-shell py-12">
        <motion.section
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-3">
            Simple pricing
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
            The library is free under the MIT license. Pay only if you want support.
          </p>
        </motion.section>

        <motion.section
          className="mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              className={`relative flex h-full flex-col rounded-lg p-6 border ${
                plan.recommended
                  ? "border-accent bg-surface"
                  : "border-line bg-surface"
              }`}
              variants={itemVariants}
            >
              {plan.recommended ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Recommended
                </div>
              ) : null}

              <h3 className="mb-1 shrink-0 text-xl font-bold text-ink">
                {plan.name}
              </h3>
              <p className="mb-3 shrink-0 text-sm text-muted">
                {plan.subtitle}
              </p>

              <div className="mb-3 shrink-0">
                <div className="flex min-h-13 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-4xl font-bold text-ink">
                    {plan.price}
                  </span>
                  {plan.originalPrice ? (
                    <span className="text-lg text-muted line-through">
                      {plan.originalPrice}
                    </span>
                  ) : null}
                  {plan.billingCycle ? (
                    <span className="text-muted">/{plan.billingCycle}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs leading-snug text-muted">
                  {PLAN_CAPACITY_NOTE}
                </p>
              </div>

              <p className="mb-4 shrink-0 text-sm text-muted">
                {plan.description}
              </p>

              <div className="mb-4 flex min-h-0 flex-1 flex-col gap-2">
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex shrink-0 items-start gap-3">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={`mt-0.5 text-sm ${
                        feature.included ? "text-ink" : "text-line"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        feature.highlight
                          ? "font-medium text-ink"
                          : "text-muted"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                type={plan.ctaVariant}
                size="large"
                className="mb-4 h-10 w-full shrink-0"
                onClick={() => handleGetStarted(plan.name)}
              >
                {plan.cta}
              </Button>

              <div className="mt-auto shrink-0 border-t border-line pt-4">
                <a
                  href="/legal/license"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  MIT License
                </a>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted">
            ChartMetric chose Simple Table over AG Grid and skipped a{" "}
            <Link
              href="/case-studies/chartmetric"
              className="text-accent font-medium hover:underline"
            >
              $19K+ per-engineer license
            </Link>
            .
          </p>
        </motion.div>

        <motion.section
          className="mt-14 text-center max-w-2xl mx-auto border-t border-line pt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-ink mb-2">Not sure?</h3>
          <p className="text-muted mb-6 text-sm max-w-lg mx-auto">
            Want support, or something custom? We&apos;ll help you figure out the fit, even if
            Simple Table isn&apos;t it.
          </p>
          <div className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="primary"
              size="large"
              onClick={() => openLicenseQuote("unsure", "pricing_bottom_license_quote")}
              className="h-11 px-8"
            >
              <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
              Contact us
            </Button>
            <Button
              size="large"
              onClick={() => openBookACall("pricing_book_a_call", "Book a free call")}
              className="h-11 px-8"
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
              Book a free call
            </Button>
          </div>
          <button
            type="button"
            onClick={() => window.open(STRIPE_CUSTOMER_PORTAL_URL, "_blank")}
            className="text-sm text-muted hover:text-accent transition-colors inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Already subscribed? Manage billing
          </button>
        </motion.section>
      </div>

      <ContactModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        variant="license_quote"
        initialPlanInterest={quotePlanInterest}
      />
    </PageWrapper>
  );
};

export default PricingContent;
