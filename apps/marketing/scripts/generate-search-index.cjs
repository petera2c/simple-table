const fs = require("fs");
const path = require("path");

// Define the search index structure
// export interface SearchableDoc {
//   id: string;
//   path: string;
//   title: string;
//   description: string;
//   keywords: string[];
//   content: string;
//   section: string;
//   headings: string[];
// }

const docsContentPath = path.join(__dirname, "../src/components/pages/docs-pages");

/**
 * Extract text content from a React component file
 */
function extractTextFromComponent(componentPath) {
  try {
    // Read the component file as text
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    const headings = [];
    const paragraphs = [];

    // Extract h1, h2, h3 text from JSX
    const headingRegex = /<h[123][^>]*>(.*?)<\/h[123]>/gs;
    let match;
    while ((match = headingRegex.exec(componentSource)) !== null) {
      const headingContent = match[1]
        .replace(/{[^}]+}/g, "") // Remove JSX expressions
        .replace(/<[^>]+>/g, "") // Remove HTML tags
        .trim();
      if (headingContent) {
        headings.push(headingContent);
      }
    }

    // Extract paragraph text
    const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gs;
    while ((match = paragraphRegex.exec(componentSource)) !== null) {
      const paragraphContent = match[1]
        .replace(/{[^}]+}/g, "") // Remove JSX expressions
        .replace(/<[^>]+>/g, "") // Remove HTML tags
        .trim();
      if (paragraphContent) {
        paragraphs.push(paragraphContent);
      }
    }

    // Extract list items
    const listItemRegex = /<li[^>]*>(.*?)<\/li>/gs;
    while ((match = listItemRegex.exec(componentSource)) !== null) {
      const listItemContent = match[1]
        .replace(/{[^}]+}/g, "") // Remove JSX expressions
        .replace(/<[^>]+>/g, "") // Remove HTML tags
        .trim();
      if (listItemContent) {
        paragraphs.push(listItemContent);
      }
    }

    // Extract string literals (for constant text)
    const stringLiteralRegex = /["'`]([^"'`]{20,}?)["'`]/g;
    while ((match = stringLiteralRegex.exec(componentSource)) !== null) {
      const stringContent = match[1].trim();
      // Filter out imports, URLs, and code-like strings
      if (
        stringContent &&
        !stringContent.includes("import") &&
        !stringContent.includes("http") &&
        !stringContent.includes("className") &&
        !stringContent.includes("=") &&
        stringContent.length < 500 &&
        /[a-z]{3,}/i.test(stringContent) // Must contain actual words
      ) {
        paragraphs.push(stringContent);
      }
    }

    const content = paragraphs
      .filter((p, index, self) => self.indexOf(p) === index) // Remove duplicates
      .join(" ");

    return {
      headings: headings.filter((h, index, self) => self.indexOf(h) === index),
      content,
    };
  } catch (error) {
    console.error(`Error extracting text from ${componentPath}:`, error);
    return {
      headings: [],
      content: "",
    };
  }
}

/**
 * Get section name from doc path
 */
function getSectionName(docPath) {
  const sectionMap = {
    "/docs/installation": "Getting Started",
    "/docs/quick-start": "Getting Started",
    "/docs/api-reference": "Getting Started",
    "/docs/column-width": "Column Features",
    "/docs/column-resizing": "Column Features",
    "/docs/column-reordering": "Column Features",
    "/docs/column-visibility": "Column Features",
    "/docs/column-pinning": "Column Features",
    "/docs/column-alignment": "Column Features",
    "/docs/column-sorting": "Column Features",
    "/docs/column-filtering": "Column Features",
    "/docs/column-selection": "Column Features",
    "/docs/column-editing": "Column Features",
    "/docs/nested-headers": "Column Features",
    "/docs/collapsible-columns": "Column Features",
    "/docs/tooltips": "Column Features",
    "/docs/row-selection": "Row Features",
    "/docs/row-grouping": "Row Features",
    "/docs/aggregate-functions": "Row Features",
    "/docs/row-height": "Row Features",
    "/docs/cell-editing": "Cell Features",
    "/docs/cell-highlighting": "Cell Features",
    "/docs/cell-renderer": "Cell Features",
    "/docs/cell-clicking": "Cell Features",
    "/docs/header-renderer": "Advanced Features",
    "/docs/footer-renderer": "Advanced Features",
    "/docs/pagination": "Advanced Features",
    "/docs/live-updates": "Advanced Features",
    "/docs/infinite-scroll": "Advanced Features",
    "/docs/csv-export": "Advanced Features",
    "/docs/themes": "Customization",
    "/docs/custom-icons": "Customization",
    "/docs/custom-theme": "Customization",
  };

  return sectionMap[docPath] || "Documentation";
}

/**
 * Get SEO metadata for a doc page
 */
function getSEOMetadata(docId) {
  const seoMap = {
    installation: {
      title: "Install Simple Table: React Data Grid Setup",
      description:
        "Install Simple Table in your React app in minutes. A 16 kB react-table for datagrids and data tables with TypeScript support and npm setup.",
      keywords:
        "simple-table, simple-table-core, react-table, react-grid, data-grid, datagrid, data table, installation, npm setup, typescript table",
    },
    "quick-start": {
      title: "Quick Start with Simple Table React Grid",
      description:
        "Get started with Simple Table in React in 5 minutes. A 16 kB react-table for datagrids and data tables with TypeScript support.",
      keywords:
        "simple-table, simple-table-core, react-table, react-grid, data-grid, datagrid, data table, quick start, typescript table, setup guide",
    },
    "api-reference": {
      title: "Simple Table API Reference: React Grid Props",
      description:
        "Complete API reference for Simple Table props and HeaderObject configuration. All react-table props for datagrids and data tables with TypeScript support.",
      keywords:
        "simple-table, simple-table-core, react-table, react-grid, data-grid, datagrid, data table, api reference, props reference, typescript table, documentation",
    },
    "column-width": {
      title: "Column Auto-Sizing in Simple Table React Grid",
      description:
        "Auto-size columns in your react-table with Simple Table. Use '1fr' for flexible column widths that adapt to available space in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column width, auto-sizing, flexible columns, responsive width, 1fr, column layout, typescript table, responsive table, adaptive columns",
    },
    "column-resizing": {
      title: "Column Resizing in Simple Table React Grid",
      description:
        "Resize columns in your react-table with Simple Table. Enable smooth drag-to-resize in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column resizing, table layout, typescript table, responsive table",
    },
    "column-reordering": {
      title: "Column Reordering in Simple Table React Grid",
      description:
        "Reorder columns in your react-table with Simple Table. Enable drag-and-drop in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column reordering, table customization, typescript table, user personalization",
    },
    "column-visibility": {
      title: "Column Visibility in Simple Table React Grid",
      description:
        "Control column visibility in your react-table with Simple Table. Show or hide columns in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column visibility, table customization, typescript table, data focus",
    },
    "column-pinning": {
      title: "Column Pinning with Simple Table React Grid",
      description:
        "Pin columns in your react-table with Simple Table. Keep key data visible in your datagrid or data table while scrolling.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column pinning, sticky columns, typescript table, table navigation",
    },
    "column-alignment": {
      title: "Column Alignment in Simple Table React Grid",
      description:
        "Align columns in your react-table with Simple Table. Ensure perfect layouts for your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column alignment, table layout, typescript table, responsive table",
    },
    "column-sorting": {
      title: "Column Sorting with Simple Table React Grid",
      description:
        "Sort columns in your react-table with Simple Table. Add powerful sorting to your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column sorting, table sorting, typescript table, data management",
    },
    "column-filtering": {
      title: "Column Filtering with Simple Table React Grid",
      description:
        "Add powerful filtering to your react-table with Simple Table. Smart filters for text, numbers, dates, and dropdowns in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column filtering, table filtering, data filtering, typescript table, search table",
    },
    "column-selection": {
      title: "Column Selection in Simple Table React Grid",
      description:
        "Enable column selection in your react-table with Simple Table. Click to select columns in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column selection, selectable columns, interactive table, typescript table, column interaction",
    },
    "column-editing": {
      title: "Column Editing with Simple Table React Grid",
      description:
        "Edit columns dynamically in your react-table with Simple Table. Add, rename, and modify columns in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, column editing, editable headers, dynamic columns, typescript table, table customization",
    },
    "nested-headers": {
      title: "Nested Headers in Simple Table React Grid",
      description:
        "Add nested headers to your react-table with Simple Table. Organize complex data in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, nested headers, table structure, typescript table, data hierarchy",
    },
    "collapsible-columns": {
      title: "Collapsible Columns in Simple Table React Grid",
      description:
        "Create collapsible column groups in your react application with Simple Table. Organize complex data with expandable/collapsible headers in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, collapsible columns, column groups, expandable headers, nested columns, typescript table, space optimization",
    },
    tooltips: {
      title: "Tooltips in Simple Table React Grid",
      description:
        "Add helpful tooltips to your react-table with Simple Table. Provide context and guidance for column headers in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, tooltips, column tooltips, table help, user guidance, typescript table, accessibility",
    },
    "row-selection": {
      title: "Row Selection in Simple Table React Grid",
      description:
        "Add row selection to your react-table with Simple Table. Enable bulk operations and multi-row interactions in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, row selection, multi-select, bulk operations, checkbox selection, typescript table, interactive table",
    },
    "row-grouping": {
      title: "Row Grouping in Simple Table React Grid",
      description:
        "Group rows in your react-table with Simple Table. Organize hierarchical data in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, row grouping, hierarchical data, typescript table, data organization",
    },
    "aggregate-functions": {
      title: "Aggregate Functions in Simple Table React Grid",
      description:
        "Add aggregate functions to your react-table with Simple Table. Sum, count, average, and more in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, aggregate functions, table aggregation, typescript table, data summary",
    },
    "row-height": {
      title: "Row Height in Simple Table React Grid",
      description:
        "Adjust row height in your react-table with Simple Table. Customize your datagrid or data table with TypeScript support and responsive design.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, row height, table layout, typescript table, responsive table",
    },
    "cell-editing": {
      title: "Cell Editing with Simple Table React Grid",
      description:
        "Enable cell editing in your react-table with Simple Table. Add inline editing to your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, cell editing, editable table, typescript table, interactive table",
    },
    "cell-highlighting": {
      title: "Cell Highlighting in Simple Table React Grid",
      description:
        "Highlight cells in your react-table with Simple Table. Add selection to your datagrid or data table for better data analysis.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, cell highlighting, table selection, typescript table, data analysis",
    },
    "cell-renderer": {
      title: "Custom Cell Renderers with Simple Table",
      description:
        "Create custom cell renderers for your react-table with Simple Table. Display rich content in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, cell renderer, custom table cells, typescript table, data visualization",
    },
    "cell-clicking": {
      title: "Cell Clicking Events in Simple Table React Grid",
      description:
        "Handle cell click events in your react-table with Simple Table. Add interactive cell behavior to your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, cell clicking, cell events, interactive table, cell interactions, typescript table, onclick handlers",
    },
    "header-renderer": {
      title: "Custom Header Renderers with Simple Table",
      description:
        "Create custom header renderers for your react-table with Simple Table. Style column headers with custom designs, icons, and interactive elements.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, header renderer, custom headers, table headers, typescript table, header customization",
    },
    "footer-renderer": {
      title: "Custom Footer Renderers with Simple Table",
      description:
        "Create custom footer renderers for your react-table with Simple Table. Build custom pagination controls and footer UI for your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, footer renderer, custom footer, table footer, pagination footer, typescript table, footer customization",
    },
    pagination: {
      title: "Pagination with Simple Table React Data Grid",
      description:
        "Add pagination to your react-table with Simple Table. Manage large datasets in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, pagination, large datasets, typescript table, data navigation",
    },
    "live-updates": {
      title: "Live Updates in Simple Table React Grid",
      description:
        "Add live updates to your react-table with Simple Table. Use tableRef for real-time datagrids and data tables with responsive design.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, live updates, real-time table, typescript table, responsive table",
    },
    "infinite-scroll": {
      title: "Infinite Scroll with Simple Table React Grid",
      description:
        "Add infinite scroll to your react-table with Simple Table. Load more data on scroll in your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, infinite scroll, load more data, lazy loading, typescript table, large datasets",
    },
    "csv-export": {
      title: "CSV Export with Simple Table React Grid",
      description:
        "Export your react-table data to CSV with Simple Table. One-click CSV download from your datagrid or data table with TypeScript support.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, csv export, export to csv, download csv, table export, typescript table, data export",
    },
    themes: {
      title: "Themes for Simple Table React Data Grid",
      description:
        "Explore themes for your react-table with Simple Table. Style your datagrid or data table with light, dark, or custom themes using TypeScript.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, table themes, table styling, typescript table, responsive design",
    },
    "custom-icons": {
      title: "Custom Icons in Simple Table React Grid",
      description:
        "Add custom icons to your react-table with Simple Table. Personalize your datagrid or data table with TypeScript support and responsive design.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, custom icons, table customization, typescript table, ui design",
    },
    "custom-theme": {
      title: "Custom Themes for Simple Table React Grid",
      description:
        "Create custom themes for your react-table with Simple Table. Style your datagrid or data table with TypeScript support and responsive design.",
      keywords:
        "simple-table, react-table, react-grid, data-grid, datagrid, data table, custom theme, table styling, typescript table, responsive design",
    },
  };

  const metadata = seoMap[docId] || {
    title: "Simple Table Documentation",
    description: "Documentation for Simple Table React Grid",
    keywords: "simple-table, react-table, documentation",
  };

  return {
    ...metadata,
    keywords: metadata.keywords.split(", "),
  };
}

/**
 * Generate search index for all documentation pages
 */
function generateSearchIndex() {
  console.log("🔍 Generating search index for documentation pages...\n");

  const searchIndex = [];
  const docsPages = fs.readdirSync(docsContentPath).filter((file) => file.endsWith("Content.tsx"));

  for (const pageFile of docsPages) {
    const componentPath = path.join(docsContentPath, pageFile);
    // Convert PascalCase to kebab-case (e.g., CSVExportContent -> csv-export)
    const docId = pageFile
      .replace("Content.tsx", "")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2") // Handle acronyms like CSV
      .replace(/([a-z\d])([A-Z])/g, "$1-$2") // Handle regular PascalCase
      .toLowerCase();

    const docPath = `/docs/${docId}`;

    console.log(`Processing: ${docId}`);

    // Extract text from component
    const { headings, content } = extractTextFromComponent(componentPath);

    // Get SEO metadata
    const { title, description, keywords } = getSEOMetadata(docId);

    // Get section name
    const section = getSectionName(docPath);

    // Create search index entry
    const searchEntry = {
      id: docId,
      path: docPath,
      title,
      description,
      keywords,
      content,
      section,
      headings,
    };

    searchIndex.push(searchEntry);
  }

  // Write search index to file
  const outputPath = path.join(__dirname, "../src/constants/docsSearchIndex.json");
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));

  console.log(`\n✅ Search index generated successfully!`);
  console.log(`📄 ${searchIndex.length} pages indexed`);
  console.log(`💾 Output: ${outputPath}`);

  // Print summary
  console.log("\n📊 Index Summary:");
  const sections = [...new Set(searchIndex.map((entry) => entry.section))];
  sections.forEach((section) => {
    const count = searchIndex.filter((entry) => entry.section === section).length;
    console.log(`   ${section}: ${count} pages`);
  });
}

// Run the script
generateSearchIndex();
