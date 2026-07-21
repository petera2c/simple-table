"use client";

import AnalyticsExample from "./AnalyticsExample";
import type { Theme } from "@simple-table/react";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";

const ROW_HEIGHT = 32;

type AnalyticsExampleWrapperProps = {
  onGridReady?: () => void;
  shouldPaginate?: boolean;
  theme?: Theme;
};

export default function AnalyticsExampleWrapper({
  onGridReady,
  shouldPaginate = false,
  theme,
}: AnalyticsExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as Theme) || theme;
  const tableIcons = getTableIcons(currentIconLibrary);

  const containerHeight = useExampleHeight({
    isUsingPagination: shouldPaginate,
    rowHeight: ROW_HEIGHT,
  });

  return (
    <LivePreview
      demoId="analytics"
      height={`${containerHeight}px`}
      selectedTheme={selectedTheme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <ExamplesWrapper>
          <AnalyticsExample
            key={currentIconLibrary}
            height={containerHeight}
            icons={tableIcons}
            onGridReady={onGridReady}
            theme={selectedTheme}
          />
        </ExamplesWrapper>
      )}
    />
  );
}
