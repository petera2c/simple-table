/**
 * Manages aria-live announcements for screen readers.
 * This is a vanilla JS alternative to the useAriaAnnouncements hook.
 *
 * Provides a way to announce dynamic content changes to assistive technologies.
 */
export declare class AriaAnnouncementManager {
    private announcement;
    private timeoutId;
    private observers;
    /**
     * Announces a message to screen readers
     * The message will be cleared after 1 second to allow for new announcements
     * @param message - The message to announce
     */
    announce(message: string): void;
    /**
     * Gets the current announcement message
     * @returns The current announcement string
     */
    getAnnouncement(): string;
    /**
     * Subscribes to announcement changes
     * @param callback - Function to call when announcement changes
     * @returns Unsubscribe function
     */
    subscribe(callback: (message: string) => void): () => void;
    /**
     * Notifies all observers of announcement changes
     */
    private notifyObservers;
    /**
     * Cleans up the manager and clears any pending timeouts
     */
    destroy(): void;
}
export default AriaAnnouncementManager;
