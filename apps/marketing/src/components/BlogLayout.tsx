import React from "react";

interface BlogLayoutProps {
  children: React.ReactNode;
  width?: "normal" | "wide";
}

export default function BlogLayout({ children, width = "normal" }: BlogLayoutProps) {
  return (
    <div className="site-shell py-6 md:py-8">
      {width === "wide" ? children : <div className="mx-auto max-w-4xl">{children}</div>}
    </div>
  );
}
