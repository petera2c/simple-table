import BlogSegmentChrome from "./BlogSegmentChrome";

export default function BlogRouteLayout({ children }: { children: React.ReactNode }) {
  return <BlogSegmentChrome>{children}</BlogSegmentChrome>;
}
