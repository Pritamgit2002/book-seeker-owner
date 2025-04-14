"use server";
import { mongodb } from "@/lib/mongodb";
import { ISekkerUser, seekerCollectionName } from "@/modules/seeker";
import { ServerActionResult } from "@/types";
import { logger } from "./logger";

export type FetchSeekerByMailResult = ServerActionResult<ISekkerUser>;

export type FetchUserParams = {
  email: string;
  type: string;
};

export const fetchSeekerByMail = async (
  data: FetchUserParams
): Promise<FetchSeekerByMailResult> => {
  try {
    if (!data.email || !data.type) {
      return {
        success: false,
        message: "Please provide all the required fields",
      };
    }

    await mongodb.connect();
    const user = await mongodb
      .collection<ISekkerUser>(seekerCollectionName)
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
      data: user,
      message: "User fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching user:", error);
    await logger({
      error,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: "Internal server error",
    };
  }
};
