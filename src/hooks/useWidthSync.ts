import { RefObject, useEffect } from "react";

const useWidthSync = ({
  callback,
  ref,
  widthAttribute,
}: {
  callback: (width: number) => void;
  ref: RefObject<HTMLElement | null>;
  widthAttribute: "offsetWidth" | "scrollWidth";
}) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => {
      callback(element[widthAttribute] || 0);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [callback, ref, widthAttribute]);
};

export default useWidthSync;
