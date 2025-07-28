import HeaderObject from "../../../types/HeaderObject";

type Product = {
  id: number;
  productName: string;
  category: string;
  brand: string;
  rating: number | "—";
  price: number | "—";
  stockLevel: number | "—";
  isActive: boolean | "—";
  releaseDate: string;
};

export const PRODUCT_HEADERS: HeaderObject<Product>[] = [
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
        cellRenderer: ({ row }: { row: Product }) => {
          if (row.rating === "—") return "—";
          const rating = row.rating as number;
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
        cellRenderer: ({ row }) => {
          if (row.price === "—") return "—";
          const price = row.price as number;

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
        isEditable: true,
        align: "center",
        type: "number",
        filterable: true,
        cellRenderer: ({ row }: { row: Product }) => {
          if (row.stockLevel === "—") return "—";
          const stock = row.stockLevel as number;

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
        isEditable: true,
        align: "center",
        type: "boolean",
        filterable: true,
        cellRenderer: ({ row }: { row: Product }) => {
          if (row.isActive === "—") return "—";
          const isActive = row.isActive as boolean;
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
      {
        accessor: "releaseDate",
        label: "Release Date",
        width: "1fr",
        isSortable: true,
        isEditable: true,
        align: "center",
        type: "date",
        filterable: true,
        cellRenderer: ({ row }: { row: Product }) => {
          if (row.releaseDate === "—") return "—";
          // Parse ISO date string directly to avoid timezone issues
          const dateString = row.releaseDate as string;
          if (!dateString) return "—";
          const [year, month, day] = dateString.split("-").map(Number);
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return `${monthNames[month - 1]} ${day}, ${year}`;
        },
      },
    ],
  },
];
