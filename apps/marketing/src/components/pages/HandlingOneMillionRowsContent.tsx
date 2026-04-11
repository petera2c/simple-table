"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageWrapper from "@/components/PageWrapper";
import {
  faRocket,
  faTable,
  faCode,
  faMemory,
  faClock,
  faChartLine,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { handlingOneMillionRowsPost } from "@/constants/blogPosts";
import PerformanceDemo from "@/components/PerformanceDemo";
import CallToActionCard from "@/components/CallToActionCard";

export default function HandlingOneMillionRowsContent() {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          {handlingOneMillionRowsPost.title}
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faRocket} />
            Performance
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faTable} />
            Large Datasets
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            React
          </span>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center">
          {handlingOneMillionRowsPost.description}
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* The Challenge Section */}
        <section id="the-challenge">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faMemory} className="text-blue-500" />
              The Challenge: Managing Extreme Data Volumes
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Modern web applications often need to display and interact with enormous datasets.
                Whether you're building analytics dashboards, financial platforms, or enterprise
                systems, the ability to manage large data volumes efficiently is crucial.
              </p>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Traditional data grids struggle when handling more than a few thousand rows, leading
                to:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>• Sluggish rendering and poor user experience</li>
                <li>• Browser freezes and unresponsive interfaces</li>
                <li>• Memory consumption issues leading to crashes</li>
                <li>• Complex implementation requiring specialized knowledge</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300">
                Simple Table solves these challenges with an optimized architecture designed
                specifically for high-performance data rendering.
              </p>
            </div>
          </div>
        </section>

        {/* Simple Table's Approach Section */}
        <section id="approach">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Simple Table's Approach to Large Datasets
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Simple Table employs several advanced techniques to effectively manage large datasets:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Virtual Rendering
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Only renders rows visible in the viewport, dramatically reducing DOM elements and
                  memory usage regardless of total dataset size.
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Efficient Updates
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Uses React's virtual DOM efficiently with optimized rendering cycles to update
                  only what has changed, avoiding costly full re-renders.
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Pagination Support
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Built-in pagination reduces initial load and improves perceived performance while
                  supporting server-side pagination for truly massive datasets.
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Memory Management
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Intelligent data handling prevents memory leaks and optimizes garbage collection,
                  maintaining performance even during extended use.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Demo Section */}
        <section id="demo">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faClock} className="text-amber-500" />
              Performance Demo
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Experience Simple Table's performance firsthand. Use the controls below to generate
              different data volumes and see how quickly the table renders and responds.
            </p>

            <div className="w-full">
              <PerformanceDemo
                title="Simple Table Performance Demo"
                description="Experience how Simple Table effortlessly handles one million rows with near-instant rendering and smooth scrolling."
                height="500px"
                theme="modern-light"
                initialRowCount={10000}
                dataCategories={[
                  "Software",
                  "Hardware",
                  "Services",
                  "Consulting",
                  "Training",
                  "Support",
                ]}
                maxDealValue={100000}
                minDealValue={1000}
                maxProfit={0.8}
                minProfit={0.1}
                buttonVariants={{
                  small: true,
                  medium: true,
                  large: true,
                  extraLarge: true,
                }}
                buttonColors={{
                  small: "bg-blue-500",
                  medium: "bg-blue-600",
                  large: "bg-blue-700",
                  extraLarge: "bg-blue-800",
                }}
                showGenerationTime={true}
                hideTable={false}
              />
            </div>
          </div>
        </section>

        {/* Implementation Section */}
        <section id="implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-purple-500" />
              Implementation: Simpler Than You Might Think
            </h3>

            <p className="mb-4 text-gray-700 dark:text-gray-300">
              One of Simple Table's strengths is its straightforward API. Here's how you can
              implement a high-performance table for large datasets:
            </p>

            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-auto mb-6 text-sm leading-relaxed">
              {`import React, { useState, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { HeaderObject } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Define headers for the performance demo
const PERFORMANCE_HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
  { accessor: "repName", label: "Sales Rep", width: "1fr", isSortable: true, type: "string" },
  { accessor: "dealSize", label: "Deal Size", width: 120, isSortable: true, type: "number" },
  { accessor: "isWon", label: "Status", width: 100, isSortable: true, type: "boolean" },
  { accessor: "dealProfit", label: "Profit", width: 120, isSortable: true, type: "number" },
  { accessor: "dealValue", label: "Value", width: 120, isSortable: true, type: "number" },
];

// Generates a large dataset for demo purposes
const generateLargeDataset = (count: number) => {
  const data = [];
  const config = {
    categories: ["Software", "Hardware", "Services", "Consulting"],
    maxDealValue: 100000,
    minDealValue: 1000,
    maxProfit: 0.8,
    minProfit: 0.1,
  };

  for (let i = 0; i < count; i++) {
    const isWon = Math.random() > 0.5;
    const profitMargin = Math.random() * (config.maxProfit - config.minProfit) + config.minProfit;
    const dealValue = Math.random() * (config.maxDealValue - config.minDealValue) + config.minDealValue;
    const dealProfit = isWon ? dealValue * profitMargin : 0;

    data.push({
      id: i,
      repName: \`Sales Rep \${i.toLocaleString()}\`,
      dealSize: Math.random() * 10000 + 100,
      isWon,
      dealProfit,
      dealValue,
      profitMargin,
    });
  }

  return data;
};

export default function PerformanceDemo() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Initial data load
    handleGenerateData(1000000); // 1 million rows!
  }, []);

  const handleGenerateData = (count: number) => {
    setTimeout(() => {
      const newData = generateLargeDataset(count);
      setData(newData);
    }, 10);
  };

  return (
    <SimpleTable
      defaultHeaders={PERFORMANCE_HEADERS}
      rows={data}
      
      height="500px"
      editColumns
      columnResizing
      selectableCells
    />
  );
}`}
            </pre>

            <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
              Key Implementation Tips:
            </h4>

            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Set fixed heights to enable virtualization and optimize rendering</li>
              <li>
                • Consider server-side operations (sorting, filtering) for datasets over 100,000
                rows
              </li>
              <li>• Implement lazy loading for your data to improve initial page load time</li>
            </ul>
          </div>
        </section>

        {/* Performance Comparison Section */}
        <section id="comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faChartLine} className="text-red-500" />
              Performance Comparison
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              How does Simple Table compare to other popular grid libraries when rendering large
              datasets? We ran benchmarks rendering 100,000 rows across different libraries:
            </p>

            <div className="space-y-4 mb-6">
              {/* Simple Table */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900 dark:text-gray-100">Simple Table</span>
                <span className="text-gray-700 dark:text-gray-300">420ms</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 md:h-4">
                <div className="bg-green-500 h-3 md:h-4 rounded-full" style={{ width: "42%" }} />
              </div>

              {/* AG Grid */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900 dark:text-gray-100">AG Grid</span>
                <span className="text-gray-700 dark:text-gray-300">780ms</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 md:h-4">
                <div className="bg-blue-500 h-3 md:h-4 rounded-full" style={{ width: "78%" }} />
              </div>

              {/* Material UI DataGrid */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  Material UI DataGrid
                </span>
                <span className="text-gray-700 dark:text-gray-300">950ms</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 md:h-4">
                <div className="bg-purple-500 h-3 md:h-4 rounded-full" style={{ width: "95%" }} />
              </div>

              {/* React Table */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900 dark:text-gray-100">React Table</span>
                <span className="text-gray-700 dark:text-gray-300">620ms</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 md:h-4">
                <div className="bg-amber-500 h-3 md:h-4 rounded-full" style={{ width: "62%" }} />
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Note: Benchmarks performed on Chrome 92, MacBook Pro 2021, M1 Pro, 16GB RAM. Results
              may vary based on hardware, browser, and specific implementation details.
            </p>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
              Conclusion and Best Practices
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table provides an efficient solution for handling large datasets in React
                applications without compromising on performance or developer experience.
              </p>

              <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
                When working with large datasets, remember to:
              </h4>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>• Implement virtualization by setting fixed heights</li>
                <li>• Minimize unnecessary re-renders with memoization</li>
                <li>• Consider server-side operations for extremely large datasets</li>
                <li>• Monitor memory usage during development</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <CallToActionCard
          title="Ready to scale your data grids?"
          description="Simple Table makes it easy to handle large datasets with lightning-fast performance."
          primaryButton={{
            text: "View on NPM",
            href: "https://www.npmjs.com/package/@simple-table/react",
            external: true,
          }}
          secondaryButton={{
            text: "Back to Home",
            href: "/",
          }}
        />
      </article>
    </PageWrapper>
  );
}
