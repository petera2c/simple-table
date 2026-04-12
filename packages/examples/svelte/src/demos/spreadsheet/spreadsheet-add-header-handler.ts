/** Lets the "Add column" header (mounted by the table adapter) call back into the demo shell. */
let handler: (() => void) | undefined;

export function setSpreadsheetAddColumnHandler(fn: () => void): void {
  handler = fn;
}

export function addSpreadsheetColumnFromHeader(): void {
  handler?.();
}
