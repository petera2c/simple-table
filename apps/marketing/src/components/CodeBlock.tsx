"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { Highlight, themes } from "prism-react-renderer";
import { useDemoCode } from "@/hooks/useDemoCode";
import { useFramework } from "@/providers/FrameworkProvider";
import { useDemoCodeMap } from "@/providers/DemoCodeProvider";
import {
  FRAMEWORKS,
  FRAMEWORK_LABELS,
  FRAMEWORK_LANGUAGE,
  FRAMEWORK_LANGUAGE_LABEL,
  type Framework,
} from "@/constants/frameworks";
import FrameworkIcon from "./FrameworkIcon";

type ThemeType = "dark" | "light";

interface CodeBlockProps {
  className?: string;
  code?: string;
  demoId?: string;
  initialTheme?: ThemeType;
  language?: string;
  showLineNumbers?: boolean;
  showThemeToggle?: boolean;
}

// Filename extraction from first comment line (e.g. "// SomeFile.tsx")
const extractFilename = (code: string): string | null => {
  if (!code) return null;

  const firstLine = code.trim().split("\n")[0];
  if (firstLine.startsWith("// ") || firstLine.startsWith("/* ")) {
    const potentialFilename = firstLine.replace(/^\/\/\s*|^\/\*\s*/, "").trim();
    if (potentialFilename.includes(".")) {
      return potentialFilename;
    }
  }
  return null;
};

const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  jsx: "React JSX",
  tsx: "React TSX",
  javascript: "JavaScript",
  typescript: "TypeScript",
  css: "CSS",
  html: "HTML",
  bash: "Shell",
  json: "JSON",
  markup: "HTML",
};

/** Header bar + syntax-highlighted body for one code snippet. */
const CodePane = ({
  code,
  language,
  languageLabel,
  showLineNumbers,
  showThemeToggle,
  theme,
  onToggleTheme,
}: {
  code: string;
  language: string;
  languageLabel: string;
  showLineNumbers: boolean;
  showThemeToggle: boolean;
  theme: ThemeType;
  onToggleTheme: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const selectedTheme = theme === "dark" ? themes.nightOwl : themes.nightOwlLight;
  const filename = extractFilename(code);

  return (
    <div className="flex flex-col rounded-md overflow-hidden shadow-lg relative h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-gray-400 text-xs">
        <div className="flex items-center gap-2">
          <span>{languageLabel}</span>
          {filename && (
            <span className="text-gray-500 ml-2 border-l border-gray-700 pl-2">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showThemeToggle && (
            <button
              className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-2 py-1 rounded cursor-pointer transition-colors"
              onClick={onToggleTheme}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="text-xs" />
            </button>
          )}
          <div
            className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-2 py-1 rounded cursor-pointer transition-colors"
            onClick={handleCopy}
            aria-label="Copy code"
            title="Copy to clipboard"
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="text-xs" />
            <span className="sm:inline hidden">{copied ? "Copied!" : "Copy"}</span>
          </div>
        </div>
      </div>

      <Highlight
        theme={selectedTheme}
        code={filename ? code.replace(/^\/\/.*?\n|^\/\*.*?\n/, "") : code.trim()}
        language={language as any}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="p-4 text-sm max-h-[64vh] w-full overflow-auto"
            style={{
              ...style,
              backgroundColor: theme === "dark" ? "#011627" : "#FBFBFB",
            }}
          >
            {tokens.map((line, i) => {
              // Check if this line is a special comment like "// ... existing code ..."
              const isSpecialComment =
                line.length > 1 &&
                line[0].content.match(/\/\/|\/\*|#/) &&
                line.some((token) => token.content.includes("existing code"));

              const lineProps = getLineProps({ line });

              return (
                <div
                  key={i}
                  {...lineProps}
                  className={`table-row ${isSpecialComment ? "opacity-60 italic" : ""}`}
                >
                  {showLineNumbers && (
                    <span className="table-cell text-right pr-4 select-none opacity-50 text-xs w-8">
                      {i + 1}
                    </span>
                  )}
                  <span className="table-cell whitespace-pre word-break">
                    {line.map((token, key) => (
                      <span
                        key={key}
                        {...getTokenProps({ token })}
                        className={token.types.includes("comment") ? "italic opacity-75" : ""}
                      />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

const CodeBlock = ({
  className = "",
  code = "",
  demoId,
  initialTheme = "dark",
  language,
  showLineNumbers = true,
  showThemeToggle = true,
}: CodeBlockProps) => {
  const { framework, setFramework } = useFramework();
  const [theme, setTheme] = useState<ThemeType>(initialTheme);

  // Server-preloaded per-framework code (docs pages). Falls back to client fetch when absent.
  const codeMap = useDemoCodeMap(demoId);
  const fetchedCode = useDemoCode(codeMap ? undefined : demoId);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // All framework variants are rendered into the HTML (SEO/LLM crawlers see every
  // snippet); only the active framework's pane is visible.
  if (codeMap) {
    const available = FRAMEWORKS.filter((fw) => codeMap[fw]);
    if (available.length > 0) {
      const activeFramework: Framework = codeMap[framework]
        ? framework
        : available[0];

      return (
        <div className={`flex flex-col ${className}`}>
          <div
            className="flex flex-wrap gap-1.5 mb-2"
            role="tablist"
            aria-label="Framework code examples"
          >
            {available.map((fw) => (
              <button
                key={fw}
                role="tab"
                aria-selected={fw === activeFramework}
                onClick={() => setFramework(fw)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-sm transition-colors ${
                  fw === activeFramework
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <FrameworkIcon framework={fw} size={14} />
                {FRAMEWORK_LABELS[fw]}
              </button>
            ))}
          </div>
          {available.map((fw) => (
            <div
              key={fw}
              role="tabpanel"
              className={`grow min-h-0 ${fw === activeFramework ? "" : "hidden"}`}
            >
              <CodePane
                code={codeMap[fw] as string}
                language={FRAMEWORK_LANGUAGE[fw]}
                languageLabel={FRAMEWORK_LANGUAGE_LABEL[fw]}
                showLineNumbers={showLineNumbers}
                showThemeToggle={showThemeToggle}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            </div>
          ))}
        </div>
      );
    }
  }

  const resolvedCode = fetchedCode ? fetchedCode.toString() : code.toString();
  const resolvedLanguage = language || (demoId ? FRAMEWORK_LANGUAGE[framework] : "tsx");
  const languageLabel = demoId
    ? FRAMEWORK_LANGUAGE_LABEL[framework]
    : LANGUAGE_DISPLAY_NAMES[resolvedLanguage] || resolvedLanguage.toUpperCase();

  return (
    <div className={className}>
      <CodePane
        code={resolvedCode}
        language={resolvedLanguage}
        languageLabel={languageLabel}
        showLineNumbers={showLineNumbers}
        showThemeToggle={showThemeToggle}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
};

export default CodeBlock;
