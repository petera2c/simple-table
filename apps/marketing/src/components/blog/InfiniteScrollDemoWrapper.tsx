"use client";

import InfiniteScrollDemo from "@/components/demos/InfiniteScrollDemo";
import { useThemeContext } from "@/providers/ThemeProvider";

const InfiniteScrollDemoWrapper = ({ height = "400px" }: { height?: string | number }) => {
  const { theme } = useThemeContext();

  return <InfiniteScrollDemo height={height} theme={theme} />;
};

export default InfiniteScrollDemoWrapper;
