import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import PillarGuideLayout from "@/components/blog/PillarGuideLayout";
import { angularDataGridPillarPost } from "@/constants/blogPosts";
import { FRAMEWORK_HUB_BY_ID } from "@/constants/frameworkIntegrationHub";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.angularDataGridPillar.title,
  description: SEO_STRINGS.blogPosts.angularDataGridPillar.description,
  keywords: SEO_STRINGS.blogPosts.angularDataGridPillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.angularDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.angularDataGridPillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.angularDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.angularDataGridPillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/angular-data-grid-simple-table",
  },
};

const fw = FRAMEWORK_HUB_BY_ID.angular;

export default function AngularDataGridPillarPage() {
  return (
    <PillarGuideLayout post={angularDataGridPillarPost} hubId="angular">
      <section>
        <h2>Install the Angular package</h2>
        <p>
          Install <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">{fw.npmPackage}</code>{" "}
          alongside your Angular version ({fw.peerSummary}). The adapter exposes a component you can
          declare in standalone components or NgModules.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{`npm install ${fw.installPackages}`}</code>
        </pre>
      </section>

      <section>
        <h2>Styles</h2>
        <p>
          Import the stylesheet in{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">angular.json</code>{" "}
          global styles, or side-effect import from TypeScript in{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">main.ts</code> /{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">main.server.ts</code> so
          every view sees table styling.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.stylesImport}</code>
        </pre>
      </section>

      <section>
        <h2>Minimal component surface</h2>
        <p>
          Import the published component symbol and add it to your template with inputs for columns and
          row data. Types ship with the package for safer templates and better IDE feedback.
        </p>
        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto not-prose">
          <code>{fw.minimalSnippet}</code>
        </pre>
      </section>

      <section>
        <h2>Standalone apps</h2>
        <p>
          For standalone bootstrapping, import the component in the{" "}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">imports</code> array of
          the hosting component, wire change detection as usual, and keep heavy work in services if you
          load data asynchronously.
        </p>
      </section>

      <section>
        <h2>Next steps</h2>
        <p>
          Open the Angular hub for npm metadata, then launch the StackBlitz quick start to validate peers
          in a sandbox before integrating into your workspace.
        </p>
      </section>
    </PillarGuideLayout>
  );
}
