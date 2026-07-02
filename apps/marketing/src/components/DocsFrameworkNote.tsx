import Link from "next/link";
import FrameworkIcon from "./FrameworkIcon";
import { FRAMEWORK_HUB_ENTRIES } from "@/constants/frameworkIntegrationHub";

/**
 * Server-rendered strip shown on every docs page. States that the docs apply to all
 * supported frameworks and links each framework hub page (crawlable internal links).
 */
export default function DocsFrameworkNote() {
  return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-4 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
      <span>These docs apply to every Simple Table adapter — the same API works in:</span>
      {FRAMEWORK_HUB_ENTRIES.map((entry) => (
        <Link
          key={entry.id}
          href={`/frameworks/${entry.id}`}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        >
          <FrameworkIcon framework={entry.id} size={12} />
          {entry.id === "vanilla" ? "Vanilla TS" : entry.label}
        </Link>
      ))}
    </div>
  );
}
