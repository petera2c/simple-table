"use client";

import { App, ConfigProvider, theme } from "antd";
import { useThemeContext } from "../providers/ThemeProvider";
import useScrollRestoration from "../hooks/useScrollRestoration";

interface PageWrapperProps {
  children: React.ReactNode;
  disableScrollRestoration?: boolean;
}

export default function PageWrapper({ children, disableScrollRestoration }: PageWrapperProps) {
  useScrollRestoration(disableScrollRestoration);
  const themeContext = useThemeContext();

  return (
    <ConfigProvider
      theme={{
        algorithm: themeContext.theme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: "nunito",
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
