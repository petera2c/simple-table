import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import {
  FRAMEWORK_HUB_BY_ID,
  FRAMEWORK_HUB_ENTRIES,
  type HubFrameworkId,
} from "@/constants/frameworkIntegrationHub";

interface OtherFrameworksCalloutProps {
  /**
   * The framework the article is currently written for. The callout will
   * exclude this framework from the link list and tailor the heading + copy
   * to invite readers on the other stacks. Defaults to "react" for backwards
   * compatibility with the original React-only callout.
   */
  currentFramework?: HubFrameworkId;
}

/**
 * Cross-stack CTA shown at the end of framework-targeted articles. Links to
 * the other framework hubs and adapts its headline/copy to whichever stack
 * the article is for.
 */
export default function OtherFrameworksCallout({
  currentFramework = "react",
}: OtherFrameworksCalloutProps) {
  const others = FRAMEWORK_HUB_ENTRIES.filter((e) => e.id !== currentFramework);
  const currentLabel = FRAMEWORK_HUB_BY_ID[currentFramework]?.label ?? "this stack";
  const heading = currentFramework === "react" ? "Not using React?" : `Not using ${currentLabel}?`;

  return (
    <aside
      className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/40 p-6 shadow-sm"
      aria-labelledby="other-frameworks-heading"
    >
      <h2
        id="other-frameworks-heading"
        className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 dark:text-blue-400" />
        {heading}
      </h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        Simple Table uses one shared core with official adapters for{" "}
        {others.map((fw) => fw.label).join(", ")}. Open a setup hub for install commands, styles,
        and a StackBlitz quick start—same grid features across stacks.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/frameworks"
          className="inline-flex items-center rounded-lg bg-blue-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-blue-700"
        >
          All framework hubs
        </Link>
        {others.map((fw) => (
          <Link
            key={fw.id}
            href={`/frameworks/${fw.id}`}
            className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-900/50"
          >
            {fw.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
