"use client";

import { useState, useEffect } from "react";
import { useFramework } from "@/providers/FrameworkProvider";

export const useDemoCode = (demoId?: string) => {
  const [demoCode, setDemoCode] = useState("");
  const { framework } = useFramework();

  useEffect(() => {
    if (!demoId) return;
    const fetchDemoCode = async () => {
      const response = await fetch(`/txt-demos/${framework}/${demoId}.txt`);
      const text = await response.text();
      setDemoCode(text);
    };

    fetchDemoCode();
  }, [demoId, framework]);

  return demoCode;
};
