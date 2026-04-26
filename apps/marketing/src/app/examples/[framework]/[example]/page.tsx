import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faCode, faRocket, faTerminal } from "@fortawesome/free-solid-svg-icons";
import {
  EXAMPLE_SLUGS,
  FRAMEWORK_HUB_BY_ID,
  FRAMEWORK_HUB_IDS,
  type ExampleSlug,
  type HubFrameworkId,
} from "@/constants/frameworkIntegrationHub";
import { FRAMEWORK_INSTALL_COMMANDS } from "@/constants/strings/technical";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { getStackBlitzUrl } from "@/utils/getStackBlitzUrl";
import type { Framework } from "@/providers/FrameworkProvider";
import BlogLayout from "@/components/BlogLayout";

type PageProps = { params: Promise<{ framework: string; example: string }> };

export function generateStaticParams() {
  return FRAMEWORK_HUB_IDS.flatMap((framework) =>
    EXAMPLE_SLUGS.map((example) => ({ framework, example }))
  );
}

function isHubId(value: string): value is HubFrameworkId {
  return FRAMEWORK_HUB_IDS.includes(value as HubFrameworkId);
}

function isExampleSlug(value: string): value is ExampleSlug {
  return EXAMPLE_SLUGS.includes(value as ExampleSlug);
}

const EXAMPLE_LABELS: Record<ExampleSlug, string> = {
  billing: "Billing & invoicing",
  crm: "CRM leads management",
  hr: "HR management",
  infrastructure: "Infrastructure monitoring",
  manufacturing: "Manufacturing dashboard",
  music: "Music artist analytics",
  sales: "Sales pipeline",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { framework: rawFw, example: rawEx } = await params;
  if (!isHubId(rawFw) || !isExampleSlug(rawEx)) {
    return { title: "Example" };
  }
  const fw = FRAMEWORK_HUB_BY_ID[rawFw];
  const exampleLabel = EXAMPLE_LABELS[rawEx];
  const baseSeo = SEO_STRINGS.examples[rawEx];
  const title = `${exampleLabel} for ${fw.label} | Simple Table`;
  const description = `Build a ${exampleLabel.toLowerCase()} data grid with Simple Table on ${fw.label}. Install ${fw.npmPackage}, copy the idiomatic snippet, and run the live demo in StackBlitz. ${baseSeo.description}`;
  const lower = fw.label.toLowerCase();
  return {
    title,
    description,
    keywords: [
      `${lower} ${rawEx} table`,
      `${lower} ${rawEx} data grid`,
      `${lower} data grid example`,
      `${rawEx} dashboard ${lower}`,
      "simple-table",
      fw.npmPackage,
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
    alternates: { canonical: `/examples/${rawFw}/${rawEx}` },
  };
}

export default async function FrameworkExamplePage({ params }: PageProps) {
  const { framework: rawFw, example: rawEx } = await params;
  if (!isHubId(rawFw) || !isExampleSlug(rawEx)) notFound();
  const fw = FRAMEWORK_HUB_BY_ID[rawFw];
  const exampleLabel = EXAMPLE_LABELS[rawEx];
  const installCmd = FRAMEWORK_INSTALL_COMMANDS[rawFw as Framework]?.npm ?? `npm install ${fw.installPackages}`;
  const stackBlitzUrl = getStackBlitzUrl(rawEx, rawFw as Framework);
  const stackBlitzEmbedUrl = `${stackBlitzUrl}?embed=1&hideExplorer=1&hideNavigation=1&view=preview`;

  return (
    <BlogLayout>
      <nav className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link href="/examples" className="text-blue-600 dark:text-blue-400 hover:underline">
          Examples
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/frameworks/${rawFw}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {fw.label}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100">{exampleLabel}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {exampleLabel} on {fw.label}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
          A real {exampleLabel.toLowerCase()} data grid built with Simple Table on {fw.label}. Install{" "}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm">
            {fw.npmPackage}
          </code>
          , copy the idiomatic snippet below, and open the live, editable demo in StackBlitz.
        </p>
      </header>

      <div className="space-y-6 mb-12">
        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faTerminal} className="text-green-500" />
            Install
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Peer expectations: {fw.peerSummary}
          </p>
          <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
            <code>{installCmd}</code>
          </pre>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} className="text-blue-500" />
            Idiomatic {fw.label} usage
          </h2>
          <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
            <code>{fw.minimalSnippet}</code>
          </pre>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {fw.label} stylesheet import:{" "}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">
              {fw.stylesImport}
            </code>
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faRocket} className="text-purple-500" />
            Live, editable demo
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            The full {exampleLabel.toLowerCase()} data grid runs below as a {fw.label} project on
            StackBlitz. Edit the code in-place, save, or fork it into your own workspace.
          </p>
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <iframe
              src={stackBlitzEmbedUrl}
              title={`${exampleLabel} on ${fw.label} — Simple Table StackBlitz demo`}
              className="w-full h-[600px] bg-white"
              loading="lazy"
              allow="cross-origin-isolated"
            />
          </div>
          <p className="mt-3 text-sm">
            <a
              href={stackBlitzUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Open the {fw.label} sandbox in a new tab →
            </a>
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Other frameworks for this example
          </h2>
          <div className="flex flex-wrap gap-2">
            {FRAMEWORK_HUB_IDS.filter((id) => id !== rawFw).map((id) => {
              const otherLabel = FRAMEWORK_HUB_BY_ID[id].label;
              return (
                <Link
                  key={id}
                  href={`/examples/${id}/${rawEx}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <FontAwesomeIcon icon={faBox} />
                  {otherLabel}
                </Link>
              );
            })}
          </div>
          <p className="mt-4 text-sm">
            <Link
              href={`/frameworks/${rawFw}`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              See all {fw.label} setup details →
            </Link>
          </p>
        </section>
      </div>
    </BlogLayout>
  );
}
