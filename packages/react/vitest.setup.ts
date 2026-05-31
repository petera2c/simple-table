// jsdom does not implement ResizeObserver, but the core DimensionManager
// constructs one when the table mounts and relies on its *initial* callback to
// read the container width and trigger the first render. A no-op stub leaves
// the table empty, so deliver one initial notification on observe().
class ResizeObserverStub {
  private callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(): void {
    // Schedule on a microtask so the DimensionManager has finished wiring its
    // subscriber before the (rAF-deferred) width notification fires.
    queueMicrotask(() => this.callback([], this as unknown as ResizeObserver));
  }
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

// The DimensionManager defers its width notification to requestAnimationFrame.
// jsdom may not provide rAF, so polyfill it with a macrotask fallback.
if (typeof globalThis.requestAnimationFrame !== "function") {
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 0) as unknown as number) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) =>
    clearTimeout(id as unknown as ReturnType<typeof setTimeout>)) as typeof cancelAnimationFrame;
}

// jsdom reports 0 for all layout box metrics. Give elements a non-zero width so
// the core's column virtualization renders body cells instead of an empty grid.
Object.defineProperty(HTMLElement.prototype, "clientWidth", {
  configurable: true,
  get() {
    return 800;
  },
});
