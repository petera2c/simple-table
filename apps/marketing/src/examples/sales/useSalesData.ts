import { useEffect, useState } from "react";
import type { Row } from "@simple-table/react";

export function useSalesData() {
  const [data, setData] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Deterministic 8-point "quota attainment" trend so the sparkline column is
  // stable across renders. Seeded by the rep name (or row id) and shaped toward
  // the deal value.
  const buildTrend = (seedSource: string, target: number): number[] => {
    let hash = 0;
    for (let i = 0; i < seedSource.length; i++) {
      hash = seedSource.charCodeAt(i) + ((hash << 5) - hash);
    }
    const points = 8;
    const base = Math.max(target, 1);
    return Array.from({ length: points }, (_, i) => {
      const progress = (i + 1) / points;
      const wobble = (((hash >> i) & 0xff) / 255 - 0.5) * 0.4;
      return Math.round(base * (0.45 + progress * 0.55) * (1 + wobble));
    });
  };

  const processData = (salesData: any[]) => {
    const processedData = salesData.map((sale) => {
      const dealValue = sale.dealSize / sale.profitMargin;
      const commission = dealValue * 0.1;
      const dealProfit = sale.dealSize - commission;

      return {
        ...sale,
        dealValue: parseFloat(dealValue.toFixed(2)),
        commission: parseFloat(commission.toFixed(2)),
        dealProfit: parseFloat(dealProfit.toFixed(2)),
        trend: buildTrend(String(sale.repName ?? sale.id ?? ""), dealValue),
      };
    });

    return processedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://www.simple-table.com/api/data/sales");
        if (response.ok) {
          const data = await response.json();
          const processedData = processData(data);
          setData(processedData);
        }
      } catch {
        const response = await fetch("/data/sales-data.json");
        const data = await response.json();
        const processedData = processData(data);
        setData(processedData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
}
