"use client";

import React from "react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`shrink-0 sticky top-[84px] my-6 self-start h-[calc(100dvh-84px-1.5rem)] 
        bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex flex-col rounded-xl 
        shadow-[4px_0_16px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_16px_rgba(0,0,0,0.3)] 
        p-1 overflow-visible z-[1] ${width ? "" : "w-64"} ${className}`}
      style={width ? { width } : undefined}
    >
      <h2 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400 flex items-center gap-2 pt-3 px-3">
        {icon && <FontAwesomeIcon icon={icon} className="text-blue-600 dark:text-blue-400" />}
        {title}
      </h2>

      {headerContent && <div className="px-3 pb-3">{headerContent}</div>}

      <div className="overflow-y-auto overflow-x-visible flex-grow px-2 pb-2">{sidebarContent}</div>

      {footerContent && (
        <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
          {footerContent}
        </div>
      )}
    </motion.div>
  );
};

export default ConfigurableSidebar;
