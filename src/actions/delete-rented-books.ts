"use server";
import { mongodb } from "@/lib/mongodb";
import { IOwnerUser, ownerCollectionName } from "@/modules/owner";
import { ISekkerUser, seekerCollectionName } from "@/modules/seeker";
import { ServerActionResult } from "@/types";

export type DeleteRentedBooksResult = ServerActionResult<undefined>;

export type DeleteRentedBooksParams = {
  ownerEmail: string;
  ownerType: string;
  bookName: string;
  bookAuthor: string;
  bookGenre: string;
  bookCity: string;
  bookEmail: string;
};

export const deleteRentedBooks = async (
  data: DeleteRentedBooksParams
): Promise<DeleteRentedBooksResult> => {
  try {
    if (!data.ownerEmail || !data.ownerType || !data.bookName) {
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
              booksRented: {
                name: data.bookName,
              },
            },
          }
        );

      if (!res.acknowledged) {
        return {
          success: false,
          message: "Failed to delete book",
        };
      }
    } else {
      const res = await mongodb
        .collection<ISekkerUser>(seekerCollectionName)
        .updateOne(
          {
            email: data.ownerEmail,
          },
          {
            $pull: {
              booksRented: {
                name: data.bookName,
              },
            },
          } as any
        );

      if (!res.acknowledged) {
        return {
          success: false,
          message: "Failed to delete book",
        };
      }
    }

    return {
      success: true,
      data: undefined,
      message: "Book deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting rented book:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};
