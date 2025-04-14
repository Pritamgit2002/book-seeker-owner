"use server";
import { bookCollectionName, IBook } from "@/modules/book";
import { ServerActionResult } from "@/types";
import { logger } from "./logger";
import { mongodb } from "@/lib/mongodb";

export type FetchBooksResult = ServerActionResult<
  Pick<IBook, "name" | "author" | "genre" | "city" | "email">[]
>;

export const fetchBooks = async (): Promise<FetchBooksResult> => {
  try {
    await mongodb.connect();
    const books = await mongodb
      .collection<IBook>(bookCollectionName)
      .find({})
      .toArray();

    return {
      success: true,
      data: books,
      message: "Books fetched successfully",
    };
  } catch (error: any) {
    await logger({
      error,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: `Error fetching books: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }
};
