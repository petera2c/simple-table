"use client";
import React from "react";
import { Typography } from "antd";
import ComparisonLayout from "../../ComparisonLayout";
import { SIMPLE_TABLE_INFO, MATERIAL_REACT_TABLE_INFO } from "@/constants/packageInfo";

const { Text, Link } = Typography;

const SimpleTableVsMaterialReactContent = () => {
  const introText = (
    <>
      When building React applications that require both Material Design aesthetics and advanced
      data grid functionality, developers often evaluate{" "}
      <Text className="text-lg text-inherit" strong>
        Material React Table
      </Text>{" "}
      (MRT)—a popular library that combines TanStack Table's powerful features with Material-UI's
      polished components. While Material React Table offers an excellent solution for teams already
      invested in the Material-UI ecosystem, it comes with the overhead of requiring Material-UI as
      a dependency and a larger bundle size compared to standalone alternatives.{" "}
      <Text className="text-lg text-inherit" strong>
        Simple Table
      </Text>{" "}
      offers a compelling alternative for teams seeking advanced data grid features without the
      Material-UI dependency. At just {SIMPLE_TABLE_INFO.bundleSizeMinGzip} compared to Material
      React Table's {MATERIAL_REACT_TABLE_INFO.bundleSizeMinGzip}, Simple Table delivers comparable
      functionality with a significantly lighter footprint. While it doesn't come with Material
      Design styling out of the box, its flexible theming system makes it possible to achieve
      Material Design aesthetics if desired. This comparison examines the trade-offs between
      Material React Table's pre-built MUI integration and Simple Table's lightweight,
      framework-agnostic approach to help you determine which solution best fits your project's
      needs.
    </>
  );

  const summaryContent = (
    <>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          Simple Table
        </Text>{" "}
        is a lightweight, standalone data grid that provides essential features with minimal
        overhead. It's ideal for projects that need a performant table component without the weight
        of a full UI framework. With its{" "}
        <Link
          className="text-[length:inherit]"
          href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          {SIMPLE_TABLE_INFO.bundleSizeMinGzip} (minified + gzipped)
        </Link>{" "}
        bundle size, it offers a great balance of features and performance.
      </Text>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          Material React Table
        </Text>{" "}
        is built on top of TanStack Table and provides Material-UI styling out of the box. It offers
        advanced data grid features with{" "}
        <a
          href={MATERIAL_REACT_TABLE_INFO.bundlePhobiaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {MATERIAL_REACT_TABLE_INFO.bundleSizeMinGzip} (minified + gzipped)
        </a>
        , making it a middle-ground option between Simple Table's minimal footprint and
        full-featured enterprise solutions.
      </Text>
      <Text className="text-lg block text-inherit">
        If you need a lightweight, framework-agnostic table with advanced features and don't require
        Material-UI styling,{" "}
        <a
          href="https://www.simple-table.com"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          try Simple Table
        </a>
        . If you're already heavily invested in the Material-UI ecosystem and want seamless MUI
        integration with TanStack Table's power, Material React Table is an excellent choice.
      </Text>
    </>
  );

  return (
    <ComparisonLayout
      title="Simple Table vs. Material React Table"
      subtitle="Comparing framework-agnostic efficiency with Material-UI integration"
      introText={introText}
      competitorName="Material React Table"
      competitorPackage="materialReact"
      performanceMetrics={{
        competitor: "Material React Table",
        competitorSize: (
          <a
            href={MATERIAL_REACT_TABLE_INFO.bundlePhobiaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {MATERIAL_REACT_TABLE_INFO.bundleSizeMinGzip} (minified + gzipped)
          </a>
        ),
      }}
      summaryContent={summaryContent}
    />
  );
};

export default SimpleTableVsMaterialReactContent;
