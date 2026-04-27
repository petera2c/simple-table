import type { ReactNode } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faTrophy,
  faTable,
  faCode,
  faRocket,
  faCheckCircle,
  faBalanceScale,
  faStar,
  faChartLine,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import type { BlogPostMetadata } from "@/constants/blogPosts";
import {
  FRAMEWORK_HUB_BY_ID,
  SIMPLE_TABLE_MULTI_FRAMEWORK_TAGLINE,
  type HubFrameworkId,
} from "@/constants/frameworkIntegrationHub";
import { getStackBlitzUrl } from "@/utils/getStackBlitzUrl";
import type { Framework } from "@/providers/FrameworkProvider";
import { buildTechArticleJsonLd, buildFaqPageJsonLd } from "@/utils/structuredData";

const TONE_CLASSES = {
  green:
    "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
  blue: "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
  purple:
    "border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  amber:
    "border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  yellow:
    "border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
  red: "border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
} as const;

type Tone = keyof typeof TONE_CLASSES;

const ICON_TONE_CLASSES: Record<Tone, string> = {
  green: "text-green-500",
  blue: "text-blue-500",
  purple: "text-purple-500",
  amber: "text-amber-500",
  yellow: "text-yellow-500",
  red: "text-red-500",
};

export type ComparisonCellTone = "yes" | "no" | "partial" | "neutral";

export interface ComparisonCell {
  /** Visual tone — yes/no/partial drive the standard ✓ / ✗ / amber styling. */
  tone: ComparisonCellTone;
  /** Override label. Defaults to ✓ / ✗ / "Partial". */
  label?: string;
}

export interface ComparisonRow {
  feature: string;
  /** Cell for Simple Table (always first column). */
  ours: ComparisonCell;
  /** Remaining cells in the same order as `competitors`. */
  values: ComparisonCell[];
}

export interface PerformanceNumber {
  name: string;
  value: string;
  caption: string;
  tone: "good" | "warn" | "bad";
}

export interface PillarPositioningArticleProps {
  post: BlogPostMetadata;
  hubId: HubFrameworkId;

  /** Hero badges shown under the H1 — typically 4. */
  heroBadges: { icon: IconDefinition; label: string; tone: Tone }[];

  /** Headline above the intro paragraphs. */
  introHeading: string;
  /** 2–3 paragraphs explaining the framework-specific landscape. */
  introParagraphs: string[];
  /** Bullet list inside the "What you'll learn" callout. */
  whatYoullLearn: string[];

  /** Headline above the four "why we win" cards. */
  whyHeading: string;
  whyIntro: string;
  whyCards: { icon: IconDefinition; title: string; body: string; tone: Tone }[];

  /** Headline above the comparison table. */
  comparisonHeading: string;
  comparisonIntro: string;
  /** Display names for the 2-4 stack-native incumbents you compare with. */
  competitors: string[];
  comparisonRows: ComparisonRow[];
  /** Closing summary inside the green/blue callout below the table. */
  comparisonSummary: string;

  /** Optional performance section. Omit to skip. */
  performance?: {
    heading: string;
    intro: string;
    numbers: PerformanceNumber[];
    highlights: string[];
  };

  /** Install copy + the npm command. Detailed code samples live on the docs site. */
  install: {
    heading: string;
    intro: string;
    installCommand: string;
  };

  /** Optional FAQ list — emits FAQPage JSON-LD as well. */
  faqs?: { question: string; answer: string }[];

  /** Closing section. */
  conclusionHeading: string;
  conclusionParagraphs: string[];

  /** Related blog posts surfaced at the bottom. */
  relatedBlogs?: { slug: string; title: string }[];

  /** CTA card at the very end. */
  cta: {
    title: string;
    description: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
  };

  /** Optional renderer for any extra section to insert before the conclusion. */
  extraSection?: ReactNode;
}

