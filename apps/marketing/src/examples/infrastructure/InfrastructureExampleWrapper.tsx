"use client";

import InfrastructureExample from "./InfrastructureExample";
import type { Theme } from "@simple-table/react";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";

const ROW_HEIGHT = 32;

type InfrastructureExampleWrapperProps = {
  height?: string | number;
  theme?: Theme;
};

export default function InfrastructureExampleWrapper({
  height,
  theme,
}: InfrastructureExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as Theme) || theme;
  const tableIcons = getTableIcons(currentIconLibrary);

  const containerHeight = useExampleHeight({
    isUsingPagination: false,
    rowHeight: ROW_HEIGHT,
  });

  return (
    <LivePreview
      demoId="infrastructure"
      height={`${containerHeight}px`}
      selectedTheme={selectedTheme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <ExamplesWrapper>
          <InfrastructureExample
            key={currentIconLibrary}
            height={height ? height : `${containerHeight}px`}
            icons={tableIcons}
            theme={selectedTheme}
          />
        </ExamplesWrapper>
      )}
    />
  );
}
