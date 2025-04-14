import { IBook } from "./book";

export type ISekkerUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "sekker";
  booksRented?: (IBook & {
    status: "Available" | "Rented";
  })[];
};
export const seekerCollectionName = "seeker";
