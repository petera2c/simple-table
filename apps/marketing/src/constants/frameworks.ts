/**
 * Framework constants shared between server and client code. Keep this module free of
 * "use client" so server components (e.g. demo snippet loading) can import it.
 *
 * Order is most used first. The header dropdown, homepage chips, and docs picker follow this list.
 */
export const FRAMEWORKS = ["react", "angular", "vue", "svelte", "solid", "vanilla"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React",
  angular: "Angular",
  vue: "Vue",
  svelte: "Svelte",
  solid: "Solid",
  vanilla: "Vanilla",
};

/** Prism language per framework for syntax highlighting demo snippets. */
export const FRAMEWORK_LANGUAGE: Record<Framework, string> = {
  react: "tsx",
  vue: "markup",
  angular: "typescript",
  svelte: "markup",
  solid: "tsx",
  vanilla: "typescript",
};

export const FRAMEWORK_LANGUAGE_LABEL: Record<Framework, string> = {
  react: "React TSX",
  vue: "Vue SFC",
  angular: "Angular",
  svelte: "Svelte",
  solid: "Solid TSX",
  vanilla: "TypeScript",
};
