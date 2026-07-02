import { faBox, faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip } from "antd";
import { ReactNode, useState } from "react";
import CodeBlock from "./CodeBlock";
import { useThemeContext } from "@/providers/ThemeProvider";
import { useFramework, FRAMEWORK_LABELS } from "@/providers/FrameworkProvider";
import PageWrapper from "./PageWrapper";
import { mapWebsiteThemeToTableTheme } from "@/utils/themeMapper";
import type { Theme } from "@simple-table/react";
import { getStackBlitzUrl } from "@/utils/getStackBlitzUrl";

interface LivePreviewProps {
  Preview: ({ height, theme }: { height?: string | number; theme?: Theme }) => JSX.Element;
  demoId: string;
  demoHeight?: string | number;
  height?: string | number;
  selectedTheme?: Theme;
  titleRenderer?: (buttons: { codeButton: ReactNode; sandboxButton: ReactNode }) => ReactNode;
}

/**
 * Stable host that renders the `Preview` prop. Defined at module scope so its component identity
 * never changes between LivePreview re-renders. This keeps the previewed demo mounted (no flicker)
 * even when the parent passes a fresh inline `Preview` function each render, while still giving the
 * demo its own Hook scope so toggling code/preview never changes LivePreview's own Hook count.
 */
const PreviewHost = ({
  render,
  height,
  theme,
}: {
  render: LivePreviewProps["Preview"];
  height?: string | number;
  theme?: Theme;
}) => render({ height, theme });

const LivePreview = ({
  demoId,
  height = "auto",
  Preview,
  demoHeight,
  selectedTheme,
  titleRenderer,
}: LivePreviewProps) => {
  const { framework } = useFramework();
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const { theme: contextTheme } = useThemeContext();

  const currentTheme = selectedTheme || mapWebsiteThemeToTableTheme(contextTheme);
  const stackBlitzUrl = getStackBlitzUrl(demoId, framework);

  const codeButton = (
    <Tooltip title={isCodeVisible ? "Show preview" : "Show code"}>
      <Button
        className="min-w-[120px]"
        icon={<FontAwesomeIcon icon={faCode} />}
        onClick={() => setIsCodeVisible(!isCodeVisible)}
      >
        {isCodeVisible ? "Preview" : "Code"}
      </Button>
    </Tooltip>
  );

  const sandboxButton = (
    <Tooltip title="Open in StackBlitz">
      <Button href={stackBlitzUrl} icon={<FontAwesomeIcon icon={faBox} />} target="_blank">
        StackBlitz
      </Button>
    </Tooltip>
  );

  return (
    <PageWrapper>
      <div className="flex flex-col gap-2 w-full grow">
        {titleRenderer && titleRenderer({ codeButton, sandboxButton })}

        {/* Both views stay mounted: the code block is server-rendered for SEO/LLM crawlers
            and the demo keeps its state when toggling. */}
        <div style={{ height }}>
          <div className={`h-full ${isCodeVisible ? "hidden" : ""}`}>
            <PreviewHost render={Preview} height={demoHeight || height} theme={currentTheme} />
          </div>
          <div className={`h-full ${isCodeVisible ? "" : "hidden"}`}>
            <CodeBlock className="h-full" demoId={demoId} />
          </div>
        </div>

        {!titleRenderer && (
          <div className="flex justify-end gap-2 w-full shrink-0">
            {codeButton}
            {sandboxButton}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default LivePreview;
