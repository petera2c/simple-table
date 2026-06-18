import type { Metadata } from "next";
import ContextIsolationContent from "@/components/pages/ContextIsolationContent";

// Unlisted reproduction page. Reachable by direct URL only — intentionally not
// added to docsNavigation, Header, Footer, ExampleControls, or the sitemap, and
// marked noindex so it stays out of search engines.
export const metadata: Metadata = {
  title: "React Context Isolation Repro",
  robots: { index: false, follow: false },
};

const ContextIsolationPage = () => {
  return <ContextIsolationContent />;
};

export default ContextIsolationPage;
