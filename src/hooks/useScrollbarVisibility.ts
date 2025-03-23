import { RefObject, useEffect, useState } from "react";

const useScrollbarVisibility = ({
  headerContainerRef,
  mainSectionRef,
  pinned,
}: {
  headerContainerRef?: RefObject<HTMLElement | null>;
  mainSectionRef?: RefObject<HTMLElement | null>;
  pinned?: "left" | "right";
}) => {
  const [isMainSectionScrollable, setIsMainSectionScrollable] = useState(false);

  useEffect(() => {
    const headerContainer = headerContainerRef?.current;
    if (!isMainSectionScrollable || !headerContainer) {
      return;
    }

    headerContainer.classList.add("st-header-scroll-padding");

    return () => {
      headerContainer.classList.remove("st-header-scroll-padding");
    };
  }, [headerContainerRef, isMainSectionScrollable]);

  useEffect(() => {
    const headerContainer = headerContainerRef?.current;
    const mainSection = mainSectionRef?.current;
    if (pinned || !mainSection || !headerContainer) {
      return;
    }

    const checkScrollability = () => {
      if (mainSection) {
        const hasHorizontalScroll = mainSection.scrollWidth > mainSection.clientWidth;
        setIsMainSectionScrollable(hasHorizontalScroll);
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
  }, [headerContainerRef, mainSectionRef, pinned]);
};

export default useScrollbarVisibility;
