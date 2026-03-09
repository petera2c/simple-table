export interface ScrollEventParams {
  scrollTop: number;
  scrollDirection: "up" | "down" | "none";
}

export type ScrollEventCallback = (params: ScrollEventParams) => void;

export class EventHandlers {
  private scrollCallbacks: Set<ScrollEventCallback> = new Set();
  private previousScrollTop: number = 0;

  handleScroll(element: HTMLElement, onScroll: ScrollEventCallback): void {
    const newScrollTop = element.scrollTop;
    
    const direction: "up" | "down" | "none" =
      newScrollTop > this.previousScrollTop
        ? "down"
        : newScrollTop < this.previousScrollTop
          ? "up"
          : "none";

    this.previousScrollTop = newScrollTop;

    onScroll({
      scrollTop: newScrollTop,
      scrollDirection: direction,
    });
  }

  clearHoveredRows(): void {
    document.querySelectorAll(".st-row.hovered").forEach((el) => {
      el.classList.remove("hovered");
    });
  }

  cleanup(): void {
    this.scrollCallbacks.clear();
  }
}
