/**
 * Manages aria-live announcements for screen readers.
 * This is a vanilla JS alternative to the useAriaAnnouncements hook.
 * 
 * Provides a way to announce dynamic content changes to assistive technologies.
 */
export class AriaAnnouncementManager {
  private announcement: string = "";
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private observers: Set<(message: string) => void> = new Set();

  /**
   * Announces a message to screen readers
   * The message will be cleared after 1 second to allow for new announcements
   * @param message - The message to announce
   */
  announce(message: string): void {
    this.announcement = message;
    this.notifyObservers();

    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Clear the announcement after 1 second to allow for new announcements
    this.timeoutId = setTimeout(() => {
      this.announcement = "";
      this.notifyObservers();
    }, 1000);
  }

  /**
   * Gets the current announcement message
   * @returns The current announcement string
   */
  getAnnouncement(): string {
    return this.announcement;
  }

  /**
   * Subscribes to announcement changes
   * @param callback - Function to call when announcement changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (message: string) => void): () => void {
    this.observers.add(callback);
    return () => {
      this.observers.delete(callback);
    };
  }

  /**
   * Notifies all observers of announcement changes
   */
  private notifyObservers(): void {
    this.observers.forEach(callback => callback(this.announcement));
  }

  /**
   * Cleans up the manager and clears any pending timeouts
   */
  destroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.observers.clear();
    this.announcement = "";
  }
}

export default AriaAnnouncementManager;
