"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageLayoutProps {
  sidebar?: ReactNode;
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ sidebar, children }) => {
  return (
    <>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 px-4 sm:px-6 md:px-8">
          {sidebar}

          <motion.div
            className={`flex flex-col flex-grow overflow-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-white 
              rounded-xl my-2 sm:my-3 md:my-4 p-2 sm:p-3 md:p-4 min-h-[calc(100dvh-84px-1.5rem)] 
              shadow-[4px_0_16px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_16px_rgba(0,0,0,0.3)]`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PageLayout;
