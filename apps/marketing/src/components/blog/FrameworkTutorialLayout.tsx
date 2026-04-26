import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCheckCircle,
  faCircleCheck,
  faCircleXmark,
  faCode,
  faExclamationTriangle,
  faLightbulb,
  faRocket,
  faTable,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import {
  buildBreadcrumbListJsonLd,
  buildFaqPageJsonLd,
  buildTechArticleJsonLd,
} from "@/utils/structuredData";
import {
  FRAMEWORK_HUB_BY_ID,
  type HubFrameworkId,
} from "@/constants/frameworkIntegrationHub";
import OtherFrameworksCallout from "@/components/OtherFrameworksCallout";

export interface LibraryRow {
  library: string;
  support: { value: string; tone?: "good" | "bad" | "neutral" };
  notes: string;
}

export interface CodeSnippet {
  title: string;
  description?: string;
  code: string;
  language?: string;
}

export interface Pitfall {
  title: string;
  problem: string;
  solution: string;
}

export interface FrameworkTutorialLayoutProps {
  /** Slug — must match the BlogPostMetadata slug. */
  slug: string;
  title: string;
  subtitle: string;
  /** Framework this tutorial targets. */
  framework: HubFrameworkId;
  heroBadges?: string[];
  datePublished: string;
  dateModified: string;

  introParagraphs: React.ReactNode[];

  /** "Why this feature matters" — 2-4 short benefit cards. */
  whyItMatters: { title: string; body: string }[];

  /** Library comparison rows (3-7 rows). */
  libraryRows: LibraryRow[];

  /** "How Simple Table does it" — high-level guidance and notes. */
  simpleTableSection: {
    headline: string;
    intro: React.ReactNode;
    /** Optional inline snippets. Prefer linking to docs to avoid drift. */
    snippets?: CodeSnippet[];
    notes?: React.ReactNode;
  };

  /** Optional alternative implementation guidance. */
  alternativeSection?: {
    headline: string;
    intro: React.ReactNode;
    snippets?: CodeSnippet[];
    note?: React.ReactNode;
  };

  /** 3-5 common pitfalls with problem/solution. */
  pitfalls: Pitfall[];

  /** FAQ entries (3-6). */
  faqs: { question: string; answer: string }[];

  conclusionParagraphs: React.ReactNode[];

  /** Related links shown beneath the verdict. */
  relatedLinks: { href: string; label: string }[];

  /** CTA card text. */
  ctaTitle: string;
  ctaDescription: string;
  /** Optional doc destination for primary button. Defaults to /docs/installation. */
  docsHref?: string;
}

function ToneCell({
  tone,
  children,
}: {
  tone?: "good" | "bad" | "neutral";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    good: "text-green-600 dark:text-green-400",
    bad: "text-red-600 dark:text-red-400",
    neutral: "text-gray-700 dark:text-gray-300",
  };
  return <td className={`p-3 ${tones[tone ?? "neutral"]}`}>{children}</td>;
}

