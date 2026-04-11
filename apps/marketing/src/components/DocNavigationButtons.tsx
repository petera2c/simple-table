"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { getAllDocPages, getPathToLabelMap } from "@/constants/docsNavigation";

// Get the navigation structure and labels from shared config
const docNavigation = getAllDocPages();
const pathToLabel = getPathToLabelMap();

/**
 * Component for rendering dynamic next/previous navigation buttons based on the docs structure
 */
const DocNavigationButtons = () => {
  const pathname = usePathname();

  const { prevPage, nextPage } = useMemo(() => {
    const currentIndex = docNavigation.findIndex((item) => item.path === pathname);

    // If page not found in navigation, return empty
    if (currentIndex === -1) {
      return { prevPage: null, nextPage: null };
    }

    const prevPage = currentIndex > 0 ? docNavigation[currentIndex - 1] : null;
    const nextPage =
      currentIndex < docNavigation.length - 1 ? docNavigation[currentIndex + 1] : null;

    return { prevPage, nextPage };
  }, [pathname]);

  if (!prevPage && !nextPage) {
    return null;
  }

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between mt-6 pt-6 border-t border-gray-200 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      {prevPage ? (
        <Link href={prevPage.path} className="w-full sm:w-auto">
          <Button
            type="default"
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
            className="flex items-center w-full sm:w-auto justify-center sm:justify-start"
          >
            <span className="hidden sm:inline">Previous: </span>
            <span className="truncate max-w-[200px] sm:max-w-none">
              {pathToLabel[prevPage.path]}
            </span>
          </Button>
        </Link>
      ) : (
        <span></span>
      )}

      {nextPage && (
        <Link href={nextPage.path} className="w-full sm:w-auto">
          <Button
            type="primary"
            className="flex items-center w-full sm:w-auto justify-center sm:justify-start"
          >
            <span className="hidden sm:inline">Next: </span>
            <span className="truncate max-w-[200px] sm:max-w-none">
              {pathToLabel[nextPage.path]}
            </span>
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </Button>
        </Link>
      )}
    </motion.div>
  );
};

export default DocNavigationButtons;
