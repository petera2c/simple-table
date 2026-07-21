"use client";

import SalesExample from "./SalesExample";
import type { Theme } from "@simple-table/react";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";

const ROW_HEIGHT = 32;

type SalesExampleWrapperProps = {
  onTableReady?: () => void;
  enablePagination?: boolean;
  theme?: Theme;
};

export default function SalesExampleWrapper({
  onTableReady,
  enablePagination = true,
  theme,
}: SalesExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as Theme) || theme;
  const tableIcons = getTableIcons(currentIconLibrary);

  const containerHeight = useExampleHeight({
    isUsingPagination: enablePagination,
    rowHeight: ROW_HEIGHT,
  });

  return (
    <LivePreview
      demoId="sales"
      height={`${containerHeight}px`}
      selectedTheme={selectedTheme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <ExamplesWrapper>
          <SalesExample
            key={currentIconLibrary}
            height={containerHeight}
            icons={tableIcons}
            onTableReady={onTableReady}
            theme={selectedTheme}
          />
        </ExamplesWrapper>
      )}
    />
  );
}
