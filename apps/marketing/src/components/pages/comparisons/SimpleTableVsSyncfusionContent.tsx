"use client";
import React from "react";
import { Typography } from "antd";
import ComparisonLayout from "../../ComparisonLayout";
import {
  SIMPLE_TABLE_INFO,
  SYNCFUSION_GRID_INFO,
  getPricingString,
} from "@/constants/packageInfo";

const { Text, Link } = Typography;

const SimpleVsSyncfusion = () => {
  const introText = (
    <>
      Syncfusion has established itself as a comprehensive enterprise UI component suite, offering
      over 80 components including their DataGrid. With a commercial license requirement for most
      businesses—priced at $995/developer/year (though free for companies with less than $1M in
      annual revenue)—Syncfusion represents a significant investment in a full-featured ecosystem.
      However, many development teams find themselves using only a fraction of the component suite,
      primarily needing just the data grid functionality. This is where{" "}
      <Text className="text-lg text-inherit" strong>
        Simple Table
      </Text>{" "}
      presents a compelling alternative for teams seeking powerful data grid capabilities without
      the overhead of an entire component library. At{" "}
      <Link
        className="text-[length:inherit]"
        href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
      </Link>{" "}
      compared to Syncfusion's{" "}
      <Link
        className="text-[length:inherit]"
        href={SYNCFUSION_GRID_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        {SYNCFUSION_GRID_INFO.bundleSizeMinGzip}
      </Link>{" "}
      (minified + gzipped), Simple Table delivers exceptional performance with core data grid
      features that rival Syncfusion's capabilities—all while remaining completely free. This
      comparison examines whether you can achieve your data grid goals without the licensing costs,
      bundle overhead, and component library lock-in that Syncfusion demands. We'll break down the
      true cost of ownership and help you determine if Simple Table can deliver the
      enterprise-level functionality your application needs without the enterprise price tag.
    </>
  );

  const summaryContent = (
    <>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          Simple Table
        </Text>{" "}
        is a lightweight, free alternative to Syncfusion, offering essential features like
        virtualization, infinite scroll, row grouping, and advanced filtering, with a significantly
        smaller bundle size (
        <Link
          className="text-[length:inherit]"
          href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          {SIMPLE_TABLE_INFO.bundleSizeMinGzip} minified + gzipped
        </Link>
        ). It's ideal for projects needing a powerful, performant data grid without the overhead of
        an entire component suite or licensing fees.
      </Text>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          Syncfusion DataGrid
        </Text>{" "}
        is part of a comprehensive UI component suite with advanced data grid capabilities. The{" "}
        <Link
          className="text-[length:inherit]"
          href={SYNCFUSION_GRID_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          DataGrid package
        </Link>{" "}
        is {SYNCFUSION_GRID_INFO.bundleSizeMinGzip} (minified + gzipped) and requires a commercial
        license at {getPricingString(SYNCFUSION_GRID_INFO)} (free for companies with less than $1M
        revenue). While feature-rich, the combined bundle size, licensing costs, and tight
        integration with the broader Syncfusion ecosystem make it better suited for enterprises
        already invested in the Syncfusion platform.
      </Text>
      <Text className="text-lg block text-inherit">
        If you're looking for a free, lightweight solution with solid features,{" "}
        <Link className="text-[length:inherit]" href="https://www.simple-table.com">
          try Simple Table
        </Link>
        . For teams already using Syncfusion components or needing specialized enterprise features,
        Syncfusion DataGrid might be worth the investment.
      </Text>
    </>
  );

  return (
    <ComparisonLayout
      title="Simple Table vs. Syncfusion DataGrid"
      subtitle="A comprehensive comparison of two React data grid solutions"
      introText={introText}
      competitorName="Syncfusion DataGrid"
      competitorPackage="syncfusion"
      performanceMetrics={{
        competitor: "Syncfusion",
        competitorSize: (
          <>
            <Link
              className="text-[length:inherit]"
              href={SYNCFUSION_GRID_INFO.bundlePhobiaUrl}
              target="_blank"
            >
              {SYNCFUSION_GRID_INFO.bundleSizeMinGzip}
            </Link>
            {" (minified + gzipped), requires "}
            {getPricingString(SYNCFUSION_GRID_INFO)}
          </>
        ),
      }}
      summaryContent={summaryContent}
    />
  );
};

export default SimpleVsSyncfusion;