function ToneCallout({
  tone,
  icon,
  title,
  children,
}: {
  tone: Tone;
  icon: IconDefinition;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-lg p-4 border ${TONE_CLASSES[tone]}`}>
      <div className="flex items-center gap-2 mb-2">
        <FontAwesomeIcon icon={icon} className={ICON_TONE_CLASSES[tone]} />
        <span className="font-medium">{title}</span>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ComparisonValueCell({ cell }: { cell: ComparisonCell }) {
  const className =
    "border border-gray-200 dark:border-gray-700 p-3 text-center text-sm";
  if (cell.label) {
    const toneText =
      cell.tone === "yes"
        ? "text-green-600 dark:text-green-400 font-bold"
        : cell.tone === "no"
          ? "text-red-600 dark:text-red-400"
          : cell.tone === "partial"
            ? "text-amber-600 dark:text-amber-400"
            : "text-gray-700 dark:text-gray-300";
    return (
      <td className={className}>
        <span className={toneText}>{cell.label}</span>
      </td>
    );
  }
  if (cell.tone === "yes") {
    return (
      <td className={className}>
        <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
      </td>
    );
  }
  if (cell.tone === "no") {
    return (
      <td className={className}>
        <span className="text-red-600 dark:text-red-400">✗</span>
      </td>
    );
  }
  if (cell.tone === "partial") {
    return (
      <td className={className}>
        <span className="text-amber-600 dark:text-amber-400">Partial</span>
      </td>
    );
  }
  return (
    <td className={className}>
      <span className="text-gray-700 dark:text-gray-300">—</span>
    </td>
  );
}

export default function PillarPositioningArticle(props: PillarPositioningArticleProps) {
  const fw = FRAMEWORK_HUB_BY_ID[props.hubId];
  const stackBlitzUrl = getStackBlitzUrl("quick-start", props.hubId as Framework);
  const articleJsonLd = buildTechArticleJsonLd({
    title: props.post.title,
    description: props.post.description,
    canonicalPath: `/blog/${props.post.slug}`,
    datePublished: props.post.createdAt,
    dateModified: props.post.updatedAt,
  });
  const faqJsonLd = props.faqs?.length ? buildFaqPageJsonLd(props.faqs) : null;
  const perfNumberToneClass = {
    good: "text-green-600 dark:text-green-400",
    warn: "text-amber-600 dark:text-amber-400",
    bad: "text-red-600 dark:text-red-400",
  } as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <BlogLayout>
        <section className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-2">
            {props.post.createdAt} · {fw.label} · Pillar guide
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
            {props.post.title}
          </h1>

          <div className="flex justify-center mb-4 gap-2 flex-wrap">
            {props.heroBadges.map((badge) => (
              <span
                key={badge.label}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${TONE_CLASSES[badge.tone]}`}
              >
                <FontAwesomeIcon icon={badge.icon} />
                {badge.label}
              </span>
            ))}
          </div>

          <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
            {props.post.description}
          </p>
        </section>

        <article className="space-y-8">
          <section id="introduction">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
                <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                {props.introHeading}
              </h3>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {props.introParagraphs.map((p, i) => (
                  <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">
                    {p}
                  </p>
                ))}
                <ToneCallout tone="blue" icon={faCheckCircle} title="What You'll Learn">
                  <ul className="space-y-1">
                    {props.whatYoullLearn.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </ToneCallout>
              </div>
            </div>
          </section>

          <section id="why-simple-table-wins">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
                <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
                {props.whyHeading}
              </h3>
              <p className="mb-6 text-gray-700 dark:text-gray-300">{props.whyIntro}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {props.whyCards.map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-lg p-4 border ${TONE_CLASSES[card.tone]}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={card.icon} className={ICON_TONE_CLASSES[card.tone]} />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {card.title}
                      </h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="detailed-comparison">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
                <FontAwesomeIcon icon={faBalanceScale} className="text-blue-500" />
                {props.comparisonHeading}
              </h3>
              <p className="mb-6 text-gray-700 dark:text-gray-300">{props.comparisonIntro}</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                        Feature
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 p-3 text-center font-semibold text-green-700 dark:text-green-400">
                        Simple Table
                      </th>
                      {props.competitors.map((name) => (
                        <th
                          key={name}
                          className="border border-gray-200 dark:border-gray-700 p-3 text-center font-semibold text-gray-900 dark:text-gray-100"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {props.comparisonRows.map((row, idx) => (
                      <tr
                        key={row.feature}
                        className={idx % 2 === 1 ? "bg-gray-50 dark:bg-gray-900" : ""}
                      >
                        <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium text-gray-900 dark:text-gray-100">
                          {row.feature}
                        </td>
                        <ComparisonValueCell cell={row.ours} />
                        {row.values.map((cell, i) => (
                          <ComparisonValueCell key={i} cell={cell} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <ToneCallout tone="green" icon={faCheckCircle} title="The Bottom Line">
                  <p>{props.comparisonSummary}</p>
                </ToneCallout>
              </div>
            </div>
          </section>

          {props.performance ? (
            <section id="performance-benchmarks">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
                  <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
                  {props.performance.heading}
                </h3>
                <p className="mb-6 text-gray-700 dark:text-gray-300">{props.performance.intro}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                  {props.performance.numbers.map((n) => (
                    <div
                      key={n.name}
                      className="text-center border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className={`text-2xl font-bold mb-2 ${perfNumberToneClass[n.tone]}`}>
                        {n.value}
                      </div>
                      <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {n.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{n.caption}</div>
                    </div>
                  ))}
                </div>
                <ToneCallout tone="blue" icon={faRocket} title="Performance highlights">
                  <ul className="space-y-1">
                    {props.performance.highlights.map((h) => (
                      <li key={h}>• {h}</li>
                    ))}
                  </ul>
                </ToneCallout>
              </div>
            </section>
          ) : null}

          <section id="install">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
                <FontAwesomeIcon icon={faCode} className="text-blue-500" />
                {props.install.heading}
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{props.install.intro}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Install:</p>
              <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto mb-4">
                <code>{props.install.installCommand}</code>
              </pre>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Follow the{" "}
                <Link
                  href="/docs/quick-start"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Quick Start guide
                </Link>{" "}
                or open the StackBlitz sandbox below for a full, runnable {fw.label} example.
              </p>
            </div>
          </section>

          {props.extraSection}

          {props.faqs?.length ? (
            <section id="faq">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
                  <FontAwesomeIcon icon={faTable} className="text-purple-500" />
                  Frequently asked questions
                </h3>
                <div className="space-y-4">
                  {props.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <section id="conclusion">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
                <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
                {props.conclusionHeading}
              </h3>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {props.conclusionParagraphs.map((p, i) => (
                  <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">
                    {p}
                  </p>
                ))}
                <ToneCallout
                  tone="blue"
                  icon={faCheckCircle}
                  title={`Continue building with ${fw.label}`}
                >
                  <p>{SIMPLE_TABLE_MULTI_FRAMEWORK_TAGLINE}</p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <Link href={`/frameworks/${props.hubId}`}>
                      <Button type="primary" size="middle" block>
                        {fw.label} setup hub
                      </Button>
                    </Link>
                    <a href={stackBlitzUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="middle" block>
                        StackBlitz quick start
                      </Button>
                    </a>
                  </div>
                </ToneCallout>
              </div>
            </div>
          </section>

          {props.relatedBlogs?.length ? (
            <section id="related-reading">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
                  <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
                  Related reading
                </h3>
                <ul className="space-y-2">
                  {props.relatedBlogs.map((b) => (
                    <li key={b.slug}>
                      <Link
                        href={`/blog/${b.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {b.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}
        </article>

        <CallToActionCard
          title={props.cta.title}
          description={props.cta.description}
          primaryButton={{ text: props.cta.primaryLabel, href: props.cta.primaryHref }}
          secondaryButton={{ text: props.cta.secondaryLabel, href: props.cta.secondaryHref }}
        />
      </BlogLayout>
    </>
  );
}
