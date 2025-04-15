"use server";
import { mongodb } from "@/lib/mongodb";
import { IOwnerUser, ownerCollectionName } from "@/modules/owner";
import { ISeekerUser, seekerCollectionName } from "@/modules/seeker";
import { ServerActionResult } from "@/types";
import { logger } from "./logger";

export type AddRentedBooksResult = ServerActionResult<undefined>;

export type AddRentedBooksParams = {
  ownerEmail: string;
  ownerType: string;
  bookName: string;
  bookAuthor: string;
  bookGenre: string;
  bookCity: string;
  bookEmail: string;
};

export const addRentedBooks = async (
  data: AddRentedBooksParams
): Promise<AddRentedBooksResult> => {
  try {
    if (!data.ownerEmail || !data.ownerType || !data.bookName) {
      return {
        success: false,
        message: "Please log in to access",
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
            $push: {
              booksRented: {
                name: data.bookName,
                author: data.bookAuthor,
                genre: data.bookGenre,
                city: data.bookCity,
                email: data.bookEmail,
                status: "Rented",
              } as any,
            },
          }
        );

      if (!res.acknowledged) {
        return {
          success: false,
          message: "Error adding rented book",
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
            $push: {
              booksRented: {
                name: data.bookName,
                author: data.bookAuthor,
                genre: data.bookGenre,
                city: data.bookCity,
                email: data.bookEmail,
                status: "Rented",
              } as any,
            },
          }
        );

      if (!res.acknowledged) {
        return {
          success: false,
          message: "Error adding rented book",
        };
      }
    }

    return {
      success: true,
      data: undefined,
      message: `Rented Book ${data.bookName} added successfully`,
    };
  } catch (error: any) {
    await logger({
      error,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: `Error adding user..: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }
};
