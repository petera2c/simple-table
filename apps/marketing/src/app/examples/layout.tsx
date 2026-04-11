import PageLayout from "@/components/PageLayout";
import { ExamplesProvider } from "@/providers/ExamplesProvider";
import { Suspense } from "react";

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout sidebar={null}>
      <Suspense fallback={<div />}>
        <ExamplesProvider>{children}</ExamplesProvider>
      </Suspense>
    </PageLayout>
  );
}
