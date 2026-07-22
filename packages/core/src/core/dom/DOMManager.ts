import { getColumnEditorStripWidth } from "../../consts/general-consts";
import { SimpleTableConfig } from "../../types/SimpleTableConfig";

export interface DOMElements {
  rootElement: HTMLElement;
  wrapperContainer: HTMLElement;
  contentWrapper: HTMLElement;
  content: HTMLElement;
  headerContainer: HTMLElement;
  bodyContainer: HTMLElement;
  footerContainer: HTMLElement;
  ariaLiveRegion: HTMLElement;
}

export interface DOMRefs {
  mainBodyRef: { current: HTMLDivElement | null };
  pinnedLeftRef: { current: HTMLDivElement | null };
  pinnedRightRef: { current: HTMLDivElement | null };
  mainHeaderRef: { current: HTMLDivElement | null };
  pinnedLeftHeaderRef: { current: HTMLDivElement | null };
  pinnedRightHeaderRef: { current: HTMLDivElement | null };
  headerContainerRef: { current: HTMLDivElement | null };
  tableBodyContainerRef: { current: HTMLDivElement | null };
  horizontalScrollbarRef: { current: HTMLElement | null };
}

export class DOMManager {
  private elements: DOMElements | null = null;
  private refs: DOMRefs;

  constructor() {
    this.refs = {
      mainBodyRef: { current: null },
      pinnedLeftRef: { current: null },
      pinnedRightRef: { current: null },
      mainHeaderRef: { current: null },
      pinnedLeftHeaderRef: { current: null },
      pinnedRightHeaderRef: { current: null },
      headerContainerRef: { current: null },
      tableBodyContainerRef: { current: null },
      horizontalScrollbarRef: { current: null },
    };
  }

  createDOMStructure(container: HTMLElement, config: SimpleTableConfig): DOMElements {
    const theme = config.theme ?? "modern-light";
    const className = config.className ?? "";
    const columnBorders = config.columnBorders ?? false;

    const rootElement = document.createElement("div");
    rootElement.className = `simple-table-root st-wrapper theme-${theme} ${className} ${
      columnBorders ? "st-column-borders" : ""
    }`;

    const wrapperContainer = document.createElement("div");
    wrapperContainer.className = "st-wrapper-container";

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "st-content-wrapper";

    const content = document.createElement("div");
    content.className = "st-content";
    // The grid role lives on `.st-content` (the element that directly wraps the
    // header + body) rather than the root. This keeps the screen-reader live
    // region (a sibling of the content wrapper) OUTSIDE the grid, so it is not
    // reported as a disallowed grid child, and ensures the element carrying
    // `aria-rowcount`/`aria-colcount` is a valid grid container.
    // Row-grouped data is a hierarchy of expandable rows, which is the
    // `treegrid` pattern (rows carry aria-level/posinset/setsize/expanded);
    // a flat table stays a plain `grid`.
    const isTreeGrid = Array.isArray(config.rowGrouping) && config.rowGrouping.length > 0;
    content.setAttribute("role", isTreeGrid ? "treegrid" : "grid");
    // Match RenderOrchestrator so DimensionManager's first clientWidth read (before any render)
    // already excludes the column editor strip when the toggle is visible.
    const editorStripWidth = getColumnEditorStripWidth(
      config.enableColumnEditor,
      config.columnEditorConfig?.showToggle,
    );
    content.style.width =
      editorStripWidth > 0 ? `calc(100% - ${editorStripWidth}px)` : "100%";

    const headerContainer = document.createElement("div");
    headerContainer.className = "st-header-container";
    // The header/body containers are the grid's two row groups (like
    // thead/tbody). The actual section elements inside them (pinned-left /
    // main / pinned-right) are visual-only and carry no role, so the row
    // elements they hold resolve up to this rowgroup.
    headerContainer.setAttribute("role", "rowgroup");
    this.refs.headerContainerRef.current = headerContainer as HTMLDivElement;

    const bodyContainer = document.createElement("div");
    bodyContainer.className = "st-body-container";
    bodyContainer.setAttribute("role", "rowgroup");
    // The body container is the vertical scroll region. Make it keyboard
    // focusable so keyboard-only and Safari users can scroll it without a
    // pointer (WCAG 2.1.1; axe `scrollable-region-focusable`). A focusable
    // `rowgroup` is a valid grid child (unlike a focusable generic div), so
    // this does not introduce an `aria-required-children` violation.
    bodyContainer.setAttribute("tabindex", "0");
    this.refs.tableBodyContainerRef.current = bodyContainer as HTMLDivElement;

    const footerContainer = document.createElement("div");
    footerContainer.id = "st-footer-container";

    const footerAtTop = config.footerPosition === "top";
    if (footerAtTop) {
      rootElement.classList.add("st-footer-position-top");
    }

    const ariaLiveRegion = document.createElement("div");
    ariaLiveRegion.setAttribute("aria-live", "polite");
    ariaLiveRegion.setAttribute("aria-atomic", "true");
    ariaLiveRegion.className = "st-sr-only";

    content.appendChild(headerContainer);
    content.appendChild(bodyContainer);

    contentWrapper.appendChild(content);

    if (footerAtTop) {
      wrapperContainer.appendChild(footerContainer);
      wrapperContainer.appendChild(contentWrapper);
    } else {
      wrapperContainer.appendChild(contentWrapper);
      wrapperContainer.appendChild(footerContainer);
    }

    rootElement.appendChild(wrapperContainer);
    rootElement.appendChild(ariaLiveRegion);

    container.appendChild(rootElement);

    this.elements = {
      rootElement,
      wrapperContainer,
      contentWrapper,
      content,
      headerContainer,
      bodyContainer,
      footerContainer,
      ariaLiveRegion,
    };

    return this.elements;
  }

  updateTheme(theme: string): void {
    if (!this.elements) return;
    const root = this.elements.rootElement;
    const classes = root.className.replace(/\btheme-\S+/g, "").trim();
    root.className = `${classes} theme-${theme}`;
  }

  /** Reorders footer vs content when `footerPosition` changes after mount. */
  syncFooterPosition(footerPosition: SimpleTableConfig["footerPosition"]): void {
    if (!this.elements) return;

    const { rootElement, wrapperContainer, contentWrapper, footerContainer } = this.elements;
    const atTop = footerPosition === "top";
    rootElement.classList.toggle("st-footer-position-top", atTop);

    const scrollbar = wrapperContainer.querySelector(".st-horizontal-scrollbar-container");

    if (atTop) {
      if (footerContainer !== wrapperContainer.firstElementChild) {
        wrapperContainer.insertBefore(footerContainer, contentWrapper);
      }
      if (scrollbar) {
        wrapperContainer.appendChild(scrollbar);
      }
      return;
    }

    if (scrollbar && scrollbar.parentElement === wrapperContainer) {
      wrapperContainer.insertBefore(footerContainer, scrollbar);
    } else if (footerContainer !== wrapperContainer.lastElementChild) {
      wrapperContainer.appendChild(footerContainer);
    }
  }

  getElements(): DOMElements | null {
    return this.elements;
  }

  getRefs(): DOMRefs {
    return this.refs;
  }

  destroy(container: HTMLElement): void {
    if (this.elements?.rootElement && container.contains(this.elements.rootElement)) {
      container.removeChild(this.elements.rootElement);
    }
    this.elements = null;
  }
}
