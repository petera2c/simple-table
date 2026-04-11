"use client";

import { faCode } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ExpandableSection from "./ExpandableSection";
import ConfigurableSidebar from "./ConfigurableSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { docSections, getSubsectionIconMap } from "@/constants/docsNavigation";
import DocsSearch from "./DocsSearch";

// Get icons mapping from shared config
const subsectionIcons = getSubsectionIconMap();

export default function DocsSidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Initialize expanded sections
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};

    docSections.forEach((section) => {
      initialExpandedState[section.id] = true;
    });

    setExpandedSections(initialExpandedState);
  }, [pathname]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Search bar in header (non-scrolling)
  const docsHeaderContent = <DocsSearch placeholder="Search docs..." />;

  // Scrollable sidebar content
  const docsSidebarContent = (
    <div>
      {docSections.map((section, index) => (
        <ExpandableSection
          key={index}
          title={section.label}
          icon={section.icon}
          expanded={expandedSections[section.id] || false}
          onToggle={() => toggleSection(section.id)}
        >
          <ul className="space-y-1">
            {section.subsections.map((subsection, index) => (
              <li key={index}>
                <Link
                  href={subsection.path}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
                    pathname === subsection.path
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {subsectionIcons[subsection.id] && (
                    <FontAwesomeIcon
                      icon={subsectionIcons[subsection.id]}
                      className="w-3.5 h-3.5"
                    />
                  )}
                  {subsection.label}
                </Link>
              </li>
            ))}
          </ul>
        </ExpandableSection>
      ))}
    </div>
  );

  return (
    <ConfigurableSidebar
      config={{
        title: "Documentation",
        icon: faCode,
        headerContent: docsHeaderContent,
        sidebarContent: docsSidebarContent,
      }}
    />
  );
}
