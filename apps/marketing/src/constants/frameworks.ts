/**
 * Framework constants shared between server and client code. Keep this module free of
 * "use client" so server components (e.g. demo snippet loading) can import it.
 */
export const FRAMEWORKS = ["react", "vue", "angular", "svelte", "solid", "vanilla"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  angular: "Angular",
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
