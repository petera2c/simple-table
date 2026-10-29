"use client";

import { useEffect } from "react";
import { classifyOutboundUrl, getPageLocation, trackOutboundClick } from "@/lib/analytics";

function getLinkLocation(anchor: HTMLAnchorElement): string {
  const tagged = anchor.closest<HTMLElement>("[data-analytics-location]");
  if (tagged?.dataset.analyticsLocation) return tagged.dataset.analyticsLocation;
  if (anchor.closest("header")) return "header";
  if (anchor.closest("footer")) return "footer";
  return getPageLocation();
}

/**
 * One delegated listener that sends `github_click` / `npm_click` for every link to
 * GitHub or npm, so individual links do not need their own handlers.
 */
export default function OutboundLinkTracker() {
  useEffect(() => {
    const handle = (event: MouseEvent) => {
      // Left click and middle click (open in new tab) both count.
      if (event.type === "auxclick" && event.button !== 1) return;
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const match = classifyOutboundUrl(anchor.href);
      if (!match) return;
      trackOutboundClick({
        target: match.target,
        package: match.package,
        link_url: anchor.href,
        link_text: (anchor.textContent || anchor.getAttribute("aria-label") || "").trim(),
        location: getLinkLocation(anchor),
      });
    };
    document.addEventListener("click", handle, true);
    document.addEventListener("auxclick", handle, true);
    return () => {
      document.removeEventListener("click", handle, true);
      document.removeEventListener("auxclick", handle, true);
    };
  }, []);

  return null;
}
