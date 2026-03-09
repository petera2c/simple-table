export interface CreateDropdownOptions {
  children: HTMLElement;
  containerRef?: HTMLElement;
  mainBodyRef?: HTMLElement;
  onClose: () => void;
  open: boolean;
  overflow?: "auto" | "visible" | "hidden";
  width?: number;
  positioning?: "fixed" | "absolute";
}

export const createDropdown = (options: CreateDropdownOptions) => {
  let {
    children,
    containerRef,
    mainBodyRef,
    onClose,
    open,
    overflow = "auto",
    width,
    positioning = "fixed",
  } = options;

  const dropdownElement = document.createElement("div");
  dropdownElement.className = "st-dropdown-content";
  dropdownElement.style.position = positioning;
  dropdownElement.style.overflow = overflow;
  if (width) {
    dropdownElement.style.width = `${width}px`;
  }

  dropdownElement.addEventListener("click", (e) => e.stopPropagation());
  dropdownElement.addEventListener("mousedown", (e) => e.stopPropagation());
  dropdownElement.addEventListener("touchstart", (e) => e.stopPropagation());

  dropdownElement.appendChild(children);

  let triggerElement: HTMLElement | null = null;

  const calculatePosition = () => {
    if (!open || !dropdownElement.parentElement) return;

    dropdownElement.style.visibility = "hidden";

    if (!triggerElement) {
      triggerElement = dropdownElement.parentElement;
    }

    requestAnimationFrame(() => {
      if (!triggerElement) return;

      const triggerRect = triggerElement.getBoundingClientRect();
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

      const spaceBottom = containerRect.bottom - triggerRect.bottom;
      const spaceTop = triggerRect.top - containerRect.top;
      const spaceRight = containerRect.right - triggerRect.right;

      let verticalPosition = "bottom";
      if (dropdownHeight > spaceBottom && dropdownHeight <= spaceTop) {
        verticalPosition = "top";
      } else if (dropdownHeight > spaceBottom && spaceTop > spaceBottom) {
        verticalPosition = "top";
      }

      let horizontalPosition = "left";
      if (dropdownWidth > spaceRight + triggerRect.width) {
        horizontalPosition = "right";
      }

      if (positioning === "fixed") {
        if (verticalPosition === "bottom") {
          dropdownElement.style.top = `${triggerRect.bottom + 4}px`;
          dropdownElement.style.bottom = "auto";
        } else {
          dropdownElement.style.bottom = `${window.innerHeight - triggerRect.top + 4}px`;
          dropdownElement.style.top = "auto";
        }

        if (horizontalPosition === "left") {
          dropdownElement.style.left = `${triggerRect.left}px`;
          dropdownElement.style.right = "auto";
        } else {
          dropdownElement.style.right = `${window.innerWidth - triggerRect.right}px`;
          dropdownElement.style.left = "auto";
        }
      } else {
        if (verticalPosition === "bottom") {
          dropdownElement.style.top = `${triggerRect.height + 4}px`;
          dropdownElement.style.bottom = "auto";
        } else {
          dropdownElement.style.bottom = `${triggerRect.height + 4}px`;
          dropdownElement.style.top = "auto";
        }

        if (horizontalPosition === "left") {
          dropdownElement.style.left = "0";
          dropdownElement.style.right = "auto";
        } else {
          dropdownElement.style.right = "0";
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
    if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
      const parentElement = dropdownElement.parentElement;
      if (parentElement && !parentElement.contains(event.target as Node)) {
        setOpen(false);
        onClose?.();
      }
    }
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
