import type Row from "./Row";
import type { RowData } from "./Row";

export interface LoadingStateRendererProps<TData extends RowData = Row> {
  parentRow?: TData;
}

export interface ErrorStateRendererProps<TData extends RowData = Row> {
  error: string;
  parentRow?: TData;
}

export interface EmptyStateRendererProps<TData extends RowData = Row> {
  message?: string;
  parentRow?: TData;
}

export type VanillaLoadingStateRenderer<TData extends RowData = Row> =
  | string
  | HTMLElement
  | ((props: LoadingStateRendererProps<TData>) => HTMLElement | string);

export type VanillaErrorStateRenderer<TData extends RowData = Row> =
  | string
  | HTMLElement
  | ((props: ErrorStateRendererProps<TData>) => HTMLElement | string);

export type VanillaEmptyStateRenderer<TData extends RowData = Row> =
  | string
  | HTMLElement
  | ((props: EmptyStateRendererProps<TData>) => HTMLElement | string);

export type LoadingStateRenderer<TData extends RowData = Row> = VanillaLoadingStateRenderer<TData>;
export type ErrorStateRenderer<TData extends RowData = Row> = VanillaErrorStateRenderer<TData>;
export type EmptyStateRenderer<TData extends RowData = Row> = VanillaEmptyStateRenderer<TData>;
