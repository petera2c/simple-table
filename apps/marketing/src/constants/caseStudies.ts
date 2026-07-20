export interface CaseStudyMeta {
  slug: string;
  title: string;
  company: string;
  summary: string;
  href: string;
  type: "customer";
  highlightStat: string;
  highlightLabel: string;
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: "chartmetric",
    title: "How ChartMetric Chose Simple Table",
    company: "ChartMetric",
    summary:
      "Music analytics platform that evaluated AG Grid, TanStack Table, and Material UI Data Grid — then chose Simple Table for pricing, customization, and support.",
    href: "/case-studies/chartmetric",
    type: "customer",
    highlightStat: "$19K+",
    highlightLabel: "First-year savings vs AG Grid",
  },
];
