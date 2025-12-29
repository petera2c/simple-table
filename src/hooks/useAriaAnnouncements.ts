import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage aria-live announcements for screen readers
 * Provides a way to announce dynamic content changes to assistive technologies
 */
const useAriaAnnouncements = () => {
  const [announcement, setAnnouncement] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear announcement after a delay to allow for new announcements
  useEffect(() => {
    if (announcement) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Clear the announcement after 1 second to allow for new announcements
      timeoutRef.current = setTimeout(() => {
        setAnnouncement("");
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [announcement]);

  /**
   * Announce a message to screen readers
   * @param message The message to announce
   */
  const announce = (message: string) => {
    setAnnouncement(message);
  };

  return {
    announcement,
    announce,
  };
};

export default useAriaAnnouncements;
