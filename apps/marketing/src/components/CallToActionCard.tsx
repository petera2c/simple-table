"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBookOpen, faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { useThemeContext } from "@/providers/ThemeProvider";
import { useFramework } from "@/providers/FrameworkProvider";
import { getExampleUrl } from "@/utils/getExampleUrl";
import { getAiTablePrompt } from "@/constants/aiTablePrompt";
import { trackBookACall, trackCtaClick, trackCopyAiTablePrompt } from "@/lib/analytics";

export type CallToActionButton = {
  text: string;
  href?: string;
  external?: boolean;
  /** When set, renders a clipboard button instead of a navigation link. */
  action?: "link" | "copyPrompt";
};

interface CallToActionCardProps {
  title: string;
  description: string;
  location?: string;
  primaryButton: CallToActionButton;
  secondaryButton: CallToActionButton;
}

const BLACK_BTN =
  "!bg-gray-900 !text-white !border-gray-900 hover:!bg-black hover:!border-black hover:!text-white";

function isDocsCta(button: CallToActionButton): boolean {
  return Boolean(button.href?.startsWith("/docs"));
}

export default function CallToActionCard({
  title,
  description,
  location = "blog_cta",
  primaryButton,
  secondaryButton,
}: CallToActionCardProps) {
  const { theme } = useThemeContext();
  const { framework } = useFramework();
  const [promptCopied, setPromptCopied] = useState(false);

  const handleCopyPrompt = (ctaId: string, ctaText: string) => {
    const prompt = getAiTablePrompt(framework);
    navigator.clipboard.writeText(prompt).then(() => {
      trackCopyAiTablePrompt({ framework, location });
      trackCtaClick({
        cta_id: ctaId,
        cta_text: ctaText,
        destination: "clipboard:ai_table_prompt",
        location,
      });
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    });
  };

  const ButtonComponent = ({
    button,
    isPrimary,
    ctaId,
  }: {
    button: CallToActionButton;
    isPrimary: boolean;
    ctaId: string;
  }) => {
    const className = `hover:scale-105 transition-transform w-full sm:w-auto ${
      isPrimary ? "" : BLACK_BTN
    }`;

    if (button.action === "copyPrompt") {
      return (
        <Button
          type={isPrimary ? "primary" : "default"}
          size="large"
          className={className}
          icon={<FontAwesomeIcon icon={promptCopied ? faCheck : faCopy} />}
          onClick={() => handleCopyPrompt(ctaId, button.text)}
        >
          {promptCopied ? "Copied!" : button.text}
        </Button>
      );
    }

    if (!button.href) {
      return null;
    }

    let href = button.href;
    if (!button.external && href.startsWith("/examples/")) {
      href = getExampleUrl(href, theme);
    }

    const handleClick = () => {
      const destination = button.href ?? "";
      const isCalendly = destination.includes("calendly.com");
      if (isCalendly) {
        trackBookACall({
          cta_id: ctaId,
          cta_text: button.text,
          destination,
          location,
        });
        return;
      }
      trackCtaClick({
        cta_id: ctaId,
        cta_text: button.text,
        destination,
        location,
      });
    };

    const docsIcon = isDocsCta(button) ? (
      <FontAwesomeIcon icon={faBookOpen} />
    ) : undefined;

    const label = (
      <>
        {button.text}
        {isDocsCta(button) ? <FontAwesomeIcon icon={faArrowRight} className="ml-2" /> : null}
      </>
    );

    if (button.external) {
      return (
        <Button
          type={isPrimary ? "primary" : "default"}
          size="large"
          className={className}
          icon={docsIcon}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          {label}
        </Button>
      );
    }

    return (
      <Link href={href} onClick={handleClick}>
        <Button
          type={isPrimary ? "primary" : "default"}
          size="large"
          className={className}
          icon={docsIcon}
        >
          {label}
        </Button>
      </Link>
    );
  };

  return (
    <section className="bg-linear-to-r from-purple-800 to-violet-800 rounded-xl p-6 md:p-8 text-center shadow-lg">
      <h2 className="text-white mb-3 md:mb-4 text-xl md:text-2xl font-bold">{title}</h2>

      <p className="text-white text-base md:text-lg mb-4 md:mb-6">{description}</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <ButtonComponent button={primaryButton} isPrimary={true} ctaId={`${location}_primary`} />
        <ButtonComponent
          button={secondaryButton}
          isPrimary={false}
          ctaId={`${location}_secondary`}
        />
      </div>
    </section>
  );
}
