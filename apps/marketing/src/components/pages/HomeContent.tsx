"use client";

import { Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageWrapper from "@/components/PageWrapper";
import { faCode, faBox, faStar, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGitHubStars } from "@/hooks/useGitHubStars";
import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
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
import { SIMPLE_TABLE_INFO, AG_GRID_TOTAL_SIZE } from "@/constants/packageInfo";
import { FRAMEWORK_REQUIREMENTS } from "@/constants/strings/technical";
import ContactModal from "@/components/ContactModal";
import { mapWebsiteThemeToTableTheme } from "@/utils/themeMapper";

// Dynamically import heavy components that are below the fold or conditional
const CodeBlock = dynamic(() => import("@/components/CodeBlock"), { ssr: false });
const FeaturesSection = dynamic(() => import("@/components/sections/FeaturesSection"), {
  ssr: true,
});
const ProductionSection = dynamic(() => import("@/components/sections/ProductionSection"), {
  ssr: true,
});
const InstallationSection = dynamic(() => import("@/components/sections/InstallationSection"), {
  ssr: true,
});
const FAQSection = dynamic(() => import("@/components/sections/FAQSection"), { ssr: true });
const ComparisonsSection = dynamic(() => import("@/components/sections/ComparisonsSection"), {
  ssr: true,
});
const TrustedBySection = dynamic(() => import("@/components/sections/TrustedBySection"), {
  ssr: true,
});
const FeaturedOnSection = dynamic(() => import("@/components/sections/FeaturedOnSection"), {
  ssr: true,
});
const CaseStudySection = dynamic(() => import("@/components/sections/CaseStudySection"), {
  ssr: true,
});

export default function HomeContent() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { theme } = useThemeContext();
  const { stars } = useGitHubStars("petera2c", "simple-table");
  const [iconLibrary, setIconLibrary] = useState<IconLibrary>("default");
  const [selectedTheme, setSelectedTheme] = useState<Theme>();
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { framework, setFramework } = useFramework();
  const tableIcons = getTableIcons(iconLibrary);

  // Map theme: if user selected a theme, use it; otherwise use modern version of website theme
  const tableTheme = selectedTheme ? selectedTheme : mapWebsiteThemeToTableTheme(theme);

  // FAQ Schema for AI visibility
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Simple Table?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Simple Table is a lightweight JavaScript data grid and table library that's only ${SIMPLE_TABLE_INFO.bundleSizeMinGzip} in size. It works with React, Vue, Angular, Svelte, Solid, and vanilla JavaScript or TypeScript (simple-table-core), providing comprehensive features like cell editing, column management, sorting, filtering, and full TypeScript support.`,
        },
      },
      {
        "@type": "Question",
        name: "How does Simple Table compare to AG Grid?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Simple Table is a free alternative to AG Grid that's much lighter (${SIMPLE_TABLE_INFO.bundleSizeMinGzip} vs ${AG_GRID_TOTAL_SIZE}). While AG Grid has more enterprise features, Simple Table provides all the essential functionality most developers need for data grids, including cell editing, column management, sorting, filtering, and theming, without the licensing costs.`,
        },
      },
      {
        "@type": "Question",
        name: "Is Simple Table free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Simple Table is completely free for pre-revenue and bootstrapped projects. For revenue-generating businesses, affordable paid plans are available. You can install it via npm and start building data grids immediately.",
        },
      },
      {
        "@type": "Question",
        name: "Does Simple Table support TypeScript?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Simple Table has full TypeScript support with comprehensive type definitions. This provides excellent developer experience with autocomplete, type checking, and IntelliSense support in your IDE.",
        },
      },
      {
        "@type": "Question",
        name: "What features does Simple Table include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simple Table includes cell editing, column management (resizing, reordering, pinning, visibility), row grouping, pagination, sorting, filtering, custom themes, nested headers, custom renderers, and responsive design. It's designed to handle large datasets efficiently.",
        },
      },
      {
        "@type": "Question",
        name: "How do I install Simple Table?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Install Simple Table with your framework adapter, e.g. 'npm install @simple-table/react' (or @simple-table/vue, @simple-table/angular, etc.). The library is ready to use with minimal configuration in any supported framework.",
        },
      },
    ],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.simple-table.com",
      },
    ],
  };

  // Software Application Schema for better SEO
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Simple Table",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: [
      {
        "@type": "Offer",
        name: "Free Plan",
        price: "0",
        priceCurrency: "USD",
        description: "Free for zero-revenue companies and individuals",
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "85",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "85",
          priceCurrency: "USD",
          unitText: "MONTH",
        },
        description: "For revenue-generating businesses with priority support",
      },
    ],
    description: `Simple Table is a lightweight JavaScript data grid with first-class npm packages: @simple-table/react, @simple-table/vue, @simple-table/angular, @simple-table/svelte, @simple-table/solid, and simple-table-core for vanilla JavaScript or TypeScript. Only ${SIMPLE_TABLE_INFO.bundleSizeMinGzip} in size, production-ready with 30+ features including cell editing, column management, sorting, filtering, and full TypeScript support.`,
    url: "https://www.simple-table.com",
    downloadUrl: "https://www.npmjs.com/package/@simple-table/react",
    softwareVersion: SIMPLE_TABLE_INFO.version,
    author: {
      "@type": "Organization",
      name: "Simple Table",
      url: "https://www.simple-table.com",
    },
    softwareRequirements: `React ${FRAMEWORK_REQUIREMENTS.react}; Vue ${FRAMEWORK_REQUIREMENTS.vue}; Angular ${FRAMEWORK_REQUIREMENTS.angular}; Svelte ${FRAMEWORK_REQUIREMENTS.svelte}; Solid ${FRAMEWORK_REQUIREMENTS.solid}; ${FRAMEWORK_REQUIREMENTS.vanilla}.`,
    featureList: [
      "React adapter (@simple-table/react)",
      "Vue adapter (@simple-table/vue)",
      "Angular adapter (@simple-table/angular)",
      "Svelte adapter (@simple-table/svelte)",
      "Solid adapter (@simple-table/solid)",
      "Vanilla JavaScript / TypeScript (simple-table-core)",
    ],
    sameAs: [
      "https://github.com/petera2c/simple-table",
      "https://www.npmjs.com/package/@simple-table/react",
      "https://www.npmjs.com/package/simple-table-core",
      "https://github.com/brillout/awesome-react-components",
    ],
  };

  // Add schemas to head
  React.useEffect(() => {
    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);

    const breadcrumbScript = document.createElement("script");
    breadcrumbScript.type = "application/ld+json";
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    const softwareScript = document.createElement("script");
    softwareScript.type = "application/ld+json";
    softwareScript.textContent = JSON.stringify(softwareSchema);
    document.head.appendChild(softwareScript);

    return () => {
      document.head.removeChild(faqScript);
      document.head.removeChild(breadcrumbScript);
      document.head.removeChild(softwareScript);
    };
  }, [faqSchema, breadcrumbSchema, softwareSchema]);

  const handleDocumentationClick = () => {
    router.push("/docs/installation");
  };

  return (
    <PageWrapper>
      <AIVisibilityEnhancer pageType="home" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-[6dvh]">
        {/* Hero section */}
        <section className="relative pb-12">
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* GitHub Star Button */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
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
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The Data Grid for React, Vue, Angular, Svelte, Solid, and Vanilla TypeScript
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              A lightweight data grid with sorting, filtering, virtualization, column pinning, row
              grouping, inline editing, and much more.
            </motion.p>

            <motion.div
              className={`${isMobile ? "flex flex-col gap-4" : "flex justify-center gap-4"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                className="hover:scale-105 transition-transform"
                icon={<FontAwesomeIcon icon={faCode} />}
                onClick={handleDocumentationClick}
                size="large"
                type="primary"
              >
                Get Started
              </Button>

              <Button
                size="large"
                onClick={() => setIsContactModalOpen(true)}
                className="hover:scale-105 transition-transform"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Contact Us
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Theme and Icon Library Selectors */}
        <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
          <motion.div
            className="flex items-center gap-2 flex-wrap"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
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
          <div className="flex items-center gap-4 flex-wrap">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <span className="text-sm text-gray-600 dark:text-gray-300">Theme:</span>
              <ThemeSelector currentTheme={selectedTheme} setCurrentTheme={setSelectedTheme} />
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              <span className="text-sm text-gray-600 dark:text-gray-300">Icons:</span>
              <IconLibrarySelector currentIconLibrary={iconLibrary} onChange={setIconLibrary} />
            </motion.div>
          </div>
        </div>

        {/* Demo section with animated entrance */}
        <motion.section
          className="mb-16 shadow-xl rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {isCodeVisible ? (
            <CodeBlock demoId="infrastructure" />
          ) : (
            <Suspense fallback={<div />}>
              <InfrastructureExample key={iconLibrary} theme={tableTheme} icons={tableIcons} />
            </Suspense>
          )}
        </motion.section>

        {/* Framework Toggle Buttons */}
        <motion.div
          className="flex justify-center gap-2 flex-wrap mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
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

        <motion.div
          className="flex justify-center flex-wrap gap-2 mb-16"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          aria-label="Framework integration hubs"
        >
          {FRAMEWORKS.map((fw) => (
            <Link
              key={`hub-${fw}`}
              href={`/frameworks/${fw}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <FrameworkIcon framework={fw} size={14} />
              {FRAMEWORK_LABELS[fw]} hub
            </Link>
          ))}
        </motion.div>

        {/* Trusted By Section */}
        <TrustedBySection />

        {/* Case Study Section */}
        <CaseStudySection />

        {/* Featured On Section */}
        <FeaturedOnSection />

        {/* Main Features Section */}
        <FeaturesSection />

        {/* Explore All Features CTA */}
        <motion.section
          className="mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Explore 30+ Features
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

        {/* Built for Production Section */}
        <ProductionSection />

        {/* Installation Section */}
        <InstallationSection />

        {/* Comparisons section */}
        <ComparisonsSection />

        {/* FAQ Section */}
        <FAQSection />
      </div>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </PageWrapper>
  );
}
