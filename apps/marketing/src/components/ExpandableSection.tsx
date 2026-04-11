import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ExpandableSectionProps {
  title: string;
  icon?: IconDefinition;
  expanded: boolean;
  onToggle: () => void;
  iconClassName?: string;
  children: React.ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  icon,
  expanded,
  onToggle,
  iconClassName = "text-blue-600",
  children,
}) => {
  return (
    <div className="py-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 text-left text-gray-800 dark:text-gray-200 font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className={`${iconClassName} w-4 h-4 dark:text-blue-400`}
            />
          )}
          <span className="text-base">{title}</span>
        </span>
        <FontAwesomeIcon
          icon={expanded ? faChevronDown : faChevronRight}
          className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            expanded ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="mt-3 pt-1 ml-2 pl-4 pr-1 border-l-2 border-blue-100 dark:border-blue-900">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
