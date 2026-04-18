import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import PillarGuideLayout from "@/components/blog/PillarGuideLayout";
import { sveltekitDataTablePillarPost } from "@/constants/blogPosts";
import { FRAMEWORK_HUB_BY_ID } from "@/constants/frameworkIntegrationHub";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.title,
  description: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.description,
  keywords: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.title,
    description: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.title,
    description: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/sveltekit-data-table-simple-table",
  },
};

const fw = FRAMEWORK_HUB_BY_ID.svelte;

export default function SveltekitDataTablePillarPage() {
  return (
    <PillarGuideLayout post={sveltekitDataTablePillarPost} hubId="svelte">
      <section>
        <h2>Install @simple-table/svelte</h2>
        <p>
          Works with Svelte 4+ and SvelteKit layouts. Peers: {fw.peerSummary}. The component follows
          Svelte conventions for props and slots while delegating rendering to the shared core.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{`npm install ${fw.installPackages}`}</code>
        </pre>
      </section>

      <section>
        <h2>Global styles</h2>
        <p>
          Import the stylesheet from your root layout or{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">+layout.svelte</code> so
          routes that host the grid inherit table styling without duplication.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.stylesImport}</code>
        </pre>
      </section>

      <section>
        <h2>Component bootstrap</h2>
        <p>
          Import <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">SimpleTable</code>{" "}
          and bind data with Svelte stores or local state. Because the core is framework-agnostic, you can
          lift column definitions into shared modules if you also ship Vue or React clients.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.minimalSnippet}</code>
        </pre>
      </section>

      <section>
        <h2>SvelteKit routing</h2>
        <p>
          Place the grid in route components that need it; keep data loaders in{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">+page.ts</code> or server
          endpoints, then pass results into the table as props. Avoid blocking navigation on huge payloads—
          paginate or virtualize large sets using the same patterns as other stacks.
        </p>
      </section>

      <section>
        <h2>Next steps</h2>
        <p>
          Visit the Svelte hub for install verification and StackBlitz, then explore feature docs for APIs
          that are identical across adapters.
        </p>
      </section>
    </PillarGuideLayout>
  );
}
