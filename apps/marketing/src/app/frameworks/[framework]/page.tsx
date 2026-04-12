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
import type { Framework } from "@/providers/FrameworkProvider";
import { getStackBlitzUrl } from "@/utils/getStackBlitzUrl";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";

type PageProps = { params: Promise<{ framework: string }> };

export function generateStaticParams() {
  return FRAMEWORK_HUB_IDS.map((framework) => ({ framework }));
}

function isHubId(value: string): value is HubFrameworkId {
  return FRAMEWORK_HUB_IDS.includes(value as HubFrameworkId);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { framework: raw } = await params;
  if (!isHubId(raw)) {
    return { title: "Framework hub" };
  }
  const fw = FRAMEWORK_HUB_BY_ID[raw];
  const title = `${fw.label} data grid setup | Simple Table`;
  const description = `Install ${fw.npmPackage} for ${fw.label}: npm command, styles import, peers (${fw.peerSummary}), and links to runnable examples and docs.`;
  return {
    title,
    description,
    keywords: [
      fw.npmPackage,
      "simple-table",
      "data grid",
      `${fw.label.toLowerCase()} table`,
      "typescript",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: [SEO_STRINGS.site.ogImage],
      siteName: SEO_STRINGS.site.name,
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

  return (
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Next steps</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={fw.featureDocsPath}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
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
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
