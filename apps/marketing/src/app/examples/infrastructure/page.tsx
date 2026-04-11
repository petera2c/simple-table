import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import InfrastructureExampleWrapper from "@/examples/infrastructure/InfrastructureExampleWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.infrastructure.title,
  description: SEO_STRINGS.examples.infrastructure.description,
};

export default function InfrastructurePage() {
  return <InfrastructureExampleWrapper />;
}
