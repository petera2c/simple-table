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
      1,600+ components including their DataGrid. Paid licenses are sold via custom quote (team
      plans are common); a Community License remains free for qualifying companies under $1M annual
      revenue (with headcount limits). Syncfusion represents a significant investment in a
      full-featured ecosystem. However, many development teams find themselves using only a fraction
      of the suite, primarily needing just the data grid. This is where{" "}
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
      compared to Syncfusion DataGrid (
      <Link
        className="text-[length:inherit]"
        href={SYNCFUSION_GRID_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        {SYNCFUSION_GRID_INFO.npmPackage}
      </Link>
      ) at{" "}
      <Link
        className="text-[length:inherit]"
        href={SYNCFUSION_GRID_INFO.bundlePhobiaUrl}
        target="_blank"
      >
        {SYNCFUSION_GRID_INFO.bundleSizeMinGzip}
      </Link>{" "}
      (minified + gzipped), Simple Table delivers core data grid features under a Community License
      for pre-revenue teams (Pro when you earn revenue). This comparison examines whether you can
      achieve your data grid goals without Syncfusion suite lock-in, custom-quote licensing, and
      DataGrid bundle overhead.
    </>
  );

  const summaryContent = (
    <>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          Simple Table
        </Text>{" "}
        is a lightweight alternative to Syncfusion DataGrid—Community License for pre-revenue
        teams—offering virtualization, infinite scroll, row grouping, and advanced filtering, with a
        significantly smaller bundle size (
        <Link
          className="text-[length:inherit]"
          href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          {SIMPLE_TABLE_INFO.bundleSizeMinGzip} minified + gzipped
        </Link>
        ). It's ideal for projects needing a powerful data grid without an entire component suite.
      </Text>
      <Text className="text-lg mb-4 block text-inherit">
        <Text className="text-lg text-inherit" strong>
          Syncfusion DataGrid
        </Text>{" "}
        ({SYNCFUSION_GRID_INFO.npmPackage}) is part of a comprehensive UI component suite. The
        DataGrid package is{" "}
        <Link
          className="text-[length:inherit]"
          href={SYNCFUSION_GRID_INFO.bundlePhobiaUrl}
          target="_blank"
        >
          {SYNCFUSION_GRID_INFO.bundleSizeMinGzip} (minified + gzipped)
        </Link>
        . Paid plans are {getPricingString(SYNCFUSION_GRID_INFO)}; a Community License is available
        for qualifying companies under $1M revenue (≤5 developers, ≤10 employees). Bundle size,
        suite coupling, and licensing make it better suited for teams already invested in
        Syncfusion.
      </Text>
      <Text className="text-lg block text-inherit">
        If you want a focused grid with a Community License for pre-revenue use,{" "}
        <Link className="text-[length:inherit]" href="https://www.simple-table.com">
          try Simple Table
        </Link>
        . For teams already using Syncfusion components or needing specialized suite features,
        Syncfusion DataGrid may be worth the investment.
      </Text>
    </>
  );

  return (
    <ComparisonLayout
      title="Simple Table vs. Syncfusion DataGrid"
      subtitle="Syncfusion's suite-bound grid vs. Simple Table's standalone multi-framework data grid"
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

