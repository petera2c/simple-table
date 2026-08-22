"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { docsSearchIndex, type SearchableDoc } from "@/constants/docsSearchIndex";
import { createDocsSearchFuse, getDocsSearchSnippet } from "@/utils/docsSearchFuse";
import PageWrapper from "./PageWrapper";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DocsSearchProps {
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Highlights matching text based on Fuse.js match indices
 */
const highlightMatches = (
  text: string,
  matches: readonly any[] | undefined,
  fieldName: string,
): React.ReactNode => {
  if (!matches || matches.length === 0) {
    return text;
  }

  // Find matches for this specific field
  const fieldMatches = matches.filter((match) => match.key === fieldName);

  if (fieldMatches.length === 0) {
    return text;
  }

  // Collect all match indices for this field
  const indices: Array<[number, number]> = [];
  fieldMatches.forEach((match) => {
    if (match.indices) {
      // Filter out very short matches (single characters) to reduce noise
      const validIndices = match.indices.filter(
        ([start, end]: [number, number]) => end - start >= 1,
      );
      indices.push(...validIndices);
    }
  });

  if (indices.length === 0) {
    return text;
  }

  // Sort indices by start position
  indices.sort((a, b) => a[0] - b[0]);

  // Merge overlapping or very close indices (within 2 characters)
  const mergedIndices: Array<[number, number]> = [];
  let currentRange = indices[0];

  for (let i = 1; i < indices.length; i++) {
    const [start, end] = indices[i];
    if (start <= currentRange[1] + 2) {
      // Overlapping or very close, merge them
      currentRange = [currentRange[0], Math.max(currentRange[1], end)];
    } else {
      mergedIndices.push(currentRange);
      currentRange = [start, end];
    }
  }
  mergedIndices.push(currentRange);

  // Build the highlighted text
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  mergedIndices.forEach(([start, end], idx) => {
    // Add non-highlighted text before this match
    if (start > lastIndex) {
      parts.push(text.substring(lastIndex, start));
    }

    // Add highlighted match with more subtle styling
    parts.push(
      <mark
        key={`highlight-${idx}`}
        className="bg-accent-soft text-inherit font-semibold rounded px-0.5"
      >
        {text.substring(start, end + 1)}
      </mark>,
    );

    lastIndex = end + 1;
  });

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};

/** Highlight query tokens in a snippet (works for excerpts where Fuse indices don't apply). */
const highlightQueryInText = (text: string, query: string): React.ReactNode => {
  const tokens = query
    .toLowerCase()
    .split(/[\s/|,–—:_-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);
  if (tokens.length === 0) return text;

  const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, idx) =>
        tokens.some((t) => part.toLowerCase() === t) ? (
          <mark
            key={`snippet-${idx}`}
            className="bg-accent-soft text-inherit font-semibold rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={`snippet-${idx}`}>{part}</span>
        ),
      )}
    </>
  );
};

const DocsSearch: React.FC<DocsSearchProps> = ({
  placeholder = "Search documentation...",
  autoFocus = false,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Same Fuse config as scripts/test-docs-search.ts
  const fuse = useMemo(() => createDocsSearchFuse(docsSearchIndex), [docsSearchIndex]);

  // Perform search
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const results = fuse.search(query);

    return results.slice(0, 10).map((result) => ({
      doc: result.item,
      score: result.score || 0,
      matches: result.matches || [],
    }));
  }, [query, fuse]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || searchResults.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (searchResults[selectedIndex]) {
            navigateToDoc(searchResults[selectedIndex].doc);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setQuery("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle click outside to clear search
  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  useClickOutside(searchContainerRef, handleClickOutside);

  const navigateToDoc = (doc: SearchableDoc, e?: React.MouseEvent) => {
    // If command/ctrl key is pressed, let the browser handle opening in new tab
    if (e && (e.metaKey || e.ctrlKey)) {
      return;
    }

    router.push(doc.path);
    setIsOpen(false);
    setQuery("");
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    setIsOpen(value.trim().length > 0);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <PageWrapper disableScrollRestoration>
      <div className="relative w-full" ref={searchContainerRef}>
        <Input
          prefix={<SearchOutlined className="text-muted" />}
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(query.trim().length > 0)}
          autoFocus={autoFocus}
          allowClear
          onClear={handleClear}
          className="!bg-surface !border-line !text-ink"
        />

        {/* Search Results Dropdown */}
        {isOpen && (
          <div className="absolute top-full mt-2 w-full min-w-[400px] bg-surface border border-line rounded-lg max-h-96 overflow-y-auto z-9999">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <Link
                  key={result.doc.id}
                  href={result.doc.path}
                  onClick={(e) => navigateToDoc(result.doc, e)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`block px-4 py-3 border-b border-line cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? "bg-accent-soft"
                      : "hover:bg-paper"
                  }`}
                >
                  <span className="inline-block mb-1 text-xs text-muted border border-line rounded px-1.5 py-0.5">
                    {result.doc.section}
                  </span>
                  <div className="font-semibold text-ink mb-1">
                    {highlightMatches(result.doc.title, result.matches, "title")}
                  </div>
                  <div className="text-sm text-muted line-clamp-2">
                    {highlightQueryInText(
                      getDocsSearchSnippet(result.doc, result.matches, query).text,
                      query,
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-muted">
                      No results found for &quot;{query}&quot;
                    </span>
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default DocsSearch;
