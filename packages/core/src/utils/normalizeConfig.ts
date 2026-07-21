import type HeaderObject from "../types/HeaderObject";
import type { SimpleTableConfig } from "../types/SimpleTableConfig";

/** Preferred column-def aliases accepted on column objects (normalized to `is*` fields). */
export type ColumnDefAliases = {
  /** @deprecated Prefer `editable` */
  isEditable?: boolean;
  editable?: boolean;
  /** @deprecated Prefer `sortable` */
  isSortable?: boolean;
  sortable?: boolean;
  /** @deprecated Prefer `essential` */
  isEssential?: boolean;
  essential?: boolean;
};

/**
 * Consumer-facing config input: accepts preferred prop names alongside legacy
 * names. {@link normalizeConfig} / {@link normalizeConfigPatch} collapse aliases
 * into the canonical {@link SimpleTableConfig} shape used internally.
 */
export type SimpleTableConfigInput = Omit<
  SimpleTableConfig,
  | "defaultHeaders"
  | "editColumns"
  | "editColumnsInitOpen"
  | "shouldPaginate"
  | "onGridReady"
  | "useHoverRowBackground"
  | "useOddColumnBackground"
  | "useOddEvenRowBackground"
> & {
  /** Preferred column definitions prop. */
  columns?: HeaderObject[];
  /** @deprecated Prefer `columns` */
  defaultHeaders?: HeaderObject[];
  /** Preferred flag for the column editor / visibility UI. */
  enableColumnEditor?: boolean;
  /** @deprecated Prefer `enableColumnEditor` */
  editColumns?: boolean;
  enableColumnEditorInitOpen?: boolean;
  /** @deprecated Prefer `enableColumnEditorInitOpen` */
  editColumnsInitOpen?: boolean;
  /** Preferred pagination flag. */
  enablePagination?: boolean;
  /** @deprecated Prefer `enablePagination` */
  shouldPaginate?: boolean;
  /** Preferred ready callback. */
  onTableReady?: () => void;
  /** @deprecated Prefer `onTableReady` */
  onGridReady?: () => void;
  hoverRowBackground?: boolean;
  /** @deprecated Prefer `hoverRowBackground` */
  useHoverRowBackground?: boolean;
  oddColumnBackground?: boolean;
  /** @deprecated Prefer `oddColumnBackground` */
  useOddColumnBackground?: boolean;
  oddEvenRowBackground?: boolean;
  /** @deprecated Prefer `oddEvenRowBackground` */
  useOddEvenRowBackground?: boolean;
};

type HeaderWithAliases = HeaderObject & ColumnDefAliases;

function pickAlias<T>(preferred: T | undefined, legacy: T | undefined): T | undefined {
  return preferred !== undefined ? preferred : legacy;
}

/** Normalize a single column def: preferred bare adjectives win over `is*` aliases. */
export function normalizeColumnDef(header: HeaderObject): HeaderObject {
  const h = header as HeaderWithAliases;
  const {
    editable,
    sortable,
    essential,
    isEditable,
    isSortable,
    isEssential,
    children,
    ...rest
  } = h;

  const normalized: HeaderObject = {
    ...rest,
    isEditable: pickAlias(editable, isEditable),
    isSortable: pickAlias(sortable, isSortable),
    isEssential: pickAlias(essential, isEssential),
  };

  if (children) {
    normalized.children = children.map(normalizeColumnDef);
  }

  return normalized;
}

export function normalizeColumnDefs(headers: HeaderObject[]): HeaderObject[] {
  return headers.map(normalizeColumnDef);
}

/**
 * Collapse consumer aliases into the canonical config shape.
 * Requires `columns` or `defaultHeaders`.
 */
export function normalizeConfig(input: SimpleTableConfigInput): SimpleTableConfig {
  const headers = input.columns ?? input.defaultHeaders;
  if (!headers) {
    throw new Error("SimpleTable requires `columns` or `defaultHeaders`");
  }

  const {
    columns: _columns,
    defaultHeaders: _defaultHeaders,
    enableColumnEditor,
    editColumns,
    enableColumnEditorInitOpen,
    editColumnsInitOpen,
    enablePagination,
    shouldPaginate,
    onTableReady,
    onGridReady,
    hoverRowBackground,
    useHoverRowBackground,
    oddColumnBackground,
    useOddColumnBackground,
    oddEvenRowBackground,
    useOddEvenRowBackground,
    ...rest
  } = input;

  return {
    ...rest,
    defaultHeaders: normalizeColumnDefs(headers),
    editColumns: pickAlias(enableColumnEditor, editColumns),
    editColumnsInitOpen: pickAlias(enableColumnEditorInitOpen, editColumnsInitOpen),
    shouldPaginate: pickAlias(enablePagination, shouldPaginate),
    onGridReady: pickAlias(onTableReady, onGridReady),
    useHoverRowBackground: pickAlias(hoverRowBackground, useHoverRowBackground),
    useOddColumnBackground: pickAlias(oddColumnBackground, useOddColumnBackground),
    useOddEvenRowBackground: pickAlias(oddEvenRowBackground, useOddEvenRowBackground),
  };
}

/**
 * Normalize a partial update patch. Maps preferred alias keys onto canonical
 * keys so `update({ columns })` / `update({ enablePagination })` work.
 */
export function normalizeConfigPatch(
  patch: Partial<SimpleTableConfigInput>,
): Partial<SimpleTableConfig> {
  const {
    columns,
    defaultHeaders,
    enableColumnEditor,
    editColumns,
    enableColumnEditorInitOpen,
    editColumnsInitOpen,
    enablePagination,
    shouldPaginate,
    onTableReady,
    onGridReady,
    hoverRowBackground,
    useHoverRowBackground,
    oddColumnBackground,
    useOddColumnBackground,
    oddEvenRowBackground,
    useOddEvenRowBackground,
    ...rest
  } = patch;

  const result: Partial<SimpleTableConfig> = { ...rest };

  const headers = columns ?? defaultHeaders;
  if (headers !== undefined) {
    result.defaultHeaders = normalizeColumnDefs(headers);
  }

  const resolvedEditColumns = pickAlias(enableColumnEditor, editColumns);
  if (resolvedEditColumns !== undefined) result.editColumns = resolvedEditColumns;

  const resolvedEditInit = pickAlias(enableColumnEditorInitOpen, editColumnsInitOpen);
  if (resolvedEditInit !== undefined) result.editColumnsInitOpen = resolvedEditInit;

  const resolvedPaginate = pickAlias(enablePagination, shouldPaginate);
  if (resolvedPaginate !== undefined) result.shouldPaginate = resolvedPaginate;

  const resolvedReady = pickAlias(onTableReady, onGridReady);
  if (resolvedReady !== undefined) result.onGridReady = resolvedReady;

  const resolvedHover = pickAlias(hoverRowBackground, useHoverRowBackground);
  if (resolvedHover !== undefined) result.useHoverRowBackground = resolvedHover;

  const resolvedOddCol = pickAlias(oddColumnBackground, useOddColumnBackground);
  if (resolvedOddCol !== undefined) result.useOddColumnBackground = resolvedOddCol;

  const resolvedOddEven = pickAlias(oddEvenRowBackground, useOddEvenRowBackground);
  if (resolvedOddEven !== undefined) result.useOddEvenRowBackground = resolvedOddEven;

  return result;
}
