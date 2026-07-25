"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import CellEditingDemo from "@/components/demos/CellEditingDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  forAllFrameworks,
  onCellEditSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type EditPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const EDIT_PATTERNS: EditPattern[] = [
  {
    title: "Mark columns editable",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">editable: true</code> on
        each column users can change. Column{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">type</code> picks the
        editor (string, number, boolean, date, or enum).
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "firstName",
  label: "First Name",
  width: "1fr",
  type: "string",
  editable: true,
}`),
    language: "typescript",
  },
  {
    title: "Handle onCellEdit",
    body: (
      <>
        Update your data when{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onCellEdit</code> fires.
        It receives{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">accessor</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">newValue</code>, and the{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">row</code>.
      </>
    ),
    codeByFramework: onCellEditSnippets(),
  },
  {
    title: "Editors by type",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">type</code> for the
        matching control. Enum columns also need{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enumOptions</code>.
      </>
    ),
    codeByFramework: forAllFrameworks(`const columns = [
  { accessor: "firstName", label: "First Name", type: "string", editable: true },
  { accessor: "salary", label: "Salary", type: "number", editable: true },
  { accessor: "isActive", label: "Active", type: "boolean", editable: true },
  { accessor: "hireDate", label: "Hire Date", type: "date", editable: true },
  {
    accessor: "role",
    label: "Role",
    type: "enum",
    editable: true,
    enumOptions: [
      { label: "Developer", value: "Developer" },
      { label: "Designer", value: "Designer" },
      { label: "Manager", value: "Manager" },
    ],
  },
];`),
    language: "typescript",
  },
];

const CELL_EDITING_PROPS: PropInfo[] = [
  {
    key: "editable",
    name: "ColumnDef.editable",
    required: false,
    description: "When true, cells in the column can be edited (and accept paste).",
    type: "boolean",
    example: `editable: true`,
  },
  {
    key: "type",
    name: "ColumnDef.type",
    required: false,
    description: "Chooses the cell editor and validation for editable columns.",
    type: "enum",
    link: "/docs/api-reference#union-types",
    enumValues: ["string", "number", "boolean", "date", "enum"],
    example: `type: "string"
type: "number"
type: "boolean"
type: "date"
type: "enum"`,
  },
  {
    key: "enumOptions",
    name: "ColumnDef.enumOptions",
    required: false,
    description: "Dropdown options for enum columns.",
    type: "EnumOption[]",
    example: `enumOptions: [
  { label: "Developer", value: "Developer" },
  { label: "Designer", value: "Designer" },
]`,
  },
  {
    key: "onCellEdit",
    name: "onCellEdit",
    required: false,
    description: "Fires when a cell value changes. Update your rows from the callback.",
    type: "(props: CellChangeProps) => void",
    link: "/docs/api-reference#cell-change-props",
    example: `onCellEdit={({ accessor, newValue, row }) => {
  // update row[accessor] = newValue
}}`,
  },
];

export default function CellEditingContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faEdit} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cell Editing</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Edit values in place. Mark columns{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">editable</code>, then
        persist changes with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onCellEdit</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {EDIT_PATTERNS.map((pattern) => (
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

      <motion.div
        className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">Copy and paste</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Ctrl/⌘+C copies selected cells; paste from spreadsheets works too. Only columns with{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">editable: true</code>{" "}
          accept pasted values — others are skipped.
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        Example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.36 }}
      >
        Double-click a cell to edit. Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.38 }}
      >
        <LivePreview demoId="cell-editing" height="400px" Preview={CellEditingDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={CELL_EDITING_PROPS} title="Cell Editing Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
}
