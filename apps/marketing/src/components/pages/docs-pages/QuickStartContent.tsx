"use client";

import { useState } from "react";
import { Button, message } from "antd";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy, faRocket } from "@fortawesome/free-solid-svg-icons";
import QuickStartDemo from "@/components/demos/QuickStartDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import DocsSteps, { type DocsStep } from "@/components/DocsSteps";
import Link from "next/link";
import {
  COLUMNS_SNIPPETS,
  ROWS_SNIPPET,
  IMPORT_SNIPPETS,
  forAllFrameworks,
  installSnippets,
  tableSnippets,
} from "@/constants/docsSnippets";
import { getAiTablePrompt, getAiThemePrompt } from "@/constants/aiTablePrompt";
import { trackCopyAiTablePrompt, trackCopyAiThemePrompt } from "@/lib/analytics";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { useFramework } from "@/providers/FrameworkProvider";

const TABLE_PROPS: PropInfo[] = [
  {
    key: "columns",
    name: "columns",
    required: true,
    description: "Array of column definitions that specify the structure of your table.",
    type: "ColumnDef[]",
    link: "/docs/api-reference#column-def",
    example: `const columns: ReactColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", type: "string" }
];`,
  },
  {
    key: "rows",
    name: "rows",
    required: true,
    description: "Array of data objects to display in the table. Each object represents a row.",
    type: "Row[]",
    link: "/docs/api-reference#union-types",
    example: `const data = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 }
];`,
  },
  {
    key: "getRowId",
    name: "getRowId",
    required: false,
    description:
      "Optional but recommended: Function to generate unique identifiers for each row. Receives detailed context (row, depth, index, paths). Enables stable row identification across sorting and filtering. Highly recommended for tables with row grouping, external sorting, or dynamic data updates.",
    type: "(params: GetRowIdParams) => string | number",
    link: "/docs/api-reference#simple-table-props",
    example: `getRowId={({ row }) => String(row.id)}
getRowId={({ row }) => String(row.uuid)}`,
  },
  {
    key: "height",
    name: "height",
    required: false,
    description:
      "Height of the table container. When specified, Simple Table handles vertical scrolling internally with a fixed header. When omitted, the table expands to fit all rows and overflows the parent container. Most applications should specify a height.",
    type: "string",
    link: "/docs/table-height",
    example: `height="400px"
height="50vh"
height="100%"`,
  },
  {
    key: "customTheme",
    name: "customTheme",
    required: false,
    description:
      "Custom theme configuration for dimensions and spacing. Only specify the properties you want to customize.",
    type: "CustomTheme",
    link: "/docs/custom-theme",
    example: `customTheme={{
  rowHeight: 32,
  headerHeight: 32,
}}`,
  },
  {
    key: "enableColumnEditor",
    name: "enableColumnEditor",
    required: false,
    description: "Enable column reordering by drag and drop.",
    type: "boolean",
    example: `enableColumnEditor={true}`,
  },
  {
    key: "selectableCells",
    name: "selectableCells",
    required: false,
    description: "Enable cell selection functionality.",
    type: "boolean",
    example: `selectableCells={true}`,
  },
  {
    key: "theme",
    name: "theme",
    required: false,
    description: "Custom theme object to override default styling.",
    type: "Theme",
    link: "/docs/api-reference#union-types",
    example: `theme={{
  primaryColor: "#3b82f6",
  backgroundColor: "#ffffff"
}}`,
  },
];

const QUICK_START_STEPS: DocsStep[] = [
  {
    title: "Install",
    body: (
      <>
        Full install options (yarn, pnpm) are on the{" "}
        <Link
          href="/docs/installation"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Installation
        </Link>{" "}
        page.
      </>
    ),
    codeByFramework: installSnippets(),
    language: "bash",
  },
  {
    title: "Import",
    body: "Import the table component and its CSS styles.",
    codeByFramework: IMPORT_SNIPPETS,
    language: "typescript",
  },
  {
    title: "Define columns",
    body: (
      <>
        Each column needs an{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          accessor
        </code>{" "}
        that matches a property on your row objects.
      </>
    ),
    codeByFramework: COLUMNS_SNIPPETS,
    language: "typescript",
  },
  {
    title: "Define rows",
    body: "Provide an array of objects — one object per row.",
    codeByFramework: forAllFrameworks(ROWS_SNIPPET),
    language: "typescript",
  },
  {
    title: "Render the table",
    body: (
      <>
        Pass columns and rows to the table. Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          height
        </code>{" "}
        so the table scrolls with a sticky header.
      </>
    ),
    codeByFramework: tableSnippets({ height: "400px" }),
  },
];

const QuickStartContent = () => {
  const { framework } = useFramework();
  const [tablePromptCopied, setTablePromptCopied] = useState(false);
  const [stylePromptCopied, setStylePromptCopied] = useState(false);

  const copyTablePrompt = async () => {
    try {
      await navigator.clipboard.writeText(getAiTablePrompt(framework));
      trackCopyAiTablePrompt({ framework, location: "quick_start" });
      setTablePromptCopied(true);
      window.setTimeout(() => setTablePromptCopied(false), 2000);
      message.success("Table prompt copied to clipboard");
    } catch {
      message.error("Could not copy table prompt");
    }
  };

  const copyStylePrompt = async () => {
    try {
      await navigator.clipboard.writeText(getAiThemePrompt(framework));
      trackCopyAiThemePrompt({
        framework,
        location: "quick_start",
        has_theme_css: false,
      });
      setStylePromptCopied(true);
      window.setTimeout(() => setStylePromptCopied(false), 2000);
      message.success("Style prompt copied to clipboard");
    } catch {
      message.error("Could not copy style prompt");
    }
  };

  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faRocket} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quick Start</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Add Simple Table to your app in about 60 seconds.
      </motion.p>

      <motion.div
        className="flex flex-col gap-3 mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.22 }}
      >
        <Button
          type="primary"
          size="large"
          className="w-full"
          onClick={copyTablePrompt}
          icon={<FontAwesomeIcon icon={tablePromptCopied ? faCheck : faCopy} />}
        >
          {tablePromptCopied ? "Copied!" : "Copy table prompt"}
        </Button>
        <Button
          size="large"
          className="w-full"
          onClick={copyStylePrompt}
          icon={<FontAwesomeIcon icon={stylePromptCopied ? faCheck : faCopy} />}
        >
          {stylePromptCopied ? "Copied!" : "Copy style prompt"}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <DocsSteps steps={QUICK_START_STEPS} />
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
        A live table built with the same props. Use Code or StackBlitz to explore the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="quick-start" height="400px" Preview={QuickStartDemo} />
      </motion.div>

      <motion.div
        className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-1">Height</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Prefer{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">height</code> or{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">maxHeight</code> so the
          table owns scrolling. Details in{" "}
          <Link
            href="/docs/table-height"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Table Height
          </Link>
          .
        </p>
      </motion.div>

      <motion.div
        className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-1">getRowId (recommended)</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Provide a stable id when you sort, filter, group, or update rows often:{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            {"getRowId={({ row }) => String(row.id)}"}
          </code>
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        SimpleTable Props
      </motion.h2>

      <PropTable props={TABLE_PROPS} title="Main Component Props" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default QuickStartContent;
