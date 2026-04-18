import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import PillarGuideLayout from "@/components/blog/PillarGuideLayout";
import { vueNuxtDataGridPillarPost } from "@/constants/blogPosts";
import { FRAMEWORK_HUB_BY_ID } from "@/constants/frameworkIntegrationHub";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.title,
  description: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.description,
  keywords: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/vue-nuxt-data-grid-simple-table",
  },
};

const fw = FRAMEWORK_HUB_BY_ID.vue;

export default function VueNuxtDataGridPillarPage() {
  return (
    <PillarGuideLayout post={vueNuxtDataGridPillarPost} hubId="vue">
      <section>
        <h2>Install the Vue adapter</h2>
        <p>
          Add <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">{fw.npmPackage}</code>{" "}
          to your Vue 3 or Nuxt project. Peers: {fw.peerSummary}. One install line covers the adapter;
          the core ships as a dependency of the package on npm.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{`npm install ${fw.installPackages}`}</code>
        </pre>
      </section>

      <section>
        <h2>Import styles once</h2>
        <p>
          Register the published stylesheet in your app entry, Nuxt plugin, or root layout so column
          chrome, editors, and themes render correctly.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.stylesImport}</code>
        </pre>
      </section>

      <section>
        <h2>Composition API usage</h2>
        <p>
          Import the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">SimpleTable</code>{" "}
          component and pass the same props you would expect from the shared core API: columns, data,
          sorting, editing, and theme objects. Keep table state in{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">ref</code> or{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">reactive</code> structures
          and let Vue’s reactivity propagate updates.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.minimalSnippet}</code>
        </pre>
      </section>

      <section>
        <h2>Nuxt 3 notes</h2>
        <p>
          For Nuxt, import CSS in a client plugin or your{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">app.vue</code> / layout
          wrapper. If the grid should only run client-side, wrap it in{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">ClientOnly</code> or
          equivalent so SSR output stays clean while hydration picks up interactivity.
        </p>
      </section>

      <section>
        <h2>Next steps</h2>
        <p>
          Use the Vue integration hub for peer details, npm links, and a StackBlitz quick start. Feature
          documentation on this site demonstrates capabilities that apply across adapters—swap the import
          to match Vue when you copy examples.
        </p>
      </section>
    </PillarGuideLayout>
  );
}
