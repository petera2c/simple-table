import type { Framework } from "@/providers/FrameworkProvider";

export const FRAMEWORK_INSTALL_COMMANDS: Record<Framework, { npm: string; yarn: string; pnpm: string }> = {
  react: {
    npm: "npm install @simple-table/react",
    yarn: "yarn add @simple-table/react",
    pnpm: "pnpm add @simple-table/react",
  },
  vue: {
    npm: "npm install @simple-table/vue",
    yarn: "yarn add @simple-table/vue",
    pnpm: "pnpm add @simple-table/vue",
  },
  angular: {
    npm: "npm install @simple-table/angular",
    yarn: "yarn add @simple-table/angular",
    pnpm: "pnpm add @simple-table/angular",
  },
  svelte: {
    npm: "npm install @simple-table/svelte",
    yarn: "yarn add @simple-table/svelte",
    pnpm: "pnpm add @simple-table/svelte",
  },
  solid: {
    npm: "npm install @simple-table/solid",
    yarn: "yarn add @simple-table/solid",
    pnpm: "pnpm add @simple-table/solid",
  },
  vanilla: {
    npm: "npm install simple-table-core",
    yarn: "yarn add simple-table-core",
    pnpm: "pnpm add simple-table-core",
  },
};

export const FRAMEWORK_REQUIREMENTS: Record<Framework, string> = {
  react: "React 16.8+",
  vue: "Vue 3.0+",
  angular: "Angular 19+",
  svelte: "Svelte 5+",
  solid: "Solid 1.0+",
  vanilla: "Any modern browser (ES2020+)",
};

export const TECHNICAL_STRINGS = {
  installation: {
    npm: "npm install @simple-table/react",
    yarn: "yarn add @simple-table/react",
    pnpm: "pnpm add @simple-table/react",
  },
  css: {
    import: `// In your JavaScript or TypeScript file
import "@simple-table/react/styles.css";`,
    themeVariables: {
      light: `/* light theme */
.theme-custom {
  --st-border-radius: 4px;
  --st-cell-padding: 8px;
  --st-spacing-small: 4px;
  --st-spacing-medium: 8px;
  --st-scrollbar-bg-color: transparent;
  --st-scrollbar-thumb-color: var(--slate-200);

  --st-border-color: var(--gray-300);
  --st-odd-row-background-color: var(--white);
  --st-even-row-background-color: var(--white);
  --st-header-background-color: var(--white);
  --st-dragging-background-color: var(--gray-200);
  --st-selected-cell-background-color: var(--blue-200);
  --st-selected-first-cell-background-color: var(--blue-200);
  --st-footer-background-color: var(--white);
  --st-cell-color: var(--gray-800);
  --st-cell-odd-row-color: var(--gray-700);
  --st-edit-cell-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 1px -1px rgba(0, 0, 0, 0.05);
  --st-selected-cell-color: var(--gray-900);
  --st-selected-first-cell-color: var(--gray-900);
  --st-resize-handle-color: var(--blue-300);
  --st-separator-border-color: var(--slate-100);
  --st-last-group-row-separator-border-color: var(--slate-300);
  --st-selected-border-color: var(--blue-600);
  --st-checkbox-checked-background-color: var(--blue-600);
  --st-checkbox-checked-border-color: var(--blue-600);
  --st-column-editor-background-color: var(--white);
  --st-column-editor-popout-background-color: var(--white);
  --st-button-hover-background-color: var(--gray-200);
  --st-button-active-background-color: var(--blue-800);
  --st-editable-cell-focus-border-color: var(--blue-600);
  --st-hover-row-background-color: var(--gray-200);
}`,
    },
  },
  links: {
    npm: "https://www.npmjs.com/package/@simple-table/react",
    github: "https://github.com/petera2c/simple-table",
    discord: "https://discord.gg/RvKHCfg3PC",
    demo: "https://stackblitz.com/github/petera2c/simple-table/tree/stackblitz-examples/react/quick-start",
    githubIssues: "https://github.com/petera2c/simple-table/issues",
  },
  files: {
    theme: "simple-table-theme.css",
  },
} as const;
