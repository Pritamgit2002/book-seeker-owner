"use server";
import { mongodb } from "@/lib/mongodb";
import { IOwnerUser, ownerCollectionName } from "@/modules/owner";
import { ServerActionResult } from "@/types";
import { nanoid } from "nanoid";
import { logger } from "./logger";

export type AddOwnerresult = ServerActionResult<undefined>;

export type AddOwnerParams = {
  name: string;
  email: string;
  password: string;
};

export const addOwner = async (data: any): Promise<AddOwnerresult> => {
  try {
    if (!data.name || !data.email || !data.password) {
      return {
        success: false,
        message: "Please provide all the required fields.",
      };
    }

    await mongodb.connect();
    const user = await mongodb
      .collection<IOwnerUser>(ownerCollectionName)
      .insertOne({
        id: nanoid(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: "owner",
        booksPublished: [],
        booksRented: [],
      });

    if (!user.acknowledged) {
      return {
        success: false,
        message: "Error adding user",
      };
    }

    return {
      success: true,
      data: undefined,
      message: `Owner ${data.name} added successfully`,
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
