"use client";

import Script from "next/script";
import { useThemeContext } from "@/providers/ThemeProvider";

const SORO_EMBED_BASE =
  "https://app.trysoro.com/api/embed/afe2586b-51a3-4f1d-8b51-cec59f1cbb00";

export function SoroBlogEmbed() {
  const { theme } = useThemeContext();
  const src = `${SORO_EMBED_BASE}?theme=${theme}`;

  return (
    <div key={theme}>
      <div id="soro-blog" />
      <Script src={src} strategy="afterInteractive" />
    </div>
  );
}
