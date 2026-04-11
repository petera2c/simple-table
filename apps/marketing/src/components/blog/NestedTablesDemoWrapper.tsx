"use client";

import NestedTablesDemo from "@/components/demos/NestedTablesDemo";
import { useThemeContext } from "@/providers/ThemeProvider";

const NestedTablesDemoWrapper = ({ height = "500px" }: { height?: string | number }) => {
  const { theme } = useThemeContext();

  return <NestedTablesDemo height={height} theme={theme} />;
};

export default NestedTablesDemoWrapper;
