import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import MusicExampleWrapper from "@/examples/music/MusicExampleWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.music?.title || "Music Artist Analytics - Simple Table",
  description:
    SEO_STRINGS.examples.music?.description ||
    "Explore music artist analytics with Simple Table - track followers, popularity, playlist reach, and more.",
};

export default function MusicPage() {
  return <MusicExampleWrapper />;
}
