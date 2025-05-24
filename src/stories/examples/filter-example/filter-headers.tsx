import Row from "../../../types/Row";
import HeaderObject from "../../../types/HeaderObject";

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
        isEditable: false,
        align: "left",
        type: "string",
        filterable: true,
      },
      {
        accessor: "brand",
        label: "Brand",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "left",
        type: "string",
        filterable: true,
      },
      {
        accessor: "rating",
        label: "Rating",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "center",
        type: "number",
        filterable: true,
        cellRenderer: ({ row }: { row: Row }) => {
          if (row.rowData.rating === "—") return "—";
          const rating = row.rowData.rating as number;
          const stars = "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));

          // Color code based on rating
          let ratingClass = "text-gray-400";
          if (rating >= 4.5) ratingClass = "text-green-600";
          else if (rating >= 4.0) ratingClass = "text-green-500";
          else if (rating >= 3.5) ratingClass = "text-yellow-500";
          else if (rating >= 3.0) ratingClass = "text-orange-500";
          else ratingClass = "text-red-500";

          return (
            <div className="flex items-center justify-center">
              <span className={ratingClass}>{stars}</span>
              <span className="ml-1 text-xs text-gray-600">({rating.toFixed(1)})</span>
            </div>
          );
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
        isEditable: false,
        align: "right",
        type: "number",
        filterable: true,
        cellRenderer: ({ row }) => {
          if (row.rowData.price === "—") return "—";
          const price = row.rowData.price as number;

          // Color code based on price tiers
          let priceClass = "text-gray-700";
          if (price > 500) priceClass = "text-purple-700 font-bold";
          else if (price > 200) priceClass = "text-blue-600";
          else if (price > 100) priceClass = "text-green-600";
          else if (price > 50) priceClass = "text-yellow-600";
          else priceClass = "text-gray-600";

          return (
            <span className={priceClass}>
              $
              {price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        accessor: "stockLevel",
        label: "Stock",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "center",
        type: "number",
        filterable: true,
        cellRenderer: ({ row }: { row: Row }) => {
          if (row.rowData.stockLevel === "—") return "—";
          const stock = row.rowData.stockLevel as number;

          // Color code based on stock levels
          let stockClass = "";
          let stockText = "";

          if (stock === 0) {
            stockClass = "text-red-600 font-bold";
            stockText = "Out of Stock";
          } else if (stock <= 5) {
            stockClass = "text-orange-600 font-semibold";
            stockText = `Low (${stock})`;
          } else if (stock <= 20) {
            stockClass = "text-yellow-600";
            stockText = `${stock} units`;
          } else {
            stockClass = "text-green-600";
            stockText = `${stock} units`;
          }

          return <span className={stockClass}>{stockText}</span>;
        },
      },
      {
        accessor: "isActive",
        label: "Status",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "center",
        type: "boolean",
        filterable: true,
        cellRenderer: ({ row }: { row: Row }) => {
          if (row.rowData.isActive === "—") return "—";
          const isActive = row.rowData.isActive as boolean;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
    ],
  },
];
