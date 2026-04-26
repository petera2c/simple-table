import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faBox, faTerminal } from "@fortawesome/free-solid-svg-icons";
import {
  FRAMEWORK_HUB_BY_ID,
  FRAMEWORK_HUB_IDS,
  type HubFrameworkId,
  getNpmPackageUrl,
} from "@/constants/frameworkIntegrationHub";
import { FRAMEWORK_HUB_PILLAR_BLOG_SLUG } from "@/constants/frameworkPillarBlogs";
import {
  getFrameworkHubFaqItems,
  getFrameworkHubWhyParagraph,
} from "@/constants/frameworkHubSeoContent";
import {
  FRAMEWORK_COMPETITORS,
  FRAMEWORK_ELEVATOR_PITCH,
} from "@/constants/frameworkCompetitors";
import type { Framework } from "@/providers/FrameworkProvider";
import { getStackBlitzUrl } from "@/utils/getStackBlitzUrl";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import AIVisibilityEnhancer from "@/components/AIVisibilityEnhancer";
import {
  buildFaqPageJsonLd,
  buildFrameworkHubSoftwareJsonLd,
} from "@/utils/structuredData";

type PageProps = { params: Promise<{ framework: string }> };

export function generateStaticParams() {
  return FRAMEWORK_HUB_IDS.map((framework) => ({ framework }));
}

function isHubId(value: string): value is HubFrameworkId {
  return FRAMEWORK_HUB_IDS.includes(value as HubFrameworkId);
}

const HUB_SOFTWARE_FEATURES = [
  "Shared simple-table-core engine across adapters",
  "Sorting, filtering, column resize, pin, and visibility",
  "Cell editing, custom renderers, themes, and keyboard UX",
  "TypeScript-first APIs and published CSS themes",
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { framework: raw } = await params;
  if (!isHubId(raw)) {
    return { title: "Framework hub" };
  }
  const fw = FRAMEWORK_HUB_BY_ID[raw];
  const competitors = FRAMEWORK_COMPETITORS[raw];
  const title = `${fw.label} data grid setup | Simple Table`;
  const description = `Install ${fw.npmPackage} for ${fw.label}: npm command, styles import, peers (${fw.peerSummary}), FAQs, pillar guide, and links to runnable examples and docs. Free MIT alternative to ${competitors.slice(0, 3).join(", ")}.`;
  const lowerLabel = fw.label.toLowerCase();
  return {
    title,
    description,
    keywords: [
      fw.npmPackage,
      "simple-table",
      "data grid",
      `${lowerLabel} table`,
      `${lowerLabel} data grid`,
      `${lowerLabel} data table`,
      `${lowerLabel} grid component`,
      "typescript",
      ...competitors.map((c) => `${c} alternative`),
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: [SEO_STRINGS.site.ogImage],
      siteName: SEO_STRINGS.site.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SEO_STRINGS.site.creator,
      images: SEO_STRINGS.site.ogImage.url,
    },
    alternates: { canonical: `/frameworks/${raw}` },
  };
}

export default async function FrameworkHubDetailPage({ params }: PageProps) {
  const { framework: raw } = await params;
  if (!isHubId(raw)) notFound();

  const fw = FRAMEWORK_HUB_BY_ID[raw];
  const installCmd = `npm install ${fw.installPackages}`;
  const stackBlitzQuickStartUrl = getStackBlitzUrl("quick-start", raw as Framework);
  const pillarSlug = FRAMEWORK_HUB_PILLAR_BLOG_SLUG[raw];
  const pillarHref = `/blog/${pillarSlug}`;
  const faqItems = getFrameworkHubFaqItems(raw);
  const why = getFrameworkHubWhyParagraph(raw);
  const competitors = FRAMEWORK_COMPETITORS[raw];
  const elevatorPitch = FRAMEWORK_ELEVATOR_PITCH[raw];

  const softwareLd = buildFrameworkHubSoftwareJsonLd({
    name: `Simple Table (${fw.label})`,
    description: why,
    urlPath: `/frameworks/${raw}`,
    downloadUrl: getNpmPackageUrl(fw.npmPackage),
    featureList: HUB_SOFTWARE_FEATURES,
  });
  const faqLd = buildFaqPageJsonLd(faqItems);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BlogLayout>
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/frameworks" className="text-blue-600 dark:text-blue-400 hover:underline">
            Framework hubs
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">{fw.label}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {fw.label} integration
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
            Install line, peers, styles, and a minimal import for {fw.label}. Live docs demos open in
            StackBlitz in one click—no local clone required.
          </p>
        </header>

        <div className="space-y-8 mb-12">
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Why Simple Table on {fw.label}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{why}</p>
            <p className="mt-4 text-sm">
              <Link
                href={pillarHref}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Read the {fw.label} pillar guide →
              </Link>
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Install</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Peer expectations: {fw.peerSummary}
            </p>
            <div className="flex items-start gap-3 rounded-lg bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-x-auto">
              <FontAwesomeIcon icon={faTerminal} className="mt-0.5 shrink-0 text-green-400" />
              <code>{installCmd}</code>
            </div>
            <p className="mt-3 text-sm">
              <a
                href={getNpmPackageUrl(fw.npmPackage)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on npm →
              </a>
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Styles</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Import the published stylesheet once in your app entry (or a layout component).
            </p>
            <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
              <code>{fw.stylesImport}</code>
            </pre>
          </section>

          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Minimal import surface
            </h2>
            <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
              <code>{fw.minimalSnippet}</code>
            </pre>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Documentation demos include <span className="font-medium">Open in StackBlitz</span> so
              you can run and edit a full {fw.label} project in the browser. Start with the quick-start
              sandbox below.
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Simple Table vs other {fw.label} data grids
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {elevatorPitch}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              If you have evaluated any of the libraries below, Simple Table is a drop-in MIT
              alternative that ships virtualization, pinning, grouping, and inline editing without a
              Pro license:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
              {competitors.map((name) => (
                <li
                  key={name}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-900/40"
                >
                  {name} alternative
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link
                href={pillarHref}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                See the full {fw.label} comparison →
              </Link>
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">FAQ</h2>
            <dl className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <dt className="font-medium text-gray-900 dark:text-gray-100">{item.question}</dt>
                  <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Next steps</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href={pillarHref}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
              >
                <FontAwesomeIcon icon={faBook} />
                Pillar guide
              </Link>
              <Link
                href={fw.featureDocsPath}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <FontAwesomeIcon icon={faBook} />
                Feature documentation
              </Link>
              <a
                href={stackBlitzQuickStartUrl}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faBox} />
                Open quick start in StackBlitz
              </a>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                Blog & comparisons
              </Link>
              <Link
                href="/frameworks"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                All framework hubs
              </Link>
            </div>
          </section>
        </div>
        <AIVisibilityEnhancer pageType="framework-hub" framework={raw} />
      </BlogLayout>
    </>
  );
}
