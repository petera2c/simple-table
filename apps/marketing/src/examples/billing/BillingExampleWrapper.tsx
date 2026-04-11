"use client";

import BillingExample from "./BillingExample";
import type { Theme } from "@simple-table/react";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";

const ROW_HEIGHT = 40;

type BillingExampleWrapperProps = {
  onGridReady?: () => void;
  theme?: Theme;
};

export default function BillingExampleWrapper({ onGridReady, theme }: BillingExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as Theme) || theme;
  const tableIcons = getTableIcons(currentIconLibrary);

  const containerHeight = useExampleHeight({
    isUsingPagination: false,
    rowHeight: ROW_HEIGHT,
  });

  return (
    <LivePreview
      demoId="billing"
      height={`${containerHeight}px`}
      selectedTheme={selectedTheme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <ExamplesWrapper>
          <BillingExample
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
