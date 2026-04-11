"use client";

import MusicExample from "./MusicExample";
import type { Theme } from "@simple-table/react";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { Inter } from "next/font/google";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ROW_HEIGHT = 64; // Taller rows for the artist cards

type MusicExampleWrapperProps = {
  height?: string | number;
  theme?: Theme;
};

export default function MusicExampleWrapper({ height, theme }: MusicExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as Theme) || theme;
  const tableIcons = getTableIcons(currentIconLibrary);

  const containerHeight = useExampleHeight({
    isUsingPagination: false,
    rowHeight: ROW_HEIGHT,
  });

  return (
    <LivePreview
      demoId="music"
      height={`${containerHeight}px`}
      selectedTheme={selectedTheme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <div className={inter.className}>
          <ExamplesWrapper>
            <MusicExample
              key={currentIconLibrary}
              height={height ? height : `${containerHeight}px`}
              icons={tableIcons}
              theme={selectedTheme}
            />
          </ExamplesWrapper>
        </div>
      )}
    />
  );
}
