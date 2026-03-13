export type SectionId = "pinned-left" | "main" | "pinned-right";
export type SectionPaneRole = "sticky" | "scrollbar" | "header" | "body";

interface RegisteredPane {
  element: HTMLElement;
  role: SectionPaneRole;
}

export interface SectionScrollControllerConfig {
  onMainSectionScrollLeft?: (scrollLeft: number) => void;
}

/**
 * Single controller for horizontal scroll sync across all four panes per section:
 * sticky parent, horizontal scrollbar segment, header, and body.
 * Scrolling any one pane updates the other three in that section.
 * All four panes must have the same scroll width (enforced by renderers).
 */
export class SectionScrollController {
  private scrollLeftBySection: Record<SectionId, number> = {
    "pinned-left": 0,
    main: 0,
    "pinned-right": 0,
  };
  private panesBySection: Map<SectionId, Set<RegisteredPane>> = new Map([
    ["pinned-left", new Set<RegisteredPane>()],
    ["main", new Set<RegisteredPane>()],
    ["pinned-right", new Set<RegisteredPane>()],
  ]);
  private scrollHandlers: WeakMap<HTMLElement, () => void> = new WeakMap();
  private config: SectionScrollControllerConfig;
  /** Guard to avoid re-entrancy when we programmatically set scrollLeft on other panes */
  private isSyncing = false;

  constructor(config: SectionScrollControllerConfig = {}) {
    this.config = config;
  }

  updateConfig(config: Partial<SectionScrollControllerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Register a pane (sticky, scrollbar, header, or body) for a section.
   * When any registered pane scrolls, the others in the same section are updated.
   * If a pane with the same role was already registered (e.g. after re-render), it is replaced.
   */
  registerPane(sectionId: SectionId, element: HTMLElement, role: SectionPaneRole): void {
    const panes = this.panesBySection.get(sectionId)!;
    const existingSameElement = Array.from(panes).find((p) => p.element === element);
    if (existingSameElement) return;

    const existingSameRole = Array.from(panes).find((p) => p.role === role);
    if (existingSameRole) {
      this.removeScrollListener(existingSameRole.element);
      panes.delete(existingSameRole);
    }

    panes.add({ element, role });
    this.addScrollListener(sectionId, element);
    // Sync new pane to current section scroll position (e.g. when scrollbar is created after header/body)
    const current = this.scrollLeftBySection[sectionId] ?? 0;
    if (element.scrollLeft !== current) {
      this.isSyncing = true;
      element.scrollLeft = current;
      this.isSyncing = false;
    }
  }

  /**
   * Unregister a pane (e.g. when section is removed or re-created).
   */
  unregisterPane(sectionId: SectionId, element: HTMLElement): void {
    const panes = this.panesBySection.get(sectionId);
    if (!panes) return;

    this.removeScrollListener(element);
    const toRemove = Array.from(panes).find((p) => p.element === element);
    if (toRemove) panes.delete(toRemove);
  }

  /**
   * Unregister all panes for a section (e.g. on cleanup).
   */
  unregisterSection(sectionId: SectionId): void {
    const panes = this.panesBySection.get(sectionId);
    if (!panes) return;

    panes.forEach(({ element }) => this.removeScrollListener(element));
    panes.clear();
  }

  /**
   * Set scroll position for a section. Updates state and all registered panes.
   * Used when a pane fires scroll and when restoring after render.
   */
  setSectionScrollLeft(sectionId: SectionId, value: number): void {
    this.scrollLeftBySection[sectionId] = value;
    const panes = this.panesBySection.get(sectionId);
    if (!panes) return;

    panes.forEach(({ element }) => {
      if (element.scrollLeft !== value) {
        element.scrollLeft = value;
      }
    });

    if (sectionId === "main" && this.config.onMainSectionScrollLeft) {
      this.config.onMainSectionScrollLeft(value);
    }
  }

  getSectionScrollLeft(sectionId: SectionId): number {
    return this.scrollLeftBySection[sectionId] ?? 0;
  }

  /**
   * Restore scroll position to all registered panes from stored state (e.g. after render).
   */
  restoreAll(): void {
    (["pinned-left", "main", "pinned-right"] as SectionId[]).forEach((sectionId) => {
      const value = this.scrollLeftBySection[sectionId] ?? 0;
      this.isSyncing = true;
      this.setSectionScrollLeft(sectionId, value);
      this.isSyncing = false;
    });
  }

  private addScrollListener(sectionId: SectionId, element: HTMLElement): void {
    this.removeScrollListener(element);
    const handler = () => {
      if (this.isSyncing) return;
      const value = element.scrollLeft;
      this.scrollLeftBySection[sectionId] = value;
      this.isSyncing = true;

      const panes = this.panesBySection.get(sectionId);
      if (panes) {
        panes.forEach(({ element: paneEl }) => {
          if (paneEl !== element && paneEl.scrollLeft !== value) {
            paneEl.scrollLeft = value;
          }
        });
      }
      if (sectionId === "main" && this.config.onMainSectionScrollLeft) {
        this.config.onMainSectionScrollLeft(value);
      }

      this.isSyncing = false;
    };
    this.scrollHandlers.set(element, handler);
    element.addEventListener("scroll", handler, { passive: true });
  }

  private removeScrollListener(element: HTMLElement): void {
    const handler = this.scrollHandlers.get(element);
    if (handler) {
      element.removeEventListener("scroll", handler);
      this.scrollHandlers.delete(element);
    }
  }

  destroy(): void {
    (["pinned-left", "main", "pinned-right"] as SectionId[]).forEach((sectionId) =>
      this.unregisterSection(sectionId),
    );
  }
}
