import HeaderObject from "../types/HeaderObject";
import {
  CSS_VAR_BORDER_WIDTH,
  DEFAULT_BORDER_WIDTH,
  VIRTUALIZATION_THRESHOLD,
} from "../consts/general-consts";

export interface DimensionManagerConfig {
  effectiveHeaders: HeaderObject[];
  headerHeight?: number;
  rowHeight: number;
  height?: string | number;
  maxHeight?: string | number;
  totalRowCount: number;
  footerHeight?: number;
  containerElement?: HTMLElement;
}

export interface DimensionManagerState {
  containerWidth: number;
  calculatedHeaderHeight: number;
  maxHeaderDepth: number;
  contentHeight: number | undefined;
}

type StateChangeCallback = (state: DimensionManagerState) => void;

export class DimensionManager {
  private config: DimensionManagerConfig;
  private state: DimensionManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number | null = null;

  constructor(config: DimensionManagerConfig) {
    this.config = config;

    const maxHeaderDepth = this.calculateMaxHeaderDepth();
    const calculatedHeaderHeight = this.calculateHeaderHeight(maxHeaderDepth);
    const contentHeight = this.calculateContentHeight();

    this.state = {
      containerWidth: 0,
      calculatedHeaderHeight,
      maxHeaderDepth,
      contentHeight,
    };

    if (config.containerElement) {
      this.observeContainer(config.containerElement);
    }
  }

  private getHeaderDepth(header: HeaderObject): number {
    if (header.singleRowChildren && header.children?.length) {
      return 1;
    }
    return header.children?.length
      ? 1 + Math.max(...header.children.map((h) => this.getHeaderDepth(h)))
      : 1;
  }

  private calculateMaxHeaderDepth(): number {
    let maxDepth = 0;
    this.config.effectiveHeaders.forEach((header) => {
      const depth = this.getHeaderDepth(header);
      maxDepth = Math.max(maxDepth, depth);
    });
    return maxDepth;
  }

  private calculateHeaderHeight(maxHeaderDepth: number): number {
    let borderWidth = DEFAULT_BORDER_WIDTH;
    if (typeof window !== "undefined") {
      const rootElement = document.documentElement;
      const computedStyle = getComputedStyle(rootElement);
      const borderWidthValue = computedStyle.getPropertyValue(CSS_VAR_BORDER_WIDTH).trim();
      if (borderWidthValue) {
        const parsed = parseFloat(borderWidthValue);
        if (!isNaN(parsed)) {
          borderWidth = parsed;
        }
      }
    }
    return maxHeaderDepth * (this.config.headerHeight ?? this.config.rowHeight) + borderWidth;
  }

  private convertHeightToPixels(heightValue: string | number): number {
    const container = this.config.containerElement || document.querySelector(".simple-table-root");

    if (typeof heightValue === "string") {
      if (heightValue.endsWith("px")) {
        return parseInt(heightValue, 10);
      } else if (heightValue.endsWith("vh")) {
        const vh = parseInt(heightValue, 10);
        return (window.innerHeight * vh) / 100;
      } else if (heightValue.endsWith("%")) {
        const percentage = parseInt(heightValue, 10);
        const parentHeight = container?.parentElement?.clientHeight;
        if (!parentHeight || parentHeight < 50) {
          return 0;
        }
        return (parentHeight * percentage) / 100;
      } else {
        return window.innerHeight;
      }
    } else {
      return heightValue as number;
    }
  }

  private calculateContentHeight(): number | undefined {
    const { height, maxHeight, rowHeight, totalRowCount, headerHeight, footerHeight } = this.config;

    if (maxHeight) {
      const maxHeightPx = this.convertHeightToPixels(maxHeight);

      if (maxHeightPx === 0) {
        return undefined;
      }

      const actualHeaderHeight = headerHeight || rowHeight;
      const actualFooterHeight = footerHeight || 0;
      const actualContentHeight =
        actualHeaderHeight + totalRowCount * rowHeight + actualFooterHeight;

      if (actualContentHeight <= maxHeightPx || totalRowCount < VIRTUALIZATION_THRESHOLD) {
        return undefined;
      }

      return Math.max(0, maxHeightPx - actualHeaderHeight);
    }

    if (!height) return undefined;

    const totalHeightPx = this.convertHeightToPixels(height);

    if (totalHeightPx === 0) {
      return undefined;
    }

    return Math.max(0, totalHeightPx - rowHeight);
  }

