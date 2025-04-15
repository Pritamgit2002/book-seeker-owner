"use server";
import { mongodb } from "@/lib/mongodb";
import { IOwnerUser, ownerCollectionName } from "@/modules/owner";
import { ServerActionResult } from "@/types";
import { logger } from "./logger";

export type FetchOwnerByMailResult = ServerActionResult<IOwnerUser>;

export type FetchUserParams = {
  email: string;
  type: string;
};

export const fetchOwnerByMail = async (
  data: FetchUserParams
): Promise<FetchOwnerByMailResult> => {
  try {
    if (!data.email || !data.type) {
      return {
        success: false,
        message: "Please provide all the required fields",
      };
    }

    await mongodb.connect();
    const user = await mongodb
      .collection<IOwnerUser>(ownerCollectionName)
      .findOne({
        email: data.email,
      });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      data: {
        ...user,
        id: user.id.toString(), // convert ObjectId to string
        booksRented: user.booksRented ?? [], // ensure this is defined and plain
      },
      message: "User fetched successfully",
    };
  } catch (error: any) {
    await logger({
      error,
      errorStack: error.stack,
    });
    console.error("Error fetching user:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};
