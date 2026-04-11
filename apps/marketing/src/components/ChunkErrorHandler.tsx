"use client";

import { useEffect } from "react";

/**
 * Handles ChunkLoadError by automatically reloading the page
 * This prevents users from seeing errors when new deployments invalidate old chunks
 */
export default function ChunkErrorHandler() {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      const isChunkError =
        event.message?.includes("ChunkLoadError") ||
        event.message?.includes("Loading chunk") ||
        event.message?.includes("Failed to fetch dynamically imported module");

      if (isChunkError) {
        console.warn("ChunkLoadError detected, reloading page...");
        // Reload the page to get the latest chunks
        window.location.reload();
      }
    };

    // Also handle unhandled promise rejections (chunk errors often appear here)
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || "";
      const isChunkError =
        reason.includes("ChunkLoadError") ||
        reason.includes("Loading chunk") ||
        reason.includes("Failed to fetch dynamically imported module");

      if (isChunkError) {
        console.warn("ChunkLoadError detected in promise rejection, reloading page...");
        event.preventDefault(); // Prevent the error from being logged
        window.location.reload();
      }
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, []);

  return null;
}
