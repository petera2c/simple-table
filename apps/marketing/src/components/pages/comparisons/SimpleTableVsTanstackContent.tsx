"use client";
import React from "react";
import { Typography } from "antd";
import NextLink from "next/link";
import ComparisonLayout from "../../ComparisonLayout";
import { SIMPLE_TABLE_INFO, TANSTACK_TABLE_INFO } from "@/constants/packageInfo";

const { Text, Link } = Typography;

const SimpleTableVsTanstackContent = () => {
  const introText = (
    <>
      The React table ecosystem offers two distinct philosophies: ready-to-use components versus
      headless libraries that provide logic without UI. This fundamental choice affects everything
      from development speed to long-term maintenance. Many developers start their projects by
      evaluating{" "}
      <Text className="text-lg text-inherit" strong>
        TanStack Table (React Table)
      </Text>{" "}
      (formerly known as React Table, now at v8), the most popular headless table library, which
      provides powerful hooks and utilities but requires you to build every UI component from
      scratch. On the other side,{" "}
      <Text className="text-lg text-inherit" strong>
        Simple Table
      </Text>{" "}
      offers a complete, production-ready solution that gets you from zero to functional data grid
      in minutes rather than weeks. This comparison examines both approaches: the flexibility and
      control of building everything yourself versus the speed and convenience of a
      batteries-included solution. We'll help you determine which approach aligns better with your
      project timeline, team expertise, and design requirements. For a deeper dive, read our{" "}
      <NextLink
        href="/blog/tanstack-table-vs-simple-table-headless-batteries-included"
        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
      >
        headless vs batteries-included comparison
      </NextLink>
      .
    </>
  );

  const summaryContent = (
    <>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          Simple Table
        </Text>{" "}
        provides a complete solution with pre-built UI components, ready to use out of the box. It's
        ideal for projects that need a functional data grid quickly without building UI components
        from scratch. With a small bundle size (
        <Link
          className="text-[length:inherit]"
          href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          {SIMPLE_TABLE_INFO.bundleSizeMinGzip} minified + gzipped
        </Link>
        ) and comprehensive features, it's great for most table needs where you want to focus on
        your application logic rather than building UI components.
      </Text>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          TanStack Table (React Table v8)
        </Text>{" "}
        is a headless library (
        <a
          href={TANSTACK_TABLE_INFO.bundlePhobiaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {TANSTACK_TABLE_INFO.bundleSizeMinGzip} minified + gzipped
        </a>
        ) that gives you complete control over your table's UI. It provides hooks and utilities to
        handle table logic, but you'll need to build all UI components yourself. It's perfect for
        projects that require highly customized tables and have the resources to build custom UI
        components from scratch.
      </Text>
      <Text className="text-lg block text-inherit mb-4">
        Choose{" "}
        <a
          href="https://www.simple-table.com"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Simple Table
        </a>{" "}
        if you want a ready-to-use solution with minimal setup. Choose TanStack Table (React Table)
        if you need complete UI flexibility and have the time and resources to build custom
        components.
      </Text>
      <Text className="text-base block text-inherit">
        <strong>Related reading:</strong>{" "}
        <NextLink
          href="/blog/tanstack-table-vs-simple-table-headless-batteries-included"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Detailed headless vs batteries-included guide
        </NextLink>
        {" • "}
        <NextLink
          href="/blog/tanstack-table-vs-ag-grid-comparison"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          TanStack vs AG Grid
        </NextLink>
        {" • "}
        <NextLink
          href="/blog/best-react-table-libraries-2026"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Best React table libraries
        </NextLink>
      </Text>
    </>
  );

  return (
    <ComparisonLayout
      title="Simple Table vs. TanStack Table"
      subtitle="Ready-to-use solution vs. headless library approach"
      introText={introText}
      competitorName="TanStack Table"
      competitorPackage="tanstack"
      performanceMetrics={{
        competitor: "TanStack Table",
        competitorSize: (
          <>
            <a
              href={TANSTACK_TABLE_INFO.bundlePhobiaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {TANSTACK_TABLE_INFO.bundleSizeMinGzip} (minified + gzipped)
            </a>
            {" + custom UI implementation"}
          </>
        ),
      }}
      summaryContent={summaryContent}
    />
  );
};

export default SimpleTableVsTanstackContent;
