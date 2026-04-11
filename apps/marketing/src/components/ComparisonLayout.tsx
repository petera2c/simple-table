import React, { ReactNode, useState, useEffect, useMemo } from "react";
import { Typography, Table, Space, Card, Button, Tooltip, Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "@/components/PageWrapper";
import { ALL_FEATURES, getFeatureStatus } from "@/constants/comparisonFeatures";
import { FEATURE_LABELS } from "@/constants/featureLabels";
import { FeatureStatusBadge } from "@/components/CommonFeatures";
import { SIMPLE_TABLE_INFO } from "@/constants/packageInfo";

const { Title, Paragraph, Text, Link } = Typography;

interface PerformanceMetricsProps {
  competitor: string;
  competitorSize: string | ReactNode;
}

interface ComparisonLayoutProps {
  title: string;
  subtitle: string;
  introText: ReactNode;
  competitorName: string; // Display name like "AG Grid"
  competitorPackage: string; // Package key like "agGrid"
  performanceMetrics: PerformanceMetricsProps;
  summaryContent: ReactNode;
}

const ComparisonLayout: React.FC<ComparisonLayoutProps> = ({
  title,
  subtitle,
  introText,
  competitorName,
  competitorPackage,
  performanceMetrics,
  summaryContent,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Automatically generate feature table data from ALL_FEATURES
  const featureTableData = useMemo(() => {
    return ALL_FEATURES.map((feature) => {
      const featureInfo = FEATURE_LABELS[feature];
      const simpleTableStatus = getFeatureStatus("simpleTable", feature) || "not-available";
      const competitorStatus = getFeatureStatus(competitorPackage, feature) || "not-available";

      const featureLabel = featureInfo?.label || feature;
      const featureTooltip = featureInfo?.tooltip || "";

      return {
        key: feature,
        feature: (
          <div className={`flex items-center ${isMobile ? "gap-1" : "gap-2"}`}>
            <span className={isMobile ? "text-xs leading-tight" : ""}>{featureLabel}</span>
            {featureTooltip && (
              <Tooltip title={featureTooltip}>
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex-shrink-0"
                  style={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
                />
              </Tooltip>
            )}
          </div>
        ),
        simpleTable: (
          <div className="flex justify-center">
            <FeatureStatusBadge status={simpleTableStatus} />
          </div>
        ),
        competitor: (
          <div className="flex justify-center">
            <FeatureStatusBadge status={competitorStatus} />
          </div>
        ),
      };
    });
  }, [competitorPackage, isMobile]);

  const featureTableColumns = useMemo(
    () => [
      {
        title: "Feature",
        dataIndex: "feature",
        key: "feature",
        width: isMobile ? "45%" : "30%",
      },
      {
        title: "Simple Table",
        dataIndex: "simpleTable",
        key: "simpleTable",
        width: isMobile ? "27.5%" : "35%",
        align: "center" as const,
      },
      {
        title: competitorName,
        dataIndex: "competitor",
        key: "competitor",
        width: isMobile ? "27.5%" : "35%",
        align: "center" as const,
      },
    ],
    [competitorName, isMobile]
  );

  return (
    <PageWrapper>
      <div
        className={`max-w-7xl mx-auto ${
          isMobile ? "px-2" : "px-4 sm:px-6 lg:px-8"
        } pb-12 pt-[12dvh]`}
      >
        {/* Title Card */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Title
            level={1}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center"
          >
            {title}
          </Title>
          <Paragraph className="text-xl text-gray-600 dark:text-gray-300 text-center">
            {subtitle}
          </Paragraph>
        </div>

        {/* Introduction */}
        <div className="mb-8 text-center">
          <Paragraph className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {introText}
          </Paragraph>
        </div>

        {/* AI Disclaimer */}
        <Alert
          message="AI-Assisted Content"
          description={
            <Text>
              This comparison guide was created with AI assistance. While we strive for accuracy, if
              you notice any incorrect information, please{" "}
              <Link href="mailto:peter@peteryng.com" strong>
                contact us
              </Link>{" "}
              so we can correct it promptly.
            </Text>
          }
          type="info"
          showIcon
          className="mb-8"
        />

        {/* Comparison Table */}
        <Card
          className="mb-8 shadow-sm dark:bg-gray-800 dark:border-gray-700"
          styles={isMobile ? { body: { padding: "12px 8px" } } : undefined}
        >
          <Title
            level={2}
            className={`${
              isMobile ? "text-xl" : "text-2xl"
            } font-semibold text-gray-900 dark:text-white mb-4`}
          >
            Feature Comparison
          </Title>

          {/* Legend */}
          <div
            className={`mb-4 ${
              isMobile ? "flex flex-col gap-2" : "flex flex-wrap items-center gap-4"
            } text-sm text-gray-600 dark:text-gray-400`}
          >
            <div className={`flex flex-wrap items-center gap-3`}>
              <div className="flex items-center gap-1.5">
                <FeatureStatusBadge status="free" />
                <span className={isMobile ? "text-xs" : ""}>Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FeatureStatusBadge status="paid" />
                <span className={isMobile ? "text-xs" : ""}>Paid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FeatureStatusBadge status="in-development" />
                <span className={isMobile ? "text-xs" : ""}>In Development</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FeatureStatusBadge status="not-available" />
                <span className={isMobile ? "text-xs" : ""}>Not Available</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={featureTableColumns}
              dataSource={featureTableData}
              pagination={false}
              scroll={{ x: isMobile ? "max-content" : undefined }}
              size={isMobile ? "small" : "middle"}
              className={
                isMobile
                  ? "[&_.ant-table-thead_th]:px-1.5 [&_.ant-table-tbody_td]:px-1.5 [&_.ant-table-thead_th]:text-xs [&_.ant-table-tbody_td]:text-xs [&_.ant-table-thead_th]:py-2 [&_.ant-table-tbody_td]:py-1.5"
                  : ""
              }
            />
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card
          className="mb-8 shadow-sm dark:bg-gray-800 dark:border-gray-700"
          styles={isMobile ? { body: { padding: "12px 8px" } } : undefined}
        >
          <Title
            level={2}
            className={`${
              isMobile ? "text-xl" : "text-2xl"
            } font-semibold text-gray-900 dark:text-white mb-4`}
          >
            Performance Comparison
          </Title>
          <div className="overflow-x-auto">
            <Table
              columns={[
                { title: "Metric", dataIndex: "metric", key: "metric" },
                { title: "Simple Table", dataIndex: "simpleTable", key: "simpleTable" },
                {
                  title: performanceMetrics.competitor,
                  dataIndex: "competitor",
                  key: "competitor",
                },
              ]}
              dataSource={[
                {
                  key: "bundle-size",
                  metric: "Bundle Size",
                  simpleTable: (
                    <Link
                      className="text-[length:inherit]"
                      href={SIMPLE_TABLE_INFO.bundlePhobiaUrl}
                      target="_blank"
                    >
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip} (minified + gzipped)
                    </Link>
                  ),
                  competitor: performanceMetrics.competitorSize,
                },
              ]}
              pagination={false}
              scroll={{ x: isMobile ? "max-content" : undefined }}
              size={isMobile ? "small" : "middle"}
            />
          </div>
        </Card>

        {/* Summary */}
        <Card
          className="mb-8 shadow-sm dark:bg-gray-800 dark:border-gray-700"
          styles={isMobile ? { body: { padding: "12px 8px" } } : undefined}
        >
          <Title
            level={2}
            className={`${
              isMobile ? "text-xl" : "text-2xl"
            } font-semibold text-gray-900 dark:text-white mb-4`}
          >
            Summary
          </Title>
          <Paragraph className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {summaryContent}
          </Paragraph>
        </Card>

        {/* Feature Requests */}
        <Card
          className="mb-8 shadow-sm dark:bg-gray-800 dark:border-gray-700"
          styles={isMobile ? { body: { padding: "12px 8px" } } : undefined}
        >
          <Title
            level={2}
            className={`${
              isMobile ? "text-xl" : "text-2xl"
            } font-semibold text-gray-900 dark:text-white mb-4`}
          >
            Missing a Feature?
          </Title>
          <Paragraph className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            We're constantly working to improve Simple Table. If you need a feature that's not yet
            available, let us know! We prioritize features based on community demand.
          </Paragraph>
          <Space direction={isMobile ? "vertical" : "horizontal"} className="w-full">
            <Button
              type="primary"
              href="https://discord.gg/RvKHCfg3PC"
              target="_blank"
              rel="noopener noreferrer"
              size="large"
            >
              Join Discord Community
            </Button>
            <Button
              href="https://github.com/petera2c/simple-table"
              target="_blank"
              rel="noopener noreferrer"
              size="large"
            >
              Star on GitHub
            </Button>
          </Space>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default ComparisonLayout;
