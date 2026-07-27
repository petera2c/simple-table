"use client";

import ColumnSortingDemo from "@/components/demos/ColumnSortingDemo";
import { useThemeContext } from "@/providers/ThemeProvider";

const ColumnSortingDemoWrapper = ({ height = "360px" }: { height?: string | number }) => {
  const { theme } = useThemeContext();

  return <ColumnSortingDemo height={height} theme={theme} />;
};

export default ColumnSortingDemoWrapper;
