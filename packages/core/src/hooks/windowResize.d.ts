/**
 * Manages window resize event listeners.
 * This is a vanilla JS alternative to the useWindowResize hook.
 */
export declare class WindowResizeManager {
    private callbacks;
    private isListening;
    /**
     * Handles the window resize event
     */
    private handleResize;
    /**
     * Adds a callback to be called on window resize
     * @param callback - Function to call when window resizes
     * @returns Unsubscribe function
     */
    addCallback(callback: () => void): () => void;
    /**
     * Starts listening to window resize events
     */
    startListening(): void;
    /**
     * Stops listening to window resize events
     */
    stopListening(): void;
    /**
     * Cleans up the manager and removes all event listeners
     */
    destroy(): void;
}
export default WindowResizeManager;
