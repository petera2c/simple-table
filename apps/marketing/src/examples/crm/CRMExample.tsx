import { getCRMHeaders } from "./crm-headers";
import { useState, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { CellChangeProps, FooterRendererProps, ReactIconsConfig } from "@simple-table/react";

import "@simple-table/react/styles.css";
import "./CustomTheme.css";
import CRMCustomFooter from "./CRMFooter";
import { useCRMData } from "./useCRMData";

const CRMExampleComponent = ({
  height,
  icons,
  onGridReady,
  theme = "custom-light",
}: {
  height?: number | null;
  icons?: ReactIconsConfig;
  onGridReady?: () => void;
  theme?: "custom-light" | "custom-dark";
}) => {
  const { data: fetchedData, isLoading } = useCRMData();
  const [data, setData] = useState(fetchedData);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const isDark = theme === "custom-dark";

  // Update local data when fetched data changes
  useEffect(() => {
    setData(fetchedData);
  }, [fetchedData]);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === row.id) {
          return {
            ...item,
            [accessor]: newValue,
          };
        }
        return item;
      }),
    );
  };

  if (isLoading) return <></>;

  return (
    <div className={`custom-theme-container theme-${theme}`}>
      <SimpleTable
        columnReordering
        columnResizing
        defaultHeaders={getCRMHeaders(isDark)}
        enableRowSelection
        footerRenderer={(props: FooterRendererProps) => (
          <CRMCustomFooter {...props} isDark={isDark} setRowsPerPage={setRowsPerPage} />
        )}
        customTheme={{
          headerHeight: 48,
          rowHeight: 92,
        }}
        getRowId={({ row }) => String(row.id)}
        height={height ? `${height}px` : "70dvh"}
        icons={icons}
        onCellEdit={handleCellEdit}
        onGridReady={onGridReady}
        rows={data}
        rowsPerPage={rowsPerPage}
        shouldPaginate
        theme="custom"
      />
    </div>
  );
};

export default CRMExampleComponent;
