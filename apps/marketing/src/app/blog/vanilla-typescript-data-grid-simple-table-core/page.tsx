import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import PillarGuideLayout from "@/components/blog/PillarGuideLayout";
import { vanillaDataGridPillarPost } from "@/constants/blogPosts";
import { FRAMEWORK_HUB_BY_ID } from "@/constants/frameworkIntegrationHub";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.vanillaDataGridPillar.title,
  description: SEO_STRINGS.blogPosts.vanillaDataGridPillar.description,
  keywords: SEO_STRINGS.blogPosts.vanillaDataGridPillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.vanillaDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.vanillaDataGridPillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.vanillaDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.vanillaDataGridPillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/vanilla-typescript-data-grid-simple-table-core",
  },
};

const fw = FRAMEWORK_HUB_BY_ID.vanilla;

export default function VanillaDataGridPillarPage() {
  return (
    <PillarGuideLayout post={vanillaDataGridPillarPost} hubId="vanilla">
      <section>
        <h2>Install simple-table-core</h2>
        <p>
          The vanilla path uses the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">simple-table-core</code>{" "}
          package directly—no React or other UI peer ({fw.peerSummary}). You mount the grid into a DOM
          container and drive updates from your own state layer.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{`npm install ${fw.installPackages}`}</code>
        </pre>
      </section>

      <section>
        <h2>Styles</h2>
        <p>
          Import the core stylesheet wherever you bootstrap the app shell so headers, cells, and editors
          pick up the default theme.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.stylesImport}</code>
        </pre>
      </section>

      <section>
        <h2>SimpleTableVanilla bootstrap</h2>
        <p>
          Instantiate the vanilla class with a container element and configuration. Wire event handlers and
          data updates from your framework-agnostic code; the API mirrors the conceptual model used by
          adapters, which makes migrating to React or Vue later easier.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.minimalSnippet}</code>
        </pre>
      </section>

      <section>
        <h2>When to pick vanilla vs an adapter</h2>
        <p>
          Choose vanilla for embeds, micro-frontends with custom lifecycles, or tooling that is not React/Vue.
          Choose an official adapter when you want idiomatic components, fewer glue layers, and faster
          onboarding for framework developers.
        </p>
      </section>

      <section>
        <h2>Next steps</h2>
        <p>
          Follow the vanilla hub for npm details and StackBlitz, then explore documentation pages—APIs map
          cleanly across stacks once styles and bootstrap are in place.
        </p>
      </section>
    </PillarGuideLayout>
  );
}
