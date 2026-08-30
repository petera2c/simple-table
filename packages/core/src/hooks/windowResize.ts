/**
 * Manages window resize event listeners.
 * This is a vanilla JS alternative to the useWindowResize hook.
 */
export class WindowResizeManager {
  private callbacks: Set<() => void> = new Set();
  private isListening: boolean = false;
  private rafId: number | null = null;

  /**
   * Run at most one resize callback per animation frame.
   */
  private handleResize = (): void => {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.callbacks.forEach((callback) => callback());
    });
  };

  /**
   * Adds a callback to be called on window resize
   * @param callback - Function to call when window resizes
   * @returns Unsubscribe function
   */
  addCallback(callback: () => void): () => void {
    this.callbacks.add(callback);

    if (!this.isListening) {
      this.startListening();
    }

    return () => {
      this.callbacks.delete(callback);
      if (this.callbacks.size === 0) {
        this.stopListening();
      }
    };
  }

  /**
   * Starts listening to window resize events
   */
  startListening(): void {
    if (!this.isListening) {
      window.addEventListener("resize", this.handleResize);
      this.isListening = true;
    }
  }

  /**
   * Stops listening to window resize events
   */
  stopListening(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.isListening) {
      window.removeEventListener("resize", this.handleResize);
      this.isListening = false;
    }
  }

  /**
   * Cleans up the manager and removes all event listeners
   */
  destroy(): void {
    this.stopListening();
    this.callbacks.clear();
  }
}

export default WindowResizeManager;
