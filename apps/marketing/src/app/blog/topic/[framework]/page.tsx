import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  FRAMEWORK_HUB_BY_ID,
  FRAMEWORK_HUB_IDS,
  type HubFrameworkId,
} from "@/constants/frameworkIntegrationHub";
import { FRAMEWORK_COMPETITORS } from "@/constants/frameworkCompetitors";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogPageContent from "@/components/pages/BlogPageContent";

type PageProps = { params: Promise<{ framework: string }> };

export function generateStaticParams() {
  return FRAMEWORK_HUB_IDS.map((framework) => ({ framework }));
}

function isHubId(value: string): value is HubFrameworkId {
  return FRAMEWORK_HUB_IDS.includes(value as HubFrameworkId);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { framework: raw } = await params;
  if (!isHubId(raw)) return { title: "Blog topic" };
  const fw = FRAMEWORK_HUB_BY_ID[raw];
  const competitors = FRAMEWORK_COMPETITORS[raw];
  const lower = fw.label.toLowerCase();
  const title = `${fw.label} data grid blog | Simple Table`;
  const description = `${fw.label}-specific data grid tutorials, comparisons, and migration guides from Simple Table—covering ${competitors.slice(0, 3).join(", ")} alternatives, ${lower} table examples, and best practices.`;
  return {
    title,
    description,
    keywords: [
      `${lower} data grid`,
      `${lower} table tutorials`,
      `${lower} table comparisons`,
      `${lower} data table`,
      `simple-table ${lower}`,
      ...competitors.map((c) => `${c} alternative`),
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: [SEO_STRINGS.site.ogImage],
      siteName: SEO_STRINGS.site.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SEO_STRINGS.site.creator,
      images: SEO_STRINGS.site.ogImage.url,
    },
    alternates: { canonical: `/blog/topic/${raw}` },
  };
}

export default async function BlogTopicPage({ params }: PageProps) {
  const { framework: raw } = await params;
  if (!isHubId(raw)) notFound();
  const fw = FRAMEWORK_HUB_BY_ID[raw];
  return (
    <BlogPageContent
      initialFramework={raw}
      hideFrameworkFilter={false}
      heading={`${fw.label} data grid tutorials & comparisons`}
      intro={`Every Simple Table post tagged for ${fw.label}: tutorials, competitor comparisons, migrations, and pillar guides. New here? Start with the ${fw.label} pillar guide and the ${fw.label} integration hub.`}
    />
  );
}
