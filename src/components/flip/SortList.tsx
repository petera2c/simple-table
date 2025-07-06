import React, { useState, useCallback, useMemo } from "react";
import { ListViewItem } from "./types";
import { useFlipAnimation } from "./use-flip-animation";
import { easingFunctions } from "./animation-utils";
import "./sort-list.css";

interface SortListProps {
  items: ListViewItem[];
  onItemClick?: (item: ListViewItem) => void;
  animationConfig?: {
    duration?: number;
    easing?: string;
    delay?: number;
  };
  className?: string;
  itemClassName?: string;
}

export const SortList: React.FC<SortListProps> = ({
  items,
  onItemClick,
  animationConfig = {},
  className = "",
  itemClassName = "",
}) => {
  const [currentItems, setCurrentItems] = useState<ListViewItem[]>(items);

  // Default animation configuration
  const defaultAnimationConfig = useMemo(
    () => ({
      duration: 300,
      easing: easingFunctions.easeOutQuad,
      delay: 0,
      ...animationConfig,
    }),
    [animationConfig]
  );

  // Setup FLIP animation hook
  const { containerRef, captureFirst, isAnimating, triggerFlipAnimation } = useFlipAnimation(
    currentItems,
    {
      animationOptions: defaultAnimationConfig,
    }
  );

  // Update items when props change
  React.useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  // Shuffle function
  const handleShuffle = useCallback(() => {
    if (isAnimating) return;

    // Fisher-Yates shuffle algorithm
    const shuffled = [...currentItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Manually trigger the FLIP animation sequence
    captureFirst();
    setCurrentItems(shuffled);
    triggerFlipAnimation();
  }, [currentItems, captureFirst, isAnimating, triggerFlipAnimation]);

  const handleItemClick = useCallback(
    (item: ListViewItem) => {
      if (onItemClick && !isAnimating) {
        onItemClick(item);
      }
    },
    [onItemClick, isAnimating]
  );

  return (
    <div className={`sort-list ${className}`}>
      <div className="sort-controls">
        <button onClick={handleShuffle} disabled={isAnimating} className="sort-button">
          Shuffle 🔀
        </button>
      </div>

      <div ref={containerRef} className="sort-list-container">
        {currentItems.map((item) => (
          <div
            key={item.id}
            data-flip-id={item.id}
            className={`sort-list-item ${itemClassName}`}
            onClick={() => handleItemClick(item)}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortList;
