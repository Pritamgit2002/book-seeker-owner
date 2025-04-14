"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "./logger";
import { IOwnerUser, ownerCollectionName } from "@/modules/owner";
import { ServerActionResult } from "@/types";
import { bookCollectionName, IBook } from "@/modules/book";

export type DeleteBookByOwnerResult = ServerActionResult<undefined>;

export type DeleteBookByOwnerParams = {
  ownerEmail: string;
  bookName: string;
  bookAuthor: string;
};

export const deleteBookByOwner = async (
  data: DeleteBookByOwnerParams
): Promise<DeleteBookByOwnerResult> => {
  try {
    if (!data.ownerEmail || !data.bookName) {
      return {
        success: false,
        message: "Please provide all the required fields",
      };
    }

    await mongodb.connect();
    const res = await mongodb
      .collection<IOwnerUser>(ownerCollectionName)
      .updateOne(
        {
          email: data.ownerEmail,
          bookName: data.bookName,
          bookAuthor: data.bookAuthor,
        },
        {
          $pull: {
            booksPublished: {
              name: data.bookName,
            },
          } as any,
        }
      );

    if (!res.acknowledged) {
      return {
        success: false,
        message: "Error deleting book",
      };
    }

    const res2 = await mongodb.collection<IBook>(bookCollectionName).deleteOne({
      name: data.bookName,
    });

    if (!res2.acknowledged) {
      return {
        success: false,
        message: "Error deleting book",
      };
    }

    return {
      success: true,
      data: undefined,
      message: `Book ${data.bookName} deleted successfully`,
    };
  } catch (error: any) {
    await logger({
      error,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: `Error deleting book: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }
};
