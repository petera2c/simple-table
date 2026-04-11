"use client";
import React from "react";
import { Typography } from "antd";
import NextLink from "next/link";
import ComparisonLayout from "../../ComparisonLayout";
import {
  SIMPLE_TABLE_INFO,
  AG_GRID_COMMUNITY_INFO,
  AG_GRID_ENTERPRISE_INFO,
  AG_GRID_TOTAL_SIZE,
  getPricingString,
} from "@/constants/packageInfo";

const { Text, Link } = Typography;

const SimpleVsAgGrid = () => {
  const introText = (
    <>
      In the enterprise data grid landscape, AG Grid has established itself as the go-to solution
      for companies willing to invest heavily in advanced table functionality. With its two-tier
      pricing model—free Community edition and $999/developer Enterprise license—AG Grid represents
      a significant financial commitment. However, many development teams find themselves
      questioning whether they truly need the Enterprise features that justify this cost, especially
      when much of their functionality is locked behind the paywall. This is where{" "}
      <Text className="text-lg text-inherit" strong>
        Simple Table
      </Text>{" "}
      presents a compelling alternative for teams seeking enterprise-grade performance without
      enterprise-grade pricing. At{" "}
      <Link
        className="text-[length:inherit]"
        href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
      </Link>{" "}
      compared to AG Grid Community's{" "}
      <Link
        className="text-[length:inherit]"
        href={AG_GRID_COMMUNITY_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip}
      </Link>{" "}
      (or {AG_GRID_TOTAL_SIZE} total with{" "}
      <Link
        className="text-[length:inherit]"
        href={AG_GRID_ENTERPRISE_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        Enterprise
      </Link>
      , minified + gzipped), Simple Table delivers blazing-fast performance with core data grid
      features that rival AG Grid's Community edition—and surpass many of its Enterprise
      capabilities—all while remaining completely free. This comparison examines whether you can
      achieve your data grid goals without the complexity, licensing costs, and bundle overhead that
      AG Grid Enterprise demands. We'll break down the true cost of ownership and help you determine
      if Simple Table can deliver the enterprise-level functionality your application needs. For a
      detailed pricing breakdown, see our{" "}
      <NextLink
        href="/blog/ag-grid-pricing-license-breakdown-2026"
        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
      >
        AG Grid pricing guide
      </NextLink>
      . Looking for more options? Check out our{" "}
      <NextLink
        href="/blog/ag-grid-alternatives-free-react-data-grids"
        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
      >
        7 best free AG Grid alternatives
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
        is a lightweight, free alternative to AG Grid, offering essential features like
        virtualization, infinite scroll, and column filters, with a smaller bundle size (
        <Link
          className="text-[length:inherit]"
          href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          {SIMPLE_TABLE_INFO.bundleSizeMinGzip} minified + gzipped
        </Link>
        ). It's ideal for projects needing a simple, performant data grid without the overhead of
        enterprise features.
      </Text>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          AG Grid
        </Text>{" "}
        is a feature-rich data grid with advanced capabilities. The{" "}
        <Link
          className="text-[length:inherit]"
          href={AG_GRID_COMMUNITY_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          Community edition
        </Link>{" "}
        is {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip} (minified + gzipped), but many advanced
        features like pivot tables and tree data require the{" "}
        <Link
          className="text-[length:inherit]"
          href={AG_GRID_ENTERPRISE_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          Enterprise edition
        </Link>{" "}
        (additional {AG_GRID_ENTERPRISE_INFO.bundleSizeMinGzip}, totaling {AG_GRID_TOTAL_SIZE}) at{" "}
        {getPricingString(AG_GRID_ENTERPRISE_INFO)}. The combined bundle size and steeper learning
        curve make it better suited for complex, enterprise-level applications.
      </Text>
      <Text className="text-lg block text-inherit mb-4">
        If you're looking for a free, lightweight solution with solid features,{" "}
        <Link className="text-[length:inherit]" href="https://www.simple-table.com">
          try Simple Table
        </Link>
        . For enterprise needs, AG Grid might be worth the investment.
      </Text>
      <Text className="text-base block text-inherit">
        <strong>Related reading:</strong>{" "}
        <NextLink
          href="/blog/ag-grid-pricing-license-breakdown-2026"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          AG Grid pricing breakdown
        </NextLink>
        {" • "}
        <NextLink
          href="/blog/best-react-table-libraries-2026"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Best React table libraries 2025
        </NextLink>
        {" • "}
        <NextLink
          href="/blog/react-data-grid-bundle-size-comparison"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Bundle size comparison
        </NextLink>
      </Text>
    </>
  );

  return (
    <ComparisonLayout
      title="Simple Table vs. AG Grid"
      subtitle="A comprehensive comparison of two popular React data grid solutions"
      introText={introText}
      competitorName="AG Grid"
      competitorPackage="agGrid"
      performanceMetrics={{
        competitor: "AG Grid",
        competitorSize: (
          <>
            <Link
              className="text-[length:inherit]"
              href={AG_GRID_COMMUNITY_INFO.bundlePhobiaUrl}
              target="_blank"
            >
              {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip} Community
            </Link>
            {" + "}
            <Link
              className="text-[length:inherit]"
              href={AG_GRID_ENTERPRISE_INFO.bundlePhobiaUrl}
              target="_blank"
            >
              {AG_GRID_ENTERPRISE_INFO.bundleSizeMinGzip} Enterprise
            </Link>
            {" = "}
            {AG_GRID_TOTAL_SIZE} total (minified + gzipped)
          </>
        ),
      }}
      summaryContent={summaryContent}
    />
  );
};

export default SimpleVsAgGrid;
