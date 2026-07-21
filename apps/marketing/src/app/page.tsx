import HomeContent from "@/components/pages/HomeContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { SIMPLE_TABLE_INFO, AG_GRID_TOTAL_SIZE } from "@/constants/packageInfo";
import { FRAMEWORK_REQUIREMENTS } from "@/constants/strings/technical";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.home.title,
  description: SEO_STRINGS.home.description,
  keywords: SEO_STRINGS.home.keywords,
  openGraph: {
    title: SEO_STRINGS.home.title,
    description: SEO_STRINGS.home.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.home.title,
    description: SEO_STRINGS.home.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/",
  },
};

// FAQ Schema for AI visibility
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Simple Table?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Simple Table is a lightweight JavaScript data grid and table library that's only ${SIMPLE_TABLE_INFO.bundleSizeMinGzip} in size. It works with React, Vue, Angular, Svelte, Solid, and vanilla JavaScript or TypeScript (simple-table-core), providing comprehensive features like cell editing, column management, sorting, filtering, and full TypeScript support.`,
      },
    },
    {
      "@type": "Question",
      name: "How does Simple Table compare to AG Grid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Simple Table is a free alternative to AG Grid that's much lighter (${SIMPLE_TABLE_INFO.bundleSizeMinGzip} vs ${AG_GRID_TOTAL_SIZE}). While AG Grid has more enterprise features, Simple Table provides all the essential functionality most developers need for data grids, including cell editing, column management, sorting, filtering, and theming, without the licensing costs.`,
      },
    },
    {
      "@type": "Question",
      name: "Is Simple Table free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Simple Table is completely free for pre-revenue and bootstrapped projects. For revenue-generating businesses, affordable paid plans are available. You can install it via npm and start building data grids immediately.",
      },
    },
    {
      "@type": "Question",
      name: "Does Simple Table support TypeScript?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Simple Table has full TypeScript support with comprehensive type definitions. This provides excellent developer experience with autocomplete, type checking, and IntelliSense support in your IDE.",
      },
    },
    {
      "@type": "Question",
      name: "What features does Simple Table include?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simple Table includes cell editing, column management (resizing, reordering, pinning, visibility), row grouping, pivot tables, pagination, sorting, filtering, custom themes, nested headers, custom renderers, and responsive design. It's designed to handle large datasets efficiently.",
      },
    },
    {
      "@type": "Question",
      name: "How do I install Simple Table?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Install Simple Table with your framework adapter, e.g. 'npm install @simple-table/react' (or @simple-table/vue, @simple-table/angular, etc.). The library is ready to use with minimal configuration in any supported framework.",
      },
    },
  ],
};

// Breadcrumb Schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.simple-table.com",
    },
  ],
};

// Software Application Schema for better SEO
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Simple Table",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: [
    {
      "@type": "Offer",
      name: "Free Plan",
      price: "0",
      priceCurrency: "USD",
      description: "Free for zero-revenue companies and individuals",
    },
    {
      "@type": "Offer",
      name: "Pro Plan",
      price: "85",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "85",
        priceCurrency: "USD",
        unitText: "MONTH",
      },
      description: "For revenue-generating businesses with priority support",
    },
  ],
  description: `Simple Table is a lightweight JavaScript data grid with first-class npm packages: @simple-table/react, @simple-table/vue, @simple-table/angular, @simple-table/svelte, @simple-table/solid, and simple-table-core for vanilla JavaScript or TypeScript. Only ${SIMPLE_TABLE_INFO.bundleSizeMinGzip} in size, production-ready with 30+ features including cell editing, column management, sorting, filtering, and full TypeScript support.`,
  url: "https://www.simple-table.com",
  downloadUrl: "https://www.npmjs.com/package/@simple-table/react",
  softwareVersion: SIMPLE_TABLE_INFO.version,
  author: {
    "@type": "Organization",
    name: "Simple Table",
    url: "https://www.simple-table.com",
  },
  softwareRequirements: `React ${FRAMEWORK_REQUIREMENTS.react}; Vue ${FRAMEWORK_REQUIREMENTS.vue}; Angular ${FRAMEWORK_REQUIREMENTS.angular}; Svelte ${FRAMEWORK_REQUIREMENTS.svelte}; Solid ${FRAMEWORK_REQUIREMENTS.solid}; ${FRAMEWORK_REQUIREMENTS.vanilla}.`,
  featureList: [
    "React adapter (@simple-table/react)",
    "Vue adapter (@simple-table/vue)",
    "Angular adapter (@simple-table/angular)",
    "Svelte adapter (@simple-table/svelte)",
    "Solid adapter (@simple-table/solid)",
    "Vanilla JavaScript / TypeScript (simple-table-core)",
  ],
  sameAs: [
    "https://github.com/petera2c/simple-table",
    "https://www.npmjs.com/package/@simple-table/react",
    "https://www.npmjs.com/package/simple-table-core",
    "https://github.com/brillout/awesome-react-components",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <HomeContent />
    </>
  );
}
