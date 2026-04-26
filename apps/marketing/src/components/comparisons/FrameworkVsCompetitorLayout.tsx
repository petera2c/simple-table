import { ReactNode } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCheck,
  faChevronRight,
  faCircleInfo,
  faTerminal,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import BlogLayout from "@/components/BlogLayout";
import {
  buildBreadcrumbListJsonLd,
  buildFaqPageJsonLd,
  buildTechArticleJsonLd,
} from "@/utils/structuredData";
import {
  FRAMEWORK_HUB_BY_ID,
  type HubFrameworkId,
} from "@/constants/frameworkIntegrationHub";

type Verdict = "yes" | "no" | "partial" | "info";

export interface FeatureRow {
  feature: string;
  simpleTable: { verdict: Verdict; note?: string };
  competitor: { verdict: Verdict; note?: string };
}

export interface PricingRow {
  tier: string;
  simpleTable: string;
  competitor: string;
}

export interface FrameworkVsCompetitorLayoutProps {
  title: string;
  subtitle: string;
  canonicalPath: string;
  /** Stable date strings for JSON-LD. */
  datePublished: string;
  dateModified: string;
  framework: HubFrameworkId;
  competitorName: string;
  competitorPackage: string;
  heroBadges: { icon: IconDefinition; label: string }[];
  introParagraphs: string[];
  whyChooseSimpleTable: string[];
  whyChooseCompetitor: string[];
  featureRows: FeatureRow[];
  pricingRows?: PricingRow[];
  bundleSizeNote?: ReactNode;
  installCommand: string;
  /** Optional migration snippet. Prefer linking to docs to avoid drift. */
  migrationSnippet?: string;
  migrationCallout?: ReactNode;
  faqs: { question: string; answer: string }[];
  conclusion: ReactNode;
  relatedLinks?: { href: string; label: string }[];
}

function VerdictCell({ verdict, note }: { verdict: Verdict; note?: string }) {
  const iconByVerdict: Record<Verdict, IconDefinition> = {
    yes: faCheck,
    no: faXmark,
    partial: faCircleInfo,
    info: faCircleInfo,
  };
  const colorByVerdict: Record<Verdict, string> = {
    yes: "text-green-600 dark:text-green-400",
    no: "text-red-500 dark:text-red-400",
    partial: "text-amber-600 dark:text-amber-400",
    info: "text-blue-600 dark:text-blue-400",
  };
  return (
    <div className="flex items-start gap-2">
      <FontAwesomeIcon
        icon={iconByVerdict[verdict]}
        className={`mt-1 ${colorByVerdict[verdict]}`}
        aria-hidden="true"
      />
      {note ? <span className="text-sm text-gray-700 dark:text-gray-300">{note}</span> : null}
    </div>
  );
}

export default function FrameworkVsCompetitorLayout(props: FrameworkVsCompetitorLayoutProps) {
  const fw = FRAMEWORK_HUB_BY_ID[props.framework];
  const articleLd = buildTechArticleJsonLd({
    title: props.title,
    description: props.subtitle,
    canonicalPath: props.canonicalPath,
    datePublished: props.datePublished,
    dateModified: props.dateModified,
  });
  const faqLd = buildFaqPageJsonLd(props.faqs);
  const breadcrumbsLd = buildBreadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons/simple-table-vs-ag-grid" },
    { name: props.title, url: props.canonicalPath },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <BlogLayout>
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/comparisons/simple-table-vs-ag-grid" className="text-blue-600 dark:text-blue-400 hover:underline">
            Comparisons
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/frameworks/${props.framework}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {fw.label}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">vs {props.competitorName}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {props.title}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mb-4">
            {props.subtitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {props.heroBadges.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 text-xs font-medium"
              >
                <FontAwesomeIcon icon={b.icon} aria-hidden="true" />
                {b.label}
              </span>
            ))}
          </div>
        </header>

        <section className="prose dark:prose-invert max-w-none mb-10">
          {props.introParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Choose Simple Table for {fw.label} when…
            </h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {props.whyChooseSimpleTable.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheck} className="mt-1 text-green-500" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Choose {props.competitorName} when…
            </h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {props.whyChooseCompetitor.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="mt-1 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Feature comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 pr-4 font-medium text-gray-700 dark:text-gray-300">
                    Feature
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-gray-700 dark:text-gray-300">
                    Simple Table for {fw.label}
                  </th>
                  <th className="text-left py-3 font-medium text-gray-700 dark:text-gray-300">
                    {props.competitorName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.featureRows.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  >
                    <td className="py-3 pr-4 align-top text-gray-900 dark:text-gray-100 font-medium">
                      {row.feature}
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <VerdictCell verdict={row.simpleTable.verdict} note={row.simpleTable.note} />
                    </td>
                    <td className="py-3 align-top">
                      <VerdictCell verdict={row.competitor.verdict} note={row.competitor.note} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {props.bundleSizeNote ? (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{props.bundleSizeNote}</p>
          ) : null}
        </section>

        {props.pricingRows ? (
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Pricing & licensing
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 pr-4 font-medium text-gray-700 dark:text-gray-300">
                      Tier
                    </th>
                    <th className="text-left py-3 pr-4 font-medium text-gray-700 dark:text-gray-300">
                      Simple Table
                    </th>
                    <th className="text-left py-3 font-medium text-gray-700 dark:text-gray-300">
                      {props.competitorName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {props.pricingRows.map((row) => (
                    <tr
                      key={row.tier}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                    >
                      <td className="py-3 pr-4 align-top text-gray-900 dark:text-gray-100 font-medium">
                        {row.tier}
                      </td>
                      <td className="py-3 pr-4 align-top text-gray-700 dark:text-gray-300">
                        {row.simpleTable}
                      </td>
                      <td className="py-3 align-top text-gray-700 dark:text-gray-300">
                        {row.competitor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faTerminal} className="text-green-500" aria-hidden="true" />
            Migrate to Simple Table on {fw.label}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Replace your existing {props.competitorName} usage with{" "}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">
              {fw.npmPackage}
            </code>
            .
          </p>
          <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto mb-4">
            <code>{props.installCommand}</code>
          </pre>
          {props.migrationSnippet ? (
            <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
              <code>{props.migrationSnippet}</code>
            </pre>
          ) : null}
          {props.migrationCallout ? (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {props.migrationCallout}
            </p>
          ) : null}
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">FAQ</h2>
          <dl className="space-y-4">
            {props.faqs.map((q) => (
              <div key={q.question}>
                <dt className="font-medium text-gray-900 dark:text-gray-100">{q.question}</dt>
                <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">{q.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Bottom line
          </h2>
          <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
            {props.conclusion}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/frameworks/${props.framework}`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              See {fw.label} setup
            </Link>
            <Link
              href="/docs/quick-start"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              Quick start docs
            </Link>
          </div>
        </section>

        {props.relatedLinks && props.relatedLinks.length > 0 ? (
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Related comparisons & guides
            </h2>
            <ul className="space-y-2">
              {props.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </BlogLayout>
    </>
  );
}
