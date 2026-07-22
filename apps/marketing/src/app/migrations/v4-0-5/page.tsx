import BlogLayout from "@/components/BlogLayout";
import MigrationV4_0_5Content from "@/components/pages/migrations/MigrationV4_0_5Content";

export const metadata = {
  title: "Migration Guide: API naming (v4.0.5) | Simple Table",
  description:
    "Simple Table 4.0.5 renames several props and types. Update to columns, ColumnDef, enable* flags, onTableReady, and sortable / editable / essential.",
};

export default function MigrationV4_0_5Page() {
  return (
    <BlogLayout width="wide">
      <MigrationV4_0_5Content />
    </BlogLayout>
  );
}
