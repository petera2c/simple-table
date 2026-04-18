import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import PillarGuideLayout from "@/components/blog/PillarGuideLayout";
import { solidjsDataGridPillarPost } from "@/constants/blogPosts";
import { FRAMEWORK_HUB_BY_ID } from "@/constants/frameworkIntegrationHub";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.solidjsDataGridPillar.title,
  description: SEO_STRINGS.blogPosts.solidjsDataGridPillar.description,
  keywords: SEO_STRINGS.blogPosts.solidjsDataGridPillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.solidjsDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.solidjsDataGridPillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.solidjsDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.solidjsDataGridPillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/solidjs-data-grid-simple-table",
  },
};

const fw = FRAMEWORK_HUB_BY_ID.solid;

export default function SolidjsDataGridPillarPage() {
  return (
    <PillarGuideLayout post={solidjsDataGridPillarPost} hubId="solid">
      <section>
        <h2>Install @simple-table/solid</h2>
        <p>
          Requires <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">solid-js</code>{" "}
          as a peer ({fw.peerSummary}). The adapter exposes a Solid component that participates in fine-grained
          updates instead of rerendering entire trees.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{`npm install ${fw.installPackages}`}</code>
        </pre>
      </section>

      <section>
        <h2>Styles</h2>
        <p>Import the stylesheet once at your application root so every route using the grid is styled.</p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.stylesImport}</code>
        </pre>
      </section>

      <section>
        <h2>Component usage</h2>
        <p>
          Compose <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">SimpleTable</code>{" "}
          with Solid signals for row data and configuration objects. Column definitions can live in modules
          shared with other frameworks if you standardize on the core types.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.minimalSnippet}</code>
        </pre>
      </section>

      <section>
        <h2>Performance mindset</h2>
        <p>
          Solid’s fine-grained model pairs well with targeted cell updates. Keep references stable when
          possible so the grid can diff efficiently—mirroring guidance from other Simple Table adapters.
        </p>
      </section>

      <section>
        <h2>Next steps</h2>
        <p>
          Use the Solid hub for npm links and StackBlitz, then read feature documentation for advanced
          APIs like custom renderers and themes.
        </p>
      </section>
    </PillarGuideLayout>
  );
}
