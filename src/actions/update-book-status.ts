import { bookCollectionName, IBook } from "@/modules/book";
import { ServerActionResult } from "@/types";
import { logger } from "./logger";
import { mongodb } from "@/lib/mongodb";
import { ISeekerUser, seekerCollectionName } from "@/modules/seeker";
import { IOwnerUser, ownerCollectionName } from "@/modules/owner";

export type UpdateBookStatusResult = ServerActionResult<undefined>;

export type UpdateBookStatusParams = {
  ownerType: "owner" | "seeker";
  ownerEmail: string;
  bookName: string;
  bookAuthor: string;
  bookEmail: string;
  bookGenre: string;
  status: "available" | "rented";
};

export const updateBookStatus = async (
  data: UpdateBookStatusParams
): Promise<UpdateBookStatusResult> => {
  try {
    if (!data.bookName || !data.bookAuthor || !data.status) {
      return {
        success: false,
        message: "Please provide all the required fields",
      };
    }

    await mongodb.connect();

    if (data.ownerType === "owner") {
      const res = await mongodb
        .collection<IOwnerUser>(ownerCollectionName)
        .updateOne(
          {
            email: data.ownerEmail,
          },
          {
            $pull: {
              booksPublished: {
                name: data.bookName,
                author: data.bookAuthor,
                email: data.bookEmail,
                genre: data.bookGenre,
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
    } else {
      const res = await mongodb
        .collection<ISeekerUser>(seekerCollectionName)
        .updateOne(
          {
            email: data.ownerEmail,
          },
          {
            $pull: {
              bookName: data.bookName,
              bookAuthor: data.bookAuthor,
              bookEmail: data.bookEmail,
              bookGenre: data.bookGenre,
              status: "rented",
            } as any,
          }
        );

      if (!res.acknowledged) {
        return {
          success: false,
          message: "Error deleting book",
        };
      }
    }

    // const res2 = await mongodb
    //   .collection<ISekkerUser>(bookCollectionName)
    //   .find({
    //     email: data.ownerEmail,
    //   })
    //   .toArray();

    // const updatedBooks = res2.map((item) => item.booksRented).flat();
    // console.log("Updated books: ", updatedBooks);

    return {
      success: true,
      data: undefined,
      message: "Book status updated successfully",
    };
  } catch (error: any) {
    await logger({
      error,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: `Error updating book: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }
};
