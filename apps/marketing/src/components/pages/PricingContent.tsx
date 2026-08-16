"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageWrapper from "@/components/PageWrapper";
import {
  faCheck,
  faGift,
  faCreditCard,
  faCalendarCheck,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { openStripeCheckout } from "@/utils/stripe";
import { STRIPE_CUSTOMER_PORTAL_URL } from "@/constants/stripe";
import { SIMPLE_TABLE_PRICING } from "@/constants/simpleTablePricing";
import { TECHNICAL_STRINGS } from "@/constants/strings/technical";
import { trackBookACall, trackCtaClick, trackViewPricing } from "@/lib/analytics";
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

const PLAN_CAPACITY_NOTE = "One license per product · unlimited users";

const PricingContent: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
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
    window.open(calendlyUrl, "_blank", "noopener,noreferrer");
  };

  const openLicenseQuote = (
    planInterest: PlanInterest = "unsure",
    ctaId?: string,
    ctaText = "Get a license quote",
  ) => {
    trackCtaClick({
      cta_id: ctaId ?? `pricing_license_quote_${planInterest}`,
      cta_text: ctaText,
      destination: "license_quote_modal",
      location: "pricing_page",
    });
    setQuotePlanInterest(planInterest);
    setIsQuoteModalOpen(true);
  };

  const plans: Plan[] = useMemo(
    () => [
      {
        name: "FREE",
        subtitle: "Side projects & early teams",
        price: SIMPLE_TABLE_PRICING.freeDisplay,
        billingCycle: "forever",
        description: "Full library. Free until your company makes money.",
        features: [
          { text: "All grid features (same as Pro)", included: true, highlight: true },
          { text: "Official adapters for every framework", included: true, highlight: true },
          { text: "Community Discord support", included: true, highlight: true },
          { text: "When you earn revenue → Pro", included: true, highlight: false },
        ],
        cta: "Install free",
        ctaVariant: "default",
      },
      {
        name: "PRO",
        subtitle: "Most teams · any revenue",
        price: isAnnual ? SIMPLE_TABLE_PRICING.proAnnual : SIMPLE_TABLE_PRICING.proMonthly,
        originalPrice: isAnnual ? SIMPLE_TABLE_PRICING.proAnnualStrikethrough : undefined,
        billingCycle: isAnnual ? "per year" : "per month",
        description: "Commercial license + priority support. No per-seat fees as you hire.",
        features: [
          { text: "Commercial license for products that make money", included: true, highlight: true },
          { text: "Priority email & Discord support", included: true, highlight: true },
          { text: "Production bug coverage", included: true, highlight: true },
          { text: "Same full library as Free", included: true, highlight: true },
        ],
        cta: "Start Pro",
        ctaVariant: "primary",
        recommended: true,
      },
      {
        name: "ENTERPRISE",
        subtitle: "Hands-on support",
        price: SIMPLE_TABLE_PRICING.enterpriseDisplay,
        description: "Everything in Pro, plus direct access to core developers.",
        features: [
          { text: "Everything in Pro", included: true, highlight: true },
          { text: "Direct access to core developers", included: true, highlight: true },
          { text: "Custom features", included: true, highlight: true },
        ],
        cta: "Contact us",
        ctaVariant: "default",
      },
    ],
    [isAnnual],
  );

  const handleGetStarted = (planName: Plan["name"]) => {
    if (planName === "FREE") {
      trackCtaClick({
        cta_id: "pricing_install_free",
        cta_text: "Install free",
        destination: "/docs/installation",
        location: "pricing_page",
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
    try {
      openStripeCheckout("pro", isAnnual);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.section
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            Simple Pricing
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
            Free until you earn revenue
          </p>

          <div className="relative inline-flex items-center gap-4 mb-8">
            <span
              className={`text-base ${
                !isAnnual
                  ? "font-semibold text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Monthly
            </span>
            <button
              type="button"
              className={`relative w-16 h-8 rounded-full transition-colors duration-200 ${
                isAnnual ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label={isAnnual ? "Switch to monthly billing" : "Switch to annual billing"}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform duration-200 ${
                  isAnnual ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-base ${
                isAnnual
                  ? "font-semibold text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Annual
            </span>
            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faGift} />
              Save 17% yearly
            </span>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`relative flex h-full flex-col rounded-xl p-6 border ${
                plan.recommended
                  ? "border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 shadow-md lg:-mt-1 lg:mb-1 ring-1 ring-blue-600/15 dark:ring-blue-400/20"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 shadow-sm"
              }`}
              variants={itemVariants}
            >
              {plan.recommended ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Recommended
                </div>
              ) : null}

              <h3 className="mb-1 shrink-0 text-xl font-bold text-gray-800 dark:text-white">
                {plan.name}
              </h3>
              <p className="mb-3 shrink-0 text-sm text-gray-600 dark:text-gray-400">
                {plan.subtitle}
              </p>

              <div className="mb-3 shrink-0">
                <div className="flex min-h-13 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.originalPrice ? (
                    <span className="text-lg text-gray-500 line-through dark:text-gray-400">
                      {plan.originalPrice}
                    </span>
                  ) : null}
                  {plan.billingCycle ? (
                    <span className="text-gray-600 dark:text-gray-400">/{plan.billingCycle}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs leading-snug text-gray-500 dark:text-gray-400">
                  {PLAN_CAPACITY_NOTE}
                </p>
              </div>

              <p className="mb-4 shrink-0 text-sm text-gray-600 dark:text-gray-300">
                {plan.description}
              </p>

              <div className="mb-4 flex min-h-0 flex-1 flex-col gap-2">
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex shrink-0 items-start gap-3">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={`mt-0.5 text-sm ${
                        feature.included ? "text-green-500" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        feature.highlight
                          ? "font-medium text-gray-800 dark:text-white"
                          : "text-gray-700 dark:text-gray-300"
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

              <div className="mt-auto shrink-0 border-t border-gray-200 pt-4 dark:border-gray-700">
                <a
                  href={plan.name === "FREE" ? "/legal/license" : "/legal/eula"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {plan.name === "FREE" ? "Community License" : "Commercial license"}
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ChartMetric chose Simple Table over AG Grid:{" "}
            <Link
              href="/case-studies/chartmetric"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              $19K+ first-year savings (~95% for their team)
            </Link>
            .
          </p>
        </motion.div>

        <motion.section
          className="mt-14 text-center max-w-2xl mx-auto border-t border-gray-200 dark:border-gray-700 pt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Not sure?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm max-w-lg mx-auto">
            Prefer a quote without checkout, or want to talk through your setup? We&apos;ll help for
            free, even if Simple Table isn&apos;t the fit.
          </p>
          <div className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="primary"
              size="large"
              onClick={() => openLicenseQuote("unsure", "pricing_bottom_license_quote")}
              className="h-11 px-8"
            >
              <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
              Get a license quote
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
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
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
