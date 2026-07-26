import type ColumnDef from "../types/ColumnDef";
import type { SimpleTableConfig } from "../types/SimpleTableConfig";
import type Row from "../types/Row";
import type { RowData } from "../types/Row";

/**
 * Consumer-facing config input. Preferred prop names only — no legacy aliases.
 */
export type SimpleTableConfigInput<TData extends RowData = Row> = SimpleTableConfig<TData>;

/** Pass-through for column trees (kept for call-site stability / future transforms). */
export function normalizeColumnDef(header: ColumnDef): ColumnDef {
  if (!header.children?.length) return header;
  return {
    ...header,
    children: header.children.map(normalizeColumnDef),
  };
}

export function normalizeColumnDefs(headers: ColumnDef[]): ColumnDef[] {
  return headers.map(normalizeColumnDef);
}

/**
 * Validate and normalize config. Requires `columns`.
 * Runtime always normalizes to the default {@link Row}-shaped config.
 */
export function normalizeConfig(input: SimpleTableConfigInput): SimpleTableConfig {
  if (!input.columns) {
    throw new Error("SimpleTable requires `columns`");
  }

  return {
    ...input,
    columns: normalizeColumnDefs(input.columns),
  };
}

/**
 * Normalize a partial update patch.
 */
export function normalizeConfigPatch(
  patch: Partial<SimpleTableConfigInput>,
): Partial<SimpleTableConfig> {
  if (patch.columns !== undefined) {
    return {
      ...patch,
      columns: normalizeColumnDefs(patch.columns),
    };
  }
  return { ...patch };
}
