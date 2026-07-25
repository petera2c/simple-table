"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import QuickFilterDemo from "@/components/demos/QuickFilterDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { Input, Radio, Checkbox, Space } from "antd";
import type { RadioChangeEvent } from "antd";
import type { QuickFilterMode } from "@simple-table/react";
import {
  QUICK_FILTER_CONFIG_PROPS,
  QUICK_FILTER_GETTER_PROPS,
} from "@/constants/propDefinitions";
import {
  forAllFrameworks,
  programmaticQuickFilterSnippets,
  quickFilterSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type FilterPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const FILTER_PATTERNS: FilterPattern[] = [
  {
    title: "Bind a search input",
    body: (
      <>
        Pass a controlled{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">quickFilter.text</code>.
        Default mode is simple contains matching across searchable columns.
      </>
    ),
    codeByFramework: quickFilterSnippets(),
  },
  {
    title: "Smart mode",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">mode: &quot;smart&quot;</code>{" "}
        for multi-word AND, quoted phrases,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">-negation</code>, and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">column:value</code>.
      </>
    ),
    codeByFramework: quickFilterSnippets({ mode: "smart" }),
  },
  {
    title: "Limit searchable columns",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">quickFilter.columns</code>{" "}
        or set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          quickFilterable: false
        </code>{" "}
        on a column.
      </>
    ),
    codeByFramework: forAllFrameworks(`// Limit via config
quickFilter={{ text: searchText, columns: ["name", "email"] }}

// Or exclude a column
{ accessor: "id", label: "ID", quickFilterable: false }`),
    language: "typescript",
  },
  {
    title: "Custom searchable value",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">quickFilterGetter</code>{" "}
        when the searchable string differs from the cell value.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "user",
  label: "User",
  quickFilterGetter: ({ row }) => row.user?.fullName ?? "",
}`),
    language: "typescript",
  },
  {
    title: "Programmatic filter",
    body: (
      <>
        Call{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setQuickFilter</code> on
        the table API. See{" "}
        <Link
          href="/docs/programmatic-control"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Programmatic Control
        </Link>
        .
      </>
    ),
    codeByFramework: programmaticQuickFilterSnippets(),
  },
];

const QUICK_FILTER_PROPS: PropInfo[] = [
  {
    key: "quickFilter",
    name: "quickFilter",
    required: false,
    description:
      "Global search across columns. Controlled via QuickFilterConfig (text is required).",
    type: "QuickFilterConfig",
    link: "/docs/api-reference#quick-filter-config",
    example: `quickFilter={{ text: searchText, mode: "simple" }}`,
  },
  {
    key: "quickFilterable",
    name: "ColumnDef.quickFilterable",
    required: false,
    description: "When false, the column is skipped by quick filter. Defaults to true.",
    type: "boolean",
    example: `quickFilterable: false`,
  },
  {
    key: "quickFilterGetter",
    name: "ColumnDef.quickFilterGetter",
    required: false,
    description: "Custom string extracted from the row for quick filter matching.",
    type: "QuickFilterGetter",
    example: `quickFilterGetter: ({ row }) => row.user?.fullName ?? ""`,
  },
];

const QuickFilterContent = () => {
  const [searchText, setSearchText] = useState("");
  const [filterMode, setFilterMode] = useState<QuickFilterMode>("simple");
  const [caseSensitive, setCaseSensitive] = useState(false);

  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faSearch} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quick Filter</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Search across columns with one controlled input. Use simple contains matching or smart
        operators.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {FILTER_PATTERNS.map((pattern) => (
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
        Try simple vs smart mode below. In smart mode, try{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          engineering -inactive
        </code>
        .
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%", marginBottom: 16 }}>
          <Input
            placeholder="Search across all columns..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            allowClear
          />
          <Space size="large" wrap>
            <Radio.Group
              value={filterMode}
              onChange={(e: RadioChangeEvent) => setFilterMode(e.target.value as QuickFilterMode)}
            >
              <Radio value="simple">Simple</Radio>
              <Radio value="smart">Smart</Radio>
            </Radio.Group>
            <Checkbox
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            >
              Case sensitive
            </Checkbox>
          </Space>
        </Space>
        <LivePreview
          demoId="quick-filter"
          height="400px"
          Preview={(props) => (
            <QuickFilterDemo
              {...props}
              searchText={searchText}
              filterMode={filterMode}
              caseSensitive={caseSensitive}
            />
          )}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={QUICK_FILTER_PROPS} title="Quick Filter Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        QuickFilterConfig
      </motion.h3>
      <PropTable props={QUICK_FILTER_CONFIG_PROPS} title="QuickFilterConfig" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.44 }}
      >
        QuickFilterGetterProps
      </motion.h3>
      <PropTable props={QUICK_FILTER_GETTER_PROPS} title="QuickFilterGetterProps" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default QuickFilterContent;
