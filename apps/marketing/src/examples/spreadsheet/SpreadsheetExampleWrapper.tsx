"use client";

import SpreadsheetExample from "./SpreadsheetExample";
import type { Theme } from "@simple-table/react";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";

const ROW_HEIGHT = 24;

type SpreadsheetExampleWrapperProps = {
  onGridReady?: () => void;
  theme?: Theme;
  rowCount?: number;
};

export default function SpreadsheetExampleWrapper({
  onGridReady,
  theme,
  rowCount,
}: SpreadsheetExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as Theme) || theme;
  const tableIcons = getTableIcons(currentIconLibrary);

  const containerHeight = useExampleHeight({
    isUsingPagination: false,
    rowHeight: ROW_HEIGHT,
  });

  return (
    <LivePreview
      demoId="spreadsheet"
      height={`${containerHeight}px`}
      selectedTheme={selectedTheme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <ExamplesWrapper>
          <SpreadsheetExample
            key={currentIconLibrary}
            height={containerHeight}
            icons={tableIcons}
            onGridReady={onGridReady}
            rowCount={rowCount}
            theme={selectedTheme}
          />
        </ExamplesWrapper>
      )}
    />
  );
}
