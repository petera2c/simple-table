"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faDiscord, faNpm } from "@fortawesome/free-brands-svg-icons";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TECHNICAL_STRINGS } from "../constants/strings/technical";
import { useThemeContext } from "@/providers/ThemeProvider";
import { COMPARISON_FOOTER_LINKS } from "@/constants/comparisons";
import { EXAMPLE_NAV_ITEMS } from "@/constants/examplesNav";
import PageWrapper from "./PageWrapper";
import { getExampleUrl } from "@/utils/getExampleUrl";
import { trackBookACall } from "@/lib/analytics";

export default function Footer() {
  const pathname = usePathname();
  const { theme } = useThemeContext();
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <PageWrapper disableScrollRestoration>
      <footer className="bg-footer text-footer-ink overflow-visible">
        <div className="site-shell py-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr] gap-8 items-start overflow-visible">
            {/* Documentation */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Documentation</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/docs/quick-start"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/docs/quick-start") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    Quick Start
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/installation"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/docs/installation") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    Installation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/frameworks"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/frameworks") ? "text-footer-ink font-medium" : ""
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
              <ul className="space-y-2">
                {EXAMPLE_NAV_ITEMS.map((example) => (
                  <li key={example.id}>
                    <Link
                      href={getExampleUrl(example.path, theme)}
                      className={`text-footer-muted hover:text-footer-ink transition-colors ${
                        isActive(example.path) ? "text-footer-ink font-medium" : ""
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
              <ul className="space-y-2">
                {COMPARISON_FOOTER_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`text-footer-muted hover:text-footer-ink transition-colors ${
                        isActive(item.href) ? "text-footer-ink font-medium" : ""
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
                    className="text-footer-muted hover:text-footer-ink transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faNpm} className="mr-2" />
                    NPM Package
                  </a>
                </li>
                <li>
                  <a
                    href={TECHNICAL_STRINGS.links.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-footer-muted hover:text-footer-ink transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faDiscord} className="mr-2" />
                    Discord Support
                  </a>
                </li>
                <li>
                  <a
                    href={TECHNICAL_STRINGS.links.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-footer-muted hover:text-footer-ink transition-colors flex items-center"
                    onClick={() =>
                      trackBookACall({
                        cta_id: "footer_book_a_call",
                        cta_text: "Book a free call",
                        destination: TECHNICAL_STRINGS.links.calendly,
                        location: "footer",
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                    Book a free call
                  </a>
                </li>
                <li>
                  <a
                    href={TECHNICAL_STRINGS.links.githubIssues}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-footer-muted hover:text-footer-ink transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faGithub} className="mr-2" />
                    GitHub Issues
                  </a>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/blog") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/case-studies"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/case-studies") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/benchmarks"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/benchmarks") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    Benchmarks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/changelog") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap.xml"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/sitemap.xml") ? "text-footer-ink font-medium" : ""
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
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/theme-builder") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    Theme Builder
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/themes"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/docs/themes") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    Theme Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/custom-theme"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/docs/custom-theme") ? "text-footer-ink font-medium" : ""
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
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/legal/eula") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    EULA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/license"
                    className={`text-footer-muted hover:text-footer-ink transition-colors ${
                      isActive("/legal/license") ? "text-footer-ink font-medium" : ""
                    }`}
                  >
                    Community License
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-footer-line text-center text-footer-muted">
            <p>© {new Date().getFullYear()} Simple Table. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}
