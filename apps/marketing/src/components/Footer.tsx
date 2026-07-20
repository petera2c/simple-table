"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faDiscord, faNpm } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TECHNICAL_STRINGS } from "../constants/strings/technical";
import { useThemeContext } from "@/providers/ThemeProvider";
import { COMPARISON_FOOTER_LINKS } from "@/constants/comparisons";
import { EXAMPLE_NAV_ITEMS } from "@/constants/examplesNav";
import PageWrapper from "./PageWrapper";
import { getExampleUrl } from "@/utils/getExampleUrl";

export default function Footer() {
  const pathname = usePathname();
  const { theme } = useThemeContext();
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <PageWrapper disableScrollRestoration>
      <footer className="bg-gray-900 dark:bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr] gap-8">
            {/* Documentation */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Documentation</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/docs/installation"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/docs/installation") ? "text-white font-medium" : ""
                    }`}
                  >
                    Installation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/quick-start"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/docs/quick-start") ? "text-white font-medium" : ""
                    }`}
                  >
                    Quick Start
                  </Link>
                </li>
                <li>
                  <Link
                    href="/frameworks"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/frameworks") ? "text-white font-medium" : ""
                    }`}
                  >
                    Framework setup (Vue, Angular, …)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Examples</h3>
              <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {EXAMPLE_NAV_ITEMS.map((example) => (
                  <li key={example.id}>
                    <Link
                      href={getExampleUrl(example.path, theme)}
                      className={`text-gray-400 hover:text-white transition-colors ${
                        isActive(example.path) ? "text-white font-medium" : ""
                      }`}
                    >
                      {example.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Comparisons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Comparisons</h3>
              <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {COMPARISON_FOOTER_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`text-gray-400 hover:text-white transition-colors ${
                        isActive(item.href) ? "text-white font-medium" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href={TECHNICAL_STRINGS.links.npm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faNpm} className="mr-2" />
                    NPM Package
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/RvKHCfg3PC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faDiscord} className="mr-2" />
                    Discord Support
                  </a>
                </li>
                <li>
                  <a
                    href={TECHNICAL_STRINGS.links.githubIssues}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faGithub} className="mr-2" />
                    GitHub Issues
                  </a>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/blog") ? "text-white font-medium" : ""
                    }`}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/case-studies"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/case-studies") ? "text-white font-medium" : ""
                    }`}
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/benchmarks"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/benchmarks") ? "text-white font-medium" : ""
                    }`}
                  >
                    Benchmarks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/changelog") ? "text-white font-medium" : ""
                    }`}
                  >
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap.xml"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/sitemap.xml") ? "text-white font-medium" : ""
                    }`}
                  >
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Theme Builder */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customization</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/theme-builder"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/theme-builder") ? "text-white font-medium" : ""
                    }`}
                  >
                    Theme Builder
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/themes"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/docs/themes") ? "text-white font-medium" : ""
                    }`}
                  >
                    Theme Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/custom-theme"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/docs/custom-theme") ? "text-white font-medium" : ""
                    }`}
                  >
                    Custom Theme
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/legal/eula"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/legal/eula") ? "text-white font-medium" : ""
                    }`}
                  >
                    EULA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/license"
                    className={`text-gray-400 hover:text-white transition-colors ${
                      isActive("/legal/license") ? "text-white font-medium" : ""
                    }`}
                  >
                    Community License
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Simple Table. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}
