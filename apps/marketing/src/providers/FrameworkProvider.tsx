"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export const FRAMEWORKS = ["react", "vue", "angular", "svelte", "solid", "vanilla"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  angular: "Angular",
  svelte: "Svelte",
  solid: "Solid",
  vanilla: "Vanilla",
};

type FrameworkContextType = {
  framework: Framework;
  setFramework: (fw: Framework) => void;
};

const FrameworkContext = createContext<FrameworkContextType | undefined>(undefined);

const STORAGE_KEY = "simple-table-framework";

export const useFramework = (): FrameworkContextType => {
  const context = useContext(FrameworkContext);
  if (context === undefined) {
    throw new Error("useFramework must be used within a FrameworkProvider");
  }
  return context;
};

export const FrameworkProvider = ({ children }: { children: ReactNode }) => {
  const [framework, setFrameworkState] = useState<Framework>("react");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Framework | null;
    if (saved && FRAMEWORKS.includes(saved)) {
      setFrameworkState(saved);
    }
  }, []);

  const setFramework = useCallback((fw: Framework) => {
    setFrameworkState(fw);
    localStorage.setItem(STORAGE_KEY, fw);
  }, []);

  const value = useMemo(() => ({ framework, setFramework }), [framework, setFramework]);

  return <FrameworkContext.Provider value={value}>{children}</FrameworkContext.Provider>;
};
