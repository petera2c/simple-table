import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FRAMEWORK_HUB_ENTRIES } from "@/constants/frameworkIntegrationHub";

/**
 * Cross-stack CTA for React-oriented articles: links to framework hubs and pillars.
 */
export default function OtherFrameworksCallout() {
  const nonReact = FRAMEWORK_HUB_ENTRIES.filter((e) => e.id !== "react");
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
        Not using React?
      </h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        Simple Table uses one shared core with official adapters for Vue, Angular, Svelte, Solid, and
        vanilla TypeScript. Open a setup hub for install commands, styles, and a StackBlitz quick
        start—same grid features across stacks.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/frameworks"
          className="inline-flex items-center rounded-lg bg-blue-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-blue-700"
        >
          All framework hubs
        </Link>
        {nonReact.map((fw) => (
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
