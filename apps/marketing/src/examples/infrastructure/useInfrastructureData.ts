import { useEffect, useState } from "react";
import type { Row } from "@simple-table/react";

export function useInfrastructureData(rowCount?: number) {
  const [data, setData] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://www.simple-table.com/api/data/infrastructure?rowCount=${rowCount}`
        );
        if (response.ok) {
          const data = await response.json();
          setData(data);
        }
      } catch {
        const response = await fetch("/data/infrastructure-data.json");
        const data = await response.json();
        setData(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rowCount]);

  return { data, isLoading };
}
