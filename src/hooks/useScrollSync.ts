import { RefObject, useEffect } from "react";

const useScrollSync = (
  sourceRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    if (!sourceRef.current) return;

    const sourceElement = sourceRef.current;

    const handleScroll = () => {
      const scrollLeft = sourceElement?.scrollLeft;

      // Set the scrollLeft to the target element
      if (scrollLeft !== undefined) {
        targetRef.current?.scrollTo(scrollLeft, 0);
      }
    };

    sourceElement.addEventListener("scroll", handleScroll);

    return () => {
      sourceElement?.removeEventListener("scroll", handleScroll);
    };
  }, [sourceRef, targetRef]);
};

export default useScrollSync;
