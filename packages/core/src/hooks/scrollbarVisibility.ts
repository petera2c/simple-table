/**
 * Manages scrollbar visibility detection and header padding adjustments.
 * This is a vanilla JS alternative to the useScrollbarVisibility hook.
 */
export class ScrollbarVisibilityManager {
  private isMainSectionScrollable: boolean = false;
  private headerContainer: HTMLElement | null = null;
  private mainSection: HTMLElement | null = null;
  private scrollbarWidth: number = 0;
  private resizeObserver: ResizeObserver | null = null;
  private observers: Set<(isScrollable: boolean) => void> = new Set();
  private rafId: number | null = null;

  constructor(config: {
    headerContainer?: HTMLElement | null;
    mainSection?: HTMLElement | null;
    scrollbarWidth: number;
  }) {
    this.headerContainer = config.headerContainer || null;
    this.mainSection = config.mainSection || null;
    this.scrollbarWidth = config.scrollbarWidth;

    if (this.mainSection && this.headerContainer) {
      this.initialize();
    }
  }

  /**
   * Initializes the scrollbar visibility detection
   */
  private initialize(): void {
    if (!this.mainSection || !this.headerContainer) return;

    // Check on initial setup
    this.checkScrollability();

    // Use requestAnimationFrame to defer scroll checks triggered by ResizeObserver,
    // preventing ResizeObserver loop errors in Chromium when the callback
    // synchronously triggers renders that affect the observed element's layout.
    this.resizeObserver = new ResizeObserver(() => {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.checkScrollability();
      });
    });

    this.resizeObserver.observe(this.mainSection);
  }

  /**
   * Checks if the main section is scrollable
   */
  private checkScrollability(): void {
    if (this.mainSection) {
      const hasVerticalScroll = this.mainSection.scrollHeight > this.mainSection.clientHeight;
      
      if (hasVerticalScroll !== this.isMainSectionScrollable) {
        this.isMainSectionScrollable = hasVerticalScroll;
        this.updateHeaderPadding();
        this.notifyObservers();
      }
    }
  }

  /**
   * Updates the header padding based on scrollbar visibility
   */
  private updateHeaderPadding(): void {
    if (!this.headerContainer) return;

    if (this.isMainSectionScrollable) {
      // Measure the live vertical scrollbar gutter on the body container. The
      // width passed in at construction is often 0 (measured before overflow).
      const live =
        this.mainSection != null
          ? this.mainSection.offsetWidth - this.mainSection.clientWidth
          : this.scrollbarWidth;
      this.scrollbarWidth = live;
      this.headerContainer.classList.add("st-header-scroll-padding");
      this.headerContainer.style.setProperty("--st-after-width", `${live}px`);
    } else {
      this.headerContainer.classList.remove("st-header-scroll-padding");
    }
  }

  /**
   * Updates the scrollbar width and refreshes padding
   * @param width - New scrollbar width in pixels
   */
  setScrollbarWidth(width: number): void {
    this.scrollbarWidth = width;
    this.updateHeaderPadding();
  }

  /**
   * Updates the header container element
   * @param container - New header container element
   */
  setHeaderContainer(container: HTMLElement | null): void {
    // Clean up old header
    if (this.headerContainer) {
      this.headerContainer.classList.remove("st-header-scroll-padding");
    }

    this.headerContainer = container;
    this.updateHeaderPadding();
  }

  /**
   * Updates the main section element
   * @param section - New main section element
   */
  setMainSection(section: HTMLElement | null): void {
    // Clean up old observer
    if (this.resizeObserver && this.mainSection) {
      this.resizeObserver.unobserve(this.mainSection);
    }

    this.mainSection = section;

    if (this.mainSection && this.headerContainer) {
      this.initialize();
    }
  }

  /**
   * Gets whether the main section is currently scrollable
   * @returns True if the main section has vertical scroll
   */
  getIsMainSectionScrollable(): boolean {
    return this.isMainSectionScrollable;
  }

  /**
   * Subscribes to scrollability changes
   * @param callback - Function to call when scrollability changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (isScrollable: boolean) => void): () => void {
    this.observers.add(callback);
    return () => {
      this.observers.delete(callback);
    };
  }

  /**
   * Notifies all observers of scrollability changes
   */
  private notifyObservers(): void {
    this.observers.forEach(callback => callback(this.isMainSectionScrollable));
  }

  /**
   * Cleans up the manager and removes all observers
   */
  destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.resizeObserver && this.mainSection) {
      this.resizeObserver.unobserve(this.mainSection);
      this.resizeObserver = null;
    }

    if (this.headerContainer) {
      this.headerContainer.classList.remove("st-header-scroll-padding");
    }

    this.observers.clear();
  }
}

export default ScrollbarVisibilityManager;
