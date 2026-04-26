import { ReactNode } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCircleCheck,
  faTerminal,
  faTriangleExclamation,
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

export interface MappingRow {
  competitor: ReactNode;
  simpleTable: ReactNode;
  notes?: ReactNode;
}

export interface MigrationStep {
  title: string;
  body: ReactNode;
  code?: string;
}

export interface FromCompetitorMigrationLayoutProps {
  title: string;
  subtitle: string;
  canonicalPath: string;
  datePublished: string;
  dateModified: string;
  framework: HubFrameworkId;
  competitorName: string;
  competitorPackage: string;
  introParagraphs: string[];
  whyMigrate: string[];
  prerequisites: string[];
  installCommand: string;
  /** Optional before/after code snippets. Prefer linking to docs to avoid drift. */
  beforeSnippet?: string;
  afterSnippet?: string;
  mappingRows: MappingRow[];
  migrationSteps: MigrationStep[];
  gotchas: { title: string; body: ReactNode }[];
  faqs: { question: string; answer: string }[];
  relatedLinks?: { href: string; label: string }[];
}

export default function FromCompetitorMigrationLayout(props: FromCompetitorMigrationLayoutProps) {
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
    { name: "Migrations", url: "/migrations/v3" },
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
      <BlogLayout width="wide">
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/migrations/v3" className="text-blue-600 dark:text-blue-400 hover:underline">
            Migrations
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/frameworks/${props.framework}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {fw.label}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">from {props.competitorName}</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5">
              {props.competitorName}
            </span>
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            <span className="rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 font-medium">
              Simple Table for {fw.label}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {props.title}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">{props.subtitle}</p>
        </header>

        <section className="prose dark:prose-invert max-w-none mb-10">
          {props.introParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Why migrate
          </h2>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {props.whyMigrate.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="mt-1 text-green-500"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Prerequisites
          </h2>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc pl-6">
            {props.prerequisites.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faTerminal} className="text-green-500" aria-hidden="true" />
            Install
          </h3>
          <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
            <code>{props.installCommand}</code>
          </pre>
        </section>

        {props.beforeSnippet || props.afterSnippet ? (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {props.beforeSnippet ? (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Before — {props.competitorName}
                </h2>
                <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-xs overflow-x-auto">
                  <code>{props.beforeSnippet}</code>
                </pre>
              </div>
            ) : null}
            {props.afterSnippet ? (
              <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  After — Simple Table for {fw.label}
                </h2>
                <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-xs overflow-x-auto">
                  <code>{props.afterSnippet}</code>
                </pre>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            API mapping cheat sheet
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 pr-4 font-medium text-gray-700 dark:text-gray-300">
                    {props.competitorName}
                  </th>
                  <th className="text-left py-3 pr-4 font-medium text-gray-700 dark:text-gray-300">
                    Simple Table for {fw.label}
                  </th>
                  <th className="text-left py-3 font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.mappingRows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 align-top"
                  >
                    <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                      <code className="text-xs">{row.competitor}</code>
                    </td>
                    <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                      <code className="text-xs">{row.simpleTable}</code>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400 text-sm">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Step-by-step migration
          </h2>
          <ol className="space-y-6 text-sm text-gray-700 dark:text-gray-300 list-decimal pl-6">
            {props.migrationSteps.map((step) => (
              <li key={step.title}>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {step.title}
                </h3>
                <div className="prose dark:prose-invert prose-sm max-w-none">{step.body}</div>
                {step.code ? (
                  <pre className="mt-2 rounded-lg bg-gray-900 text-gray-100 p-4 text-xs overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        {props.gotchas.length > 0 ? (
          <section className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-amber-600"
                aria-hidden="true"
              />
              Gotchas
            </h2>
            <dl className="space-y-4">
              {props.gotchas.map((g) => (
                <div key={g.title}>
                  <dt className="font-medium text-gray-900 dark:text-gray-100">{g.title}</dt>
                  <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">{g.body}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

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

        {props.relatedLinks && props.relatedLinks.length > 0 ? (
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Keep going
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
