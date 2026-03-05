import { SimpleTableConfig } from "../../types/SimpleTableConfig";

export interface DOMElements {
  rootElement: HTMLElement;
  wrapperContainer: HTMLElement;
  contentWrapper: HTMLElement;
  content: HTMLElement;
  headerContainer: HTMLElement;
  bodyContainer: HTMLElement;
  footerContainer: HTMLElement;
  columnEditorContainer: HTMLElement;
  ariaLiveRegion: HTMLElement;
}

export interface DOMRefs {
  mainBodyRef: { current: HTMLDivElement | null };
  pinnedLeftRef: { current: HTMLDivElement | null };
  pinnedRightRef: { current: HTMLDivElement | null };
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
    rootElement.setAttribute("role", "grid");

    const wrapperContainer = document.createElement("div");
    wrapperContainer.className = "st-wrapper-container";

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "st-content-wrapper";

    const content = document.createElement("div");
    content.className = "st-content";

    const headerContainer = document.createElement("div");
    headerContainer.className = "st-header-container";
    this.refs.headerContainerRef.current = headerContainer as HTMLDivElement;

    const bodyContainer = document.createElement("div");
    bodyContainer.className = "st-body-container";
    this.refs.tableBodyContainerRef.current = bodyContainer as HTMLDivElement;

    const columnEditorContainer = document.createElement("div");
    columnEditorContainer.id = "st-column-editor-container";

    const footerContainer = document.createElement("div");
    footerContainer.id = "st-footer-container";

    const ariaLiveRegion = document.createElement("div");
    ariaLiveRegion.setAttribute("aria-live", "polite");
    ariaLiveRegion.setAttribute("aria-atomic", "true");
    ariaLiveRegion.className = "st-sr-only";

    content.appendChild(headerContainer);
    content.appendChild(bodyContainer);

    contentWrapper.appendChild(content);
    contentWrapper.appendChild(columnEditorContainer);

    wrapperContainer.appendChild(contentWrapper);
    wrapperContainer.appendChild(footerContainer);

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
      columnEditorContainer,
      ariaLiveRegion,
    };

    return this.elements;
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
