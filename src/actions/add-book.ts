"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "./logger";
import { bookCollectionName, IBook } from "@/modules/book";
import { nanoid } from "nanoid";
import { ServerActionResult } from "@/types";
import { addBookToOwner } from "./add-book-to-owner";

export type AddBookResult = ServerActionResult<undefined>;

export type AddBookParams = {
  ownerEmail: string;
  ownerName: string;
  bookName: string;
  author: string;
  genre: string;
  city: string;
  bookEmail: string;
};

export const addBook = async (data: AddBookParams): Promise<AddBookResult> => {
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
        message: "Please provide all the required fields...",
      };
    }

    await mongodb.connect();

    const bookExists = await mongodb
      .collection<IBook>(bookCollectionName)
      .findOne({
        author: data.author,
        name: data.bookName,
      });

    if (bookExists) {
      return {
        success: false,
        message: ` Book ${data.bookName} and author ${data.author} already exists`,
      };
    }

    const user = await mongodb.collection<IBook>(bookCollectionName).insertOne({
      id: nanoid(),
      name: data.bookName,
      author: data.author,
      genre: data.genre,
      city: data.city,
      email: data.bookEmail,
    });

    if (!user.acknowledged) {
      return {
        success: false,
        message: "Error adding user",
      };
    }
    const res = await addBookToOwner({
      ownerEmail: data.ownerEmail,
      ownerName: data.ownerName,
      bookName: data.bookName,
      author: data.author,
      genre: data.genre,
      city: data.city,
      bookEmail: data.bookEmail,
    });

    if (!res.success) {
      return {
        success: false,
        message: res.message,
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
