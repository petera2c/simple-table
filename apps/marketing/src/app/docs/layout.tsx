import PageLayout from "@/components/PageLayout";
import DocsSidebar from "@/components/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <PageLayout sidebar={<DocsSidebar />}>{children}</PageLayout>;
}
