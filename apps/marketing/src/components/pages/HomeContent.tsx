"use client";

import { Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageWrapper from "@/components/PageWrapper";
import { faCode, faBox, faStar, faTable } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGitHubStars } from "@/hooks/useGitHubStars";
import { Suspense, useState } from "react";
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
import { DEFAULT_EXAMPLE_PATH } from "@/constants/global";
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
const CaseStudySection = dynamic(() => import("@/components/sections/CaseStudySection"), {
  ssr: true,
});

export default function HomeContent() {
  const router = useRouter();
  const { theme } = useThemeContext();
  const { stars } = useGitHubStars("petera2c", "simple-table");
  const [iconLibrary, setIconLibrary] = useState<IconLibrary>("default");
  const [selectedTheme, setSelectedTheme] = useState<Theme>();
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const { framework, setFramework } = useFramework();
  const tableIcons = getTableIcons(iconLibrary);

  // Map theme: if user selected a theme, use it; otherwise use modern version of website theme
  const tableTheme = selectedTheme ? selectedTheme : mapWebsiteThemeToTableTheme(theme);

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
            transition={{ duration: 0.4 }}
          >
            {/* GitHub Star Button */}
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
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              A lightweight data grid packed with 30+ features, dropped into React, Vue, Angular,
              Svelte, Solid, or vanilla TypeScript in minutes — backed by support that actually
              replies.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
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
                onClick={() => router.push(DEFAULT_EXAMPLE_PATH)}
                className="hover:scale-105 transition-transform"
              >
                <FontAwesomeIcon icon={faTable} className="mr-2" />
                Live Examples
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
          <div className="flex items-center gap-4 flex-wrap">
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

        {/* Demo section with animated entrance */}
        <motion.section
          className="mb-16 shadow-xl rounded-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
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

        {/* Case Study Section (includes trusted-by and featured-on proof) */}
        <CaseStudySection />

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

        {/* Built for Production Section */}
        <ProductionSection />

        {/* Installation Section */}
        <InstallationSection />

        {/* Comparisons section */}
        <ComparisonsSection />

        {/* FAQ Section */}
        <FAQSection />
      </div>
    </PageWrapper>
  );
}
