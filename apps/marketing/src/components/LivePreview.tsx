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
      <div className="flex flex-col gap-2 w-full flex-grow">
        {titleRenderer && titleRenderer({ codeButton, sandboxButton })}

        <div style={{ height }}>
          {isCodeVisible ? (
            <CodeBlock className="h-full" demoId={demoId} />
          ) : (
            <Preview height={demoHeight || height} theme={currentTheme} />
          )}
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
