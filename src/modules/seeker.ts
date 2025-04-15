import { IBook } from "./book";

export type ISeekerUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "seeker";
  booksRented?: (IBook & {
    status: "Available" | "Rented";
  })[];
};
export const seekerCollectionName = "seeker";
