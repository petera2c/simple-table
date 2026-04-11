import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";
import HRExampleWrapper from "@/examples/hr/HRExampleWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.hr.title,
  description: SEO_STRINGS.examples.hr.description,
};

export default function HRExample() {
  return <HRExampleWrapper />;
}
