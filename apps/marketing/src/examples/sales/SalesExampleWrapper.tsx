"use client";

import { useState } from "react";
import { Button } from "antd";
import SalesExample from "./SalesExample";
import type { Theme } from "@simple-table/react";
import { useExampleHeight } from "@/hooks/useExampleHeight";
import LivePreview from "@/components/LivePreview";
import ExamplesWrapper from "../ExamplesWrapper";
import { getTableIcons } from "@/utils/getTableIcons";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import ExampleControls from "@/components/ExampleControls";
import type { SalesLocale } from "./sales-headers";

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
  const [locale, setLocale] = useState<SalesLocale>("en");

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
        <>
          <ExampleControls codeButton={codeButton} sandboxButton={sandboxButton} />
          <div className="mb-2">
            <Button
              type="default"
              onClick={() => setLocale((current) => (current === "en" ? "ko" : "en"))}
            >
              {locale === "en" ? "한국어" : "English"}
            </Button>
          </div>
        </>
      )}
      Preview={() => (
        <ExamplesWrapper>
          <SalesExample
            key={currentIconLibrary}
            height={containerHeight}
            icons={tableIcons}
            locale={locale}
            onTableReady={onTableReady}
            theme={selectedTheme}
          />
        </ExamplesWrapper>
      )}
    />
  );
}
