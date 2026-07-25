"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "@/components/PageWrapper";
import { trackPurchaseComplete } from "@/lib/analytics";
import { TECHNICAL_STRINGS } from "@/constants/strings/technical";

const SUPPORT_EMAIL = "peter@peteryng.com";

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
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link href="/docs/installation">
            <Button type="primary" size="large">
              Go to installation
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="large">Back to pricing</Button>
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-5 py-6 text-left">
          <p className="text-gray-800 dark:text-gray-100 font-semibold mb-2">Need help?</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Join our Discord for the fastest support — I&apos;m usually there and can help you get
            set up quickly. Email works too if you prefer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
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
            <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex">
              <Button size="large" icon={<FontAwesomeIcon icon={faEnvelope} />}>
                {SUPPORT_EMAIL}
              </Button>
            </a>
          </div>
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
