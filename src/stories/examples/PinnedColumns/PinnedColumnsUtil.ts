import HeaderObject from "../../../types/HeaderObject";

export const displayCell = ({
  hiddenColumns,
  header,
  pinned,
}: {
  hiddenColumns: Record<string, boolean>;
  header: HeaderObject;
  pinned?: "left" | "right";
}) => {
  if (hiddenColumns[header.accessor]) return null;
  else if ((pinned || header.pinned) && header.pinned !== pinned) return null;
  return true;
};

export const SAMPLE_HEADERS: HeaderObject[] = [
  {
    accessor: "productId",
    label: "Product ID",
    pinned: "left",
    type: "string",
    width: 140,
  },
  {
    accessor: "productName",
    label: "Product Name",
    pinned: "left",
    width: 140,
  },
  {
    accessor: "category",
    label: "Category",
    width: 140,
  },
  {
    accessor: "quantity",
    label: "Quantity",
    width: 140,
  },
  {
    accessor: "price",
    label: "Price",
    width: 140,
  },
  {
    accessor: "supplier",
    label: "Supplier",
    width: 140,
  },
  {
    accessor: "location",
    label: "Location",
    width: 140,
  },
  {
    accessor: "reorderLevel",
    label: "Reorder Level",
    width: 140,
  },
  {
    accessor: "sku",
    label: "SKU",
    width: 140,
  },
  {
    accessor: "description",
    label: "Description",
    width: 140,
  },
  {
    accessor: "weight",
    label: "Weight",
    width: 140,
  },
  {
    accessor: "dimensions",
    label: "Dimensions",
    width: 140,
  },
  {
    accessor: "barcode",
    label: "Barcode",
    width: 140,
  },
  {
    accessor: "expirationDate",
    label: "Expiration Date",
    width: 140,
  },
  {
    accessor: "manufacturer",
    label: "Manufacturer",
    width: 140,
  },
];
