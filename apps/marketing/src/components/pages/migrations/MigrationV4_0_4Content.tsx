"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheckCircle,
  faExclamationTriangle,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import CodeBlock from "@/components/CodeBlock";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";

const RENAMES: { old: string; next: string; notes?: string }[] = [
  { old: "HeaderObject", next: "ColumnDef", notes: "Core type alias; both names remain valid at runtime/types." },
  { old: "ReactHeaderObject", next: "ReactColumnDef" },
  { old: "VueHeaderObject", next: "VueColumnDef" },
  { old: "AngularHeaderObject", next: "AngularColumnDef" },
  { old: "SolidHeaderObject", next: "SolidColumnDef" },
  { old: "SvelteHeaderObject", next: "SvelteColumnDef" },
  { old: "defaultHeaders", next: "columns", notes: "Vue: :default-headers → :columns" },
  { old: "editColumns", next: "enableColumnEditor" },
  { old: "editColumnsInitOpen", next: "enableColumnEditorInitOpen" },
  { old: "shouldPaginate", next: "enablePagination" },
  { old: "onGridReady", next: "onTableReady" },
  { old: "useHoverRowBackground", next: "hoverRowBackground" },
  { old: "useOddColumnBackground", next: "oddColumnBackground" },
  { old: "useOddEvenRowBackground", next: "oddEvenRowBackground" },
  {
    old: "isEditable",
    next: "editable",
    notes: "Breaking in 4.0.4 — old name removed (not aliased). Applies to read-back headers too.",
  },
  {
    old: "isSortable",
    next: "sortable",
    notes: "Breaking in 4.0.4 — old name removed (not aliased). Applies to read-back headers too.",
  },
  {
    old: "isEssential",
    next: "essential",
    notes: "Breaking in 4.0.4 — old name removed (not aliased). Applies to read-back headers too.",
  },
];

export default function MigrationV4_0_4Content() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faArrowRight} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Migration Guide: API naming (v4.0.4)
        </h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Simple Table v4.0.4 continues the clearer public names introduced in 4.0.2 (columns, not
        “headers”; enable flags instead of should*/use* prefixes). Most old table-level names still
        work as aliases. Column flags{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isSortable</code> /{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isEditable</code> /{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isEssential</code> are
        removed — use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">sortable</code> /{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">editable</code> /{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">essential</code> only.
      </motion.p>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-6 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xl">Compatibility</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Mostly non-breaking.</strong> Table-level preferred names are aliases. Existing{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">defaultHeaders</code>,{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">HeaderObject</code>,
            and other legacy table props continue to work.
          </li>
          <li>
            <strong>Breaking in 4.0.4 for column flags.</strong>{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isSortable</code> /{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isEditable</code> /{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isEssential</code> are
            removed from types and runtime. Use{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">sortable</code> /{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">editable</code> /{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">essential</code> for
            both input and read-back (
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getHeaders()</code>,
            renderers, column callbacks).
          </li>
          <li>
            When both old and new <em>table-level</em> props are passed, the{" "}
            <strong>preferred</strong> name wins (e.g.{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columns</code> over{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">defaultHeaders</code>
            ).
          </li>
          <li>
            Docs and examples use the preferred names. See the{" "}
            <Link href="/changelog" className="text-blue-600 dark:text-blue-400 hover:underline">
              changelog
            </Link>
            .
          </li>
        </ul>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
        Rename list
      </motion.h2>

      <motion.div
        className="overflow-x-auto mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 pr-4 font-semibold text-gray-800 dark:text-white">Old name</th>
              <th className="py-3 pr-4 font-semibold text-gray-800 dark:text-white">
                Preferred name
              </th>
              <th className="py-3 font-semibold text-gray-800 dark:text-white">Notes</th>
            </tr>
          </thead>
          <tbody>
            {RENAMES.map((row) => (
              <tr
                key={row.old}
                className="border-b border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
              >
                <td className="py-2.5 pr-4">
                  <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                    {row.old}
                  </code>
                </td>
                <td className="py-2.5 pr-4">
                  <code className="bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded">
                    {row.next}
                  </code>
                </td>
                <td className="py-2.5 text-gray-600 dark:text-gray-400">{row.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
        Before / after
      </motion.h2>

      <motion.div
        className="grid md:grid-cols-2 gap-6 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Before</h3>
          <CodeBlock
            language="tsx"
            code={`import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject } from "@simple-table/react";

const headers: ReactHeaderObject[] = [
  { accessor: "name", label: "Name", width: "1fr", isSortable: true, isEditable: true },
];

<SimpleTable
  defaultHeaders={headers}
  rows={rows}
  editColumns
  shouldPaginate
  onGridReady={() => {}}
  useHoverRowBackground
/>`}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">After</h3>
          <CodeBlock
            language="tsx"
            code={`import { SimpleTable } from "@simple-table/react";
import type { ReactColumnDef } from "@simple-table/react";

const columns: ReactColumnDef[] = [
  { accessor: "name", label: "Name", width: "1fr", sortable: true, editable: true },
];

<SimpleTable
  columns={columns}
  rows={rows}
  enableColumnEditor
  enablePagination
  onTableReady={() => {}}
  hoverRowBackground
/>`}
          />
        </div>
      </motion.div>

      <motion.div
        className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faRocket} className="text-green-600" />
          Suggested migration steps
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            Upgrade to{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">4.0.4</code> (or
            later).
          </li>
          <li>
            <strong>Required:</strong> replace column flags{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isSortable</code> /{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isEditable</code> /{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isEssential</code>{" "}
            with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">sortable</code> /{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">editable</code> /{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">essential</code>{" "}
            everywhere (defs and any code that reads headers). Do not rename{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isSelectionColumn</code>
            .
          </li>
          <li>
            Optionally find/replace table-level aliases — start with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">defaultHeaders</code>{" "}
            →{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columns</code> and
            framework{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">*HeaderObject</code>{" "}
            types →{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">*ColumnDef</code>.
          </li>
          <li>Run your typecheck — preferred names are fully typed on all adapters.</li>
        </ol>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        Next:{" "}
        <Link href="/docs/quick-start" className="text-blue-600 dark:text-blue-400 hover:underline">
          Quick start
        </Link>{" "}
        ·{" "}
        <Link href="/docs/api-reference" className="text-blue-600 dark:text-blue-400 hover:underline">
          API reference
        </Link>{" "}
        ·{" "}
        <Link href="/changelog" className="text-blue-600 dark:text-blue-400 hover:underline">
          Changelog
        </Link>
      </motion.p>
    </PageWrapper>
  );
}
