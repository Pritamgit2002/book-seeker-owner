"use server";
import { ServerActionResult } from "@/types";
import { logger } from "./logger";
import { mongodb } from "@/lib/mongodb";
import { nanoid } from "nanoid";
import { IOwnerUser, ownerCollectionName } from "@/modules/owner";

export type AddBookToOwner = ServerActionResult<undefined>;

export type AddBookToOwnerParams = {
  ownerEmail: string;
  ownerName: string;
  bookName: string;
  author: string;
  genre: string;
  city: string;
  bookEmail: string;
};

export const addBookToOwner = async (
  data: AddBookToOwnerParams
): Promise<AddBookToOwner> => {
  try {
    if (
      !data.ownerEmail ||
      !data.ownerName ||
      !data.bookName ||
      !data.author ||
      !data.genre ||
      !data.city ||
      !data.bookEmail
    ) {
      return {
        success: false,
        message: "Please provide all the required fields.....",
      };
    }

    await mongodb.connect();
    const res = await mongodb
      .collection<IOwnerUser>(ownerCollectionName)
      .updateOne(
        {
          email: data.ownerEmail,
        },
        {
          $push: {
            booksPublished: {
              id: nanoid(),
              name: data.bookName,
              author: data.author,
              genre: data.genre,
              city: data.city,
              email: data.bookEmail,
            },
          } as any,
        }
      );

    if (!res.acknowledged) {
      return {
        success: false,
        message: "Error adding user",
      };
    }

    return {
      success: true,
      data: undefined,
      message: `Book ${data.bookName} added successfully`,
    };
  } catch (error: any) {
    await logger({
      error,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: `Error adding user: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }
};
