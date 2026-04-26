import { SEO_STRINGS } from "@/constants/strings/seo";

const SITE = SEO_STRINGS.site.url;

export function buildTechArticleJsonLd(input: {
  title: string;
  description: string;
  canonicalPath: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: input.title,
    description: input.description,
    url: `${SITE}${input.canonicalPath.startsWith("/") ? input.canonicalPath : `/${input.canonicalPath}`}`,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@type": "Organization",
      name: SEO_STRINGS.site.name,
      url: SITE,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_STRINGS.site.name,
      url: SITE,
    },
  };
}

export function buildFaqPageJsonLd(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Path or absolute URL for the breadcrumb item. Relative paths are resolved against SITE. */
  url: string;
}

export function buildBreadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${SITE}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}

export function buildFrameworkHubSoftwareJsonLd(input: {
  name: string;
  description: string;
  urlPath: string;
  downloadUrl: string;
  featureList: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    description: input.description,
    url: `${SITE}${input.urlPath}`,
    downloadUrl: input.downloadUrl,
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      name: SEO_STRINGS.site.name,
      url: SITE,
    },
    featureList: input.featureList,
  };
}
