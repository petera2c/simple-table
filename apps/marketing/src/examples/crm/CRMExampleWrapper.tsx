"use client";

import CRMExample from "./CRMExample";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";
import type { Theme } from "@simple-table/react";

/* @import url("https://fonts.googleapis.com/css2?family=BBH+Sans+Hegarty&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"); */
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const ROW_HEIGHT = 60;

type CRMExampleWrapperProps = {
  onGridReady?: () => void;
  shouldPaginate?: boolean;
  theme?: Theme;
};

export default function CRMExampleWrapper({
  onGridReady,
  shouldPaginate = true,
  theme,
}: CRMExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as any) || theme || ("custom-light" as any);
  const tableIcons = getTableIcons(currentIconLibrary);

  const containerHeight = useExampleHeight({
    isUsingPagination: shouldPaginate,
    rowHeight: ROW_HEIGHT,
  });

  // Map any theme to custom-light or custom-dark
  const crmTheme: "custom-light" | "custom-dark" =
    selectedTheme === "custom-dark" ? "custom-dark" : "custom-light";

  return (
    <LivePreview
      demoId="crm"
      height={`${containerHeight}px`}
      selectedTheme={crmTheme as Theme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <div className={plusJakartaSans.className}>
          <ExamplesWrapper>
            <CRMExample
              key={currentIconLibrary}
              height={containerHeight}
              icons={tableIcons}
              onGridReady={onGridReady}
              theme={crmTheme}
            />
          </ExamplesWrapper>
        </div>
      )}
    />
  );
}
