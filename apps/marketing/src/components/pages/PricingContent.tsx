"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageWrapper from "@/components/PageWrapper";
import {
  faCheck,
  faRocket,
  faBolt,
  faGift,
  faCreditCard,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import Link from "next/link";
import { useMemo, useState } from "react";
import { openStripeCheckout } from "@/utils/stripe";
import { STRIPE_CUSTOMER_PORTAL_URL } from "@/constants/stripe";
import { SIMPLE_TABLE_PRICING } from "@/constants/simpleTablePricing";
import ContactModal from "@/components/ContactModal";

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface Plan {
  name: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  billingCycle: string;
  description: string;
  features: PlanFeature[];
  cta: string;
  ctaVariant: "default" | "primary";
  recommended?: boolean;
}

const PLAN_CAPACITY_NOTE = "One license per product · unlimited users";

const PricingContent: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const plans: Plan[] = useMemo(
    () => [
      {
        name: "FREE",
        subtitle: "Pre-revenue & side projects",
        price: SIMPLE_TABLE_PRICING.freeDisplay,
        billingCycle: "forever",
        description: "Full library. Community License — only while you have zero revenue.",
        features: [
          { text: "All grid features (same as Pro)", included: true, highlight: true },
          { text: "Official adapters for every framework", included: true, highlight: true },
          { text: "Community Discord support", included: true, highlight: true },
          { text: "Commercial use when you earn revenue → Pro", included: true, highlight: false },
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
          { text: "Commercial EULA for paid / revenue products", included: true, highlight: true },
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
        price: isAnnual
          ? SIMPLE_TABLE_PRICING.enterpriseAnnual
          : SIMPLE_TABLE_PRICING.enterpriseMonthly,
        originalPrice: isAnnual
          ? SIMPLE_TABLE_PRICING.enterpriseAnnualStrikethrough
          : undefined,
        billingCycle: isAnnual ? "per year" : "per month",
        description: "Everything in Pro when you need faster answers and core-dev access.",
        features: [
          { text: "Everything in Pro", included: true, highlight: true },
          { text: "Faster support response times", included: true, highlight: true },
          { text: "Direct access to core developers", included: true, highlight: true },
          { text: "Feature request prioritization", included: true, highlight: true },
        ],
        cta: "Start Enterprise",
        ctaVariant: "default",
      },
    ],
    [isAnnual],
  );

  const handleGetStarted = (planName: string) => {
    if (planName === "FREE") {
      window.location.assign("/docs/installation");
      return;
    }
    try {
      openStripeCheckout(planName === "ENTERPRISE" ? "enterprise" : "pro", isAnnual);
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
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Free until you earn revenue. Then Pro — one price per product, not per developer.
          </p>

          <div className="max-w-3xl mx-auto mb-8 grid sm:grid-cols-2 gap-3 text-left">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Choose FREE if…
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You are an individual, side project, or pre-revenue startup. Install from docs.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 p-4">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                Choose PRO if…
              </p>
              <p className="text-sm text-blue-900/80 dark:text-blue-100/90">
                Your company generates any revenue. You need a commercial license plus priority
                support.
              </p>
            </div>
          </div>

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
                  <span className="text-gray-600 dark:text-gray-400">/{plan.billingCycle}</span>
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
                <FontAwesomeIcon
                  icon={plan.name === "FREE" ? faRocket : faBolt}
                  className="mr-2"
                />
                {plan.cta}
              </Button>

              <div className="mt-auto shrink-0 border-t border-gray-200 pt-4 dark:border-gray-700">
                <a
                  href={plan.name === "FREE" ? "/legal/license" : "/legal/eula"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {plan.name === "FREE" ? "Community License" : "Commercial EULA"}
                </a>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Features are the same on every tier. Free is Community License (zero revenue). Pro and
          Enterprise add a commercial EULA and support.{" "}
          <a href="/legal/license" className="text-blue-600 dark:text-blue-400 hover:underline">
            Community License
          </a>
          {" · "}
          <a href="/legal/eula" className="text-blue-600 dark:text-blue-400 hover:underline">
            EULA
          </a>
        </p>

        <motion.section
          className="mt-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            href="/case-studies/chartmetric"
            className="block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Case study
            </p>
            <p className="font-semibold text-gray-900 dark:text-white mb-1">ChartMetric</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chose Simple Table over AG Grid — $19K+ first-year savings.
            </p>
          </Link>
        </motion.section>

        <motion.section
          className="mt-10 text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Not sure?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm max-w-lg mx-auto">
            Pre-revenue → Free. Earning revenue → Pro. Need dedicated help → Enterprise.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => setIsContactModalOpen(true)}
            className="h-11 px-8"
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Contact us
          </Button>
        </motion.section>

        <motion.section
          className="mt-14 text-center border-t border-gray-200 dark:border-gray-700 pt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">
            Already subscribed?
          </h3>
          <button
            type="button"
            onClick={() => window.open(STRIPE_CUSTOMER_PORTAL_URL, "_blank")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Manage billing
          </button>
        </motion.section>

        <motion.section
          className="mt-14 text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Ship the grid. Skip the per-seat bill.
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Install free today. Upgrade to Pro when your product earns revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="large" onClick={() => handleGetStarted("FREE")} className="h-11 px-8">
              <FontAwesomeIcon icon={faRocket} className="mr-2" />
              Install free
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => handleGetStarted("PRO")}
              className="h-11 px-8"
            >
              Start Pro
            </Button>
          </div>
        </motion.section>
      </div>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </PageWrapper>
  );
};

export default PricingContent;
