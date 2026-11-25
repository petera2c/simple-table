"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faCheck, faCopy, faTerminal } from "@fortawesome/free-solid-svg-icons";
import { faNpm } from "@fortawesome/free-brands-svg-icons";
import { detectPackageManager, trackCopyInstallCommand } from "@/lib/analytics";

interface InstallCommandBoxProps {
  /** Full install command, for example "npm install @simple-table/react". */
  command: string;
  /** Framework id sent with the copy event (react, vue, angular, svelte, solid, vanilla). */
  framework?: string;
  /** Optional "Open in StackBlitz" link shown next to the command. */
  stackBlitzUrl?: string;
  stackBlitzLabel?: string;
  /** Optional npm package page link. */
  npmUrl?: string;
  /** Value for the `location` event param and `data-analytics-location` on the links. */
  analyticsLocation?: string;
  className?: string;
}

/**
 * Copy-paste install command with a one-click copy button, plus optional StackBlitz and npm
 * links. Copies fire `copy_install_command`; the links are picked up by OutboundLinkTracker.
 */
export default function InstallCommandBox({
  command,
  framework,
  stackBlitzUrl,
  stackBlitzLabel = "Open in StackBlitz",
  npmUrl,
  analyticsLocation,
  className = "",
}: InstallCommandBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const done = () => {
      trackCopyInstallCommand({
        package_manager: detectPackageManager(command) ?? "npm",
        framework,
        code_preview: command,
        location: analyticsLocation,
      });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(command).then(done, done);
    } else {
      done();
    }
  };

  return (
    <div className={className} data-analytics-location={analyticsLocation}>
      <div className="flex items-center gap-3 rounded-lg bg-gray-900 text-gray-100 pl-4 pr-2 py-2 font-mono text-sm">
        <FontAwesomeIcon icon={faTerminal} className="shrink-0 text-green-400" aria-hidden="true" />
        <code className="grow overflow-x-auto whitespace-nowrap py-1">{command}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center gap-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white px-3 py-1.5 text-xs font-sans font-medium cursor-pointer transition-colors"
          aria-label={copied ? "Install command copied" : "Copy install command"}
        >
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} aria-hidden="true" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {(stackBlitzUrl || npmUrl) && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {stackBlitzUrl && (
            <a
              href={stackBlitzUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faBox} aria-hidden="true" />
              {stackBlitzLabel}
            </a>
          )}
          {npmUrl && (
            <a
              href={npmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              <FontAwesomeIcon icon={faNpm} aria-hidden="true" />
              View on npm
            </a>
          )}
        </div>
      )}
    </div>
  );
}
