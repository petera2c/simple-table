import type { HubFrameworkId } from "@/constants/frameworkIntegrationHub";
import { FRAMEWORK_HUB_PILLAR_BLOG_SLUG } from "@/constants/frameworkPillarBlogs";
import { SEO_STRINGS } from "@/constants/strings/seo";

export type FrameworkHubFaqItem = { question: string; answer: string };

const SITE = SEO_STRINGS.site.url;

export function getFrameworkHubFaqItems(id: HubFrameworkId): FrameworkHubFaqItem[] {
  const pillarUrl = `${SITE}/blog/${FRAMEWORK_HUB_PILLAR_BLOG_SLUG[id]}`;

  const common: FrameworkHubFaqItem[] = [
    {
      question: "Is this the same grid as the React package?",
      answer:
        "Yes. Every adapter wraps the same simple-table-core engine, so features like sorting, editing, column APIs, and themes behave consistently. You choose the npm package that matches your framework.",
    },
    {
      question: "Where can I run a full example without cloning the repo?",
      answer:
        "Use the StackBlitz quick start from this hub, or open documentation demos—many include “Open in StackBlitz” for a runnable project in the browser.",
    },
    {
      question: "Is there a deeper guide for this stack?",
      answer: `Read the stack-specific pillar guide at ${pillarUrl} for install context, patterns, and links back to this hub.`,
    },
  ];

  const specific: Record<HubFrameworkId, FrameworkHubFaqItem[]> = {
    react: [
      {
        question: "Which React versions are supported?",
        answer:
          "Use React 18 or newer with @simple-table/react. Peer expectations are listed in the Install section above.",
      },
    ],
    vue: [
      {
        question: "Does Simple Table work with Nuxt?",
        answer:
          "Yes. Install @simple-table/vue, import styles in a layout or plugin, and mount the component in your page or layout. For SSR, hydrate as you would any client table component—see the Vue & Nuxt pillar guide for notes.",
      },
    ],
    angular: [
      {
        question: "Can I use standalone components?",
        answer:
          "Yes. Import SimpleTableComponent into a standalone component or NgModule as usual; peers are listed in the Install section.",
      },
    ],
    svelte: [
      {
        question: "SvelteKit vs Svelte—any difference for setup?",
        answer:
          "The adapter is the same. Import styles once in your root layout or main entry. Use the SvelteKit pillar guide for app-shell conventions.",
      },
    ],
    solid: [
      {
        question: "How does this fit Solid’s reactivity?",
        answer:
          "The @simple-table/solid adapter is built for Solid’s fine-grained updates. Install peers, import styles once, then compose the grid like other Solid components.",
      },
    ],
    vanilla: [
      {
        question: "When should I use simple-table-core directly?",
        answer:
          "Use it when you are not on React/Vue/etc., or when you wrap the grid in your own framework glue. For most apps, an official adapter is faster to integrate.",
      },
    ],
  };

  return [...specific[id], ...common];
}

export function getFrameworkHubWhyParagraph(id: HubFrameworkId): string {
  const map: Record<HubFrameworkId, string> = {
    react:
      "Ship a typed React data grid with minimal ceremony: one package, one stylesheet import, and the same feature set as every other Simple Table stack. Ideal when you want batteries-included UI without hand-rolling virtualization and keyboard behavior.",
    vue:
      "Build Vue 3 or Nuxt tables with a first-class component and predictable styling. The adapter mirrors core APIs so you can share column definitions and themes across teams that also use Simple Table on other stacks.",
    angular:
      "Drop a production-ready grid into Angular apps with familiar module or standalone patterns. Keep enterprise features—editing, pinning, nested headers—without pulling in a massive commercial bundle.",
    svelte:
      "Use a Svelte-native component that fits stores, runes, or SvelteKit layouts. Same core as React and Vue, so migrating prototypes between stacks is straightforward.",
    solid:
      "Leverage Solid’s fine-grained reactivity with an adapter designed for the ecosystem—small surface area, explicit peers, and the full Simple Table feature set.",
    vanilla:
      "Integrate at the DOM level with simple-table-core when you control rendering yourself, embed in legacy apps, or prototype without a framework. Import CSS once and wire updates with your own state layer.",
  };
  return map[id];
}
