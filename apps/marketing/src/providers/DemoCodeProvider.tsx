"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Framework } from "@/constants/frameworks";

/** demoId -> framework -> source code. Loaded server-side so snippets are in the SSR HTML. */
export type DemoCodeMap = Record<string, Partial<Record<Framework, string>>>;

const DemoCodeContext = createContext<DemoCodeMap | null>(null);

/** Returns the preloaded per-framework code for a demo, or null when no provider/data exists. */
export const useDemoCodeMap = (demoId?: string): Partial<Record<Framework, string>> | null => {
  const map = useContext(DemoCodeContext);
  if (!map || !demoId) return null;
  return map[demoId] ?? null;
};

const DemoCodeProvider = ({
  codeMap,
  children,
}: {
  codeMap: DemoCodeMap;
  children: ReactNode;
}) => <DemoCodeContext.Provider value={codeMap}>{children}</DemoCodeContext.Provider>;

export default DemoCodeProvider;
