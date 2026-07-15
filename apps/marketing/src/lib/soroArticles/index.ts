import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import type { BlogPostMetadata } from "@/constants/blogPosts";
import type { SoroArticle } from "./types";

const ARTICLES_DIR = join(process.cwd(), "content", "articles");

function isSoroArticle(value: unknown): value is SoroArticle {
  if (!value || typeof value !== "object") return false;
  const article = value as Record<string, unknown>;
  return (
    typeof article.slug === "string" &&
    typeof article.title === "string" &&
    typeof article.description === "string" &&
    typeof article.contentHtml === "string"
  );
}

function readArticleFile(filePath: string): SoroArticle | null {
  try {
    const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"));
    return isSoroArticle(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function listSoroArticles(): SoroArticle[] {
  if (!existsSync(ARTICLES_DIR)) return [];

  const articles: SoroArticle[] = [];
  for (const name of readdirSync(ARTICLES_DIR)) {
    if (!name.endsWith(".json")) continue;
    const article = readArticleFile(join(ARTICLES_DIR, name));
    if (article) articles.push(article);
  }

  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getSoroArticleBySlug(slug: string): SoroArticle | null {
  const filePath = join(ARTICLES_DIR, `${slug}.json`);
  if (!existsSync(filePath)) return null;
  return readArticleFile(filePath);
}

export function getSoroArticleSlugs(): string[] {
  return listSoroArticles().map((article) => article.slug);
}

/** Map a Soro RSS article into the hand-authored blog card shape for the index. */
export function soroArticleToBlogPostMetadata(article: SoroArticle): BlogPostMetadata {
  const createdAt = article.publishedAt.slice(0, 10);
  const updatedAt = (article.updatedAt || article.publishedAt).slice(0, 10);
  return {
    title: article.title,
    description: article.description,
    slug: article.slug,
    tags: ["article"],
    createdAt,
    updatedAt,
  };
}

export function listSoroBlogPostMetadata(): BlogPostMetadata[] {
  return listSoroArticles().map(soroArticleToBlogPostMetadata);
}
