import { ReactNode } from "react";

/**
 * Props passed to the loading state renderer
 */
export interface LoadingStateRendererProps {
  /**
   * The row that is being loaded (parent row for nested loading states)
   */
  parentRow?: any;
}

/**
 * Props passed to the error state renderer
 */
export interface ErrorStateRendererProps {
  /**
   * The error message to display
   */
  error: string;
  /**
   * The row that encountered the error (parent row for nested error states)
   */
  parentRow?: any;
}

/**
 * Props passed to the empty state renderer
 */
export interface EmptyStateRendererProps {
  /**
   * Optional custom message to display
   */
  message?: string;
  /**
   * The row that has no children (parent row for nested empty states)
   */
  parentRow?: any;
}

/**
 * Function type for rendering loading state
 */
export type LoadingStateRenderer = (props: LoadingStateRendererProps) => ReactNode;

/**
 * Function type for rendering error state
 */
export type ErrorStateRenderer = (props: ErrorStateRendererProps) => ReactNode;

/**
 * Function type for rendering empty state
 */
export type EmptyStateRenderer = (props: EmptyStateRendererProps) => ReactNode;
