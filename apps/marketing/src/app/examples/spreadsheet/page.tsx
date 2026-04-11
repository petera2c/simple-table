import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import SpreadsheetExampleWrapper from "@/examples/spreadsheet/SpreadsheetExampleWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.spreadsheet.title,
  description: SEO_STRINGS.examples.spreadsheet.description,
};

export default function SpreadsheetExample() {
  return <SpreadsheetExampleWrapper />;
}
