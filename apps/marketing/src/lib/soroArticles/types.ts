export type SoroArticleImage = {
  url: string;
  type?: string;
};

export type SoroArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  contentHtml: string;
  featuredImage: SoroArticleImage | null;
  link: string;
  publishedAt: string;
  updatedAt: string;
  source: "soro-rss";
};

export const SORO_RSS_FEED_URL =
  "https://app.trysoro.com/api/rss/afe2586b-51a3-4f1d-8b51-cec59f1cbb00";
