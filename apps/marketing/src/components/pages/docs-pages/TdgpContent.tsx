"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlug } from "@fortawesome/free-solid-svg-icons";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { tdgpSnippets, type CodeByFramework } from "@/constants/docsSnippets";

type TdgpPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const TDGP_PATTERNS: TdgpPattern[] = [
  {
    title: "Connect to a TDGP server",
    body: (
      <>
        Install{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">@thedatagrid/client</code>{" "}
        next to Simple Table. In React, call{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">useTdgpTable</code> and
        spread{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">tableProps</code> onto
        the table. Other frameworks use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          createTdgpTableSource
        </code>{" "}
        from{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">simple-table-core</code>.
        Page changes, sorts, and column filters become server requests. Pair with{" "}
        <Link
          href="/docs/loading-state"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          isLoading
        </Link>{" "}
        (already set on{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">tableProps</code>).
      </>
    ),
    codeByFramework: tdgpSnippets(),
  },
];

const TDGP_PROPS: PropInfo[] = [
  {
    key: "client",
    name: "client",
    required: true,
    description:
      "A TDGP client with a query method. createTdgpClient() from @thedatagrid/client matches this.",
    type: "TdgpQueryClient",
    example: `client={createTdgpClient({ url: "https://data.thedatagrid.com" })}`,
  },
  {
    key: "dataset",
    name: "dataset",
    required: true,
    description: "Dataset name on the TDGP server (the route segment, not a URL).",
    type: "string",
    example: `dataset="developers-10k"`,
  },
  {
    key: "columns",
    name: "columns",
    required: true,
    description: "Column definitions for the table. Keep this array stable across renders.",
    type: "ColumnDef[]",
    example: `columns={columns}`,
  },
  {
    key: "pageSize",
    name: "pageSize",
    required: false,
    description: "Rows per page sent to the server. Defaults to 50.",
    type: "number",
    example: `pageSize={50}`,
  },
  {
    key: "primaryKey",
    name: "primaryKey",
    required: false,
    description: "Field used as the row id for leaf rows. Defaults to id.",
    type: "string",
    example: `primaryKey="id"`,
  },
  {
    key: "groupBy",
    name: "groupBy",
    required: false,
    description:
      "Group on the server by these fields. Expanding a group loads the next level (or leaf rows at the last level).",
    type: "string[]",
    example: `groupBy={["country", "stack"]}`,
  },
  {
    key: "aggregations",
    name: "aggregations",
    required: false,
    description:
      "Server aggregations for grouped rows (sum, avg, min, max, count). Values are copied onto the group row using each aggregation id.",
    type: "TdgpAggregation[]",
    example: `aggregations={[{ id: "salary", field: "salary", fn: "sum" }]}`,
  },
];

const TdgpContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faPlug} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Server Data (TDGP)</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        THE DataGrid Protocol (TDGP) is a shared JSON contract for asking a server for a page of
        rows — filtered, sorted, and optionally grouped. Simple Table maps its existing{" "}
        <Link
          href="/docs/pagination"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          server-side pagination
        </Link>
        , sort, and filter hooks onto that contract. The same public server that powers AG Grid and
        Infinite Table demos works here:{" "}
        <a
          href="https://data.thedatagrid.com/docs"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          data.thedatagrid.com
        </a>
        .
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {TDGP_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock codeByFramework={pattern.codeByFramework} showLineNumbers={false} />
          </section>
        ))}
      </motion.div>

      <motion.div
        className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">Grouping</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Pass{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">groupBy</code> to load
          group rows first. Expanding a group fetches the next level from the server. Pivot stays
          client-side — use{" "}
          <Link href="/docs/pivot" className="text-blue-600 dark:text-blue-400 hover:underline">
            Pivot Tables
          </Link>{" "}
          on rows you already have.
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Options
      </motion.h2>

      <PropTable props={TDGP_PROPS} title="useTdgpTable / createTdgpTableSource" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default TdgpContent;
