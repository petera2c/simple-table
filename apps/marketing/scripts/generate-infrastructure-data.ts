import type { Row } from "@simple-table/react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Datacenter locations
const DATACENTERS = [
  { name: "N. Virginia" },
  { name: "Ohio" },
  { name: "N. California" },
  { name: "Oregon" },
  { name: "Ireland" },
  { name: "Frankfurt" },
  { name: "Singapore" },
  { name: "Tokyo" },
  { name: "Mumbai" },
  { name: "São Paulo" },
];

// Server types
const SERVER_TYPES = [
  { name: "Web Server", baseCpu: 35, baseMemory: 60 },
  { name: "API Server", baseCpu: 50, baseMemory: 55 },
  { name: "Database", baseCpu: 60, baseMemory: 80 },
  { name: "Cache Server", baseCpu: 30, baseMemory: 70 },
  { name: "Background Worker", baseCpu: 45, baseMemory: 50 },
  { name: "Load Balancer", baseCpu: 25, baseMemory: 35 },
  { name: "Storage Server", baseCpu: 40, baseMemory: 45 },
  { name: "ML Compute", baseCpu: 80, baseMemory: 75 },
];

// Generate realistic infrastructure monitoring data
const generateInfrastructureData = (): Row[] => {
  const rows: Row[] = [];
  const totalRows = 1000;

  for (let i = 0; i < totalRows; i++) {
    // Random datacenter
    const datacenter = DATACENTERS[Math.floor(Math.random() * DATACENTERS.length)];

    // Random server type
    const serverType = SERVER_TYPES[Math.floor(Math.random() * SERVER_TYPES.length)];

    // Generate server ID
    const serverId = `SERVER-${(i % 10000).toString().padStart(4, "0")}`;

    // CPU usage - based on server type with variation
    const cpuUsage = Math.min(
      100,
      Math.max(0, Math.round((serverType.baseCpu + (Math.random() - 0.5) * 40) * 10) / 10),
    );

    // Memory usage - based on server type with variation
    const memoryUsage = Math.min(
      100,
      Math.max(0, Math.round((serverType.baseMemory + (Math.random() - 0.5) * 30) * 10) / 10),
    );

    // Disk usage - random but realistic
    const diskUsage = Math.round((20 + Math.random() * 70) * 10) / 10;

    // Response time (ms)
    const responseTime = Math.round((10 + Math.random() * 500) * 10) / 10;

    // Determine status based on metrics
    let status;
    if (cpuUsage > 90 || memoryUsage > 95 || responseTime > 400) {
      status = "critical";
    } else if (cpuUsage > 80 || memoryUsage > 85 || responseTime > 200) {
      status = "warning";
    } else if (Math.random() < 0.02) {
      status = Math.random() < 0.5 ? "maintenance" : "offline";
    } else {
      status = "online";
    }

    // Active alerts count
    const activeAlerts =
      status === "critical"
        ? Math.floor(Math.random() * 5) + 1
        : status === "warning"
          ? Math.floor(Math.random() * 3)
          : 0;

    // Last ping timestamp - recent
    const lastPing = new Date(Date.now() - Math.random() * 300000); // Within last 5 minutes

    // Available storage (TB)
    const totalStorage = [0.5, 1, 2, 4, 8, 16][Math.floor(Math.random() * 6)];
    const usedStorage = Math.round(((totalStorage * diskUsage) / 100) * 100) / 100;
    const availableStorage = Math.round((totalStorage - usedStorage) * 100) / 100;

    // Generate CPU history for the last 30 data points (for chart visualization)
    const cpuHistory: number[] = [];
    let historicalCpu = cpuUsage;
    for (let j = 0; j < 30; j++) {
      // Generate realistic fluctuations around the current CPU value
      const change = (Math.random() - 0.5) * 15;
      historicalCpu = Math.min(100, Math.max(0, historicalCpu + change));
      cpuHistory.push(Math.round(historicalCpu * 10) / 10);
    }
    // Reverse so most recent is at the end
    cpuHistory.reverse();

    rows.push({
      id: serverId,
      serverId,
      serverName: `${datacenter.name} ${serverType.name} ${(i % 100) + 1}`,
      status,
      cpuUsage,
      memoryUsage,
      diskUsage,
      responseTime,
      activeAlerts,
      lastPing: lastPing.toISOString(),
      totalStorage,
      usedStorage,
      availableStorage,
      cpuHistory,
    });
  }

  return rows;
};

// Run the generation and save to a file
function saveDataToFile() {
  console.log("Generating infrastructure monitoring dataset...");
  const data = generateInfrastructureData();
  console.log(`Generated ${data.length} server records`);

  const filePath = path.join(__dirname, "../public/data/infrastructure-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

// Execute the function
saveDataToFile();
