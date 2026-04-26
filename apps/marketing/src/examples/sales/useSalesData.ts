import { useEffect, useState } from "react";
import type { Row } from "@simple-table/react";

export function useSalesData() {
  const [data, setData] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
