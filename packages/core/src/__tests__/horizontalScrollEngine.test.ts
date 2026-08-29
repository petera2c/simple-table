import { afterEach, describe, expect, it, vi } from "vitest";
import { HorizontalScrollEngine } from "../managers/horizontalScroll/HorizontalScrollEngine";
import {
  ensureHorizontalScrollLayer,
  getHorizontalScrollViewport,
  H_SCROLL_LAYER_CLASS,
} from "../managers/horizontalScroll/scrollLayer";
import { getRenderedCells } from "../utils/bodyCell/eventTracking";

const createViewport = (width = 200): HTMLElement => {
  const el = document.createElement("div");
  el.className = "st-body-main";
  el.style.width = `${width}px`;
  Object.defineProperty(el, "clientWidth", { configurable: true, value: width });
  document.body.appendChild(el);
  return el;
};

const layerOf = (viewport: HTMLElement): HTMLElement => {
  const layer = viewport.querySelector(`.${H_SCROLL_LAYER_CLASS}`);
  if (!(layer instanceof HTMLElement)) throw new Error("missing scroll layer");
  return layer;
};

const fireTouch = (
  target: HTMLElement,
  type: "touchstart" | "touchmove" | "touchend",
  pageX: number,
  pageY: number,
): void => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const touch = { identifier: 1, target, clientX: pageX, clientY: pageY, pageX, pageY };
  Object.defineProperty(event, "touches", {
    value: type === "touchend" ? [] : [touch],
  });
  Object.defineProperty(event, "changedTouches", { value: [touch] });
  target.dispatchEvent(event);
};

