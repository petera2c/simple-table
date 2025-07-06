import React, { useState, useCallback, useMemo } from "react";
import { SectionedListViewItem, SectionedSortListProps } from "./types";
import { useFlipAnimation } from "./use-flip-animation";
import { easingFunctions } from "./animation-utils";
import "./sort-list.css";

export const SectionedSortList: React.FC<SectionedSortListProps> = ({
  items,
  animationConfig = {},
  className = "",
  itemClassName = "",
  sectionClassName = "",
}) => {
  const [currentItems, setCurrentItems] = useState<SectionedListViewItem[]>(items);

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

  // Setup FLIP animation hook - we'll use a flattened structure for animation
  const flattenedItems = useMemo(() => {
    return currentItems.flatMap((item) =>
      item.sections.map((section) => ({
        id: `${item.id}-${section.id}`,
        content: section.content,
        data: { itemId: item.id, sectionId: section.id },
      }))
    );
  }, [currentItems]);

  const { containerRef, captureFirst, isAnimating, triggerFlipAnimation } = useFlipAnimation(
    flattenedItems,
    {
      animationOptions: defaultAnimationConfig,
    }
  );

  // Update items when props change
  React.useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  // Shuffle items function
  const handleShuffleItems = useCallback(() => {
    if (isAnimating) return;

    // Fisher-Yates shuffle algorithm for items
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

  // Shuffle sections within items function
  const handleShuffleSections = useCallback(() => {
    if (isAnimating) return;

    const shuffledItems = currentItems.map((item) => {
      // Fisher-Yates shuffle for sections within each item
      const shuffledSections = [...item.sections];
      for (let i = shuffledSections.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSections[i], shuffledSections[j]] = [shuffledSections[j], shuffledSections[i]];
      }

      return {
        ...item,
        sections: shuffledSections,
      };
    });

    // Manually trigger the FLIP animation sequence
    captureFirst();
    setCurrentItems(shuffledItems);
    triggerFlipAnimation();
  }, [currentItems, captureFirst, isAnimating, triggerFlipAnimation]);

  return (
    <div className={`sort-list ${className}`}>
      <div className="sort-controls">
        <button onClick={handleShuffleItems} disabled={isAnimating} className="sort-button">
          Shuffle Items 🔀
        </button>
        <button onClick={handleShuffleSections} disabled={isAnimating} className="sort-button">
          Shuffle Sections 🎯
        </button>
      </div>

      <div ref={containerRef} className="sort-list-container">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className={`sort-list-item sectioned-item ${itemClassName} ${item.className || ""}`}
          >
            <div className="item-sections">
              {item.sections.map((section) => (
                <div
                  key={section.id}
                  data-flip-id={`${item.id}-${section.id}`}
                  className={`item-section ${sectionClassName} ${section.className || ""}`}
                >
                  {section.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionedSortList;
