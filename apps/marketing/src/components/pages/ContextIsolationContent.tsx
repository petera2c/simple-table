"use client";

import ContextIsolationDemo from "@/components/demos/ContextIsolationDemo";
import PageWrapper from "@/components/PageWrapper";

const ContextIsolationContent = () => {
  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <span className="inline-block mb-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
          Internal repro · unlisted
        </span>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          React Context Isolation Stress Test
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
          This page exercises as much of the <code>@simple-table/react</code> custom-renderer surface
          as possible, with <strong>every</strong> custom renderer reading from host React context
          (an app-settings provider for locale/currency/accent/current-user, plus a{" "}
          <code>useGlobalAlert</code> provider). Before the portal/context fix these renderers were
          mounted in isolated React roots and could not see host providers — so they rendered empty,
          threw <code>must be used within …</code>, or silently dropped DOM slots.
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-2">Features wired through context here:</p>
        <ul className="list-disc pl-6 mb-6 space-y-1.5 text-gray-700 dark:text-gray-300">
          <li>
            Custom <strong>cell renderers</strong>: avatar/initials, status badges, currency (via
            host locale/currency), quota progress bars, star ratings, and a “Ping” button that calls{" "}
            <code>useGlobalAlert()</code>.
          </li>
          <li>
            Custom <strong>header renderers</strong> using the <code>labelContent</code>,{" "}
            <code>sortIcon</code>, <code>filterIcon</code>, and <code>collapseIcon</code> slots
            (passed by core as DOM nodes, now bridged into JSX).
          </li>
          <li>
            A context-aware <strong>header dropdown</strong>, a custom <strong>footer</strong> with
            page-size control and bridged <code>nextIcon</code>/<code>prevIcon</code>, and{" "}
            <strong>column-editor</strong> row + panel renderers.
          </li>
          <li>
            <strong>Cell editing</strong> (string/enum/date/boolean/number), <strong>row selection</strong>,{" "}
            <strong>quick filter</strong>, pagination, column resize/reorder, custom icons, collapsible
            column groups, and imperative <code>TableAPI</code> calls (export CSV, expand/collapse,
            clear selection).
          </li>
          <li>
            A second <strong>grouped + aggregated</strong> table (regions → teams → reps) with sum and
            average rollups and sticky parents.
          </li>
        </ul>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <ContextIsolationDemo />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ContextIsolationContent;