export default function FrameworkTutorialLayout(props: FrameworkTutorialLayoutProps) {
  const fw = FRAMEWORK_HUB_BY_ID[props.framework];
  const canonical = `/blog/${props.slug}`;

  const articleLd = buildTechArticleJsonLd({
    title: props.title,
    description: props.subtitle,
    canonicalPath: canonical,
    datePublished: props.datePublished,
    dateModified: props.dateModified,
  });
  const faqLd = buildFaqPageJsonLd(props.faqs);
  const breadcrumbsLd = buildBreadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: props.title, url: canonical },
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
        <section className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-4 md:p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
            {props.title}
          </h1>
          <div className="flex justify-center mb-4 gap-2 flex-wrap">
            {(props.heroBadges ?? ["Tutorial", "Guide"]).map((badge, i) => (
              <span
                key={badge}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                  i % 2 === 0
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                }`}
              >
                <FontAwesomeIcon icon={i === 0 ? faCode : faLightbulb} />
                {badge}
              </span>
            ))}
          </div>
          <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
            {props.subtitle}
          </p>
          <p className="text-base max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-400 mt-4">
            For{" "}
            <Link
              href={`/frameworks/${props.framework}`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              {fw.label}
            </Link>{" "}
            developers building data grids in 2026.
          </p>
        </section>

        <article className="space-y-8 mb-8">
          <section>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {props.introParagraphs.map((p, i) => (
                  <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
                Why it matters
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {props.whyItMatters.map((item) => (
                  <div
                    key={item.title}
                    className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500" />
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                <FontAwesomeIcon icon={faTrophy} className="text-amber-500" />
                {fw.label} library comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Library
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Support
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.libraryRows.map((row) => (
                      <tr
                        key={row.library}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                          {row.library}
                        </td>
                        <ToneCell tone={row.support.tone}>{row.support.value}</ToneCell>
                        <td className="p-3 text-gray-700 dark:text-gray-300">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                <FontAwesomeIcon icon={faCode} className="text-green-500" />
                {props.simpleTableSection.headline}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {props.simpleTableSection.intro}
                </p>
                {props.simpleTableSection.snippets?.map((snippet) => (
                  <div key={snippet.title} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      {snippet.title}
                    </h3>
                    {snippet.description && (
                      <p className="mb-3 text-gray-700 dark:text-gray-300">{snippet.description}</p>
                    )}
                    <CodeBlock
                      className="mb-2"
                      code={snippet.code}
                      language={snippet.language ?? "tsx"}
                      showThemeToggle={false}
                    />
                  </div>
                ))}
                {props.simpleTableSection.notes && (
                  <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {props.simpleTableSection.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {props.alternativeSection && (
            <section>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                  <FontAwesomeIcon icon={faTable} className="text-purple-500" />
                  {props.alternativeSection.headline}
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    {props.alternativeSection.intro}
                  </p>
                  {props.alternativeSection.snippets?.map((snippet) => (
                    <div key={snippet.title} className="mb-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                        {snippet.title}
                      </h3>
                      {snippet.description && (
                        <p className="mb-3 text-gray-700 dark:text-gray-300">{snippet.description}</p>
                      )}
                      <CodeBlock
                        className="mb-2"
                        code={snippet.code}
                        language={snippet.language ?? "tsx"}
                        showThemeToggle={false}
                      />
                    </div>
                  ))}
                  {props.alternativeSection.note && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {props.alternativeSection.note}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
                Common pitfalls
              </h2>
              <div className="space-y-4">
                {props.pitfalls.map((p) => (
                  <div
                    key={p.title}
                    className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCircleXmark} className="text-amber-500" />
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      <strong>Problem:</strong> {p.problem}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Solution:</strong> {p.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                <FontAwesomeIcon icon={faBolt} className="text-blue-500" />
                Frequently asked questions
              </h2>
              <dl className="space-y-4">
                {props.faqs.map((q) => (
                  <div key={q.question}>
                    <dt className="font-semibold text-gray-900 dark:text-gray-100">{q.question}</dt>
                    <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">{q.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                <FontAwesomeIcon icon={faRocket} className="text-green-500" />
                Wrap-up
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {props.conclusionParagraphs.map((p, i) => (
                  <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">
                    {p}
                  </p>
                ))}
                <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Related reading:
                  </p>
                  <div className="flex gap-4 flex-wrap text-sm">
                    {props.relatedLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <FontAwesomeIcon icon={faCircleCheck} className="mr-1" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>

        <OtherFrameworksCallout currentFramework={props.framework} />

        <CallToActionCard
          title={props.ctaTitle}
          description={props.ctaDescription}
          primaryButton={{ text: "View documentation", href: props.docsHref ?? "/docs/installation" }}
          secondaryButton={{ text: "Try interactive demo", href: "/examples" }}
        />
      </BlogLayout>
    </>
  );
}
