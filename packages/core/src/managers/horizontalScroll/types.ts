export type SectionId = "pinned-left" | "main" | "pinned-right";
export type SectionPaneRole = "sticky" | "scrollbar" | "header" | "body";

export const sectionIdFromPinned = (pinned?: "left" | "right"): SectionId => {
  if (pinned === "left") return "pinned-left";
  if (pinned === "right") return "pinned-right";
  return "main";
};

export interface HorizontalScrollEngineConfig {
  /** Column virtualization for the main section. Runs at most every 20px of movement. */
  onMainSectionScrollLeft?: (scrollLeft: number) => void;
}

export interface SectionScrollMetrics {
  /** Sum of column widths in this section. */
  contentWidth: number;
  /** Visible width of this section. */
  viewportWidth: number;
}
