"use client";
import React from "react";
import { Typography } from "antd";
import ComparisonLayout from "../../ComparisonLayout";
import {
  SIMPLE_TABLE_INFO,
  TABULATOR_INFO,
  REACT_TABULATOR_INFO,
  TABULATOR_TOTAL_SIZE,
} from "@/constants/packageInfo";

const { Text, Link } = Typography;

const SimpleVsTabulator = () => {
  const introText = (
    <>
      Tabulator has built a strong reputation as a feature-rich, free data grid library that works
      with vanilla JavaScript and can be adapted to React. With its comprehensive feature set and
      zero licensing costs, Tabulator appeals to developers who want a powerful table solution
      without breaking the bank. However, Tabulator wasn't designed specifically for React—it
      requires a wrapper library and can feel somewhat disconnected from the React ecosystem, with
      manual DOM manipulation and event handling that doesn't always align with React's declarative
      philosophy. This is where{" "}
      <Text className="text-lg text-inherit" strong>
        Simple Table
      </Text>{" "}
      offers a React-first alternative built from the ground up for the React ecosystem. At{" "}
      <Link
        className="text-[length:inherit]"
        href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
      </Link>{" "}
      compared to Tabulator's{" "}
      <Link className="text-[length:inherit]" href={TABULATOR_INFO.bundlePhobiaUrl} target="_blank">
        {TABULATOR_INFO.bundleSizeMinGzip}
      </Link>{" "}
      plus{" "}
      <Link
        className="text-[length:inherit]"
        href={REACT_TABULATOR_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        {REACT_TABULATOR_INFO.bundleSizeMinGzip}
      </Link>{" "}
      for the React wrapper (totaling {TABULATOR_TOTAL_SIZE}, minified + gzipped), Simple Table
      provides a more streamlined solution. This comparison examines whether a React-first approach
      with TypeScript-first design can deliver the functionality you need with better React
      integration, or if Tabulator's mature ecosystem and extensive features make it worth the
      integration complexity. We'll explore the differences in developer experience, React patterns,
      and feature sets to help you choose the right fit for your project.
    </>
  );

  const summaryContent = (
    <>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          Simple Table
        </Text>{" "}
        is a React-first data grid built specifically for the React ecosystem, offering features
        like virtualization, infinite scroll, row grouping, and cell editing with seamless React
        integration. At{" "}
        <Link
          className="text-[length:inherit]"
          href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          {SIMPLE_TABLE_INFO.bundleSizeMinGzip} minified + gzipped
        </Link>
        , it provides a declarative API that feels natural in React applications. It's ideal for
        developers who want a TypeScript-first, React-first solution without the overhead of wrapper
        libraries.
      </Text>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          Tabulator
        </Text>{" "}
        is a feature-rich, mature data grid library that works with vanilla JavaScript and can be
        used in React via a wrapper. The{" "}
        <Link
          className="text-[length:inherit]"
          href={TABULATOR_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          core library
        </Link>{" "}
        is {TABULATOR_INFO.bundleSizeMinGzip}, plus an additional{" "}
        <Link
          className="text-[length:inherit]"
          href={REACT_TABULATOR_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          {REACT_TABULATOR_INFO.bundleSizeMinGzip}
        </Link>{" "}
        for the React wrapper (totaling {TABULATOR_TOTAL_SIZE}, minified + gzipped). While
        completely free and feature-complete, its imperative API and manual DOM manipulation can
        feel less natural in React applications, requiring more integration work to follow React
        patterns.
      </Text>
      <Text className="text-lg block text-inherit">
        If you're building a React application and want a React-first solution with excellent
        TypeScript support,{" "}
        <Link className="text-[length:inherit]" href="https://www.simple-table.com">
          try Simple Table
        </Link>
        . For projects where framework-agnostic code is important or you need Tabulator's specific
        advanced features, Tabulator remains a solid free choice.
      </Text>
    </>
  );

  return (
    <ComparisonLayout
      title="Simple Table vs. Tabulator"
      subtitle="Comparing a React-first data grid with a framework-agnostic solution"
      introText={introText}
      competitorName="Tabulator"
      competitorPackage="tabulator"
      performanceMetrics={{
        competitor: "Tabulator",
        competitorSize: (
          <>
            <Link
              className="text-[length:inherit]"
              href={TABULATOR_INFO.bundlePhobiaUrl}
              target="_blank"
            >
              {TABULATOR_INFO.bundleSizeMinGzip} core
            </Link>
            {" + "}
            <Link
              className="text-[length:inherit]"
              href={REACT_TABULATOR_INFO.bundlePhobiaUrl}
              target="_blank"
            >
              {REACT_TABULATOR_INFO.bundleSizeMinGzip} React wrapper
            </Link>
            {" = "}
            {TABULATOR_TOTAL_SIZE} total (minified + gzipped)
          </>
        ),
      }}
      summaryContent={summaryContent}
    />
  );
};

export default SimpleVsTabulator;
