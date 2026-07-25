"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "antd";
import PageWrapper from "@/components/PageWrapper";
import { trackPurchaseComplete } from "@/lib/analytics";

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? undefined;
  const billing = searchParams.get("billing") ?? undefined;

  useEffect(() => {
    trackPurchaseComplete({ plan, billing });
  }, [plan, billing]);

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Thanks for upgrading
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your Simple Table license is active. Install from the docs, or manage billing anytime from
          the pricing page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/docs/installation">
            <Button type="primary" size="large">
              Go to installation
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="large">Back to pricing</Button>
          </Link>
        </div>
        <p className="mt-10 text-xs text-gray-500 dark:text-gray-400">
          Stripe Payment Links should redirect here after checkout:{" "}
          <code className="text-[11px]">
            https://www.simple-table.com/checkout/success?plan=pro&amp;billing=annual
          </code>
        </p>
      </div>
    </PageWrapper>
  );
}

export default function CheckoutSuccessContent() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
