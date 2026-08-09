"use client";

import { Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageWrapper from "@/components/PageWrapper";
import {
  faArrowRight,
  faBookOpen,
  faBox,
  faCode,
  faStar,
  faCopy,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGitHubStars } from "@/hooks/useGitHubStars";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import InfrastructureExample from "@/examples/infrastructure/InfrastructureExample";
import { useThemeContext } from "@/providers/ThemeProvider";
import AIVisibilityEnhancer from "@/components/AIVisibilityEnhancer";
import IconLibrarySelector from "@/components/IconLibrarySelector";
import ThemeSelector from "@/components/ThemeSelector";
import { IconLibrary, getTableIcons } from "@/utils/getTableIcons";
import type { Theme } from "@simple-table/react";
import { useFramework, FRAMEWORKS, FRAMEWORK_LABELS } from "@/providers/FrameworkProvider";
import { getStackBlitzUrl } from "@/utils/getStackBlitzUrl";
import FrameworkIcon from "@/components/FrameworkIcon";
import { mapWebsiteThemeToTableTheme } from "@/utils/themeMapper";
import { trackCtaClick, trackCopyAiSetupPrompt } from "@/lib/analytics";
import { getAiSetupPrompt } from "@/constants/aiTablePrompt";

// Dynamically import heavy components that are below the fold or conditional.
// `loading` is required with `ssr: true` so Next wraps React.lazy in Suspense;
// without it, HMR/chunk reload can throw "async Client Component".
const CodeBlock = dynamic(() => import("@/components/CodeBlock"), { ssr: false });
const FeaturesSection = dynamic(() => import("@/components/sections/FeaturesSection"), {
  ssr: true,
  loading: () => null,
});
const ProductionSection = dynamic(() => import("@/components/sections/ProductionSection"), {
  ssr: true,
  loading: () => null,
});
const InstallationSection = dynamic(() => import("@/components/sections/InstallationSection"), {
  ssr: true,
  loading: () => null,
});
const FAQSection = dynamic(() => import("@/components/sections/FAQSection"), {
  ssr: true,
  loading: () => null,
});
const ComparisonsSection = dynamic(() => import("@/components/sections/ComparisonsSection"), {
  ssr: true,
  loading: () => null,
});
const BookACallSection = dynamic(() => import("@/components/sections/BookACallSection"), {
  ssr: true,
  loading: () => null,
});
const CaseStudySection = dynamic(() => import("@/components/sections/CaseStudySection"), {
  ssr: true,
  loading: () => null,
});

/** Bottom-left proof metrics (social-proof KPIs). Desktop hero only. */
const HERO_METRICS = [
  {
    value: "$19,000 saved",
    label: "ChartMetric (~95%)",
    href: "/case-studies/chartmetric" as const,
  },
  {
    value: "30+",
    label: "Features included",
  },
  {
    value: "24/7",
    label: "Real-person support",
  },
] as const;

export default function HomeContent() {
  const router = useRouter();
  const { theme } = useThemeContext();
  const { stars } = useGitHubStars("petera2c", "simple-table");
  const [iconLibrary, setIconLibrary] = useState<IconLibrary>("default");
  const [selectedTheme, setSelectedTheme] = useState<Theme>();
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const { framework, setFramework } = useFramework();
  const tableIcons = getTableIcons(iconLibrary);

  // Map theme: if user selected a theme, use it; otherwise use modern version of website theme
  const tableTheme = selectedTheme ? selectedTheme : mapWebsiteThemeToTableTheme(theme);

  const handleDocumentationClick = () => {
    trackCtaClick({
      cta_id: "homepage_docs",
      cta_text: "Go to docs",
      destination: "/docs/quick-start",
      location: "homepage_hero",
    });
    router.push("/docs/quick-start");
  };

  const handleCopyPromptClick = () => {
    const prompt = getAiSetupPrompt(framework);
    navigator.clipboard.writeText(prompt).then(() => {
      trackCopyAiSetupPrompt({
        framework,
        location: "homepage_hero",
      });
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    });
  };

  return (
    <PageWrapper>
      <AIVisibilityEnhancer pageType="home" />

      {/* Full-page atmosphere on desktop; mobile stays flat */}
      <div className="relative isolate">
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden lg:block"
          aria-hidden
        >
          <div className="absolute inset-0 bg-linear-to-b from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-gray-900 dark:to-gray-950" />
          <div
            className="absolute inset-0 bg-grid-pattern opacity-[0.55] dark:opacity-30
              [mask-image:linear-gradient(to_bottom,black_0%,black_18%,rgba(0,0,0,0.28)_40%,rgba(0,0,0,0.14)_70%,rgba(0,0,0,0.08)_100%)]
              [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_18%,rgba(0,0,0,0.28)_40%,rgba(0,0,0,0.14)_70%,rgba(0,0,0,0.08)_100%)]"
          />
          <div className="absolute -top-[10%] -left-[15%] h-[55vh] w-[55%] rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/15" />
          <div className="absolute top-0 -right-[12%] h-[50vh] w-[50%] rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute top-[28%] left-[28%] h-[35vh] w-[40%] rounded-full bg-indigo-200/15 blur-3xl dark:bg-indigo-400/8" />
          <div className="absolute top-[45%] -right-[18%] h-[40vh] w-[45%] rounded-full bg-blue-300/12 blur-3xl dark:bg-blue-400/8" />
          <div className="absolute top-[62%] -left-[20%] h-[35vh] w-[42%] rounded-full bg-sky-200/14 blur-3xl dark:bg-slate-500/10" />
          <div className="absolute top-[78%] left-[20%] h-[32vh] w-[48%] rounded-full bg-indigo-200/10 blur-3xl dark:bg-indigo-500/6" />
          <div className="absolute top-[92%] -right-[15%] h-[28vh] w-[40%] rounded-full bg-blue-200/10 blur-3xl dark:bg-blue-500/5" />
        </div>

      {/* ========== Mobile / tablet (< lg): original homepage hero ========== */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-[6dvh]">
        <section className="relative pb-12">
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                href="https://github.com/petera2c/simple-table"
                target="_blank"
                rel="noopener noreferrer"
                icon={<FontAwesomeIcon icon={faGithub} />}
                className="rounded-full px-2 py-3"
                size="small"
              >
                <span className="font-medium">Star us!</span>
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <span className="text-sm font-semibold">{stars || ""}</span>
              </Button>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              Big grid energy. Featherweight build.
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              A lightweight data grid packed with 30+ features, dropped into React, Vue, Angular,
              Svelte, Solid, or vanilla TypeScript in minutes — backed by support that actually
              replies.
            </motion.p>

            <motion.p
              className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.12 }}
            >
              Comparing options? See{" "}
              <Link
                href="/blog/ag-grid-alternatives-free-react-data-grids"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                free AG Grid alternatives
              </Link>
              {" · "}
              <Link
                href="/blog/best-vanilla-js-data-grid-2026"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                best JavaScript table libraries
              </Link>
              .
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <Button
                className="hover:scale-105 transition-transform"
                icon={<FontAwesomeIcon icon={faBookOpen} />}
                onClick={handleDocumentationClick}
                size="large"
                type="primary"
              >
                Go to docs
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Button>

              <Button
                size="large"
                icon={<FontAwesomeIcon icon={promptCopied ? faCheck : faCopy} />}
                onClick={handleCopyPromptClick}
                className="hover:scale-105 transition-transform"
              >
                {promptCopied ? "Copied!" : "Copy AI prompt"}
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
          <motion.div
            className="flex items-center gap-2 flex-wrap"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Tooltip title={isCodeVisible ? "Show preview" : "Show code"}>
              <Button
                className="min-w-[120px]"
                icon={<FontAwesomeIcon icon={faCode} />}
                onClick={() => setIsCodeVisible(!isCodeVisible)}
              >
                {isCodeVisible ? "Preview" : "Code"}
              </Button>
            </Tooltip>
            <Tooltip title="Open in StackBlitz">
              <Button
                href={getStackBlitzUrl("infrastructure", framework)}
                icon={<FontAwesomeIcon icon={faBox} />}
                target="_blank"
              >
                StackBlitz
              </Button>
            </Tooltip>
          </motion.div>
          <div className="hidden md:flex items-center gap-4 flex-wrap">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="text-sm text-gray-600 dark:text-gray-300">Theme:</span>
              <ThemeSelector currentTheme={selectedTheme} setCurrentTheme={setSelectedTheme} />
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <span className="text-sm text-gray-600 dark:text-gray-300">Icons:</span>
              <IconLibrarySelector currentIconLibrary={iconLibrary} onChange={setIconLibrary} />
            </motion.div>
          </div>
        </div>

        <motion.section
          className="mb-16 shadow-xl rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {isCodeVisible ? (
            <CodeBlock demoId="infrastructure" />
          ) : (
            <div className="h-[60dvh]">
              <Suspense fallback={<div className="h-full" aria-hidden />}>
                <InfrastructureExample
                  key={iconLibrary}
                  theme={tableTheme}
                  icons={tableIcons}
                  hideNameColumn
                />
              </Suspense>
            </div>
          )}
        </motion.section>

        <motion.div
          className="flex justify-center gap-2 flex-wrap mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw}
              onClick={() => setFramework(fw)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                framework === fw
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
              }`}
            >
              <FrameworkIcon framework={fw} size={16} />
              {FRAMEWORK_LABELS[fw]}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ========== Desktop (lg+): new split hero ========== */}
      <div className="hidden lg:block">
        <div className="relative max-w-[100rem] mx-auto px-8 lg:px-12 pt-6">
          <section className="relative mb-16 min-h-[calc(100dvh-6.5rem)] flex flex-col pb-2">
            <div className="grid grid-cols-2 gap-12 xl:gap-14 flex-1 items-center py-6">
              <motion.div
                className="flex flex-col justify-center text-left max-w-lg 2xl:max-w-2xl -mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.h1
                  className="text-4xl 2xl:text-6xl font-bold text-gray-900 dark:text-white leading-[1.12] 2xl:leading-[1.1] tracking-tight mb-6 2xl:mb-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  Big grid energy.
                  <br />
                  Featherweight build.
                </motion.h1>

                <div className="flex flex-col gap-3 2xl:gap-4 mb-10 2xl:mb-14 max-w-md 2xl:max-w-lg">
                  <motion.p
                    className="text-base 2xl:text-lg text-gray-600 dark:text-gray-300 leading-[1.65] 2xl:leading-[1.7]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    A lightweight data grid packed with 30+ features, dropped into React, Vue,
                    Angular, Svelte, Solid, or vanilla TypeScript in minutes — backed by support
                    that actually replies.
                  </motion.p>

                  <motion.p
                    className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.12 }}
                  >
                    Comparing options? See{" "}
                    <Link
                      href="/blog/ag-grid-alternatives-free-react-data-grids"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      free AG Grid alternatives
                    </Link>
                    {" · "}
                    <Link
                      href="/blog/best-vanilla-js-data-grid-2026"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      best JavaScript table libraries
                    </Link>
                    .
                  </motion.p>
                </div>

                <motion.div
                  className="flex flex-row gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <Button
                    className="hover:scale-105 transition-transform"
                    icon={<FontAwesomeIcon icon={faBookOpen} />}
                    onClick={handleDocumentationClick}
                    size="large"
                    type="primary"
                  >
                    Go to docs
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </Button>

                  <Button
                    size="large"
                    icon={<FontAwesomeIcon icon={promptCopied ? faCheck : faCopy} />}
                    onClick={handleCopyPromptClick}
                    className="hover:scale-105 transition-transform"
                  >
                    {promptCopied ? "Copied!" : "Copy AI prompt"}
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <Suspense fallback={<div className="h-full" aria-hidden />}>
                    <InfrastructureExample
                      theme={tableTheme}
                      icons={tableIcons}
                      height="60vh"
                      hideNameColumn
                    />
                  </Suspense>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-12 items-end"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="grid grid-cols-3 gap-8">
                {HERO_METRICS.map((metric) => {
                  const content = (
                    <>
                      <div className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {metric.value}
                      </div>
                      <div className="mt-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {metric.label}
                      </div>
                    </>
                  );

                  if ("href" in metric && metric.href) {
                    return (
                      <Link
                        key={metric.value}
                        href={metric.href}
                        className="hover:opacity-80 transition-opacity"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return <div key={metric.value}>{content}</div>;
                })}
              </div>

              <div className="justify-self-end">
                <div className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  Trusted by
                </div>
                <Link
                  href="/case-studies/chartmetric"
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                >
                  <span className="relative h-10 w-40">
                    <Image
                      src="/images/trusted-by/chart-metric.svg"
                      alt="ChartMetric"
                      fill
                      className="object-contain object-left dark:hidden"
                      sizes="160px"
                    />
                    <Image
                      src="/images/trusted-by/chart-metric-dark.svg"
                      alt="ChartMetric"
                      fill
                      className="object-contain object-left hidden dark:block"
                      sizes="160px"
                    />
                  </span>
                </Link>
              </div>
            </motion.div>
          </section>
        </div>
      </div>

      {/* Shared below-hero content (single mount) */}
      <div className="relative max-w-7xl lg:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-12 pb-12">
        <CaseStudySection />

        <FeaturesSection />

        <motion.section
          className="mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Explore Every Feature
          </h3>
          <Button
            type="primary"
            size="large"
            onClick={handleDocumentationClick}
            className="hover:scale-105 transition-transform"
          >
            View Full Documentation
          </Button>
        </motion.section>

        <ProductionSection />
        <InstallationSection />
        <ComparisonsSection />
        <BookACallSection />
        <FAQSection />
      </div>
      </div>
    </PageWrapper>
  );
}
