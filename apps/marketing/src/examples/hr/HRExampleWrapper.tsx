"use client";

import HRExample from "./HRExample";
import type { Theme } from "@simple-table/react";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";

const ROW_HEIGHT = 48;

type HRExampleWrapperProps = {
  theme?: Theme;
};

export default function HRExampleWrapper({ theme }: HRExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as Theme) || theme;
  const tableIcons = getTableIcons(currentIconLibrary);

  const containerHeight = useExampleHeight({
    isUsingPagination: true,
    rowHeight: ROW_HEIGHT,
  });

  return (
    <LivePreview
      demoId="hr"
      selectedTheme={selectedTheme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <ExamplesWrapper>
          <HRExample
            key={currentIconLibrary}
            height={containerHeight}
            icons={tableIcons}
            rowHeight={ROW_HEIGHT}
            theme={selectedTheme}
          />
        </ExamplesWrapper>
      )}
    />
  );
}
