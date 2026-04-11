"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faBars,
  faXmark,
  faSun,
  faMoon,
  faQuestionCircle,
  faEnvelope,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faNpm, faGithub } from "@fortawesome/free-brands-svg-icons";
import { Dropdown, Divider } from "antd";
import type { MenuProps } from "antd";
import { useIsMobile } from "../hooks/useIsMobile";
import { useGitHubStars } from "../hooks/useGitHubStars";
import { useDiscordMembers } from "../hooks/useDiscordMembers";
import { useThemeContext } from "../providers/ThemeProvider";
import { TECHNICAL_STRINGS } from "../constants/strings/technical";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import PageWrapper from "./PageWrapper";
import { getDefaultExampleUrl } from "@/utils/getExampleUrl";
import ContactModal from "./ContactModal";
import FrameworkSelector from "./FrameworkSelector";

// Unified link button component that handles both internal and external links
interface LinkButtonProps {
  href?: string;
  label: string;
  icon?: IconDefinition;
  isMobile?: boolean;
  isExternal?: boolean;
  useActivePath?: boolean;
  onMobileClick?: () => void;
}

const LinkButton = ({
  href,
  label,
  icon,
  isMobile = false,
  isExternal = false,
  useActivePath = false,
  onMobileClick,
}: LinkButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Get the base path (e.g., "/docs" from "/docs/installation")
  const basePath = href ? "/" + href.split("/").filter(Boolean)[0] : "";
  const isActivePath = pathname?.startsWith(basePath);

  const shouldHighlight = !isExternal && (useActivePath ? isActivePath : isActive);

  const handleClick = () => {
    if (!isExternal && isMobile && onMobileClick) {
      onMobileClick();
    }
  };

  const buttonClasses = isMobile
    ? `px-3 py-2 rounded-md text-base w-full text-left ${
        shouldHighlight
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
      } transition-colors flex items-center`
    : `${
        shouldHighlight
          ? "text-blue-600 dark:text-blue-400 font-semibold"
          : "text-gray-600 dark:text-gray-300"
      } hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center focus:outline-none whitespace-nowrap`;

  const buttonContent = (
    <button onClick={handleClick} className={buttonClasses}>
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {label}
    </button>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        {...(href?.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        className="inline-block"
      >
        {buttonContent}
      </a>
    );
  }
  if (!href) {
    return buttonContent;
  }

  return (
    <Link href={href} className="inline-block">
      {buttonContent}
    </Link>
  );
};

// GitHub link component with star count
const GitHubLink = ({
  isMobile = false,
  onMobileClick,
}: {
  isMobile?: boolean;
  onMobileClick?: () => void;
}) => {
  const { stars, isLoading } = useGitHubStars("petera2c", "simple-table");

  const handleClick = () => {
    window.open("https://github.com/petera2c/simple-table", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors text-gray-700 dark:text-white text-sm ${
        isMobile ? "justify-start w-fit" : ""
      }`}
    >
      <FontAwesomeIcon icon={faGithub} style={{ fontSize: "1.5rem" }} />
      {isLoading ? "..." : stars}
    </button>
  );
};

// Discord link component with member count
const DiscordLink = ({
  isMobile = false,
  onMobileClick,
}: {
  isMobile?: boolean;
  onMobileClick?: () => void;
}) => {
  const { memberCount, isLoading } = useDiscordMembers("RvKHCfg3PC");

  const handleClick = () => {
    window.open("https://discord.gg/RvKHCfg3PC", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors text-gray-700 dark:text-white text-sm ${
        isMobile ? "justify-start w-fit" : ""
      }`}
    >
      <FontAwesomeIcon icon={faDiscord} style={{ fontSize: "1.5rem" }} />
      {!isLoading && memberCount !== null && (
        <>
          {memberCount}
          <span className="w-2 h-2 bg-green-500 rounded-full" aria-label="online" />
        </>
      )}
    </button>
  );
};

// More dropdown component for overflow navigation items
// includeThemeBuilder: whether to include Theme Builder in the dropdown
const MoreDropdown = ({ includeThemeBuilder = false }: { includeThemeBuilder?: boolean }) => {
  const pathname = usePathname();

  const moreLinks = [
    ...(includeThemeBuilder
      ? [{ key: "theme-builder", href: "/theme-builder", label: "Theme Builder" }]
      : []),
    { key: "blog", href: "/blog", label: "Blog" },
    { key: "changelog", href: "/changelog", label: "Changelog" },
  ];

  const menuItems: MenuProps["items"] = moreLinks.map((link) => {
    const isActive = pathname === link.href;
    return {
      key: link.key,
      label: (
        <Link
          href={link.href}
          className={`flex items-center transition-colors ${
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          {link.label}
        </Link>
      ),
    };
  });

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["hover"]}>
      <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center focus:outline-none whitespace-nowrap">
        <FontAwesomeIcon icon={faEllipsisH} className="mr-2" />
        More
      </button>
    </Dropdown>
  );
};

// Support dropdown component
const SupportDropdown = ({
  isMobile = false,
  onMobileClick,
  onContactClick,
}: {
  isMobile?: boolean;
  onMobileClick?: () => void;
  onContactClick?: () => void;
}) => {
  const supportLinks = [
    {
      key: "discord",
      href: "https://discord.gg/RvKHCfg3PC",
      label: "Discord Support",
      icon: faDiscord,
      isExternal: true,
    },
    {
      key: "contact",
      label: "Contact Us",
      icon: faEnvelope,
      onClick: onContactClick,
    },
    {
      key: "github",
      href: TECHNICAL_STRINGS.links.githubIssues,
      label: "Report Issue",
      icon: faGithub,
      isExternal: true,
    },
  ];

  if (isMobile) {
    return (
      <>
        {supportLinks.map((link) => {
          const linkClasses =
            "px-3 py-2 rounded-md text-base text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center";
          const linkContent = (
            <>
              <FontAwesomeIcon icon={link.icon} className="mr-2" />
              {link.label}
            </>
          );

          if (link.onClick) {
            return (
              <button
                key={link.key}
                onClick={() => {
                  link.onClick?.();
                  onMobileClick?.();
                }}
                className={linkClasses}
              >
                {linkContent}
              </button>
            );
          }

          if (link.isExternal) {
            return (
              <a
                key={link.key}
                href={link.href}
                {...(link.href?.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className={linkClasses}
              >
                {linkContent}
              </a>
            );
          } else {
            return (
              <Link
                key={link.key}
                href={link.href!}
                onClick={() => onMobileClick && onMobileClick()}
                className={linkClasses}
              >
                {linkContent}
              </Link>
            );
          }
        })}
      </>
    );
  }

  const menuItems: MenuProps["items"] = supportLinks.map((link) => ({
    key: link.key,
    label: link.onClick ? (
      <button
        onClick={link.onClick}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-full"
      >
        <FontAwesomeIcon icon={link.icon} className="mr-2 w-4" />
        {link.label}
      </button>
    ) : link.isExternal ? (
      <a
        href={link.href}
        {...(link.href?.startsWith("mailto:")
          ? {}
          : { target: "_blank", rel: "noopener noreferrer" })}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <FontAwesomeIcon icon={link.icon} className="mr-2 w-4" />
        {link.label}
      </a>
    ) : (
      <Link
        href={link.href!}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <FontAwesomeIcon icon={link.icon} className="mr-2 w-4" />
        {link.label}
      </Link>
    ),
  }));

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["hover"]}>
      <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center focus:outline-none whitespace-nowrap">
        <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
        Support
      </button>
    </Dropdown>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useThemeContext();
  const headerRef = useRef<HTMLElement>(null);

  // Handle click outside header to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside as EventListener);
      document.addEventListener("touchstart", handleClickOutside as EventListener);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside as EventListener);
      document.removeEventListener("touchstart", handleClickOutside as EventListener);
    };
  }, [isMenuOpen]);

  // Disable scrolling when mobile menu is open
  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");
    if (isMenuOpen && isMobile && scrollContainer) {
      scrollContainer.style.overflow = "hidden";
    } else if (scrollContainer) {
      scrollContainer.style.overflow = "auto";
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.style.overflow = "auto";
      }
    };
  }, [isMenuOpen, isMobile]);

  const navLinks = [
    { href: "/docs/installation", label: "Documentation", useActivePath: true },
    { href: getDefaultExampleUrl(theme), label: "Examples", useActivePath: true },
    { href: "/theme-builder", label: "Theme Builder" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/changelog", label: "Changelog" },
  ];

  const externalLinks = [{ href: TECHNICAL_STRINGS.links.npm, label: "NPM", icon: faNpm }];

  return (
    <PageWrapper disableScrollRestoration>
      <header
        ref={headerRef}
        className="backdrop-blur-md bg-white/80 dark:bg-gray-900/90 shadow-sm sticky top-0 z-50"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                <FontAwesomeIcon
                  icon={faTable}
                  className="text-blue-600 dark:text-blue-400 text-2xl mr-2"
                />
                Simple Table
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} className="text-xl" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="text-2xl" />
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <div className="flex items-center gap-3 lg:gap-4">
                {navLinks.map((link) => {
                  // Progressive hiding as screen size decreases:
                  // - Blog & Changelog: hide below 1280px (xl), show on xl+ (1280px+)
                  // - Theme Builder: hide below 1140px (nav), show on nav+ (1140px+)
                  if (link.href === "/blog" || link.href === "/changelog") {
                    return (
                      <div key={link.href} className="hidden xl:block">
                        <LinkButton {...link} />
                      </div>
                    );
                  }
                  if (link.href === "/theme-builder") {
                    return (
                      <div key={link.href} className="hidden nav:block">
                        <LinkButton {...link} />
                      </div>
                    );
                  }
                  return <LinkButton key={link.href} {...link} />;
                })}

                {/* More dropdown - progressively includes more items as space decreases */}
                {/* md-nav (768-1139px): Theme Builder + Blog + Changelog */}
                <div className="nav:hidden">
                  <MoreDropdown includeThemeBuilder={true} />
                </div>
                {/* nav-xl (1140-1279px): Blog + Changelog only */}
                <div className="hidden nav:block xl:hidden">
                  <MoreDropdown includeThemeBuilder={false} />
                </div>
              </div>

              <Divider type="vertical" className="h-8" />

              <div className="flex items-center gap-3 lg:gap-4">
                <FrameworkSelector />
                <GitHubLink />
                <DiscordLink />
                {externalLinks.map((link) => (
                  <LinkButton key={link.href} {...link} isExternal={true} />
                ))}
                <SupportDropdown onContactClick={() => setIsContactModalOpen(true)} />

                <button
                  onClick={toggleTheme}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors"
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                  <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobile && isMenuOpen && (
            <div className="mt-4 pt-2 pb-4 border-t border-gray-200 dark:border-gray-700 overflow-auto">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <LinkButton
                    key={link.href}
                    {...link}
                    isMobile={true}
                    onMobileClick={() => setIsMenuOpen(false)}
                  />
                ))}

                <Divider className="my-2" />

                <div className="px-0 py-1">
                  <span className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Framework</span>
                  <FrameworkSelector isMobile={true} />
                </div>

                <Divider className="my-2" />

                <GitHubLink isMobile={true} onMobileClick={() => setIsMenuOpen(false)} />
                <DiscordLink isMobile={true} onMobileClick={() => setIsMenuOpen(false)} />

                {externalLinks.map((link) => (
                  <LinkButton
                    key={link.href}
                    href={link.href}
                    label={link.label === "NPM" ? "NPM Package" : link.label}
                    icon={link.icon}
                    isExternal={true}
                    isMobile={true}
                    onMobileClick={() => setIsMenuOpen(false)}
                  />
                ))}

                <SupportDropdown
                  isMobile={true}
                  onMobileClick={() => setIsMenuOpen(false)}
                  onContactClick={() => setIsContactModalOpen(true)}
                />
              </div>
            </div>
          )}
        </nav>
      </header>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </PageWrapper>
  );
};

export default Header;
