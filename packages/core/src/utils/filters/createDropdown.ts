/**
 * Filter / filter-UI dropdown positioning (React-era parity):
 * - Fixed: portaled under `.simple-table-root`, anchored to `anchorElement` (e.g. filter icon) so
 *   `overflow: hidden` on `.st-header-cell` does not clip the panel. Same top/left +4px and
 *   container-based flip as legacy React Dropdown.tsx.
 * - Absolute: stays under caller’s parent (e.g. `.st-custom-select`); use `anchorElement` for the
 *   trigger rect vs `position: relative` parent (React CustomSelect pattern).
 */

export interface CreateDropdownOptions {
  children: HTMLElement;
  containerRef?: HTMLElement;
  mainBodyRef?: HTMLElement;
  /** Rect used for placement. Required for fixed portaling (e.g. filter icon); for absolute, pass the real trigger (button/input) when it differs from the dropdown parent. */
  anchorElement?: HTMLElement;
  onClose: () => void;
  open: boolean;
  overflow?: "auto" | "visible" | "hidden";
  width?: number;
  maxWidth?: number;
  positioning?: "fixed" | "absolute";
}

const resolveTableRoot = (el?: HTMLElement | null): HTMLElement | null =>
  el?.closest(".simple-table-root") ?? null;

export const createDropdown = (options: CreateDropdownOptions) => {
  let {
    children,
    containerRef,
    mainBodyRef,
    anchorElement: anchorOption,
    onClose,
    open,
    overflow = "auto",
    width,
    maxWidth,
    positioning = "fixed",
  } = options;

  const dropdownElement = document.createElement("div");
  dropdownElement.className = "st-dropdown-content";
  dropdownElement.style.position = positioning;
  dropdownElement.style.overflow = overflow;
  if (width) {
    dropdownElement.style.width = `${width}px`;
  }
  if (maxWidth) {
    dropdownElement.style.maxWidth = `${maxWidth}px`;
  }

  dropdownElement.addEventListener("click", (e) => e.stopPropagation());
  dropdownElement.addEventListener("mousedown", (e) => e.stopPropagation());
  dropdownElement.addEventListener("touchstart", (e) => e.stopPropagation());

  dropdownElement.appendChild(children);

  let anchorElement: HTMLElement | undefined = anchorOption;

  if (positioning === "fixed") {
    const root =
      resolveTableRoot(anchorElement) ??
      resolveTableRoot(mainBodyRef ?? null) ??
      resolveTableRoot(containerRef ?? null) ??
      (document.querySelector(".simple-table-root") as HTMLElement | null);
    (root ?? document.body).appendChild(dropdownElement);
  }

  const effectiveAnchor = (): HTMLElement | null => {
    if (anchorElement) return anchorElement;
    return dropdownElement.parentElement;
  };

  const calculatePosition = () => {
    if (!open) return;
    if (positioning === "absolute" && !dropdownElement.parentElement) return;
    if (positioning === "fixed" && !dropdownElement.parentElement) return;

    dropdownElement.style.visibility = "hidden";

    const anchorEl = effectiveAnchor();
    if (!anchorEl) return;

    requestAnimationFrame(() => {
      const anchorRect = anchorEl.getBoundingClientRect();
      const dropdownHeight = dropdownElement.offsetHeight;
      const dropdownWidth = width || dropdownElement.offsetWidth;

      let containerRect: DOMRect;

      if (containerRef) {
        containerRect = containerRef.getBoundingClientRect();
      } else if (mainBodyRef) {
        containerRect = mainBodyRef.getBoundingClientRect();
      } else {
        containerRect = {
          top: 0,
          right: window.innerWidth,
          bottom: window.innerHeight,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
          toJSON: () => {},
        } as DOMRect;
      }

      const spaceBottom = containerRect.bottom - anchorRect.bottom;
      const spaceTop = anchorRect.top - containerRect.top;
      const spaceRight = containerRect.right - anchorRect.right;

      let verticalPosition = "bottom";
      if (dropdownHeight > spaceBottom && dropdownHeight <= spaceTop) {
        verticalPosition = "top";
      } else if (dropdownHeight > spaceBottom && spaceTop > spaceBottom) {
        verticalPosition = "top";
      }

      let horizontalPosition = "left";
      if (dropdownWidth > spaceRight + anchorRect.width) {
        horizontalPosition = "right";
      }

      if (positioning === "fixed") {
        if (verticalPosition === "bottom") {
          dropdownElement.style.top = `${anchorRect.bottom + 4}px`;
          dropdownElement.style.bottom = "auto";
        } else {
          dropdownElement.style.bottom = `${window.innerHeight - anchorRect.top + 4}px`;
          dropdownElement.style.top = "auto";
        }

        if (horizontalPosition === "left") {
          dropdownElement.style.left = `${anchorRect.left}px`;
          dropdownElement.style.right = "auto";
        } else {
          dropdownElement.style.right = `${window.innerWidth - anchorRect.right}px`;
          dropdownElement.style.left = "auto";
        }
      } else {
        const positionParent = dropdownElement.parentElement;
        if (!positionParent) return;
        const pRect = positionParent.getBoundingClientRect();

        if (verticalPosition === "bottom") {
          dropdownElement.style.top = `${anchorRect.bottom - pRect.top + 4}px`;
          dropdownElement.style.bottom = "auto";
        } else {
          dropdownElement.style.bottom = `${pRect.bottom - anchorRect.top + 4}px`;
          dropdownElement.style.top = "auto";
        }

        if (horizontalPosition === "left") {
          dropdownElement.style.left = `${anchorRect.left - pRect.left}px`;
          dropdownElement.style.right = "auto";
        } else {
          dropdownElement.style.right = `${pRect.right - anchorRect.right}px`;
          dropdownElement.style.left = "auto";
        }
      }

      dropdownElement.className = `st-dropdown-content st-dropdown-${verticalPosition}-${horizontalPosition}`;
      dropdownElement.style.visibility = "visible";
    });
  };

  const handleScroll = (event: Event) => {
    if (!open) return;

    const target = event.target as Node;
    if (dropdownElement && !dropdownElement.contains(target)) {
      setOpen(false);
      onClose?.();
    }
  };

  const handleClickOutside = (event: MouseEvent | KeyboardEvent) => {
    const target = event.target as Node;
    if (dropdownElement.contains(target)) return;

    if (anchorElement?.contains(target)) return;

    if (positioning === "absolute") {
      const host = dropdownElement.parentElement;
      if (host?.contains(target)) return;
    }

    setOpen(false);
    onClose?.();
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      setOpen(false);
      onClose?.();
    }
  };

  const setOpen = (newOpen: boolean) => {
    open = newOpen;
    if (open) {
      dropdownElement.style.display = "flex";
      calculatePosition();
      window.addEventListener("scroll", handleScroll, true);
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("keydown", handleClickOutside, true);
      document.addEventListener("keydown", handleEscKey);
    } else {
      dropdownElement.style.display = "none";
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscKey);
    }
  };

  if (open) {
    setOpen(true);
  } else {
    dropdownElement.style.display = "none";
  }

  const update = (newOptions: Partial<CreateDropdownOptions>) => {
    if (newOptions.anchorElement !== undefined) {
      anchorElement = newOptions.anchorElement;
    }
    if (newOptions.open !== undefined) {
      setOpen(newOptions.open);
    }
    if (newOptions.children !== undefined) {
      dropdownElement.innerHTML = "";
      dropdownElement.appendChild(newOptions.children);
    }
    if (newOptions.width !== undefined) {
      width = newOptions.width;
      dropdownElement.style.width = width ? `${width}px` : "auto";
    }
    if (newOptions.maxWidth !== undefined) {
      maxWidth = newOptions.maxWidth;
      dropdownElement.style.maxWidth = maxWidth ? `${maxWidth}px` : "";
    }
    if (newOptions.overflow !== undefined) {
      overflow = newOptions.overflow;
      dropdownElement.style.overflow = overflow;
    }
  };

  const destroy = () => {
    setOpen(false);
    dropdownElement.remove();
  };

  return { element: dropdownElement, update, destroy, setOpen };
};
