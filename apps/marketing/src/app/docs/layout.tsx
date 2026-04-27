import PageLayout from "@/components/PageLayout";
import DocsSidebar from "@/components/DocsSidebar";
import DocsJsonLd from "@/components/seo/DocsJsonLd";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout sidebar={<DocsSidebar />}>
      <DocsJsonLd />
      {children}
    </PageLayout>
  );
}
