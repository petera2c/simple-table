import { RefObject, useEffect, useState } from "react";

const useScrollbarVisibility = ({
  headerContainerRef,
  mainSectionRef,
  scrollbarHorizontalRef,
}: {
  headerContainerRef?: RefObject<HTMLElement | null>;
  mainSectionRef?: RefObject<HTMLElement | null>;
  scrollbarHorizontalRef?: RefObject<HTMLElement | null>;
}) => {
  const [isMainSectionScrollable, setIsMainSectionScrollable] = useState(false);

  useEffect(() => {
    const headerContainer = headerContainerRef?.current;
    const scrollbarHorizontal = scrollbarHorizontalRef?.current;
    if (!isMainSectionScrollable || !headerContainer) {
      return;
    }

    headerContainer.classList.add("st-header-scroll-padding");
    scrollbarHorizontal?.classList.add("st-header-scroll-padding");

    return () => {
      headerContainer.classList.remove("st-header-scroll-padding");
      scrollbarHorizontal?.classList.remove("st-header-scroll-padding");
    };
  }, [headerContainerRef, isMainSectionScrollable, scrollbarHorizontalRef]);

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
