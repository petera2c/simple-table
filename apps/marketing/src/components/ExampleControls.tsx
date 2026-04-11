"use client";

import { Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faIndustry,
  faUsers,
  faFileInvoiceDollar,
  faServer,
  faMusic,
  faUserTie,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import ThemeSelector from "@/components/ThemeSelector";
import type { Theme } from "@simple-table/react";
import IconLibrarySelector from "@/components/IconLibrarySelector";
import { useExamplesContext } from "@/providers/ExamplesProvider";
import { ReactNode } from "react";

const examples = [
  {
    id: "crm",
    label: "CRM",
    path: "/examples/crm",
    icon: faUserTie,
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    path: "/examples/infrastructure",
    icon: faServer,
  },
  {
    id: "music",
    label: "Music",
    path: "/examples/music",
    icon: faMusic,
  },
  {
    id: "billing",
    label: "Billing",
    path: "/examples/billing",
    icon: faFileInvoiceDollar,
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    path: "/examples/manufacturing",
    icon: faIndustry,
  },
  {
    id: "hr",
    label: "HR",
    path: "/examples/hr",
    icon: faUsers,
  },
  {
    id: "sales",
    label: "Sales",
    path: "/examples/sales",
    icon: faChartLine,
  },
  {
    id: "spreadsheet",
    label: "Spreadsheet",
    path: "/examples/spreadsheet",
    icon: faTable,
  },
];

interface ExampleControlsProps {
  codeButton?: ReactNode;
  sandboxButton?: ReactNode;
}

export default function ExampleControls({ codeButton, sandboxButton }: ExampleControlsProps) {
  const {
    currentTheme,
    currentIconLibrary,
    currentExampleId,
    handleThemeChange,
    handleIconLibraryChange,
    handleExampleChange,
  } = useExamplesContext();

  const currentExample = examples.find((e) => e.id === currentExampleId) || examples[0];

  return (
    <div className="mb-4 flex items-end gap-3 flex-wrap justify-between">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-300">Example</span>
          <Select
            placeholder="Select an example"
            style={{ width: 200 }}
            onChange={(value) => {
              const example = examples.find((e) => e.id === value);
              if (example) {
                handleExampleChange(example.path);
              }
            }}
            value={currentExample.id}
            options={examples.map((example) => ({
              value: example.id,
              label: (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={example.icon} />
                  {example.label}
                </div>
              ),
            }))}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
          <ThemeSelector
            currentTheme={currentTheme}
            setCurrentTheme={handleThemeChange}
            restrictedThemes={
              currentExample.id === "crm" ? (["custom-dark", "custom-light"] as any[]) : undefined
            }
            themeLabels={
              currentExample.id === "crm"
                ? {
                    "custom-light": "Custom Light",
                    "custom-dark": "Custom Dark",
                  }
                : undefined
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-300">Icons</span>
          <IconLibrarySelector
            currentIconLibrary={currentIconLibrary}
            onChange={handleIconLibraryChange}
          />
        </div>
      </div>

      <div className="flex gap-3">
        {codeButton && (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300"></span>
            {codeButton}
          </div>
        )}
        {sandboxButton && (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300"></span>
            {sandboxButton}
          </div>
        )}
      </div>
    </div>
  );
}
