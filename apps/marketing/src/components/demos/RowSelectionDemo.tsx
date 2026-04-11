import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { CellRendererProps, ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

type LibraryBook = {
  id: number;
  isbn: string;
  title: string;
  author: string;
  genre: string;
  yearPublished: number;
  pages: number;
  rating: number;
  status: string;
  librarySection: string;
  borrowedBy?: string;
};

// Define headers
const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "Book ID", width: 80, isSortable: true, type: "number" },
  { accessor: "isbn", label: "ISBN", width: 120, isSortable: true, type: "string" },
  {
    accessor: "title",
    label: "Title",
    minWidth: 150,
    width: "1fr",
    isSortable: true,
    type: "string",
  },
  { accessor: "author", label: "Author", width: 140, isSortable: true, type: "string" },
  { accessor: "genre", label: "Genre", width: 120, isSortable: true, type: "string" },
  { accessor: "yearPublished", label: "Year", width: 80, isSortable: true, type: "number" },
  { accessor: "pages", label: "Pages", width: 80, isSortable: true, type: "number" },
  { accessor: "rating", label: "Rating", width: 80, isSortable: true, type: "number" },
  {
    accessor: "status",
    label: "Status",
    width: 100,
    isSortable: true,
    type: "string",
    cellRenderer: ({ accessor, colIndex, row, theme }: CellRendererProps) => (
      <span
        style={{
          color:
            row.status === "Available" ? "green" : row.status === "Checked Out" ? "orange" : "red",
          fontWeight: "bold",
        }}
      >
        {String(row.status)}
      </span>
    ),
  },
  { accessor: "librarySection", label: "Section", width: 120, isSortable: true, type: "string" },
];

// Sample library books data - completely unique from other demos
const LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 1001,
    isbn: "978-0553418026",
    title: "The Quantum Chronicles",
    author: "Dr. Elena Vasquez",
    genre: "Science Fiction",
    yearPublished: 2019,
    pages: 324,
    rating: 4.7,
    status: "Available",
    librarySection: "Fiction A-L",
  },
  {
    id: 1002,
    isbn: "978-0316769488",
    title: "Digital Renaissance",
    author: "Marcus Chen",
    genre: "Technology",
    yearPublished: 2021,
    pages: 287,
    rating: 4.2,
    status: "Checked Out",
    librarySection: "Technology",
    borrowedBy: "Sarah Williams",
  },
  {
    id: 1003,
    isbn: "978-1400079179",
    title: "Echoes of Ancient Wisdom",
    author: "Prof. Amara Okafor",
    genre: "Philosophy",
    yearPublished: 2018,
    pages: 456,
    rating: 4.9,
    status: "Available",
    librarySection: "Philosophy",
  },
  {
    id: 1004,
    isbn: "978-0062315007",
    title: "The Midnight Observatory",
    author: "Luna Rodriguez",
    genre: "Mystery",
    yearPublished: 2020,
    pages: 298,
    rating: 4.4,
    status: "Reserved",
    librarySection: "Fiction M-Z",
  },
  {
    id: 1005,
    isbn: "978-0544003415",
    title: "Sustainable Architecture Now",
    author: "Kai Nakamura",
    genre: "Architecture",
    yearPublished: 2022,
    pages: 368,
    rating: 4.6,
    status: "Available",
    librarySection: "Architecture",
  },
  {
    id: 1006,
    isbn: "978-0147516466",
    title: "Neural Networks Simplified",
    author: "Dr. Priya Sharma",
    genre: "Computer Science",
    yearPublished: 2021,
    pages: 412,
    rating: 4.8,
    status: "Checked Out",
    librarySection: "Computer Science",
    borrowedBy: "Alex Thompson",
  },
  {
    id: 1007,
    isbn: "978-0547928227",
    title: "Culinary Traditions of the World",
    author: "Isabella Fontana",
    genre: "Cooking",
    yearPublished: 2019,
    pages: 276,
    rating: 4.3,
    status: "Available",
    librarySection: "Lifestyle",
  },
  {
    id: 1008,
    isbn: "978-0525509288",
    title: "The Biomimicry Revolution",
    author: "Dr. James Whitfield",
    genre: "Biology",
    yearPublished: 2020,
    pages: 345,
    rating: 4.5,
    status: "Available",
    librarySection: "Science",
  },
  {
    id: 1009,
    isbn: "978-0345391803",
    title: "Symphonies in Code",
    author: "Aria Blackwood",
    genre: "Programming",
    yearPublished: 2022,
    pages: 423,
    rating: 4.7,
    status: "Checked Out",
    librarySection: "Computer Science",
    borrowedBy: "Emma Davis",
  },
  {
    id: 1010,
    isbn: "978-0812988407",
    title: "Urban Gardens & Green Spaces",
    author: "Miguel Santos",
    genre: "Gardening",
    yearPublished: 2021,
    pages: 189,
    rating: 4.1,
    status: "Available",
    librarySection: "Lifestyle",
  },
  {
    id: 1011,
    isbn: "978-0374533557",
    title: "The Psychology of Innovation",
    author: "Dr. Rachel Kim",
    genre: "Psychology",
    yearPublished: 2019,
    pages: 312,
    rating: 4.6,
    status: "Reserved",
    librarySection: "Psychology",
  },
  {
    id: 1012,
    isbn: "978-0593229439",
    title: "Climate Solutions for Tomorrow",
    author: "Dr. Hassan Al-Rashid",
    genre: "Environmental Science",
    yearPublished: 2022,
    pages: 398,
    rating: 4.8,
    status: "Available",
    librarySection: "Science",
  },
];

const RowSelectionDemo = ({ theme }: { height?: string | number; theme?: Theme }) => {
  const [selectedRowsInfo, setSelectedRowsInfo] = useState<LibraryBook[]>([]);
  const [lastAction, setLastAction] = useState<string>("");

  const handleRowSelectionChange = ({ row, isSelected, selectedRows }: any) => {
    const action = isSelected ? "Selected" : "Deselected";
    setLastAction(`${action}: "${row.title}" by ${row.author}`);

    // Convert Set to Array for display
    const selectedRowsArray = Array.from(selectedRows)
      .map((rowId) => LIBRARY_BOOKS.find((book) => String(book.id) === rowId))
      .filter(Boolean) as LibraryBook[];

    setSelectedRowsInfo(selectedRowsArray);
  };

  return (
    <div>
      {/* Demo Info Panel */}
      <div
        style={{
          marginBottom: "16px",
          padding: "12px",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          fontSize: "14px",
          border: "1px solid #e9ecef",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#495057" }}>
          Library Management Demo
        </h3>
        <p style={{ margin: "0 0 8px 0", color: "#6c757d" }}>
          • Click the header checkbox to select/deselect all books
        </p>
        <p style={{ margin: "0 0 8px 0", color: "#6c757d" }}>
          • Click individual row checkboxes to select specific books
        </p>
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <strong style={{ color: "#495057" }}>Selected Books:</strong>{" "}
          {selectedRowsInfo.length > 0 && (
            <span
              style={{
                fontSize: "12px",
                color: "#6c757d",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              ({selectedRowsInfo.map((book) => book.title).join(", ")})
            </span>
          )}
        </div>
      </div>

      <SimpleTable
        defaultHeaders={headers}
        rows={LIBRARY_BOOKS}
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
        height="348px"
        theme={theme}
        columnResizing={true}
        columnReordering={true}
        selectableCells={true}
      />
    </div>
  );
};

export default RowSelectionDemo;
