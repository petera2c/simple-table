import type { Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { PinnedAutoExpandResizeSandbox } from "./PinnedAutoExpandResizeSandbox";

const PinnedAutoExpandResizeDemo = ({
  height = "360px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return <PinnedAutoExpandResizeSandbox height={height} theme={theme} />;
};

export default PinnedAutoExpandResizeDemo;
