import { useEffect, RefObject } from "react";
import type { TableAPI, Row } from "@simple-table/react";

// Configuration for individual server update timers
const UPDATE_CONFIG = {
  minInterval: 300, // 0.3 seconds
  maxInterval: 1000, // 1 second
};

export function useServerMetricsUpdates(tableRef: RefObject<TableAPI>, data: Row[]) {
  useEffect(() => {
    const timerMap = new Map<string, NodeJS.Timeout>();
    let isActive = true;

    // Function to create an update timer for a specific row
    const createRowTimer = (rowId: string, rowIndex: number) => {
      const scheduleUpdate = () => {
        if (!isActive) return;

        // Random interval for this specific update
        const interval =
          UPDATE_CONFIG.minInterval +
          Math.random() * (UPDATE_CONFIG.maxInterval - UPDATE_CONFIG.minInterval);

        const timerId = setTimeout(() => {
          if (!isActive || !tableRef.current) return;

          // Find the current row in data
          const actualRowIndex = data.findIndex((row) => row.id === rowId);
          if (actualRowIndex === -1) {
            return;
          }

          const server = data[actualRowIndex];

          // Update CPU usage (small fluctuations)
          const currentCpu = server.cpuUsage as number;
          if (typeof currentCpu === "number") {
            const cpuChange = (Math.random() - 0.5) * 8; // -4% to +4%
            const newCpu = Math.min(100, Math.max(0, currentCpu + cpuChange));
            const newCpuRounded = Math.round(newCpu * 10) / 10;

            tableRef.current?.updateData({
              accessor: "cpuUsage",
              rowIndex: actualRowIndex,
              newValue: newCpuRounded,
            });

            // Update CPU history chart
            const currentHistory = server.cpuHistory as number[];
            if (Array.isArray(currentHistory) && currentHistory.length > 0) {
              const updatedHistory = [...currentHistory.slice(1), newCpuRounded];
              tableRef.current?.updateData({
                accessor: "cpuHistory",
                rowIndex: actualRowIndex,
                newValue: updatedHistory,
              });
            }
          }

          // Update Memory usage (40% chance)
          if (Math.random() < 0.4) {
            const currentMemory = server.memoryUsage as number;
            if (typeof currentMemory === "number") {
              const memoryChange = (Math.random() - 0.5) * 5; // -2.5% to +2.5%
              const newMemory = Math.min(100, Math.max(0, currentMemory + memoryChange));

              tableRef.current?.updateData({
                accessor: "memoryUsage",
                rowIndex: actualRowIndex,
                newValue: Math.round(newMemory * 10) / 10,
              });
            }
          }

          // Update Network traffic (60% chance)
          if (Math.random() < 0.6) {
            const currentNetIn = server.networkIn as number;
            if (typeof currentNetIn === "number") {
              const netChange = (Math.random() - 0.5) * 100;
              const newNetIn = Math.max(0, currentNetIn + netChange);

              tableRef.current?.updateData({
                accessor: "networkIn",
                rowIndex: actualRowIndex,
                newValue: Math.round(newNetIn * 100) / 100,
              });
            }

            const currentNetOut = server.networkOut as number;
            if (typeof currentNetOut === "number") {
              const netChange = (Math.random() - 0.5) * 60;
              const newNetOut = Math.max(0, currentNetOut + netChange);

              tableRef.current?.updateData({
                accessor: "networkOut",
                rowIndex: actualRowIndex,
                newValue: Math.round(newNetOut * 100) / 100,
              });
            }
          }

          // Update response time (50% chance)
          if (Math.random() < 0.5) {
            const currentResponseTime = server.responseTime as number;
            if (typeof currentResponseTime === "number") {
              const responseChange = (Math.random() - 0.5) * 100;
              const newResponseTime = Math.max(10, currentResponseTime + responseChange);

              tableRef.current?.updateData({
                accessor: "responseTime",
                rowIndex: actualRowIndex,
                newValue: Math.round(newResponseTime * 10) / 10,
              });
            }
          }

          // Update active connections (50% chance)
          if (Math.random() < 0.5) {
            const currentConnections = server.activeConnections as number;
            if (typeof currentConnections === "number") {
              const connectionChange = Math.floor((Math.random() - 0.5) * 500);
              const newConnections = Math.max(0, currentConnections + connectionChange);

              tableRef.current?.updateData({
                accessor: "activeConnections",
                rowIndex: actualRowIndex,
                newValue: newConnections,
              });
            }
          }

          // Update requests per second (50% chance)
          if (Math.random() < 0.5) {
            const currentRequests = server.requestsPerSec as number;
            if (typeof currentRequests === "number") {
              const requestChange = Math.floor((Math.random() - 0.5) * 2000);
              const newRequests = Math.max(0, currentRequests + requestChange);

              tableRef.current?.updateData({
                accessor: "requestsPerSec",
                rowIndex: actualRowIndex,
                newValue: newRequests,
              });
            }
          }

          // Schedule the next update for this row
          scheduleUpdate();
        }, interval);

        timerMap.set(rowId, timerId);
      };

      scheduleUpdate();
    };

    // Function to sync timers with visible rows
    const syncTimers = () => {
      if (!tableRef.current) return;

      const visibleRows = tableRef.current.getVisibleRows();
      const visibleRowIds = new Set(visibleRows.map((vr) => vr.row.id as string));

      // Remove timers for rows that are no longer visible
      timerMap.forEach((timerId, rowId) => {
        if (!visibleRowIds.has(rowId)) {
          clearTimeout(timerId);
          timerMap.delete(rowId);
        }
      });

      // Create timers for newly visible rows
      visibleRows.forEach((visibleRow, index) => {
        const rowId = visibleRow.row.id as string;
        if (!timerMap.has(rowId)) {
          createRowTimer(rowId, index);
        }
      });
    };

    // Initial sync
    syncTimers();

    // Set up interval to periodically check for visible row changes
    const syncInterval = setInterval(syncTimers, 500);

    // Cleanup function
    return () => {
      isActive = false;
      clearInterval(syncInterval);
      timerMap.forEach((timerId) => clearTimeout(timerId));
      timerMap.clear();
    };
  }, [tableRef, data]);
}
