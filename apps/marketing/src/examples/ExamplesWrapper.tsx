"use client";
import React from "react";
import { useThemeContext } from "@/providers/ThemeProvider";
import { useSearchParams } from "next/navigation";
import type { Theme } from "@simple-table/react";

const DEFAULT_EXAMPLE_ROW_COUNT = 1000;

const ExamplesWrapper = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const { theme: websiteMode } = useThemeContext();
  const theme = (searchParams?.get("theme") as Theme) || websiteMode;
  const rowCount = DEFAULT_EXAMPLE_ROW_COUNT;

  return (
    <>
      {React.isValidElement(children)
        ? React.cloneElement(children, { theme, rowCount } as any)
        : children}
    </>
  );
};

export default ExamplesWrapper;
