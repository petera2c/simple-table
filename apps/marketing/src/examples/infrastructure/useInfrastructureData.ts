import { useEffect, useState } from "react";
import type { Row } from "@simple-table/react";

/** Server metrics row shape used by the infrastructure marketing demo. */
export interface InfrastructureServer extends Row {
  id: string | number;
  serverId?: string;
  serverName?: string;
  cpuUsage?: number;
  cpuHistory?: number[];
  memoryUsage?: number;
  networkIn?: number;
  networkOut?: number;
  responseTime?: number;
  activeConnections?: number;
  requestsPerSec?: number;
  status?: string;
}

export function useInfrastructureData() {
  const [data, setData] = useState<InfrastructureServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://www.simple-table.com/api/data/infrastructure");
        if (response.ok) {
          const payload = (await response.json()) as InfrastructureServer[];
          setData(payload);
        }
      } catch {
        const response = await fetch("/data/infrastructure-data.json");
        const payload = (await response.json()) as InfrastructureServer[];
        setData(payload);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
}
