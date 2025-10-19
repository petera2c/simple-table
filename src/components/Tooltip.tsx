import React, { ReactNode, useState, useRef, useEffect, cloneElement, isValidElement } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  delay?: number; // Delay before showing tooltip in milliseconds
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, delay = 500 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current && content.trim()) {
        const rect = triggerRef.current.getBoundingClientRect();

        // Only show tooltip if element is visible and has dimensions
        if (rect.width > 0 && rect.height > 0) {
          const tooltipWidth = 200; // Approximate width
          const tooltipHeight = 40; // Approximate height

          // Position tooltip below the element, centered
          let left = rect.left + rect.width / 2 - tooltipWidth / 2;
          let top = rect.bottom + 8;

          // Adjust if tooltip goes off screen horizontally
          if (left < 8) {
            left = 8;
          } else if (left + tooltipWidth > window.innerWidth - 8) {
            left = window.innerWidth - tooltipWidth - 8;
          }

          // If tooltip would go below viewport, show it above instead
          if (top + tooltipHeight > window.innerHeight - 8) {
            top = rect.top - tooltipHeight - 8;
          }

          setPosition({ top, left });
          setIsVisible(true);
        }
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content || !isValidElement(children)) {
    return <>{children}</>;
  }

  // Clone the child element and add mouse events and ref
  const childWithProps = cloneElement(children as React.ReactElement<any>, {
    ref: triggerRef,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
  });

  return (
    <>
      {childWithProps}
      {isVisible && (
        <div
          className="st-tooltip"
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 10000,
          }}
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip;
