import BlogLayout from "@/components/BlogLayout";
import MigrationV2_4_1Content from "@/components/pages/migrations/MigrationV2_4_1Content";

export const metadata = {
  title: "Migration Guide: v2.4.1 | Simple Table",
  description:
    "Migration guide for upgrading to Simple Table v2.4.1 with enhanced column editor, unified icons API, and breaking changes.",
};

export default function MigrationV2_4_1Page() {
  return (
    <BlogLayout width="wide">
      <MigrationV2_4_1Content />
    </BlogLayout>
  );
}
