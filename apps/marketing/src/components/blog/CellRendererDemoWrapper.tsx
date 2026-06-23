"use client";

import CellRendererDemo from "@/components/demos/CellRendererDemo";
import { useThemeContext } from "@/providers/ThemeProvider";

const CellRendererDemoWrapper = ({ height = "400px" }: { height?: string | number }) => {
  const { theme } = useThemeContext();

  return <CellRendererDemo height={height} theme={theme} />;
};

export default CellRendererDemoWrapper;
