import { useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject, CellRendererProps } from "@simple-table/react";
import { customThemeConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
};

const PhoneCell = ({ value }: CellRendererProps) => (
  <span style={{ fontFamily: "monospace", letterSpacing: 0.5 }}>
    {formatPhone(String(value))}
  </span>
);

const CustomThemeDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const headers: ReactHeaderObject[] = useMemo(
    () =>
      customThemeConfig.headers.map((h) =>
        h.accessor === "phone" ? { ...h, cellRenderer: PhoneCell } : { ...h },
      ),
    [],
  );

  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={customThemeConfig.rows}
      theme={theme ?? "custom"}
      height={height}
    />
  );
};

export default CustomThemeDemo;
