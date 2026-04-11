"use client";

import ManufacturingExample from "./ManufacturingExample";
import type { Theme } from "@simple-table/react";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";

const ROW_HEIGHT = 32;

type ManufacturingExampleWrapperProps = {
  theme?: Theme;
};

export default function ManufacturingExampleWrapper({ theme }: ManufacturingExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as Theme) || theme;
  const tableIcons = getTableIcons(currentIconLibrary);

  const containerHeight = useExampleHeight({
    isUsingPagination: false,
    rowHeight: ROW_HEIGHT,
  });

  return (
    <LivePreview
      demoId="manufacturing"
      height={`${containerHeight}px`}
      selectedTheme={selectedTheme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <ExamplesWrapper>
          <ManufacturingExample
            key={currentIconLibrary}
            height={containerHeight}
            icons={tableIcons}
            theme={selectedTheme}
          />
        </ExamplesWrapper>
      )}
    />
  );
}
