import React from "react";

interface BlogLayoutProps {
  children: React.ReactNode;
  width?: "normal" | "wide";
}

export default function BlogLayout({ children, width = "normal" }: BlogLayoutProps) {
  const maxWidth = width === "wide" ? "max-w-7xl" : "max-w-4xl";

  return (
    <div
      className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 shadow-xl rounded-lg bg-white dark:bg-gray-900 my-4`}
    >
      {children}
    </div>
  );
}
