import { signal } from "@angular/core";
import type { Theme } from "@simple-table/angular";

export const footerDemoThemeContext = signal<Theme | undefined>(undefined);
