/**
 * Filter example headers – ported from React filter-headers (vanilla-compatible).
 */
import type { HeaderObject } from "../../../src/index";

export const PRODUCT_HEADERS: HeaderObject[] = [
  {
    accessor: "productName",
    label: "Product",
    width: "2fr",
    minWidth: 200,
    isSortable: true,
    filterable: true,
    type: "string",
  },
  {
    accessor: "details",
    label: "Product Details",
    width: 500,
    isSortable: false,
    children: [
      {
        accessor: "category",
        label: "Category",
        width: "1fr",
        isSortable: true,
        isEditable: true,
        align: "left",
        type: "enum",
        filterable: true,
        enumOptions: [
          { label: "Electronics", value: "Electronics" },
          { label: "Computers", value: "Computers" },
          { label: "Audio", value: "Audio" },
          { label: "Gaming", value: "Gaming" },
          { label: "Clothing", value: "Clothing" },
          { label: "Footwear", value: "Footwear" },
          { label: "Kitchen", value: "Kitchen" },
          { label: "Home & Garden", value: "Home & Garden" },
          { label: "Automotive", value: "Automotive" },
          { label: "Wearables", value: "Wearables" },
          { label: "Photography", value: "Photography" },
          { label: "Outdoor", value: "Outdoor" },
          { label: "Home Security", value: "Home Security" },
          { label: "Smart Home", value: "Smart Home" },
          { label: "VR/AR", value: "VR/AR" },
        ],
      },
      {
        accessor: "brand",
        label: "Brand",
        width: "1fr",
        isSortable: true,
        isEditable: true,
        align: "left",
        type: "enum",
        filterable: true,
        enumOptions: [
          { label: "Apple", value: "Apple" },
          { label: "Samsung", value: "Samsung" },
          { label: "Dell", value: "Dell" },
          { label: "Sony", value: "Sony" },
          { label: "Nintendo", value: "Nintendo" },
          { label: "Levi's", value: "Levi's" },
          { label: "Nike", value: "Nike" },
          { label: "Adidas", value: "Adidas" },
          { label: "Instant Pot", value: "Instant Pot" },
          { label: "KitchenAid", value: "KitchenAid" },
          { label: "Dyson", value: "Dyson" },
          { label: "Tesla", value: "Tesla" },
          { label: "Fitbit", value: "Fitbit" },
          { label: "Bose", value: "Bose" },
          { label: "Microsoft", value: "Microsoft" },
          { label: "Canon", value: "Canon" },
          { label: "GoPro", value: "GoPro" },
          { label: "Patagonia", value: "Patagonia" },
          { label: "YETI", value: "YETI" },
          { label: "Weber", value: "Weber" },
          { label: "iRobot", value: "iRobot" },
          { label: "Ring", value: "Ring" },
          { label: "Google", value: "Google" },
          { label: "Philips", value: "Philips" },
          { label: "Meta", value: "Meta" },
        ],
      },
      {
        accessor: "rating",
        label: "Rating",
        width: "1fr",
        isSortable: true,
        isEditable: true,
        align: "center",
        type: "number",
        filterable: true,
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === undefined || value === null || value === "—") return "—";
          const rating = Number(value);
          const stars = "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
          return `${stars} (${rating.toFixed(1)})`;
        },
      },
    ],
  },
  {
    accessor: "pricing",
    label: "Pricing & Inventory",
    width: "1fr",
    isSortable: false,
    children: [
      {
        accessor: "price",
        label: "Price",
        width: "1fr",
        isSortable: true,
        isEditable: true,
        align: "right",
        type: "number",
        filterable: true,
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === undefined || value === null || value === "—") return "—";
          return `$${Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "stockLevel",
        label: "Stock",
        width: "1fr",
        isSortable: true,
        isEditable: true,
        align: "center",
        type: "number",
        filterable: true,
        cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
          if (row.stockLevel === "—") return "—";
          const stock = Number(row.stockLevel);
          if (stock === 0) return "Out of Stock";
          if (stock <= 5) return `Low (${stock})`;
          return `${stock} units`;
        },
      },
      {
        accessor: "isActive",
        label: "Status",
        width: "1fr",
        isSortable: true,
        isEditable: true,
        align: "center",
        type: "boolean",
        filterable: true,
        cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
          row.isActive === "—" ? "—" : (row.isActive as boolean) ? "Active" : "Inactive",
      },
      {
        accessor: "releaseDate",
        label: "Release Date",
        width: "1fr",
        isSortable: true,
        isEditable: true,
        align: "center",
        type: "date",
        filterable: true,
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === undefined || value === null || value === "—") return "—";
          const dateString = String(value);
          const [year, month, day] = dateString.split("-").map(Number);
          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ];
          return `${monthNames[month - 1]} ${day}, ${year}`;
        },
      },
    ],
  },
];
