"use client";

import CryptoExample from "./CryptoExample";
import type { Theme } from "@simple-table/react";
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

type CryptoExampleWrapperProps = {
  height?: string | number;
  theme?: Theme;
};

export default function CryptoExampleWrapper({ theme }: CryptoExampleWrapperProps) {
  const { currentTheme, currentIconLibrary } = useExamplesContext();
  const selectedTheme = (currentTheme as Theme) || theme;
  const tableIcons = getTableIcons(currentIconLibrary);

  // No fixed height: the table grows to its natural size and the page scroller
  // (`#main-scroll-container`) drives row virtualization (external scroll mode).
  return (
    <LivePreview
      demoId="crypto"
      height="auto"
      selectedTheme={selectedTheme}
      titleRenderer={({ codeButton, sandboxButton }) => (
        <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
      )}
      Preview={() => (
        <div className={inter.className}>
          <ExamplesWrapper>
            <CryptoExample
              key={currentIconLibrary}
              icons={tableIcons}
              theme={selectedTheme}
            />
          </ExamplesWrapper>
        </div>
      )}
    />
  );
}
