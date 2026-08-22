"use client";

import { motion } from "framer-motion";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CASE_STUDIES } from "@/constants/caseStudies";

export default function CaseStudySection() {
  const router = useRouter();
  const chartmetric = CASE_STUDIES.find((s) => s.slug === "chartmetric");

  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Mobile/tablet only — desktop hero already has Trusted by + ChartMetric */}
      <div className="lg:hidden">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
            Trusted by teams at
          </h3>
        </div>
        <div className="flex justify-center mb-8">
          <div className="relative h-12 w-32 md:h-14 md:w-40">
            <Image
              src="/images/trusted-by/chart-metric.svg"
              alt="ChartMetric logo"
              fill
              className="object-contain dark:hidden"
              sizes="(max-width: 768px) 128px, 160px"
            />
            <Image
              src="/images/trusted-by/chart-metric-dark.svg"
              alt="ChartMetric logo"
              fill
              className="object-contain hidden dark:block"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <a
          href="https://github.com/brillout/awesome-react-components"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faGithub} />
          <span>
            Featured on <span className="font-semibold">Awesome React Components</span>
          </span>
        </a>
      </div>

      <div className="bg-surface rounded-lg p-8 md:p-12 border border-line">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 border border-line rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faQuoteLeft} className="text-muted text-xl" />
            </div>
          </div>

          <blockquote className="text-center mb-8">
            <p className="text-xl md:text-2xl font-semibold text-ink mb-4">
              &ldquo;It&apos;s a great fit for table-heavy products like ours. It&apos;s affordable,
              lightweight, feature-rich, and easy to customize.&rdquo;
            </p>
            <footer className="text-muted">
              <div className="font-semibold">ChartMetric</div>
              <div className="text-sm">Music Analytics Platform</div>
            </footer>
          </blockquote>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-paper rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-ink mb-1">
                {chartmetric?.highlightStat ?? "$19K+"}
              </div>
              <div className="text-sm text-muted">
                {chartmetric?.highlightLabel ?? "First-year savings vs AG Grid"}
              </div>
            </div>
            <div className="bg-paper rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-ink mb-1">
                {chartmetric?.secondaryStat ?? "~95%"}
              </div>
              <div className="text-sm text-muted">
                {chartmetric?.secondaryLabel ?? "ChartMetric cost cut vs AG Grid"}
              </div>
            </div>
            <div className="bg-paper rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-ink mb-1">
                &lt;24h
              </div>
              <div className="text-sm text-muted">
                Response time for support & bug fixes
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/case-studies/chartmetric")}
            >
              Read the Full Case Study
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
