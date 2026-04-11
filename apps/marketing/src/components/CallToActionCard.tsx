"use client";

import React from "react";
import Link from "next/link";
import { useThemeContext } from "@/providers/ThemeProvider";
import { getExampleUrl } from "@/utils/getExampleUrl";

interface CallToActionCardProps {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    href: string;
    external?: boolean;
  };
  secondaryButton: {
    text: string;
    href: string;
    external?: boolean;
  };
}

export default function CallToActionCard({
  title,
  description,
  primaryButton,
  secondaryButton,
}: CallToActionCardProps) {
  const { theme } = useThemeContext();

  const ButtonComponent = ({
    button,
    isPrimary,
  }: {
    button: typeof primaryButton;
    isPrimary: boolean;
  }) => {
    const baseClasses = "w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors";
    const primaryClasses = isPrimary
      ? "bg-white text-gray-800 hover:bg-gray-100"
      : "bg-blue-500 hover:bg-blue-600 text-white";

    // Add theme parameter to example URLs
    let href = button.href;
    if (!button.external && href.startsWith("/examples/")) {
      href = getExampleUrl(href, theme);
    }

    if (button.external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClasses} ${primaryClasses}`}
        >
          {button.text}
        </a>
      );
    }

    return (
      <Link href={href} className={`${baseClasses} ${primaryClasses}`}>
        {button.text}
      </Link>
    );
  };

  return (
    <section className="bg-gradient-to-r from-purple-800 to-violet-800 rounded-xl p-6 md:p-8 text-center shadow-lg">
      <h2 className="text-white mb-3 md:mb-4 text-xl md:text-2xl font-bold">{title}</h2>

      <p className="text-white text-base md:text-lg mb-4 md:mb-6">{description}</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <ButtonComponent button={primaryButton} isPrimary={true} />
        <ButtonComponent button={secondaryButton} isPrimary={false} />
      </div>
    </section>
  );
}
