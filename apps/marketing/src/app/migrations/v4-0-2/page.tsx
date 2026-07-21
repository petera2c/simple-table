import BlogLayout from "@/components/BlogLayout";
import MigrationV4_0_2Content from "@/components/pages/migrations/MigrationV4_0_2Content";

export const metadata = {
  title: "Migration Guide: API naming (v4.0.2) | Simple Table",
  description:
    "Rename guide for Simple Table 4.0.2: columns instead of defaultHeaders, ColumnDef instead of HeaderObject, enableColumnEditor, enablePagination, onTableReady, and column flag aliases.",
};

export default function MigrationV4_0_2Page() {
  return (
    <BlogLayout width="wide">
      <MigrationV4_0_2Content />
    </BlogLayout>
  );
}
