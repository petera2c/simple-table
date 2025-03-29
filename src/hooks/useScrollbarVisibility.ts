import { RefObject, useEffect, useState } from "react";

const useScrollbarVisibility = ({
  headerContainerRef,
  mainSectionRef,
  scrollbarWidth,
}: {
  headerContainerRef?: RefObject<HTMLElement | null>;
  mainSectionRef?: RefObject<HTMLElement | null>;
  scrollbarWidth: number;
}) => {
  const [isMainSectionScrollable, setIsMainSectionScrollable] = useState(false);

  useEffect(() => {
    const headerContainer = headerContainerRef?.current;
    if (!isMainSectionScrollable || !headerContainer) {
      return;
    }

    headerContainer.classList.add("st-header-scroll-padding");

    // Change width of the ::after div to the scrollbarWidth
    headerContainer.style.setProperty("--st-after-width", `${scrollbarWidth}px`);

    return () => {
      headerContainer.classList.remove("st-header-scroll-padding");
    };
  }, [headerContainerRef, isMainSectionScrollable, scrollbarWidth]);

  useEffect(() => {
    const headerContainer = headerContainerRef?.current;
    const mainSection = mainSectionRef?.current;
    if (!mainSection || !headerContainer) {
      return;
    }

    const checkScrollability = () => {
      if (mainSection) {
        const hasVerticalScroll = mainSection.scrollHeight > mainSection.clientHeight;
        setIsMainSectionScrollable(hasVerticalScroll);
      }
    };

    // Check on initial render
    checkScrollability();

    // Set up a ResizeObserver to check when the content size changes
    const resizeObserver = new ResizeObserver(() => {
      checkScrollability();
    });

    resizeObserver.observe(mainSection);

    // Clean up
    return () => {
      if (mainSection) {
        resizeObserver.unobserve(mainSection);
      }
    };
  }, [headerContainerRef, mainSectionRef]);
};

export default useScrollbarVisibility;
