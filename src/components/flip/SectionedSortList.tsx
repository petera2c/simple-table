import React, { useState, useCallback } from "react";
import { SectionedListViewItem, SectionedSortListProps } from "./types";
import { Animate } from "./Animate";
import "./sort-list.css";

export const SectionedSortList: React.FC<SectionedSortListProps> = ({
  items,
  animationConfig = {},
  className = "",
  itemClassName = "",
  sectionClassName = "",
}) => {
  const [currentItems, setCurrentItems] = useState<SectionedListViewItem[]>(items);
  const [isShuffling, setIsShuffling] = useState(false);

  // Update items when props change
  React.useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  // Shuffle items function
  const handleShuffleItems = useCallback(() => {
    if (isShuffling) return;

    setIsShuffling(true);

    // Fisher-Yates shuffle algorithm for items
    const shuffled = [...currentItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setCurrentItems(shuffled);

    // Reset shuffling state after animation completes
    setTimeout(() => setIsShuffling(false), (animationConfig.duration || 300) + 50);
  }, [currentItems, isShuffling, animationConfig.duration]);

  // Shuffle sections within items function
  const handleShuffleSections = useCallback(() => {
    if (isShuffling) return;

    setIsShuffling(true);

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

    setCurrentItems(shuffledItems);

    // Reset shuffling state after animation completes
    setTimeout(() => setIsShuffling(false), (animationConfig.duration || 300) + 50);
  }, [currentItems, isShuffling, animationConfig.duration]);

  return (
    <div className={`sort-list ${className}`}>
      <div className="sort-controls">
        <button onClick={handleShuffleItems} disabled={isShuffling} className="sort-button">
          Shuffle Items 🔀
        </button>
        <button onClick={handleShuffleSections} disabled={isShuffling} className="sort-button">
          Shuffle Sections 🎯
        </button>
      </div>

      <div className="sort-list-container">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className={`sort-list-item sectioned-item ${itemClassName} ${item.className || ""}`}
          >
            <div className="item-sections">
              {item.sections.map((section) => (
                <Animate
                  key={section.id}
                  id={`${item.id}-${section.id}`}
                  animationConfig={animationConfig}
                  className={`item-section ${sectionClassName} ${section.className || ""}`}
                >
                  {section.content}
                </Animate>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionedSortList;
