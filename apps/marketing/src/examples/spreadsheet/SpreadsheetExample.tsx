import { getSpreadsheetHeaders } from "./spreadsheet-headers";
import { useState, useEffect, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { CellChangeProps, Theme, ReactHeaderObject, ReactIconsConfig } from "@simple-table/react";

import "@simple-table/react/styles.css";
import "./SpreadsheetCustom.css";
import { useSpreadsheetData } from "./useSpreadsheetData";

const SpreadsheetExampleComponent = ({
  height,
  icons,
  onGridReady,
  rowCount = 1000,
  theme = "light",
}: {
  height?: number | null;
  icons?: ReactIconsConfig;
  onGridReady?: () => void;
  rowCount?: number;
  theme?: Theme;
}) => {
  const { data: fetchedData, isLoading } = useSpreadsheetData(rowCount);
  const [data, setData] = useState(fetchedData);
  const [additionalColumns, setAdditionalColumns] = useState<ReactHeaderObject[]>([]);

  // Update local data when fetched data changes
  useEffect(() => {
    setData(fetchedData);
  }, [fetchedData]);

  const headers = useMemo(() => {
    const baseHeaders = getSpreadsheetHeaders(additionalColumns);
    // Add actions column with Add Column button
    return [
      ...baseHeaders,
      {
        accessor: "actions",
        label: "",
        width: 100,
        minWidth: 100,
        filterable: false,
        type: "other" as const,
        disableReorder: true,
        headerRenderer: () => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => {
                const newColumn: ReactHeaderObject = {
                  accessor: `column${baseHeaders.length + additionalColumns.length + 1}`,
                  label: `Column ${baseHeaders.length + additionalColumns.length + 1}`,
                  width: 120,
                  minWidth: 80,
                  type: "number",
                  align: "right",
                  isEditable: true,
                  aggregation: { type: "sum" },
                };
                setAdditionalColumns([...additionalColumns, newColumn]);
              }}
              style={{
                color: "white",
                border: "none",
                padding: "4px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              + Add Column
            </button>
          </div>
        ),
      },
    ];
  }, [additionalColumns]);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === row.id) {
          const updatedItem = {
            ...item,
            [accessor]: newValue,
          };

          // Recalculate loan values when principal, interestRate, or monthlyPayment changes
          if (["principal", "interestRate", "monthlyPayment"].includes(accessor)) {
            const principal =
              accessor === "principal"
                ? parseFloat(newValue as string) || 0
                : typeof item.principal === "number"
                  ? item.principal
                  : 0;
            const interestRate =
              accessor === "interestRate"
                ? parseFloat(newValue as string) || 0
                : typeof item.interestRate === "number"
                  ? item.interestRate
                  : 0;
            const monthlyPayment =
              accessor === "monthlyPayment"
                ? parseFloat(newValue as string) || 0
                : typeof item.monthlyPayment === "number"
                  ? item.monthlyPayment
                  : 0;

            // Calculate remaining values using amortization
            const monthlyRate = interestRate / 100 / 12;
            const numMonths = 360; // 30 years standard

            // If monthly payment changed, recalculate based on payment
            // Otherwise, recalculate payment based on principal and rate
            let calculatedPayment = monthlyPayment;
            if (accessor === "principal" || accessor === "interestRate") {
              if (monthlyRate > 0 && principal > 0) {
                calculatedPayment =
                  (principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) /
                  (Math.pow(1 + monthlyRate, numMonths) - 1);
                updatedItem.monthlyPayment = parseFloat(calculatedPayment.toFixed(2));
              }
            }

            // Estimate payments made based on current remaining balance
            // This is a simplified calculation
            const totalPaidValue = typeof item.totalPaid === "number" ? item.totalPaid : 0;
            const estimatedPaymentsMade = Math.max(
              0,
              Math.min(120, Math.floor(totalPaidValue / calculatedPayment)),
            );

            // Calculate remaining balance
            let remainingBalance = principal;
            if (monthlyRate > 0 && calculatedPayment > 0) {
              remainingBalance =
                principal *
                ((Math.pow(1 + monthlyRate, numMonths) -
                  Math.pow(1 + monthlyRate, estimatedPaymentsMade)) /
                  (Math.pow(1 + monthlyRate, numMonths) - 1));
            }

            // Calculate total paid and interest paid
            const totalPaid = calculatedPayment * estimatedPaymentsMade;
            const principalReduction = principal - Math.max(0, remainingBalance);
            const interestPaid = totalPaid - principalReduction;

            updatedItem.remainingBalance = parseFloat(Math.max(0, remainingBalance).toFixed(2));
            updatedItem.totalPaid = parseFloat(totalPaid.toFixed(2));
            updatedItem.interestPaid = parseFloat(Math.max(0, interestPaid).toFixed(2));
          }

          return updatedItem;
        }
        return item;
      }),
    );
  };

  if (isLoading) return <></>;

  return (
    <div className="spreadsheet-container">
      <SimpleTable
        columnBorders
        columnReordering
        columnResizing
        defaultHeaders={headers}
        enableHeaderEditing
        enableRowSelection
        height={height ? `${height}px` : "70dvh"}
        icons={icons}
        onCellEdit={handleCellEdit}
        onGridReady={onGridReady}
        customTheme={{
          rowHeight: 22,
        }}
        rows={data}
        selectableCells
        selectableColumns
        theme={theme}
        useOddEvenRowBackground
      />
    </div>
  );
};

export default SpreadsheetExampleComponent;
