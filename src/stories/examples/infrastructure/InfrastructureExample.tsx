import { useEffect, useRef, useState } from "react";

import { HEADERS } from "./infrastructure-headers";
import Theme from "../../../types/Theme";
import TableRefType from "../../../types/TableRefType";
import Row from "../../../types/Row";
import SimpleTable from "../../../components/simple-table/SimpleTable";

export const infrastructureExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "70dvh",
};

const BACKUP_INFRASTRUCTURE_DATA = [
  {
    id: "US-WEST-1-loadbalancer-0000",
    serverId: "US-WEST-1-loadbalancer-0000",
    serverName: "N. California Load Balancer 1",
    datacenter: "US-WEST-1",
    datacenterName: "N. California",
    region: "US West",
    serverType: "loadbalancer",
    serverTypeName: "Load Balancer",
    status: "warning",
    cpuUsage: 36.5,
    memoryUsage: 22.3,
    diskUsage: 62.8,
    networkIn: 291.01,
    networkOut: 28.59,
    activeConnections: 1205,
    requestsPerSec: 8238,
    responseTime: 351.4,
    uptime: 6,
    activeAlerts: 0,
    isMonitored: true,
    os: "Ubuntu 22.04",
    lastPing: "2025-10-13T16:56:45.405Z",
    totalStorage: 1,
    usedStorage: 0.63,
    availableStorage: 0.37,
  },
  {
    id: "US-EAST-1-worker-0001",
    serverId: "US-EAST-1-worker-0001",
    serverName: "N. Virginia Background Worker 2",
    datacenter: "US-EAST-1",
    datacenterName: "N. Virginia",
    region: "US East",
    serverType: "worker",
    serverTypeName: "Background Worker",
    status: "online",
    cpuUsage: 45.6,
    memoryUsage: 35.6,
    diskUsage: 62.5,
    networkIn: 161.61,
    networkOut: 287.92,
    activeConnections: 4873,
    requestsPerSec: 5719,
    responseTime: 190.8,
    uptime: 20,
    activeAlerts: 0,
    isMonitored: true,
    os: "Ubuntu 22.04",
    lastPing: "2025-10-13T17:00:16.250Z",
    totalStorage: 2,
    usedStorage: 1.25,
    availableStorage: 0.75,
  },
  {
    id: "US-WEST-2-worker-0002",
    serverId: "US-WEST-2-worker-0002",
    serverName: "Oregon Background Worker 3",
    datacenter: "US-WEST-2",
    datacenterName: "Oregon",
    region: "US West",
    serverType: "worker",
    serverTypeName: "Background Worker",
    status: "warning",
    cpuUsage: 44,
    memoryUsage: 52.4,
    diskUsage: 33.2,
    networkIn: 490.01,
    networkOut: 245.37,
    activeConnections: 4543,
    requestsPerSec: 2451,
    responseTime: 354.9,
    uptime: 41,
    activeAlerts: 1,
    isMonitored: true,
    os: "Ubuntu 22.04",
    lastPing: "2025-10-13T16:57:30.400Z",
    totalStorage: 4,
    usedStorage: 1.33,
    availableStorage: 2.67,
  },
  {
    id: "US-EAST-1-web-0003",
    serverId: "US-EAST-1-web-0003",
    serverName: "N. Virginia Web Server 4",
    datacenter: "US-EAST-1",
    datacenterName: "N. Virginia",
    region: "US East",
    serverType: "web",
    serverTypeName: "Web Server",
    status: "critical",
    cpuUsage: 32.6,
    memoryUsage: 49.2,
    diskUsage: 57.1,
    networkIn: 154.78,
    networkOut: 93.9,
    activeConnections: 1199,
    requestsPerSec: 4595,
    responseTime: 410.6,
    uptime: 63,
    activeAlerts: 4,
    isMonitored: true,
    os: "Ubuntu 22.04",
    lastPing: "2025-10-13T16:56:45.076Z",
    totalStorage: 16,
    usedStorage: 9.14,
    availableStorage: 6.86,
  },
  {
    id: "AP-NORTHEAST-1-worker-0004",
    serverId: "AP-NORTHEAST-1-worker-0004",
    serverName: "Tokyo Background Worker 5",
    datacenter: "AP-NORTHEAST-1",
    datacenterName: "Tokyo",
    region: "Asia Pacific",
    serverType: "worker",
    serverTypeName: "Background Worker",
    status: "warning",
    cpuUsage: 61,
    memoryUsage: 63.4,
    diskUsage: 31.5,
    networkIn: 196.01,
    networkOut: 190.75,
    activeConnections: 4843,
    requestsPerSec: 8386,
    responseTime: 224.9,
    uptime: 33,
    activeAlerts: 1,
    isMonitored: true,
    os: "Windows Server 2022",
    lastPing: "2025-10-13T16:59:28.355Z",
    totalStorage: 4,
    usedStorage: 1.26,
    availableStorage: 2.74,
  },
  {
    id: "AP-SOUTH-1-worker-0005",
    serverId: "AP-SOUTH-1-worker-0005",
    serverName: "Mumbai Background Worker 6",
    datacenter: "AP-SOUTH-1",
    datacenterName: "Mumbai",
    region: "Asia Pacific",
    serverType: "worker",
    serverTypeName: "Background Worker",
    status: "warning",
    cpuUsage: 44.6,
    memoryUsage: 41.4,
    diskUsage: 39.9,
    networkIn: 2.21,
    networkOut: 277.71,
    activeConnections: 2414,
    requestsPerSec: 7059,
    responseTime: 206.9,
    uptime: 244,
    activeAlerts: 2,
    isMonitored: true,
    os: "Ubuntu 22.04",
    lastPing: "2025-10-13T16:57:49.065Z",
    totalStorage: 16,
    usedStorage: 6.38,
    availableStorage: 9.62,
  },
  {
    id: "US-EAST-2-database-0006",
    serverId: "US-EAST-2-database-0006",
    serverName: "Ohio Database 7",
    datacenter: "US-EAST-2",
    datacenterName: "Ohio",
    region: "US East",
    serverType: "database",
    serverTypeName: "Database",
    status: "warning",
    cpuUsage: 53.3,
    memoryUsage: 65,
    diskUsage: 46.1,
    networkIn: 455.28,
    networkOut: 254.56,
    activeConnections: 1414,
    requestsPerSec: 8516,
    responseTime: 306.6,
    uptime: 198,
    activeAlerts: 0,
    isMonitored: true,
    os: "Windows Server 2022",
    lastPing: "2025-10-13T16:59:21.760Z",
    totalStorage: 8,
    usedStorage: 3.69,
    availableStorage: 4.31,
  },
  {
    id: "US-WEST-1-ml-0007",
    serverId: "US-WEST-1-ml-0007",
    serverName: "N. California ML Compute 8",
    datacenter: "US-WEST-1",
    datacenterName: "N. California",
    region: "US West",
    serverType: "ml",
    serverTypeName: "ML Compute",
    status: "warning",
    cpuUsage: 78.5,
    memoryUsage: 81.8,
    diskUsage: 78.3,
    networkIn: 251.34,
    networkOut: 166.89,
    activeConnections: 109,
    requestsPerSec: 7,
    responseTime: 364.8,
    uptime: 6,
    activeAlerts: 1,
    isMonitored: true,
    os: "Debian 11",
    lastPing: "2025-10-13T16:59:36.099Z",
    totalStorage: 8,
    usedStorage: 6.26,
    availableStorage: 1.74,
  },
  {
    id: "US-WEST-2-web-0008",
    serverId: "US-WEST-2-web-0008",
    serverName: "Oregon Web Server 9",
    datacenter: "US-WEST-2",
    datacenterName: "Oregon",
    region: "US West",
    serverType: "web",
    serverTypeName: "Web Server",
    status: "online",
    cpuUsage: 22.8,
    memoryUsage: 67.5,
    diskUsage: 35.3,
    networkIn: 144.41,
    networkOut: 20.15,
    activeConnections: 2661,
    requestsPerSec: 6686,
    responseTime: 175.8,
    uptime: 30,
    activeAlerts: 0,
    isMonitored: true,
    os: "CentOS 8",
    lastPing: "2025-10-13T17:01:17.403Z",
    totalStorage: 4,
    usedStorage: 1.41,
    availableStorage: 2.59,
  },
  {
    id: "SA-EAST-1-database-0009",
    serverId: "SA-EAST-1-database-0009",
    serverName: "São Paulo Database 10",
    datacenter: "SA-EAST-1",
    datacenterName: "São Paulo",
    region: "South America",
    serverType: "database",
    serverTypeName: "Database",
    status: "warning",
    cpuUsage: 53.4,
    memoryUsage: 87.5,
    diskUsage: 49.8,
    networkIn: 316.48,
    networkOut: 145.13,
    activeConnections: 2483,
    requestsPerSec: 469,
    responseTime: 384.9,
    uptime: 90,
    activeAlerts: 0,
    isMonitored: true,
    os: "Ubuntu 22.04",
    lastPing: "2025-10-13T16:59:08.743Z",
    totalStorage: 1,
    usedStorage: 0.5,
    availableStorage: 0.5,
  },
  {
    id: "EU-CENTRAL-1-ml-0010",
    serverId: "EU-CENTRAL-1-ml-0010",
    serverName: "Frankfurt ML Compute 11",
    datacenter: "EU-CENTRAL-1",
    datacenterName: "Frankfurt",
    region: "Europe",
    serverType: "ml",
    serverTypeName: "ML Compute",
    status: "warning",
    cpuUsage: 88.9,
    memoryUsage: 67,
    diskUsage: 29,
    networkIn: 15.6,
    networkOut: 209.38,
    activeConnections: 4097,
    requestsPerSec: 7930,
    responseTime: 11.7,
    uptime: 273,
    activeAlerts: 1,
    isMonitored: false,
    os: "Ubuntu 22.04",
    lastPing: "2025-10-13T16:57:25.036Z",
    totalStorage: 8,
    usedStorage: 2.32,
    availableStorage: 5.68,
  },
  {
    id: "US-EAST-2-loadbalancer-0011",
    serverId: "US-EAST-2-loadbalancer-0011",
    serverName: "Ohio Load Balancer 12",
    datacenter: "US-EAST-2",
    datacenterName: "Ohio",
    region: "US East",
    serverType: "loadbalancer",
    serverTypeName: "Load Balancer",
    status: "online",
    cpuUsage: 9.8,
    memoryUsage: 28.6,
    diskUsage: 60.7,
    networkIn: 398.48,
    networkOut: 281.33,
    activeConnections: 1816,
    requestsPerSec: 3732,
    responseTime: 102.6,
    uptime: 195,
    activeAlerts: 0,
    isMonitored: true,
    os: "Amazon Linux 2",
    lastPing: "2025-10-13T16:57:35.130Z",
    totalStorage: 4,
    usedStorage: 2.43,
    availableStorage: 1.57,
  },
  {
    id: "US-EAST-1-storage-0012",
    serverId: "US-EAST-1-storage-0012",
    serverName: "N. Virginia Storage Server 13",
    datacenter: "US-EAST-1",
    datacenterName: "N. Virginia",
    region: "US East",
    serverType: "storage",
    serverTypeName: "Storage Server",
    status: "online",
    cpuUsage: 51.9,
    memoryUsage: 43.9,
    diskUsage: 88.4,
    networkIn: 225.07,
    networkOut: 251.22,
    activeConnections: 2650,
    requestsPerSec: 1946,
    responseTime: 135.8,
    uptime: 232,
    activeAlerts: 0,
    isMonitored: true,
    os: "Windows Server 2022",
    lastPing: "2025-10-13T16:57:23.895Z",
    totalStorage: 2,
    usedStorage: 1.77,
    availableStorage: 0.23,
  },
  {
    id: "US-EAST-1-loadbalancer-0013",
    serverId: "US-EAST-1-loadbalancer-0013",
    serverName: "N. Virginia Load Balancer 14",
    datacenter: "US-EAST-1",
    datacenterName: "N. Virginia",
    region: "US East",
    serverType: "loadbalancer",
    serverTypeName: "Load Balancer",
    status: "online",
    cpuUsage: 15.6,
    memoryUsage: 35,
    diskUsage: 24.2,
    networkIn: 290.96,
    networkOut: 276.12,
    activeConnections: 2555,
    requestsPerSec: 7856,
    responseTime: 38.5,
    uptime: 348,
    activeAlerts: 0,
    isMonitored: true,
    os: "Windows Server 2022",
    lastPing: "2025-10-13T16:59:36.782Z",
    totalStorage: 2,
    usedStorage: 0.48,
    availableStorage: 1.52,
  },
  {
    id: "AP-SOUTHEAST-1-cache-0014",
    serverId: "AP-SOUTHEAST-1-cache-0014",
    serverName: "Singapore Cache Server 15",
    datacenter: "AP-SOUTHEAST-1",
    datacenterName: "Singapore",
    region: "Asia Pacific",
    serverType: "cache",
    serverTypeName: "Cache Server",
    status: "online",
    cpuUsage: 20.3,
    memoryUsage: 57.8,
    diskUsage: 80.1,
    networkIn: 125.67,
    networkOut: 211.46,
    activeConnections: 3274,
    requestsPerSec: 2461,
    responseTime: 32.8,
    uptime: 212,
    activeAlerts: 0,
    isMonitored: true,
    os: "Windows Server 2022",
    lastPing: "2025-10-13T17:00:02.123Z",
    totalStorage: 2,
    usedStorage: 1.6,
    availableStorage: 0.4,
  },
  {
    id: "AP-NORTHEAST-1-worker-0015",
    serverId: "AP-NORTHEAST-1-worker-0015",
    serverName: "Tokyo Background Worker 16",
    datacenter: "AP-NORTHEAST-1",
    datacenterName: "Tokyo",
    region: "Asia Pacific",
    serverType: "worker",
    serverTypeName: "Background Worker",
    status: "warning",
    cpuUsage: 34.2,
    memoryUsage: 41.1,
    diskUsage: 89.1,
    networkIn: 291,
    networkOut: 61.34,
    activeConnections: 4439,
    requestsPerSec: 3607,
    responseTime: 251,
    uptime: 9,
    activeAlerts: 2,
    isMonitored: true,
    os: "Amazon Linux 2",
    lastPing: "2025-10-13T17:00:18.050Z",
    totalStorage: 1,
    usedStorage: 0.89,
    availableStorage: 0.11,
  },
  {
    id: "AP-NORTHEAST-1-cache-0016",
    serverId: "AP-NORTHEAST-1-cache-0016",
    serverName: "Tokyo Cache Server 17",
    datacenter: "AP-NORTHEAST-1",
    datacenterName: "Tokyo",
    region: "Asia Pacific",
    serverType: "cache",
    serverTypeName: "Cache Server",
    status: "critical",
    cpuUsage: 15.6,
    memoryUsage: 70.9,
    diskUsage: 35,
    networkIn: 407.84,
    networkOut: 169.19,
    activeConnections: 2328,
    requestsPerSec: 2895,
    responseTime: 505.8,
    uptime: 29,
    activeAlerts: 3,
    isMonitored: true,
    os: "Ubuntu 22.04",
    lastPing: "2025-10-13T16:59:58.141Z",
    totalStorage: 2,
    usedStorage: 0.7,
    availableStorage: 1.3,
  },
  {
    id: "SA-EAST-1-database-0017",
    serverId: "SA-EAST-1-database-0017",
    serverName: "São Paulo Database 18",
    datacenter: "SA-EAST-1",
    datacenterName: "São Paulo",
    region: "South America",
    serverType: "database",
    serverTypeName: "Database",
    status: "online",
    cpuUsage: 68.1,
    memoryUsage: 76.3,
    diskUsage: 60,
    networkIn: 404.6,
    networkOut: 84.86,
    activeConnections: 1709,
    requestsPerSec: 5067,
    responseTime: 46.7,
    uptime: 318,
    activeAlerts: 0,
    isMonitored: false,
    os: "Windows Server 2022",
    lastPing: "2025-10-13T16:57:03.327Z",
    totalStorage: 4,
    usedStorage: 2.4,
    availableStorage: 1.6,
  },
  {
    id: "US-EAST-1-api-0018",
    serverId: "US-EAST-1-api-0018",
    serverName: "N. Virginia API Server 19",
    datacenter: "US-EAST-1",
    datacenterName: "N. Virginia",
    region: "US East",
    serverType: "api",
    serverTypeName: "API Server",
    status: "warning",
    cpuUsage: 62.4,
    memoryUsage: 54.5,
    diskUsage: 82.6,
    networkIn: 390.67,
    networkOut: 109.29,
    activeConnections: 2134,
    requestsPerSec: 587,
    responseTime: 250.6,
    uptime: 118,
    activeAlerts: 0,
    isMonitored: true,
    os: "CentOS 8",
    lastPing: "2025-10-13T16:56:45.640Z",
    totalStorage: 8,
    usedStorage: 6.61,
    availableStorage: 1.39,
  },
  {
    id: "SA-EAST-1-storage-0019",
    serverId: "SA-EAST-1-storage-0019",
    serverName: "São Paulo Storage Server 20",
    datacenter: "SA-EAST-1",
    datacenterName: "São Paulo",
    region: "South America",
    serverType: "storage",
    serverTypeName: "Storage Server",
    status: "online",
    cpuUsage: 21.3,
    memoryUsage: 31.9,
    diskUsage: 61.2,
    networkIn: 439.05,
    networkOut: 4.03,
    activeConnections: 3627,
    requestsPerSec: 4114,
    responseTime: 98.8,
    uptime: 321,
    activeAlerts: 0,
    isMonitored: true,
    os: "Debian 11",
    lastPing: "2025-10-13T17:00:03.873Z",
    totalStorage: 2,
    usedStorage: 1.22,
    availableStorage: 0.78,
  },
  {
    id: "SA-EAST-1-loadbalancer-0020",
    serverId: "SA-EAST-1-loadbalancer-0020",
    serverName: "São Paulo Load Balancer 21",
    datacenter: "SA-EAST-1",
    datacenterName: "São Paulo",
    region: "South America",
    serverType: "loadbalancer",
    serverTypeName: "Load Balancer",
    status: "warning",
    cpuUsage: 37.1,
    memoryUsage: 23.9,
    diskUsage: 87.9,
    networkIn: 458.31,
    networkOut: 31.68,
    activeConnections: 2902,
    requestsPerSec: 7427,
    responseTime: 230,
    uptime: 76,
    activeAlerts: 2,
    isMonitored: true,
    os: "Ubuntu 22.04",
    lastPing: "2025-10-13T17:01:32.708Z",
    totalStorage: 4,
    usedStorage: 3.52,
    availableStorage: 0.48,
  },
  {
    id: "EU-WEST-1-loadbalancer-0021",
    serverId: "EU-WEST-1-loadbalancer-0021",
    serverName: "Ireland Load Balancer 22",
    datacenter: "EU-WEST-1",
    datacenterName: "Ireland",
    region: "Europe",
    serverType: "loadbalancer",
    serverTypeName: "Load Balancer",
    status: "critical",
    cpuUsage: 14.8,
    memoryUsage: 29.3,
    diskUsage: 63.8,
    networkIn: 225.19,
    networkOut: 16.88,
    activeConnections: 3292,
    requestsPerSec: 7568,
    responseTime: 426.4,
    uptime: 318,
    activeAlerts: 4,
    isMonitored: true,
    os: "Debian 11",
    lastPing: "2025-10-13T17:00:15.640Z",
    totalStorage: 0.5,
    usedStorage: 0.32,
    availableStorage: 0.18,
  },
  {
    id: "US-EAST-1-web-0022",
    serverId: "US-EAST-1-web-0022",
    serverName: "N. Virginia Web Server 23",
    datacenter: "US-EAST-1",
    datacenterName: "N. Virginia",
    region: "US East",
    serverType: "web",
    serverTypeName: "Web Server",
    status: "critical",
    cpuUsage: 34.4,
    memoryUsage: 64.6,
    diskUsage: 57.5,
    networkIn: 23.44,
    networkOut: 244.55,
    activeConnections: 678,
    requestsPerSec: 2942,
    responseTime: 476.7,
    uptime: 11,
    activeAlerts: 2,
    isMonitored: false,
    os: "CentOS 8",
    lastPing: "2025-10-13T16:59:29.815Z",
    totalStorage: 1,
    usedStorage: 0.57,
    availableStorage: 0.43,
  },
];

