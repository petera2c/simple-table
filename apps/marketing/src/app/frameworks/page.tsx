import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faBook, faBox } from "@fortawesome/free-solid-svg-icons";
import { FRAMEWORK_HUB_ENTRIES, getNpmPackageUrl } from "@/constants/frameworkIntegrationHub";
import type { Framework } from "@/providers/FrameworkProvider";
import { getStackBlitzUrl } from "@/utils/getStackBlitzUrl";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";

export const metadata: Metadata = {
  title: "Framework setup: Vue, Angular, Svelte, Solid & vanilla | Simple Table",
  description:
    "Install Simple Table for Vue 3, Angular, Svelte, Solid, or vanilla TypeScript. Links to npm, StackBlitz quick starts, and feature documentation for each adapter.",
  keywords: [
    "vue data grid",
    "angular data grid",
    "svelte table",
    "solidjs table",
    "vanilla typescript table",
    "simple-table",
    "@simple-table/vue",
    "@simple-table/angular",
  ],
  openGraph: {
    title: "Framework setup hubs | Simple Table",
    description:
      "Install commands and StackBlitz quick starts for every Simple Table adapter, from Vue and Angular to vanilla TypeScript.",
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  alternates: { canonical: "/frameworks" },
};

export default function FrameworksIndexPage() {
  return (
    <BlogLayout>
      <section className="rounded-xl bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-6 md:p-10 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-3">
          Framework integration hubs
        </h1>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-0">
          Each hub lists the npm package, install command, and styles import. Documentation demos open
          in StackBlitz in one click—no repo clone needed.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {FRAMEWORK_HUB_ENTRIES.map((fw) => (
          <article
            key={fw.id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500" aria-hidden />
              {fw.label}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Package{" "}
              <a
                href={getNpmPackageUrl(fw.npmPackage)}
                className="text-blue-600 dark:text-blue-400 font-mono text-xs break-all hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {fw.npmPackage}
              </a>
              <span className="block mt-1">Peers: {fw.peerSummary}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/frameworks/${fw.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <FontAwesomeIcon icon={faBook} />
                Open hub
              </Link>
              <a
                href={getStackBlitzUrl("quick-start", fw.id as Framework)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faBox} />
                StackBlitz quick start
              </a>
            </div>
          </article>
        ))}
      </div>
    </BlogLayout>
  );
}
