import { writable } from "svelte/store";
import {
  CRM_THEME_COLORS_LIGHT,
  CRM_THEME_COLORS_DARK,
  CRM_FOOTER_COLORS_LIGHT,
  CRM_FOOTER_COLORS_DARK,
} from "./crm.demo-data";

export const crmCellColors = writable(CRM_THEME_COLORS_LIGHT);
export const crmFooterColors = writable(CRM_FOOTER_COLORS_LIGHT);
export const crmRowsPerPage = writable(100);

export function syncCrmDemoPalette(isDark: boolean): void {
  crmCellColors.set(isDark ? CRM_THEME_COLORS_DARK : CRM_THEME_COLORS_LIGHT);
  crmFooterColors.set(isDark ? CRM_FOOTER_COLORS_DARK : CRM_FOOTER_COLORS_LIGHT);
}
