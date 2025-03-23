import { RefObject, useEffect } from "react";

const useWidthSync = (ref: RefObject<HTMLElement | null>, callback: (width: number) => void) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => {
      callback(element?.scrollWidth || 0);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [callback, ref]);
};

export default useWidthSync;
