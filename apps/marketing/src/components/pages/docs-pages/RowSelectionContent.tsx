"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import RowSelectionDemo from "@/components/demos/RowSelectionDemo";
import {
  RowSelectionSingleDemo,
  RowSelectionClickDemo,
  RowSelectionApiDemo,
} from "@/components/demos/RowSelectionVariantsDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import DocsSteps, { type DocsStep } from "@/components/DocsSteps";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { ROW_SELECTION_CHANGE_PROPS } from "@/constants/propDefinitions";
import {
  programmaticRowSelectionSnippets,
  rowSelectionSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type SelectionPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const SELECTION_STEPS: DocsStep[] = [
  {
    title: "Enable checkbox selection",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enableRowSelection</code>{" "}
        for a pinned checkbox column (multiple mode by default, with select-all in the header).
        Provide{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getRowId</code> so
        selection survives sort, filter, and pagination.
      </>
    ),
    codeByFramework: rowSelectionSnippets(),
  },
  {
    title: "Handle selection changes",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          onRowSelectionChange
        </code>{" "}
        for updates, or read selected rows from the table ref with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          getSelectedRowsData()
        </code>
        .
      </>
    ),
    codeByFramework: rowSelectionSnippets({ includeOnChange: true }),
  },
];

const SELECTION_PATTERNS: SelectionPattern[] = [
  {
    title: "Single selection",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          rowSelectionMode=&quot;single&quot;
        </code>{" "}
        when only one row should be selected. Selecting another row replaces the previous selection;
        the header select-all control is hidden.
      </>
    ),
    codeByFramework: rowSelectionSnippets({ rowSelectionMode: "single" }),
  },
  {
    title: "Click to select",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectRowOnClick</code>,
        hide the checkbox column with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          showRowSelectionColumn=&#123;false&#125;
        </code>
        , and set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          selectableCells=&#123;false&#125;
        </code>{" "}
        so clicks (and keyboard Space / arrows) drive row selection.
      </>
    ),
    codeByFramework: rowSelectionSnippets({
      selectRowOnClick: true,
      showRowSelectionColumn: false,
      selectableCells: false,
    }),
  },
  {
    title: "Programmatic selection",
    body: (
      <>
        Call{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectRow</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          toggleRowSelection
        </code>
        ,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          getSelectedRowsData
        </code>
        , and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">clearRowSelection</code>{" "}
        on the table API. See also{" "}
        <Link
          href="/docs/programmatic-control"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Programmatic Control
        </Link>
        .
      </>
    ),
    codeByFramework: programmaticRowSelectionSnippets(),
  },
];

const ROW_SELECTION_PROPS: PropInfo[] = [
  {
    key: "enableRowSelection",
    name: "enableRowSelection",
    required: false,
    description: "Enables row selection via checkboxes, click, keyboard, or TableAPI.",
    type: "boolean",
    example: `enableRowSelection={true}`,
  },
  {
    key: "rowSelectionMode",
    name: "rowSelectionMode",
    required: false,
    description:
      'Multiple (default) allows many selected rows; single replaces the previous selection and hides select-all.',
    type: "enum",
    enumValues: ["single", "multiple"],
    example: `rowSelectionMode="single"`,
  },
  {
    key: "selectRowOnClick",
    name: "selectRowOnClick",
    required: false,
    description:
      "Selecting a data cell selects the row. Prefer selectableCells={false} for a pure click-to-select UX.",
    type: "boolean",
    example: `selectRowOnClick={true}`,
  },
  {
    key: "showRowSelectionColumn",
    name: "showRowSelectionColumn",
    required: false,
    description:
      "When false, hides the checkbox column. Selection still works via click, keyboard, or API. Default true.",
    type: "boolean",
    example: `showRowSelectionColumn={false}`,
  },
  {
    key: "getRowId",
    name: "getRowId",
    required: false,
    description: "Stable row id so selection survives sort, filter, and pagination.",
    type: "(props: { row: Row }) => string | null | undefined",
    example: `getRowId={({ row }) => String(row.id)}`,
  },
  {
    key: "onRowSelectionChange",
    name: "onRowSelectionChange",
    required: false,
    description: "Fires when selection changes.",
    type: "(props: RowSelectionChangeProps) => void",
    example: `onRowSelectionChange={({ row, isSelected, selectedRows }) => { /* ... */ }}`,
  },
];

const RowSelectionContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faCheckSquare} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Row Selection</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Select one or many rows with checkboxes, click-to-select, keyboard, or the TableAPI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <DocsSteps steps={SELECTION_STEPS} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        Patterns
      </motion.h2>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {SELECTION_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={pattern.codeByFramework}
              showLineNumbers={false}
            />
          </section>
        ))}
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        Checkbox selection example
      </motion.h2>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <LivePreview
          demoId="row-selection"
          height="520px"
          demoHeight="348px"
          Preview={RowSelectionDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        Single selection example
      </motion.h2>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.47 }}
      >
        <LivePreview
          demoId="row-selection-single"
          height="340px"
          demoHeight="260px"
          Preview={RowSelectionSingleDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Click to select example
      </motion.h2>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.52 }}
      >
        <LivePreview
          demoId="row-selection-click"
          height="340px"
          demoHeight="260px"
          Preview={RowSelectionClickDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        Programmatic selection example
      </motion.h2>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.57 }}
      >
        <LivePreview
          demoId="row-selection-api"
          height="400px"
          demoHeight="260px"
          Preview={RowSelectionApiDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Props
      </motion.h2>

      <PropTable props={ROW_SELECTION_PROPS} title="Row Selection Configuration" />

      <div className="mt-8">
        <PropTable props={ROW_SELECTION_CHANGE_PROPS} title="RowSelectionChangeProps" />
      </div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default RowSelectionContent;