// Configuration for server metrics updates
const UPDATE_CONFIG = {
  // Random interval range in milliseconds
  minInterval: 500, // Minimum time between updates
  maxInterval: 1500, // Maximum time between updates

  // What percentage of servers to update each time
  minServersPercent: 0.5, // 50%
  maxServersPercent: 0.7, // 70%
};

export default function InfrastructureExampleComponent({
  height,
  theme,
  rowCount = 50,
}: {
  height?: string | number;
  theme?: Theme;
  rowCount?: number;
}) {
  const tableRef = useRef<TableRefType | null>(null);
  const [data, setData] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch infrastructure data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
        const isProduction =
          typeof window !== "undefined" && window.location.hostname.includes("simple-table.com");

        // Use backup data if not on localhost or production
        if (!isLocal && !isProduction) {
          setData(BACKUP_INFRASTRUCTURE_DATA);
          setIsLoading(false);
          return;
        }

        // Use relative path for local development, full URL for production
        const baseUrl = isLocal ? "" : "https://www.simple-table.com";
        const response = await fetch(`${baseUrl}/api/data/infrastructure?rowCount=${rowCount}`);
        if (!response.ok) {
          throw new Error("Failed to fetch infrastructure data");
        }
        const infrastructureData = await response.json();
        setData(infrastructureData);
      } catch (error) {
        console.error("Error fetching infrastructure data:", error);
        // Fallback to backup data on error
        setData(BACKUP_INFRASTRUCTURE_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rowCount]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const scheduleNextUpdate = () => {
      if (!isActive) return;

      // Random interval based on configuration
      const intervalRange = UPDATE_CONFIG.maxInterval - UPDATE_CONFIG.minInterval;
      const nextInterval = Math.random() * intervalRange + UPDATE_CONFIG.minInterval;

      timeoutId = setTimeout(() => {
        if (!isActive || !tableRef.current) return;

        // Get current visible rows for this update cycle
        const visibleRows = tableRef.current.getVisibleRows();

        if (visibleRows.length === 0) {
          scheduleNextUpdate();
          return;
        }

        // Select percentage of visible servers to update based on configuration
        const totalVisibleServers = visibleRows.length;
        const serversPercent =
          UPDATE_CONFIG.minServersPercent +
          Math.random() * (UPDATE_CONFIG.maxServersPercent - UPDATE_CONFIG.minServersPercent);
        const serversToUpdate = Math.floor(totalVisibleServers * serversPercent);

        // Randomly select which visible servers to update
        const indicesToUpdate = [];
        const usedIndices = new Set();

        for (let i = 0; i < serversToUpdate; i++) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * totalVisibleServers);
          } while (usedIndices.has(randomIndex));

          usedIndices.add(randomIndex);
          indicesToUpdate.push(randomIndex);
        }

        // Update selected servers with realistic metric changes
        indicesToUpdate.forEach((visibleIndex) => {
          // Get fresh visible rows for each update to handle scrolling
          const currentVisibleRows = tableRef.current?.getVisibleRows();
          if (!currentVisibleRows || visibleIndex >= currentVisibleRows.length) {
            return;
          }

          const visibleRow = currentVisibleRows[visibleIndex];
          const server = visibleRow.row;

          // Find the actual index in the data array using the server id
          const actualRowIndex = data.findIndex((row) => row.id === server.id);
          if (actualRowIndex === -1) {
            return;
          }

          // Update CPU usage (small fluctuations)
          const currentCpu = server.cpuUsage as number;
          if (typeof currentCpu === "number") {
            const cpuChange = (Math.random() - 0.5) * 8; // -4% to +4%
            const newCpu = Math.min(100, Math.max(0, currentCpu + cpuChange));

            tableRef.current?.updateData({
              accessor: "cpuUsage",
              rowIndex: actualRowIndex,
              newValue: Math.round(newCpu * 10) / 10,
            });
          }

          // Update Memory usage (slower changes)
          if (Math.random() < 0.4) {
            // Only 40% of the time
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

          // Update Network traffic
          if (Math.random() < 0.6) {
            // 60% of the time
            const currentNetIn = server.networkIn as number;
            if (typeof currentNetIn === "number") {
              const netChange = (Math.random() - 0.5) * 100; // Varies more
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

          // Update response time (varies significantly)
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

          // Update active connections
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

          // Update requests per second
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
        });

        // Schedule the next update
        scheduleNextUpdate();
      }, nextInterval);
    };

    // Start the first update
    scheduleNextUpdate();

    // Cleanup function
    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [data, rowCount]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: height ? height : "70dvh",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Loading infrastructure data...
      </div>
    );
  }

  return (
    <SimpleTable
      columnReordering
      columnResizing
      defaultHeaders={HEADERS}
      height={height ? height : "70dvh"}
      rows={data}
      selectableCells
      tableRef={tableRef}
      theme={theme}
    />
  );
}
