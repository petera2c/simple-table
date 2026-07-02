import PageLayout from "@/components/PageLayout";
import DocsSidebar from "@/components/DocsSidebar";
import DocsJsonLd from "@/components/seo/DocsJsonLd";
import DocsFrameworkNote from "@/components/DocsFrameworkNote";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout sidebar={<DocsSidebar />}>
      <DocsJsonLd />
      <DocsFrameworkNote />
      {children}
    </PageLayout>
  );
}