  private observeContainer(containerElement: HTMLElement): void {
    const updateContainerWidth = () => {
      // Defer notification to the next animation frame to prevent ResizeObserver
      // loop errors in Chromium. Without this, a synchronous render triggered by
      // the ResizeObserver callback can modify the observed element's layout within
      // the same frame, causing Chromium to fire a window error with event.error=null.
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        const newWidth = containerElement.clientWidth;
        if (newWidth !== this.state.containerWidth) {
          this.state = {
            ...this.state,
            containerWidth: newWidth,
          };
          this.notifySubscribers();
        }
      });
    };

    this.resizeObserver = new ResizeObserver(updateContainerWidth);
    this.resizeObserver.observe(containerElement);

    // Width updates from RO are deferred to rAF above; without a synchronous read,
    // state stays 0 until the next frame (breaks autoExpand resize and stale header
    // context). Reading here is outside the RO callback, so Chromium RO loop issues
    // do not apply.
    this.applyContainerWidthSync(containerElement);
  }

  private applyContainerWidthSync(containerElement: HTMLElement): void {
    const w = containerElement.clientWidth;
    if (w > 0 && w !== this.state.containerWidth) {
      this.state = {
        ...this.state,
        containerWidth: w,
      };
      this.notifySubscribers();
    }
  }

  updateConfig(config: Partial<DimensionManagerConfig>): void {
    const oldHeaders = this.config.effectiveHeaders;
    const oldContainerElement = this.config.containerElement;

    this.config = { ...this.config, ...config };

    let needsUpdate = false;

    if (config.effectiveHeaders && config.effectiveHeaders !== oldHeaders) {
      const maxHeaderDepth = this.calculateMaxHeaderDepth();
      const calculatedHeaderHeight = this.calculateHeaderHeight(maxHeaderDepth);
      this.state = {
        ...this.state,
        maxHeaderDepth,
        calculatedHeaderHeight,
      };
      needsUpdate = true;
    }

    if (config.height || config.maxHeight || config.totalRowCount !== undefined) {
      const contentHeight = this.calculateContentHeight();
      this.state = {
        ...this.state,
        contentHeight,
      };
      needsUpdate = true;
    }

    if (config.containerElement && config.containerElement !== oldContainerElement) {
      if (this.resizeObserver && oldContainerElement) {
        this.resizeObserver.unobserve(oldContainerElement);
      }
      this.observeContainer(config.containerElement);
      needsUpdate = true;
    }

    if (needsUpdate) {
      this.notifySubscribers();
    }
  }

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    // Constructor-time applyContainerWidthSync may call notifySubscribers() before
    // any listener exists, so that first width update is dropped. Replay current
    // state once — but defer to a microtask so SimpleTableVanilla.setupManagers()
    // can finish (e.g. RowSelectionManager) before the first dimension-driven
    // render; a synchronous callback here cached a body context with a null
    // rowSelectionManager closure (same hash as later renders with count 0).
    let unsubscribed = false;
    queueMicrotask(() => {
      if (unsubscribed || !this.subscribers.has(callback)) return;
      callback(this.state);
    });
    return () => {
      unsubscribed = true;
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb(this.state));
  }

  getState(): DimensionManagerState {
    return this.state;
  }

  getContainerWidth(): number {
    return this.state.containerWidth;
  }

  getCalculatedHeaderHeight(): number {
    return this.state.calculatedHeaderHeight;
  }

  getMaxHeaderDepth(): number {
    return this.state.maxHeaderDepth;
  }

  getContentHeight(): number | undefined {
    return this.state.contentHeight;
  }

  destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.subscribers.clear();
  }
}
