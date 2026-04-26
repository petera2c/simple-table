import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBalanceScale,
  faBolt,
  faCheckCircle,
  faCircleCheck,
  faCircleXmark,
  faCode,
  faLightbulb,
  faRocket,
  faTable,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
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

export interface ComparisonRow {
  feature: string;
  simpleTable: { value: string; tone?: "good" | "bad" | "neutral" };
  competitor: { value: string; tone?: "good" | "bad" | "neutral" };
}

export interface BulletList {
  title: string;
  items: string[];
}

export interface ScenarioCard {
  emoji: string;
  title: string;
  body: string;
  recommendation: "simpleTable" | "competitor";
  recommendationLabel: string;
}

export interface CompetitorBlogLayoutProps {
  /** Slug — must match the BlogPostMetadata slug. */
  slug: string;
  title: string;
  subtitle: string;
  competitorName: string;
  /** Framework this article targets (Angular, Vue, Svelte, Solid, Vanilla, React). */
  framework: HubFrameworkId;
  /** Hero badges (Comparison / Performance / Decision Guide etc.). */
  heroBadges?: string[];
  datePublished: string;
  dateModified: string;

  /** 3-5 paragraphs of intro content. */
  introParagraphs: React.ReactNode[];

  /** Quick comparison table (~6-10 rows). */
  comparisonRows: ComparisonRow[];

  /** "Why choose Simple Table" + "Why choose Competitor" bullet lists. */
  whyChoose: { simpleTable: BulletList; competitor: BulletList };

  /** Real-world scenarios (4-6 cards). */
  scenarios: ScenarioCard[];

  /** FAQ section (3-6 entries). */
  faqs: { question: string; answer: string }[];

  /** Conclusion (1-3 paragraphs). */
  conclusionParagraphs: React.ReactNode[];

  /** Related blog or comparison links. */
  relatedLinks: { href: string; label: string }[];

  /** CTA card text. */
  ctaTitle: string;
  ctaDescription: string;
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
  return <td className={`p-3 text-center ${tones[tone ?? "neutral"]}`}>{children}</td>;
}

export default function CompetitorBlogLayout(props: CompetitorBlogLayoutProps) {
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
            {(props.heroBadges ?? ["Comparison", "Decision Guide"]).map((badge, i) => (
              <span
                key={badge}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                  i % 2 === 0
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                }`}
              >
                <FontAwesomeIcon icon={i === 0 ? faBalanceScale : faLightbulb} />
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
            developers comparing data grid options in 2026.
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
                <FontAwesomeIcon icon={faTrophy} className="text-amber-500" />
                Quick comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Feature
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                        {props.competitorName}
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Simple Table for {fw.label}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.comparisonRows.map((row) => (
                      <tr
                        key={row.feature}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                          {row.feature}
                        </td>
                        <ToneCell tone={row.competitor.tone}>{row.competitor.value}</ToneCell>
                        <ToneCell tone={row.simpleTable.tone}>{row.simpleTable.value}</ToneCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-blue-500" />
                {props.whyChoose.competitor.title}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {props.whyChoose.competitor.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faBolt} className="text-green-500" />
                {props.whyChoose.simpleTable.title}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {props.whyChoose.simpleTable.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                <FontAwesomeIcon icon={faCode} className="text-purple-500" />
                Real-world scenarios
              </h2>
              <div className="space-y-4">
                {props.scenarios.map((s) => (
                  <div
                    key={s.title}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                  >
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      <span aria-hidden="true">{s.emoji}</span> {s.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{s.body}</p>
                    <p
                      className={`text-sm font-semibold ${
                        s.recommendation === "simpleTable"
                          ? "text-green-600 dark:text-green-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={s.recommendation === "simpleTable" ? faCheckCircle : faCircleXmark}
                        className="mr-1"
                      />{" "}
                      {s.recommendationLabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                <FontAwesomeIcon icon={faTable} className="text-blue-500" />
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
                The verdict
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
                        → {link.label}
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
          primaryButton={{ text: "View documentation", href: "/docs/installation" }}
          secondaryButton={{ text: "Try interactive demo", href: "/examples" }}
        />
      </BlogLayout>
    </>
  );
}
