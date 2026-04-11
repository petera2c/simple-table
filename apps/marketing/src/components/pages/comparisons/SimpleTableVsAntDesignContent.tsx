"use client";
import React from "react";
import { Typography } from "antd";
import ComparisonLayout from "../../ComparisonLayout";
import { SIMPLE_TABLE_INFO, ANT_DESIGN_TABLE_INFO } from "@/constants/packageInfo";

const { Text, Link } = Typography;

const SimpleTableVsAntDesignContent = () => {
  const introText = (
    <>
      When you choose Ant Design for your React project, you're making a commitment to an entire
      design system—not just individual components. This comprehensive approach brings consistency
      and polished UI elements, but it also means that adding a simple table component requires
      pulling in the{" "}
      <Link
        className="text-[length:inherit]"
        href={ANT_DESIGN_TABLE_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        entire Ant Design ecosystem ({ANT_DESIGN_TABLE_INFO.bundleSizeMinGzip} minified + gzipped)
      </Link>
      . For many teams, this raises a critical question: is the visual consistency worth the massive
      bundle size impact, especially when the table component itself lacks many advanced data grid
      features?{" "}
      <Text className="text-lg text-inherit" strong>
        Simple Table
      </Text>{" "}
      offers a different philosophy entirely. At just{" "}
      <Link
        className="text-[length:inherit]"
        href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        {SIMPLE_TABLE_INFO.bundleSizeMinGzip} (minified + gzipped)
      </Link>
      , it delivers more data grid functionality than Ant Design Table while being much smaller. But
      the choice isn't just about file size—it's about architectural decisions that affect your
      entire application's performance, from initial load times to runtime memory usage. This
      comparison examines whether you can achieve both design consistency AND performance by
      choosing Simple Table, even within Ant Design projects. We'll explore styling strategies,
      bundle optimization techniques, and help you determine whether Ant Design Table's framework
      integration justifies its massive overhead for your specific use case.
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
          Ant Design Table
        </Text>{" "}
        is part of the comprehensive Ant Design framework, offering a consistent look and feel with
        other Ant Design components. While it provides basic table functionality, it lacks many
        advanced data grid features that Simple Table offers. It comes with the overhead of the{" "}
        <Link
          className="text-[length:inherit]"
          href={ANT_DESIGN_TABLE_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          full framework ({ANT_DESIGN_TABLE_INFO.bundleSizeMinGzip} minified + gzipped)
        </Link>{" "}
        and requires additional customization for complex use cases.
      </Text>
      <Text className="text-lg block text-inherit">
        If you need a lightweight, standalone table component with advanced features,{" "}
        <Link className="text-[length:inherit]" href="https://www.simple-table.com">
          try Simple Table
        </Link>
        . If you're already using Ant Design and need a basic table with Ant Design styling, the Ant
        Design Table might be sufficient for simpler use cases.
      </Text>
    </>
  );

  return (
    <ComparisonLayout
      title="Simple Table vs. Ant Design Table"
      subtitle="A comprehensive comparison of lightweight vs full-featured React data grid solutions"
      introText={introText}
      competitorName="Ant Design Table"
      competitorPackage="antDesign"
      performanceMetrics={{
        competitor: "Ant Design Table",
        competitorSize: (
          <Link
            className="text-[length:inherit]"
            href={ANT_DESIGN_TABLE_INFO.bundlePhobiaUrl}
            target="_blank"
          >
            {ANT_DESIGN_TABLE_INFO.bundleSizeMinGzip} (minified + gzipped)
          </Link>
        ),
      }}
      summaryContent={summaryContent}
    />
  );
};

export default SimpleTableVsAntDesignContent;
