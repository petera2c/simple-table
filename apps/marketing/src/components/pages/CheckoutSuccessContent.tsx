"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import PageWrapper from "@/components/PageWrapper";
import { trackPurchaseComplete } from "@/lib/analytics";
import { TECHNICAL_STRINGS } from "@/constants/strings/technical";

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? undefined;
  const billing = searchParams.get("billing") ?? undefined;
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Only counts after begin_checkout in this browser (or a Stripe session_id).
    // Visiting /checkout/success directly no longer inflates purchases.
    trackPurchaseComplete({ plan, billing, session_id: sessionId });
  }, [plan, billing, sessionId]);

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Thanks for upgrading
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your Simple Table license is active. Install from the docs, or manage billing anytime from
          the pricing page. Please join our Discord — it&apos;s the best way to stay in contact with
          our team and resolve issues quickly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={TECHNICAL_STRINGS.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button type="primary" size="large" icon={<FontAwesomeIcon icon={faDiscord} />}>
              Join Discord
            </Button>
          </a>
          <Link href="/docs/installation">
            <Button size="large">Go to installation</Button>
          </Link>
        </div>
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
