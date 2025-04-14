"use server";
import { bookCollectionName, IBook } from "@/modules/book";
import { ServerActionResult } from "@/types";
import { logger } from "./logger";
import { mongodb } from "@/lib/mongodb";

export type fetchBooksByOwnerResult = ServerActionResult<
  Pick<IBook, "name" | "author" | "genre" | "city" | "email">[]
>;

export type fetchBooksByOwnerParams = {
  ownerEmail: string;
};

export const fetchBooksByOwner = async (
  data: fetchBooksByOwnerParams
): Promise<fetchBooksByOwnerResult> => {
  try {
    if (!data.ownerEmail) {
      return {
        success: false,
        message: "Please provide all the required fields",
      };
    }

    await mongodb.connect();
    const books = await mongodb
      .collection<IBook>(bookCollectionName)
      .find({
        email: data.ownerEmail,
      })
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