describe("HorizontalScrollEngine", () => {
  const viewports: HTMLElement[] = [];
  const engines: HorizontalScrollEngine[] = [];

  afterEach(() => {
    engines.splice(0).forEach((engine) => engine.destroy());
    viewports.splice(0).forEach((el) => el.remove());
    vi.restoreAllMocks();
  });

  const mountPair = () => {
    const header = createViewport();
    header.className = "st-header-main";
    const body = createViewport();
    viewports.push(header, body);
    const onMain = vi.fn();
    const engine = new HorizontalScrollEngine({ onMainSectionScrollLeft: onMain });
    engines.push(engine);
    engine.setSectionMetrics("main", { contentWidth: 1000, viewportWidth: 200 });
    engine.registerPane("main", header, "header");
    engine.registerPane("main", body, "body");
    return { header, body, engine, onMain };
  };

  it("puts the same transform on header and body", () => {
    const { header, body, engine } = mountPair();
    engine.setSectionScrollLeft("main", 150);
    expect(layerOf(header).style.transform).toBe("translate3d(-150px, 0px, 0px)");
    expect(layerOf(body).style.transform).toBe("translate3d(-150px, 0px, 0px)");
    expect(header.dataset.stScrollX).toBe("150");
    expect(body.dataset.stScrollX).toBe("150");
  });

  it("clamps programmatic scroll to the content range", () => {
    const { engine } = mountPair();
    engine.setSectionScrollLeft("main", 9999);
    expect(engine.getSectionScrollLeft("main")).toBe(800);
    engine.setSectionScrollLeft("main", -40);
    expect(engine.getSectionScrollLeft("main")).toBe(0);
  });

  it("applies wheel deltaX to both panes and skips vertical wheels", () => {
    const { header, body, engine } = mountPair();
    const vertical = new WheelEvent("wheel", { deltaY: 80, cancelable: true, bubbles: true });
    const preventVertical = vi.spyOn(vertical, "preventDefault");
    header.dispatchEvent(vertical);
    expect(preventVertical).not.toHaveBeenCalled();
    expect(engine.getSectionScrollLeft("main")).toBe(0);

    const horizontal = new WheelEvent("wheel", { deltaX: 40, cancelable: true, bubbles: true });
    const preventHorizontal = vi.spyOn(horizontal, "preventDefault");
    body.dispatchEvent(horizontal);
    expect(preventHorizontal).toHaveBeenCalled();
    expect(engine.getSectionScrollLeft("main")).toBe(40);
    expect(layerOf(header).style.transform).toBe("translate3d(-40px, 0px, 0px)");
    expect(layerOf(body).style.transform).toBe("translate3d(-40px, 0px, 0px)");
  });

  it("stops at the last column and still eats extra horizontal wheels", () => {
    const { body, engine } = mountPair();
    engine.setSectionScrollLeft("main", 800);
    const first = new WheelEvent("wheel", { deltaX: 40, cancelable: true, bubbles: true });
    const preventFirst = vi.spyOn(first, "preventDefault");
    body.dispatchEvent(first);
    expect(preventFirst).toHaveBeenCalled();
    expect(engine.getSectionScrollLeft("main")).toBe(800);

    for (let i = 0; i < 20; i++) {
      const extra = new WheelEvent("wheel", { deltaX: 80, cancelable: true, bubbles: true });
      const preventExtra = vi.spyOn(extra, "preventDefault");
      body.dispatchEvent(extra);
      expect(preventExtra).toHaveBeenCalled();
    }
    expect(engine.getSectionScrollLeft("main")).toBe(800);
  });

  it("stops at the first column", () => {
    const { body, engine } = mountPair();
    const extra = new WheelEvent("wheel", { deltaX: -40, cancelable: true, bubbles: true });
    const preventExtra = vi.spyOn(extra, "preventDefault");
    body.dispatchEvent(extra);
    expect(preventExtra).toHaveBeenCalled();
    expect(engine.getSectionScrollLeft("main")).toBe(0);
  });

  it("runs main-section virtualization after 20px of movement", async () => {
    const { body, onMain } = mountPair();
    onMain.mockClear();
    body.dispatchEvent(new WheelEvent("wheel", { deltaX: 10, cancelable: true, bubbles: true }));
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    expect(onMain).not.toHaveBeenCalled();
    body.dispatchEvent(new WheelEvent("wheel", { deltaX: 15, cancelable: true, bubbles: true }));
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    expect(onMain).toHaveBeenCalled();
    expect(onMain.mock.calls[0][0]).toBe(25);
  });

  it("writes the bottom bar from the same x and reads thumb drags back", () => {
    const { engine } = mountPair();
    const bar = document.createElement("div");
    bar.className = "st-horizontal-scrollbar-middle";
    Object.defineProperty(bar, "scrollLeft", {
      configurable: true,
      writable: true,
      value: 0,
    });
    document.body.appendChild(bar);
    viewports.push(bar);
    engine.registerPane("main", bar, "scrollbar");
    engine.setSectionScrollLeft("main", 220);
    expect(bar.scrollLeft).toBe(220);

    bar.scrollLeft = 300;
    bar.dispatchEvent(new Event("scroll"));
    expect(engine.getSectionScrollLeft("main")).toBe(300);
  });

  it("does not let a bottom-bar overscroll pull the table past the last column", () => {
    const { engine } = mountPair();
    const bar = document.createElement("div");
    bar.className = "st-horizontal-scrollbar-middle";
    Object.defineProperty(bar, "scrollLeft", {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(bar, "scrollWidth", { configurable: true, value: 1000 });
    Object.defineProperty(bar, "clientWidth", { configurable: true, value: 200 });
    document.body.appendChild(bar);
    viewports.push(bar);
    engine.registerPane("main", bar, "scrollbar");
    bar.scrollLeft = 960;
    bar.dispatchEvent(new Event("scroll"));
    expect(engine.getSectionScrollLeft("main")).toBe(800);
  });

  it("does not take a bottom-bar echo as a new position", () => {
    const { engine } = mountPair();
    const bar = document.createElement("div");
    bar.className = "st-horizontal-scrollbar-middle";
    Object.defineProperty(bar, "scrollLeft", {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(bar, "scrollWidth", { configurable: true, value: 1000 });
    Object.defineProperty(bar, "clientWidth", { configurable: true, value: 200 });
    document.body.appendChild(bar);
    viewports.push(bar);
    engine.registerPane("main", bar, "scrollbar");
    engine.setSectionScrollLeft("main", 220);
    bar.dispatchEvent(new Event("scroll"));
    expect(engine.getSectionScrollLeft("main")).toBe(220);
  });

  it("does not reset x when the bottom bar cannot scroll yet", () => {
    const { engine } = mountPair();
    const bar = document.createElement("div");
    bar.className = "st-horizontal-scrollbar-middle";
    Object.defineProperty(bar, "scrollLeft", {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(bar, "scrollWidth", { configurable: true, value: 200 });
    Object.defineProperty(bar, "clientWidth", { configurable: true, value: 200 });
    document.body.appendChild(bar);
    viewports.push(bar);
    engine.registerPane("main", bar, "scrollbar");
    engine.setSectionScrollLeft("main", 220);
    bar.scrollLeft = 0;
    bar.dispatchEvent(new Event("scroll"));
    expect(engine.getSectionScrollLeft("main")).toBe(220);
  });

  it("turns shift+vertical wheel into horizontal movement", () => {
    const { header, body, engine } = mountPair();
    const event = new WheelEvent("wheel", {
      deltaY: 60,
      shiftKey: true,
      cancelable: true,
      bubbles: true,
    });
    header.dispatchEvent(event);
    expect(engine.getSectionScrollLeft("main")).toBe(60);
    expect(layerOf(header).style.transform).toBe(layerOf(body).style.transform);
  });

  it("shrinks x when content no longer overflows that far", () => {
    const { engine } = mountPair();
    engine.setSectionScrollLeft("main", 800);
    engine.setSectionMetrics("main", { contentWidth: 400, viewportWidth: 200 });
    expect(engine.getSectionScrollLeft("main")).toBe(200);
  });

  it("moves x with a horizontal touch drag", () => {
    const { header, body, engine } = mountPair();
    let now = 1_000;
    vi.spyOn(performance, "now").mockImplementation(() => now);

    fireTouch(body, "touchstart", 200, 10);
    now += 16;
    fireTouch(body, "touchmove", 140, 10);
    now += 16;
    fireTouch(body, "touchmove", 80, 10);
    expect(engine.getSectionScrollLeft("main")).toBe(120);
    expect(layerOf(header).style.transform).toBe("translate3d(-120px, 0px, 0px)");
    expect(layerOf(body).style.transform).toBe("translate3d(-120px, 0px, 0px)");
  });

  it("does not move past the last column on a touch drag", () => {
    const { body, engine } = mountPair();
    let now = 1_000;
    vi.spyOn(performance, "now").mockImplementation(() => now);

    engine.setSectionScrollLeft("main", 800);
    fireTouch(body, "touchstart", 200, 10);
    now += 16;
    fireTouch(body, "touchmove", 80, 10);
    expect(engine.getSectionScrollLeft("main")).toBe(800);
  });
});

describe("getHorizontalScrollViewport", () => {
  it("tracks cells on the section pane even when they live in the slide layer", () => {
    const section = document.createElement("div");
    section.className = "st-body-main";
    document.body.appendChild(section);
    const layer = ensureHorizontalScrollLayer(section);
    const cell = document.createElement("div");

    expect(getHorizontalScrollViewport(layer)).toBe(section);
    expect(getHorizontalScrollViewport(section)).toBe(section);

    getRenderedCells(layer).set("c1", cell);
    expect(getRenderedCells(section).get("c1")).toBe(cell);

    section.remove();
  });
});
