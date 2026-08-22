"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useIsMobile } from "../hooks/useIsMobile";

export interface SidebarConfig {
  title: string;
  icon?: IconDefinition;
  headerContent?: React.ReactNode; // Content below the title (e.g., search bar)
  sidebarContent: React.ReactNode;
  footerContent?: React.ReactNode;
  width?: string; // Optional width for the sidebar
}

interface ConfigurableSidebarProps {
  config: SidebarConfig;
  className?: string;
}

const ConfigurableSidebar: React.FC<ConfigurableSidebarProps> = ({ config, className = "" }) => {
  const isMobile = useIsMobile();
  const { title, icon, headerContent, sidebarContent, footerContent, width } = config;

  if (isMobile) return null;

  return (
    <div
      className={`shrink-0 sticky top-2 sm:top-3 md:top-4 mb-4 self-start h-[calc(100dvh-var(--header-height)-32px)] 
        text-ink flex flex-col border-r border-line pr-3
        overflow-visible z-1 ${width ? "" : "w-64"} ${className}`}
      style={width ? { width } : undefined}
    >
      <h2 className="text-xl font-bold mb-2 text-ink flex items-center gap-2 pt-3 px-3">
        {icon && <FontAwesomeIcon icon={icon} className="text-muted" />}
        {title}
      </h2>

      {headerContent && <div className="px-3 pb-3">{headerContent}</div>}

      <div className="overflow-y-auto overflow-x-visible grow px-2 pb-2">{sidebarContent}</div>

      {footerContent && (
        <div className="px-3 py-3 border-t border-line mt-auto">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default ConfigurableSidebar;
