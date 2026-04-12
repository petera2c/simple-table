import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Valid data types
const VALID_TYPES = [
  "infrastructure",
  "billing",
  "hr",
  "manufacturing",
  "sales",
  "music",
  "crm",
] as const;
type DataType = (typeof VALID_TYPES)[number];

// Default row counts for each type
const DEFAULT_ROW_COUNTS: Record<DataType, number> = {
  infrastructure: 50,
  billing: 1000,
  hr: 50,
  manufacturing: 50,
  sales: 50,
  music: 50,
  crm: 800,
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;

    // Validate the type
    if (!VALID_TYPES.includes(type as DataType)) {
      return NextResponse.json(
        { error: `Invalid data type. Must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const dataType = type as DataType;
    const searchParams = request.nextUrl.searchParams;
    const rowCount = parseInt(
      searchParams.get("rowCount") || String(DEFAULT_ROW_COUNTS[dataType]),
      10
    );

    // Read the data file from public/data directory
    const filePath = join(process.cwd(), "public", "data", `${dataType}-data.json`);
    const fileContents = readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    // Special handling for billing (use account count)
    // Each account has ~10 invoices, and each invoice has 1-6 charges (avg 3.5) = ~35 charges per account
    let slicedData;
    if (dataType === "billing") {
      // Calculate accounts needed based on desired leaf row count (charges)
      // Average: ~10 invoices per account * 3.5 charges per invoice (1-6 range) = 35 charges per account
      const accountCount = Math.max(1, Math.ceil(rowCount / 35));
      slicedData = data.slice(0, accountCount);
    } else if (dataType === "music") {
      // Music data only has 50 records, so always send all of them
      slicedData = data;
    } else {
      slicedData = data.slice(0, rowCount);
    }

    return NextResponse.json(slicedData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
