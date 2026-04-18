"use client";

import { usePathname } from "next/navigation";
import OtherFrameworksCallout from "@/components/OtherFrameworksCallout";
import { shouldShowOtherFrameworksCallout } from "@/constants/blogPosts";

export default function BlogSegmentChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segment = pathname.replace(/^\/?blog\/?/, "").split("/")[0] ?? "";
  const showCallout = shouldShowOtherFrameworksCallout(segment);

  return (
    <>
      {children}
      {showCallout ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <OtherFrameworksCallout />
        </div>
      ) : null}
    </>
  );
}
