"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import ColumnVisibilityDemo from "@/components/demos/ColumnVisibilityDemo";
import ColumnEditorCustomRendererDemo from "@/components/demos/ColumnEditorCustomRendererDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import Link from "next/link";
import {
  customColumnEditorLayoutSnippets,
  customColumnEditorRowSnippets,
  forAllFrameworks,
  tableSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type VisibilityPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const VISIBILITY_PATTERNS: VisibilityPattern[] = [
  {
    title: "Hide a column by default",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">hide: true</code> on a
        column def. Users can still show it again when the column editor is enabled.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "internalId",
  label: "Internal ID",
  width: 100,
  hide: true,
}`),
    language: "typescript",
  },
  {
    title: "Enable the column editor",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          enableColumnEditor
        </code>{" "}
        so users can search, toggle, and reorder columns from the Columns panel.
      </>
    ),
    codeByFramework: tableSnippets({ height: "400px", enableColumnEditor: true }),
  },
  {
    title: "Open the editor on load",
    body: (
      <>
        Pair with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          enableColumnEditorInitOpen
        </code>{" "}
        to open the panel when the table mounts.
      </>
    ),
    codeByFramework: tableSnippets({
      height: "400px",
      enableColumnEditor: true,
      enableColumnEditorInitOpen: true,
    }),
  },
  {
    title: "Exclude from table and editor",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          excludeFromRender
        </code>{" "}
        for data you still want in CSV export but not in the grid or visibility menu (e.g. ids).
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "id",
  label: "ID",
  width: 80,
  excludeFromRender: true,
}`),
    language: "typescript",
  },
];

const COLUMN_VISIBILITY_PROPS: PropInfo[] = [
  {
    key: "hide",
    name: "ColumnDef.hide",
    required: false,
    description: "When true, the column starts hidden.",
    type: "boolean",
    example: `hide: true`,
  },
  {
    key: "enableColumnEditor",
    name: "enableColumnEditor",
    required: false,
    description: "Shows the Columns panel so users can toggle and reorder columns.",
    type: "boolean",
    example: `enableColumnEditor={true}`,
  },
  {
    key: "enableColumnEditorInitOpen",
    name: "enableColumnEditorInitOpen",
    required: false,
    description: "Opens the Columns panel on load. Requires enableColumnEditor.",
    type: "boolean",
    example: `enableColumnEditorInitOpen={true}`,
  },
  {
    key: "showToggle",
    name: "columnEditorConfig.showToggle",
    required: false,
    description:
      "When false, hides the built-in Columns strip. Open the editor with tableRef.current.toggleColumnEditor(). Default: true.",
    type: "boolean",
    example: `columnEditorConfig={{ showToggle: false }}`,
  },
  {
    key: "onColumnVisibilityChange",
    name: "onColumnVisibilityChange",
    required: false,
    description:
      "Fires with a map of accessor → visible when visibility changes. Use it to sync or persist preferences.",
    type: "(visibilityState: ColumnVisibilityState) => void",
    example: `onColumnVisibilityChange={(state) => {
  // { name: true, phone: false }
  setVisibility(state);
}}`,
  },
  {
    key: "excludeFromRender",
    name: "ColumnDef.excludeFromRender",
    required: false,
    description:
      "Omits the column from the table and column editor, but still includes it in CSV exports.",
    type: "boolean",
    example: `excludeFromRender: true`,
  },
];

const ColumnVisibilityContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faEye} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Visibility</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Hide columns by default, or let users show and hide them from the column editor.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {VISIBILITY_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={pattern.codeByFramework}
              language={pattern.language}
              showLineNumbers={false}
            />
          </section>
        ))}
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.32 }}
      >
        Open the Columns panel to toggle visibility and reorder columns.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="column-visibility" height="400px" Preview={ColumnVisibilityDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        id="custom-renderer"
      >
        Custom column editor layout
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.48 }}
      >
        Pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">customRenderer</code> on{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columnEditorConfig</code>{" "}
        to replace the default popout. See{" "}
        <Link
          href="/docs/api-reference#column-editor-config"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ColumnEditorConfig
        </Link>
        .
      </motion.p>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.49 }}
      >
        <CodeBlock
          codeByFramework={customColumnEditorLayoutSnippets()}
          showLineNumbers={false}
        />
      </motion.div>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <LivePreview
          demoId="column-editor-custom-renderer"
          height="300px"
          demoHeight="270px"
          Preview={ColumnEditorCustomRendererDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        id="custom-row-renderer"
      >
        Custom editor row layout
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.58 }}
      >
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowRenderer</code> to
        control each row. Props are documented under{" "}
        <Link
          href="/docs/api-reference#column-editor-row-renderer-props"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ColumnEditorRowRendererProps
        </Link>
        .
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <CodeBlock
          codeByFramework={customColumnEditorRowSnippets()}
          showLineNumbers={false}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLUMN_VISIBILITY_PROPS} title="Column Visibility Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnVisibilityContent;
