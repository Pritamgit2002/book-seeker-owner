import { IBook } from "./book";

export type IOwnerUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "owner";
  booksPublished?: IBook[];
  booksRented?: (IBook & {
    status: "Available" | "Rented";
  })[];
};

export const ownerCollectionName = "owner";
