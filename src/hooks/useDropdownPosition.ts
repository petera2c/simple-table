export interface DropdownPosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface DropdownPositionManagerOptions {
  estimatedHeight?: number;
  estimatedWidth?: number;
  margin?: number;
}

/**
 * Manager class for calculating and tracking dropdown position
 * Uses fixed positioning to work properly in overflow containers
 */
export class DropdownPositionManager {
  private triggerElement: HTMLElement | null = null;
  private position: DropdownPosition = {};
  private estimatedHeight: number;
  private estimatedWidth: number;
  private margin: number;
  private isOpen: boolean = false;
  private observers: Set<(position: DropdownPosition) => void> = new Set();
  private resizeHandler?: () => void;
  private scrollHandler?: () => void;

  constructor(options: DropdownPositionManagerOptions = {}) {
    this.estimatedHeight = options.estimatedHeight ?? 200;
    this.estimatedWidth = options.estimatedWidth ?? 250;
    this.margin = options.margin ?? 4;
  }

  /**
   * Sets the trigger element to calculate position relative to
   */
  setTriggerElement(element: HTMLElement | null): void {
    this.triggerElement = element;
    if (this.isOpen) {
      this.calculatePosition();
    }
  }

  /**
   * Opens the dropdown and starts position tracking
   */
  open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.startListening();
    this.calculatePosition();
  }

  /**
   * Closes the dropdown and stops position tracking
   */
  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.stopListening();
    this.position = {};
    this.notifyObservers();
  }

  /**
   * Gets the current position
   */
  getPosition(): DropdownPosition {
    return this.position;
  }

  /**
   * Calculates the dropdown position based on trigger element
   */
  private calculatePosition(): void {
    if (!this.triggerElement) return;

    const triggerRect = this.triggerElement.getBoundingClientRect();

    // Calculate space available in each direction
    const spaceBottom = window.innerHeight - triggerRect.bottom;
    const spaceTop = triggerRect.top;
    const spaceRight = window.innerWidth - triggerRect.right;

    // Determine vertical position (top or bottom)
    let verticalPosition = "bottom";
    const newPosition: DropdownPosition = {};

    // If there's not enough space below and more space above
    if (this.estimatedHeight > spaceBottom && this.estimatedHeight <= spaceTop) {
      verticalPosition = "top";
    }

    // Determine horizontal position (left or right)
    let horizontalPosition = "left";

    // If there's not enough space to the right, position to the left
    if (this.estimatedWidth > spaceRight + triggerRect.width) {
      horizontalPosition = "right";
    }

    // Calculate exact positioning for fixed positioning
    if (verticalPosition === "bottom") {
      newPosition.top = triggerRect.bottom + this.margin;
    } else {
      newPosition.bottom = window.innerHeight - triggerRect.top + this.margin;
    }

    if (horizontalPosition === "left") {
      newPosition.left = triggerRect.left;
    } else {
      newPosition.right = window.innerWidth - triggerRect.right;
    }

    this.position = newPosition;
    this.notifyObservers();
  }

  /**
   * Starts listening to window events
   */
  private startListening(): void {
    this.resizeHandler = () => requestAnimationFrame(() => this.calculatePosition());
    this.scrollHandler = () => requestAnimationFrame(() => this.calculatePosition());

    window.addEventListener("resize", this.resizeHandler);
    window.addEventListener("scroll", this.scrollHandler, true);
  }

  /**
   * Stops listening to window events
   */
  private stopListening(): void {
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = undefined;
    }
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler, true);
      this.scrollHandler = undefined;
    }
  }

  /**
   * Subscribes to position changes
   */
  subscribe(callback: (position: DropdownPosition) => void): () => void {
    this.observers.add(callback);
    return () => {
      this.observers.delete(callback);
    };
  }

  /**
   * Notifies all observers of position changes
   */
  private notifyObservers(): void {
    this.observers.forEach((callback) => callback(this.position));
  }

  /**
   * Cleans up the manager
   */
  destroy(): void {
    this.stopListening();
    this.observers.clear();
    this.triggerElement = null;
  }
}

export default DropdownPositionManager;
