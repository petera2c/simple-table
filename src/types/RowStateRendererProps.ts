export interface LoadingStateRendererProps {
  parentRow?: any;
}

export interface ErrorStateRendererProps {
  error: string;
  parentRow?: any;
}

export interface EmptyStateRendererProps {
  message?: string;
  parentRow?: any;
}

export type VanillaLoadingStateRenderer = string | HTMLElement | ((props: LoadingStateRendererProps) => HTMLElement | string);

export type VanillaErrorStateRenderer = string | HTMLElement | ((props: ErrorStateRendererProps) => HTMLElement | string);

export type VanillaEmptyStateRenderer = string | HTMLElement | ((props: EmptyStateRendererProps) => HTMLElement | string);

export type LoadingStateRenderer = any;
export type ErrorStateRenderer = any;
export type EmptyStateRenderer = any;
