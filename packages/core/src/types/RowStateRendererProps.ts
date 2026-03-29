import type Row from "./Row";

export interface LoadingStateRendererProps {
  parentRow?: Row;
}

export interface ErrorStateRendererProps {
  error: string;
  parentRow?: Row;
}

export interface EmptyStateRendererProps {
  message?: string;
  parentRow?: Row;
}

export type VanillaLoadingStateRenderer = string | HTMLElement | ((props: LoadingStateRendererProps) => HTMLElement | string);

export type VanillaErrorStateRenderer = string | HTMLElement | ((props: ErrorStateRendererProps) => HTMLElement | string);

export type VanillaEmptyStateRenderer = string | HTMLElement | ((props: EmptyStateRendererProps) => HTMLElement | string);

export type LoadingStateRenderer = VanillaLoadingStateRenderer;
export type ErrorStateRenderer = VanillaErrorStateRenderer;
export type EmptyStateRenderer = VanillaEmptyStateRenderer;
