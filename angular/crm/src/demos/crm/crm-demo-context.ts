import { signal } from "@angular/core";
import {
  CRM_FOOTER_COLORS_DARK,
  CRM_FOOTER_COLORS_LIGHT,
  CRM_THEME_COLORS_DARK,
  CRM_THEME_COLORS_LIGHT,
} from "./crm.demo-data";

export const crmCellPalette = signal(CRM_THEME_COLORS_LIGHT);
export const crmFooterPalette = signal(CRM_FOOTER_COLORS_LIGHT);
export const crmRowsPerPageSignal = signal(100);

export function syncCrmDemoPalette(isDark: boolean): void {
  crmCellPalette.set(isDark ? CRM_THEME_COLORS_DARK : CRM_THEME_COLORS_LIGHT);
  crmFooterPalette.set(isDark ? CRM_FOOTER_COLORS_DARK : CRM_FOOTER_COLORS_LIGHT);
}
