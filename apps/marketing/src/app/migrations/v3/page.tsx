import BlogLayout from "@/components/BlogLayout";
import MigrationV3Content from "@/components/pages/migrations/MigrationV3Content";

export const metadata = {
  title: "Migration Guide: v2 to v3 | Simple Table",
  description:
    "Migrate from Simple Table v2 to v3. Update imports from simple-table-core to framework adapter packages like @simple-table/react. Includes column virtualization.",
};

export default function MigrationV3Page() {
  return (
    <BlogLayout width="wide">
      <MigrationV3Content />
    </BlogLayout>
  );
}
