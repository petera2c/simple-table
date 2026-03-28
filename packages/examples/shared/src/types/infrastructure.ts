export interface InfrastructureServer {
  id: number;
  serverId: string;
  serverName: string;
  cpuUsage: number;
  cpuHistory: number[];
  memoryUsage: number;
  diskUsage: number;
  responseTime: number;
  networkIn: number;
  networkOut: number;
  activeConnections: number;
  requestsPerSec: number;
  status: "online" | "warning" | "critical" | "maintenance" | "offline";
}
