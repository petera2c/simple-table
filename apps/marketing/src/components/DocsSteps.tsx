"use client";

import type { ReactNode } from "react";
import CodeBlock from "@/components/CodeBlock";
import type { CodeByFramework } from "@/constants/docsSnippets";

export type DocsStep = {
  title: string;
  body?: ReactNode;
  code?: string;
  codeByFramework?: CodeByFramework;
  language?: string;
};

type DocsStepsProps = {
  steps: DocsStep[];
  className?: string;
};

export default function DocsSteps({ steps, className }: DocsStepsProps) {
  return (
    <ol className={`space-y-8 mb-10 list-none p-0 ${className ?? ""}`}>
      {steps.map((step, index) => (
        <li key={`${index}-${step.title}`}>
          <div className="flex items-baseline gap-3 mb-2">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-sm font-semibold text-blue-700 dark:text-blue-300"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white m-0">
              {step.title}
            </h3>
          </div>
          {step.body ? (
            <div className="ml-10 mb-3 text-sm text-gray-700 dark:text-gray-300">{step.body}</div>
          ) : null}
          {step.codeByFramework || step.code ? (
            <div className="ml-10">
              <CodeBlock
                code={step.code}
                codeByFramework={step.codeByFramework}
                language={step.language}
                showLineNumbers={false}
              />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
