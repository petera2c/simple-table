"use client";

import { useFramework, FRAMEWORKS, FRAMEWORK_LABELS } from "@/providers/FrameworkProvider";
import { Select } from "antd";
import FrameworkIcon from "./FrameworkIcon";
import type { Framework } from "@/providers/FrameworkProvider";

const FrameworkSelector = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { framework, setFramework } = useFramework();

  if (isMobile) {
    return (
      <div className="flex flex-wrap gap-1.5 px-3 py-2">
        {FRAMEWORKS.map((fw) => (
          <button
            key={fw}
            onClick={() => setFramework(fw)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-sm transition-colors ${
              framework === fw
                ? "bg-accent text-white font-medium border border-accent"
                : "bg-surface text-muted border border-line hover:text-ink"
            }`}
          >
            <FrameworkIcon framework={fw} size={14} />
            {FRAMEWORK_LABELS[fw]}
          </button>
        ))}
      </div>
    );
  }

  const options = FRAMEWORKS.map((fw) => ({
    value: fw,
    label: (
      <span className="flex items-center gap-2">
        <FrameworkIcon framework={fw} size={14} />
        {FRAMEWORK_LABELS[fw]}
      </span>
    ),
  }));

  return (
    <Select
      value={framework}
      onChange={(value: Framework) => setFramework(value)}
      options={options}
      variant="borderless"
      popupMatchSelectWidth={false}
      className="framework-selector"
    />
  );
};

export default FrameworkSelector;
