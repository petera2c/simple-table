import { ReactNode } from "react";

/**
 * Configuration for all icons used in the table
 */
export interface IconsConfig {
  /** Icon for drag handle in column editor (default: DragIcon) */
  drag?: ReactNode;
  /** Icon for expanded state in expandable rows (default: AngleRightIcon) */
  expand?: ReactNode;
  /** Icon for filter button in headers (default: FilterIcon) */
  filter?: ReactNode;
  /** Icon for collapsed column headers (default: AngleRightIcon) */
  headerCollapse?: ReactNode;
  /** Icon for expanded column headers (default: AngleLeftIcon) */
  headerExpand?: ReactNode;
  /** Icon for next page button (default: AngleRightIcon) */
  next?: ReactNode;
  /** Icon for previous page button (default: AngleLeftIcon) */
  prev?: ReactNode;
  /** Icon for sort descending (default: DescIcon) */
  sortDown?: ReactNode;
  /** Icon for sort ascending (default: AscIcon) */
  sortUp?: ReactNode;
}
