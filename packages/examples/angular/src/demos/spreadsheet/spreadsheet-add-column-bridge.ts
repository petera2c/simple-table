let spreadsheetAddColumnHandler: (() => void) | null = null;

export function setSpreadsheetAddColumnHandler(fn: (() => void) | null): void {
  spreadsheetAddColumnHandler = fn;
}

export function triggerSpreadsheetAddColumn(): void {
  spreadsheetAddColumnHandler?.();
}
