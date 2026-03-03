/**
 * Calls the onGridReady callback if provided.
 * This is a simple utility function that replaces the useOnGridReady hook.
 * 
 * @param onGridReady - Optional callback to invoke when grid is ready
 */
export function callOnGridReady(onGridReady?: () => void): void {
  onGridReady?.();
}

export default callOnGridReady;
