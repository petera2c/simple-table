/**
 * Manages window resize event listeners.
 * This is a vanilla JS alternative to the useWindowResize hook.
 */
export class WindowResizeManager {
  private callbacks: Set<() => void> = new Set();
  private isListening: boolean = false;

  /**
   * Handles the window resize event
   */
  private handleResize = (): void => {
    this.callbacks.forEach(callback => callback());
  };

  /**
   * Adds a callback to be called on window resize
   * @param callback - Function to call when window resizes
   * @returns Unsubscribe function
   */
  addCallback(callback: () => void): () => void {
    this.callbacks.add(callback);
    
    // Start listening if this is the first callback
    if (!this.isListening) {
      this.startListening();
    }
    
    return () => {
      this.callbacks.delete(callback);
      
      // Stop listening if no more callbacks
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
