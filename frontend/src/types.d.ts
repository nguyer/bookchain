export interface Book {
  bookId: string;
  title: string;
  author: string;
  coverUrl: string;
  year: string;
  isbn: string;
  borrower: string;
}

export interface Record {
  time: string;
  event: "borrowed" | "returned";
  borrowedBy?: string;
  returnedBy?: string;
}
