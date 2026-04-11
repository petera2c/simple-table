"use client";

import Link from "next/link";
import { useThemeContext } from "@/providers/ThemeProvider";
import { getExampleUrl } from "@/utils/getExampleUrl";
import { ReactNode } from "react";

interface ExampleLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * A Link component that automatically adds the appropriate theme parameter
 * when linking to example pages
 */
export default function ExampleLink({ href, children, className, onClick }: ExampleLinkProps) {
  const { theme } = useThemeContext();

  // Add theme parameter to example URLs
  const finalHref = href.startsWith("/examples/") ? getExampleUrl(href, theme) : href;

  return (
    <Link href={finalHref} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
