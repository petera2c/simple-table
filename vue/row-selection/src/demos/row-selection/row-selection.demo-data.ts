// Self-contained demo table setup for this example.
import type { HeaderObject } from "@simple-table/vue";


export type LibraryBook = {
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

export const rowSelectionData: LibraryBook[] = [
  { id: 1001, isbn: "978-0553418026", title: "The Quantum Chronicles", author: "Dr. Elena Vasquez", genre: "Science Fiction", yearPublished: 2019, pages: 324, rating: 4.7, status: "Available", librarySection: "Fiction A-L" },
  { id: 1002, isbn: "978-0316769488", title: "Digital Renaissance", author: "Marcus Chen", genre: "Technology", yearPublished: 2021, pages: 287, rating: 4.2, status: "Checked Out", librarySection: "Technology", borrowedBy: "Sarah Williams" },
  { id: 1003, isbn: "978-1400079179", title: "Echoes of Ancient Wisdom", author: "Prof. Amara Okafor", genre: "Philosophy", yearPublished: 2018, pages: 456, rating: 4.9, status: "Available", librarySection: "Philosophy" },
  { id: 1004, isbn: "978-0062315007", title: "The Midnight Observatory", author: "Luna Rodriguez", genre: "Mystery", yearPublished: 2020, pages: 298, rating: 4.4, status: "Reserved", librarySection: "Fiction M-Z" },
  { id: 1005, isbn: "978-0544003415", title: "Sustainable Architecture Now", author: "Kai Nakamura", genre: "Architecture", yearPublished: 2022, pages: 368, rating: 4.6, status: "Available", librarySection: "Architecture" },
  { id: 1006, isbn: "978-0147516466", title: "Neural Networks Simplified", author: "Dr. Priya Sharma", genre: "Computer Science", yearPublished: 2021, pages: 412, rating: 4.8, status: "Checked Out", librarySection: "Computer Science", borrowedBy: "Alex Thompson" },
  { id: 1007, isbn: "978-0547928227", title: "Culinary Traditions of the World", author: "Isabella Fontana", genre: "Cooking", yearPublished: 2019, pages: 276, rating: 4.3, status: "Available", librarySection: "Lifestyle" },
  { id: 1008, isbn: "978-0525509288", title: "The Biomimicry Revolution", author: "Dr. James Whitfield", genre: "Biology", yearPublished: 2020, pages: 345, rating: 4.5, status: "Available", librarySection: "Science" },
  { id: 1009, isbn: "978-0345391803", title: "Symphonies in Code", author: "Aria Blackwood", genre: "Programming", yearPublished: 2022, pages: 423, rating: 4.7, status: "Checked Out", librarySection: "Computer Science", borrowedBy: "Emma Davis" },
  { id: 1010, isbn: "978-0812988407", title: "Urban Gardens & Green Spaces", author: "Miguel Santos", genre: "Gardening", yearPublished: 2021, pages: 189, rating: 4.1, status: "Available", librarySection: "Lifestyle" },
  { id: 1011, isbn: "978-0374533557", title: "The Psychology of Innovation", author: "Dr. Rachel Kim", genre: "Psychology", yearPublished: 2019, pages: 312, rating: 4.6, status: "Reserved", librarySection: "Psychology" },
  { id: 1012, isbn: "978-0593229439", title: "Climate Solutions for Tomorrow", author: "Dr. Hassan Al-Rashid", genre: "Environmental Science", yearPublished: 2022, pages: 398, rating: 4.8, status: "Available", librarySection: "Science" },
];

export const rowSelectionHeaders: HeaderObject[] = [
  { accessor: "id", label: "Book ID", width: 80, isSortable: true, type: "number" },
  { accessor: "isbn", label: "ISBN", width: 120, isSortable: true, type: "string" },
  { accessor: "title", label: "Title", minWidth: 150, width: "1fr", isSortable: true, type: "string" },
  { accessor: "author", label: "Author", width: 140, isSortable: true, type: "string" },
  { accessor: "genre", label: "Genre", width: 120, isSortable: true, type: "string" },
  { accessor: "yearPublished", label: "Year", width: 80, isSortable: true, type: "number" },
  { accessor: "pages", label: "Pages", width: 80, isSortable: true, type: "number" },
  { accessor: "rating", label: "Rating", width: 80, isSortable: true, type: "number" },
  { accessor: "status", label: "Status", width: 100, isSortable: true, type: "string" },
  { accessor: "librarySection", label: "Section", width: 120, isSortable: true, type: "string" },
];

export const rowSelectionConfig = {
  headers: rowSelectionHeaders,
  rows: rowSelectionData,
  tableProps: {
    enableRowSelection: true,
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
  },
} as const;
