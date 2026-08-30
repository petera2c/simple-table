import { useState, useLayoutEffect } from "react";

type MediaEntry = {
  media: MediaQueryList;
  value: boolean;
  listeners: Set<() => void>;
};

const mediaByBreakpoint = new Map<number, MediaEntry>();
/** After the first client layout pass, remounts can read the cached match. */
let allowCachedViewportValue = false;

function getMediaEntry(breakpoint: number): MediaEntry | null {
  if (typeof window === "undefined") return null;
  const existing = mediaByBreakpoint.get(breakpoint);
  if (existing) return existing;

  const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
  const entry: MediaEntry = {
    media,
    value: media.matches,
    listeners: new Set(),
  };

  media.addEventListener("change", () => {
    const next = media.matches;
    if (next === entry.value) return;
    entry.value = next;
    entry.listeners.forEach((listener) => listener());
  });

  mediaByBreakpoint.set(breakpoint, entry);
  return entry;
}

export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(() =>
    allowCachedViewportValue ? (getMediaEntry(breakpoint)?.value ?? false) : false,
  );

  useLayoutEffect(() => {
    allowCachedViewportValue = true;
    const entry = getMediaEntry(breakpoint);
    if (!entry) return;
    const sync = () => setIsMobile(entry.value);
    sync();
    entry.listeners.add(sync);
    return () => {
      entry.listeners.delete(sync);
    };
  }, [breakpoint]);

  return isMobile;
};

/** True when the viewport is at least `minWidthPx` wide. */
export const useMinWidth = (minWidthPx: number): boolean => {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(`(min-width: ${minWidthPx}px)`);
    const sync = () => setMatches(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [minWidthPx]);

  return matches;
};
