/**
 * Type definitions for documentation search
 */

export interface SearchableDoc {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  content: string;
  section: string;
  headings: string[];
}
