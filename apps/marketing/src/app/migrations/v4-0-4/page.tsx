import BlogLayout from "@/components/BlogLayout";
import MigrationV4_0_4Content from "@/components/pages/migrations/MigrationV4_0_4Content";

export const metadata = {
  title: "Migration Guide: API naming (v4.0.4) | Simple Table",
  description:
    "Rename guide for Simple Table 4.0.4: columns instead of defaultHeaders, ColumnDef instead of HeaderObject, enable flags, and sortable / editable / essential column flags only.",
};

export default function MigrationV4_0_4Page() {
  return (
    <BlogLayout width="wide">
      <MigrationV4_0_4Content />
    </BlogLayout>
  );
}
