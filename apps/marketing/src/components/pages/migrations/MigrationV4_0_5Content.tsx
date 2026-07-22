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
  { old: "HeaderObject", next: "ColumnDef", notes: "Core type — old name removed" },
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
    notes: "Column flag — applies to read-back headers too",
  },
  {
    old: "isSortable",
    next: "sortable",
    notes: "Column flag — applies to read-back headers too",
  },
  {
    old: "isEssential",
    next: "essential",
    notes: "Column flag — applies to read-back headers too",
  },
];

export default function MigrationV4_0_5Content() {
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
          Migration Guide: API naming (v4.0.5)
        </h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Simple Table v4.0.5 hard-cuts to the clearer public names (columns, enable* flags,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">sortable</code> /{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">editable</code> /{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">essential</code>
        ). Legacy names are removed — not aliased.
      </motion.p>

      <motion.div
        className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xl">Breaking change</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            All renamed props and types in the table below are <strong>removed</strong>. Update
            call sites and any code that reads headers (
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getHeaders()</code>,
            renderers, column callbacks).
          </li>
          <li>
            Do not rename{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isSelectionColumn</code>
            .
          </li>
          <li>
            See the{" "}
            <Link href="/changelog" className="text-blue-600 dark:text-blue-400 hover:underline">
              changelog
            </Link>{" "}
            for the 4.0.5 entry.
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
              <th className="py-3 pr-4 font-semibold text-gray-800 dark:text-white">New name</th>
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
                  <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                    {row.next}
                  </code>
                </td>
                <td className="py-2.5">{row.notes ?? "—"}</td>
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
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">4.0.5</code> (or
            later).
          </li>
          <li>Find/replace using the table above — start with column flags and{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">defaultHeaders</code>{" "}
            →{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columns</code>.
          </li>
          <li>
            Update type imports{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">*HeaderObject</code>{" "}
            →{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">*ColumnDef</code>{" "}
            /{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">ColumnDef</code>.
          </li>
          <li>Run your typecheck — only the new names are typed.</li>
        </ol>
      </motion.div>
    </PageWrapper>
  );
}
