"use client";

import React, { useState, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Row, CellChangeProps } from "@simple-table/react";
import { Typography, Button, Tag } from "antd";
import { SALES_HEADERS } from "@/examples/sales/sales-headers";
import "@simple-table/react/styles.css";
import { PerformanceDemoProps } from "@/types/PerformanceDemo";

const { Text } = Typography;

// Generates a large dataset for demo purposes
const generateLargeDataset = (
  count: number,
  customConfig?: {
    categories?: string[];
    maxDealValue?: number;
    minDealValue?: number;
    maxProfit?: number;
    minProfit?: number;
  },
): Row[] => {
  const data: Row[] = [];
  const config = {
    categories: customConfig?.categories || [
      "Software",
      "Hardware",
      "Services",
      "Consulting",
      "Training",
      "Support",
    ],
    maxDealValue: customConfig?.maxDealValue || 100000,
    minDealValue: customConfig?.minDealValue || 1000,
    maxProfit: customConfig?.maxProfit || 0.8,
    minProfit: customConfig?.minProfit || 0.1,
  };

  for (let i = 0; i < count; i++) {
    const isWon = Math.random() > 0.5;
    const profitMargin = Math.random() * (config.maxProfit - config.minProfit) + config.minProfit;
    const dealValue =
      Math.random() * (config.maxDealValue - config.minDealValue) + config.minDealValue;
    const dealProfit = isWon ? dealValue * profitMargin : 0;
    const commission = isWon ? dealProfit * 0.15 : 0; // 15% commission on profit

    // Generate a random close date in the past 90 days
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - Math.floor(Math.random() * 90));
    const closeDate = pastDate.toISOString().split("T")[0];

    // Get a random category
    const category = config.categories[Math.floor(Math.random() * config.categories.length)];

    data.push({
      id: i,
      repName: `Sales Rep ${i.toLocaleString()}`,
      dealSize: Math.random() * 10000 + 100,
      isWon,
      commission,
      dealProfit,
      dealValue,
      profitMargin,
      closeDate,
      category,
    });
  }

  return data;
};

export default function PerformanceDemo({
  headers = SALES_HEADERS,
  height = "500px",
  theme = "light",
  initialRowCount = 1000,
  dataCategories,
  maxDealValue,
  minDealValue,
  maxProfit,
  minProfit,
  title,
  description,
  buttonVariants = {
    small: true,
    medium: true,
    large: true,
    extraLarge: true,
  },
  buttonColors = {
    small: "bg-blue-500",
    medium: "bg-blue-600",
    large: "bg-blue-700",
    extraLarge: "bg-blue-800",
  },
  showGenerationTime = true,
  className = "",
  hideTable = false,
}: PerformanceDemoProps) {
  const [rowCount, setRowCount] = useState<number>(initialRowCount);
  const [data, setData] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [generatingAmount, setGeneratingAmount] = useState<number>(initialRowCount);

  useEffect(() => {
    // Initial data load
    handleGenerateData(initialRowCount);
  }, [initialRowCount]);

  const handleGenerateData = (count: number) => {
    setIsLoading(true);
    setGeneratingAmount(count);

    // Use setTimeout to allow the loading state to render
    setTimeout(() => {
      const startTime = performance.now();

      // Generate data with custom configuration
      const newData = generateLargeDataset(count, {
        categories: dataCategories,
        maxDealValue,
        minDealValue,
        maxProfit,
        minProfit,
      });
      setData(newData);
      setRowCount(count);

      // Calculate render time
      const endTime = performance.now();
      setRenderTime(endTime - startTime);
      setIsLoading(false);
    }, 10);
  };

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === row.id) {
          return {
            ...item,
            [accessor]: newValue,
          };
        }
        return item;
      }),
    );
  };

  return (
    <div className={className}>
      {title && <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>}
      {description && <p className="mb-4 dark:text-gray-300">{description}</p>}

      <div className="flex flex-wrap gap-4 mb-6">
        {buttonVariants.small && (
          <Button
            type="primary"
            onClick={() => handleGenerateData(1000)}
            className={buttonColors.small || "bg-blue-500"}
          >
            1,000 Rows
          </Button>
        )}
        {buttonVariants.medium && (
          <Button
            type="primary"
            onClick={() => handleGenerateData(10000)}
            className={buttonColors.medium || "bg-blue-600"}
          >
            10,000 Rows
          </Button>
        )}
        {buttonVariants.large && (
          <Button
            type="primary"
            onClick={() => handleGenerateData(100000)}
            className={buttonColors.large || "bg-blue-700"}
          >
            100,000 Rows
          </Button>
        )}
        {buttonVariants.extraLarge && (
          <Button
            type="primary"
            onClick={() => handleGenerateData(1000000)}
            className={buttonColors.extraLarge || "bg-blue-800"}
          >
            1,000,000 Rows
          </Button>
        )}
      </div>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-wrap justify-between items-center mb-3">
          <Text strong className="dark:text-white">
            Current Dataset:
          </Text>
          <Tag color="blue" className="text-base py-1">
            {rowCount.toLocaleString()} rows
          </Tag>
        </div>

        {showGenerationTime && renderTime && (
          <div className="flex flex-wrap justify-between items-center">
            <Text strong className="dark:text-white">
              Generation Time:
            </Text>
            <Tag color="green" className="text-base py-1">
              {renderTime.toFixed(2)} ms
            </Tag>
          </div>
        )}
      </div>

      {!hideTable && (
        <div className="border border-gray-200 dark:border-gray-700 rounded">
          {isLoading ? (
            <div className="h-full flex items-center justify-center dark:bg-gray-800">
              <div className="text-center">
                <div className="spinner mb-4"></div>
                <Text className="dark:text-gray-300">
                  Generating {generatingAmount.toLocaleString()} rows...
                </Text>
              </div>
            </div>
          ) : (
            <SimpleTable
              columnResizing
              defaultHeaders={headers}
              editColumns
              height={height}
              onCellEdit={handleCellEdit}
              rows={data}
              selectableCells
              theme={theme}
            />
          )}
        </div>
      )}
    </div>
  );
}
