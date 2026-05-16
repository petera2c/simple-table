import { writable } from "svelte/store";
import type { Theme } from "@simple-table/svelte";

/** Demo-only: footer is mounted outside the demo component tree, so theme is synced here. */
export const footerDemoTheme = writable<Theme | undefined>(undefined);
