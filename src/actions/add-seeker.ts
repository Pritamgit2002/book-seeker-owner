"use server";
import { ServerActionResult } from "@/types";
import { logger } from "./logger";
import { mongodb } from "@/lib/mongodb";
import { ISekkerUser, seekerCollectionName } from "@/modules/seeker";
import { nanoid } from "nanoid";

export type AddSeekerresult = ServerActionResult<undefined>;

export type AddSeekerParams = {
  name: string;
  email: string;
  password: string;
};

export const addSeeker = async (data: any): Promise<AddSeekerresult> => {
  try {
    if (!data.name || !data.email || !data.password) {
      return {
        success: false,
        message: "Please provide all the required fields",
      };
    }

    await mongodb.connect();
    const user = await mongodb
      .collection<ISekkerUser>(seekerCollectionName)
      .insertOne({
        id: nanoid(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: "sekker",
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
      message: `Seeker ${data.name} added successfully`,
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
