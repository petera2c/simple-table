import type { HorizontalScrollEngine } from "./HorizontalScrollEngine";
import type { SectionId } from "./types";

const enginesByRoot = new WeakMap<HTMLElement, HorizontalScrollEngine>();

export const bindHorizontalScrollEngine = (
  root: HTMLElement,
  engine: HorizontalScrollEngine,
): void => {
  enginesByRoot.set(root, engine);
};

export const unbindHorizontalScrollEngine = (root: HTMLElement): void => {
  enginesByRoot.delete(root);
};

export const findHorizontalScrollEngine = (
  from: Element | null | undefined,
): HorizontalScrollEngine | null => {
  const root = from instanceof Element ? from.closest(".simple-table-root") : null;
  return root instanceof HTMLElement ? (enginesByRoot.get(root) ?? null) : null;
};

export const sectionIdFromPane = (pane: HTMLElement): SectionId => {
  const cls = pane.className;
  if (cls.includes("pinned-left") || cls.includes("scrollbar-left")) return "pinned-left";
  if (cls.includes("pinned-right") || cls.includes("scrollbar-right")) return "pinned-right";
  return "main";
};

export const readPaneScrollX = (pane: HTMLElement | null | undefined): number => {
  if (!pane) return 0;
  const raw = pane.dataset.stScrollX;
  if (raw != null && raw !== "") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  const engine = findHorizontalScrollEngine(pane);
  return engine ? engine.getSectionScrollLeft(sectionIdFromPane(pane)) : 0;
};

export const writePaneScrollX = (
  rootOrPane: HTMLElement,
  sectionId: SectionId,
  x: number,
): void => {
  const root = rootOrPane.classList.contains("simple-table-root")
    ? rootOrPane
    : (rootOrPane.querySelector(".simple-table-root") ??
      rootOrPane.closest(".simple-table-root"));
  const engine =
    root instanceof HTMLElement
      ? (enginesByRoot.get(root) ?? findHorizontalScrollEngine(rootOrPane))
      : findHorizontalScrollEngine(rootOrPane);
  engine?.setSectionScrollLeft(sectionId, x);
};
