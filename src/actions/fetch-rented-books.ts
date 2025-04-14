// import { mongodb } from "@/lib/mongodb";
// import { IBook } from "@/modules/book";
// import { IOwnerUser, ownerCollectionName } from "@/modules/owner";
// import { ISekkerUser, seekerCollectionName } from "@/modules/seeker";
// import { ServerActionResult } from "@/types";

// export type FetchRentedBooksResult = ServerActionResult<
//   (Pick<IBook, "name" | "author" | "genre" | "city" | "email"> & {
//     status: "available" | "rented";
//   })[]
// >;

// export type FetchRentedBooksParams = {
//   ownerEmail: string;
//   ownerType: "owner" | "seeker";
// };

// export const fetchRentedBooks = async (
//   data: FetchRentedBooksParams
// ): Promise<FetchRentedBooksResult> => {
//   try {
//     if (!data.ownerEmail && !data.ownerType) {
//       return {
//         success: false,
//         message: "Please provide all the required fields",
//       };
//     }

//     await mongodb.connect();
//     if (data.ownerType === "owner") {
//       const res = await mongodb
//         .collection<IOwnerUser>(ownerCollectionName)
//         .find({
//           email: data.ownerEmail,
//         })
//         .toArray();

//        const books = res
//          .map((item) => item.booksRented)
//          .flat()
//          .map((book) => ({
//            name: book.name,
//            author: book.author,
//            genre: book.genre,
//            city: book.city,
//            email: book.email,
//            status: book.status,
//          }));

//       return {
//         success: true,
//         data: books,
//         message: "Books fetched successfully",
//       };
//     } else {
//       const books = await mongodb
//         .collection<ISekkerUser>(seekerCollectionName)
//         .find({
//           email: data.ownerEmail,
//         })
//         .toArray();

//       return {
//         success: true,
//         data: books,
//         message: "Books fetched successfully",
//       };
//     }
//   } catch (error) {}
// };
