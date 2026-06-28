import { useEffect, useState } from "react";
import type { Row } from "@simple-table/react";

/**
 * Adds a derived `oee` array [efficiency, utilization, quality] to each row so
 * the OEE bar-chart column has data. Recurses into grouped child `stations`.
 */
function enrichWithOee(rows: Row[]): Row[] {
  return rows.map((row) => {
    const efficiency = Number(row.efficiency) || 0;
    const utilization = Number(row.utilization) || 0;
    const quality = Math.max(0, 100 - (Number(row.defectRate) || 0));
    const stations = Array.isArray(row.stations) ? enrichWithOee(row.stations as Row[]) : row.stations;
    return {
      ...row,
      oee: [Math.round(efficiency), Math.round(utilization), Math.round(quality)],
      ...(stations ? { stations } : {}),
    };
  });
}

export function useManufacturingData() {
  const [data, setData] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://www.simple-table.com/api/data/manufacturing");
        if (response.ok) {
          const data = await response.json();
          setData(enrichWithOee(data));
        }
      } catch {
        const response = await fetch("/data/manufacturing-data.json");
        const data = await response.json();
        setData(enrichWithOee(data));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
}
