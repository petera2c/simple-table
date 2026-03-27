import { useState } from "react";
import { SimpleTable } from "simple-table-react";
import type { Theme } from "simple-table-react";
import { paginationConfig, paginationData, PAGINATION_ROWS_PER_PAGE } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const PaginationDemo = ({
  height,
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [rows, setRows] = useState(paginationData.slice(0, PAGINATION_ROWS_PER_PAGE));
  const [isLoading, setIsLoading] = useState(false);

  const onNextPage = async (pageIndex: number) => {
    const startIndex = pageIndex * PAGINATION_ROWS_PER_PAGE;
    const endIndex = startIndex + PAGINATION_ROWS_PER_PAGE;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newPageData = paginationData.slice(startIndex, endIndex);

    if (newPageData.length === 0 || rows.length > startIndex) {
      setIsLoading(false);
      return false;
    }

    setRows((prev) => [...prev, ...newPageData]);
    setIsLoading(false);
    return true;
  };

  return (
    <SimpleTable
      defaultHeaders={paginationConfig.headers}
      height={height ?? "auto"}
      isLoading={isLoading}
      onNextPage={onNextPage}
      rows={rows}
      rowsPerPage={PAGINATION_ROWS_PER_PAGE}
      shouldPaginate
      theme={theme}
    />
  );
};

export default PaginationDemo;
