// Do not f***ing add a use client to this file. It will break SEO metadata
// The <main className="grow">{children}</main> can not have any parent that is a client component.
// If you need to use a client component, use a wrapper component like PageWrapper

import Header from "./Header";
import Footer from "./Footer";
import "../app/global.css";
import { QueryProvider } from "../providers/QueryProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { FrameworkProvider } from "../providers/FrameworkProvider";

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <div className="h-screen flex flex-col transition-colors duration-200 bg-paper text-ink">
        <Header />
        <div
          id="main-scroll-container"
          className="w-full grow z-10 text-ink overflow-auto flex flex-col"
        >
          <main className="min-h-[calc(100dvh-var(--header-height))] shrink-0">{children}</main>
          <div className="shrink-0 overflow-visible">
            <Footer />
          </div>
        </div>
      </div>
    </QueryProvider>
  );
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FrameworkProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </FrameworkProvider>
    </ThemeProvider>
  );
}
