"use client";
import { motion } from "framer-motion";
import { fetchBooks } from "@/actions/fetch-books";
import { IBook } from "@/modules/book";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import { addRentedBooks } from "@/actions/add-rented-books";
import { deleteRentedBooks } from "@/actions/delete-rented-books";
import { fetchOwnerByMail } from "@/actions/fetch-owner-by-mail";
import { fetchSeekerByMail } from "@/actions/fetch-seeker-by-mail";

type BookCardType = Pick<
  IBook,
  "name" | "author" | "genre" | "city" | "email"
> & {
  status?: "Available" | "Rented";
};

const Page = () => {
  const [books, setBooks] = useState<BookCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();
  const [statusUpdatedBooks, setStatusUpdatedBooks] = useState<IBook["name"][]>(
    []
  );

  useEffect(() => {
    async function getBooks() {
      try {
        const result = await fetchBooks();
        if (result.success) {
          setBooks(result.data);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error while fetching book details");
      } finally {
        setLoading(false);
      }
    }

    getBooks();
  }, []);

  useEffect(() => {
    async function getAlreadyRentedBooks() {
      try {
        if (user.type === "owner") {
          const result = await fetchOwnerByMail({
            email: user.email,
            type: user.type,
          });
          if (result.success) {
            {
              result.data.booksRented &&
                setStatusUpdatedBooks(
                  result.data.booksRented.map((book) => book.name)
                );
            }
            // toast.success("Successfully fetched rented books");
          }
        } else {
          const result = await fetchSeekerByMail({
            email: user.email,
            type: user.type,
          });
          if (result.success) {
            {
              result.data.booksRented &&
                setStatusUpdatedBooks(
                  result.data.booksRented.map((book) => book.name)
                );
            }
            //toast.success("Successfully fetched rented books");
          }
        }
      } catch (error) {
        toast.error("Error while fetching book details");
      }
    }
    getAlreadyRentedBooks();
  }, []);

  const toggleStatus = async (
    ownerEmail: string,
    ownerType: string,
    bookName: string,
    bookAuthor: string,
    bookGenre: string,
    bookCity: string,
    bookEmail: string
  ) => {
    if (statusUpdatedBooks.includes(bookName)) {
      try {
        setStatusUpdatedBooks((prevStatusUpdatedBooks) =>
          prevStatusUpdatedBooks.filter((book) => book !== bookName)
        );
        const result = await deleteRentedBooks({
          ownerEmail: ownerEmail,
          ownerType: user.type,
          bookName: bookName,
          bookAuthor: bookAuthor,
          bookGenre: bookGenre,
          bookCity: bookCity,
          bookEmail: bookEmail,
        });
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error while deleting book");
      }
    } else {
      try {
        const result = await addRentedBooks({
          ownerEmail: ownerEmail,
          ownerType: user.type,
          bookName: bookName,
          bookAuthor: bookAuthor,
          bookGenre: bookGenre,
          bookCity: bookCity,
          bookEmail: bookEmail,
        });
        if (result.success) {
          toast.success(result.message);
          setStatusUpdatedBooks((prevStatusUpdatedBooks) => [
            ...prevStatusUpdatedBooks,
            bookName,
          ]);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error while adding book");
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-gray-800"
      >
        Books Gallery
      </motion.h1>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="block mb-6 text-lg text-gray-700"
      >
        Welcome, <span className="font-bold">{user.type}</span>{" "}
        <span className="text-blue-600 font-semibold">{user.name}</span> 👋
      </motion.span>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
              >
                <Card className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-1" />
                  <Skeleton className="h-4 w-1/3" />
                </Card>
              </motion.div>
            ))
          : books.map((book, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card className="hover:shadow-xl transition-shadow duration-200 border border-gray-200 bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{book.name}</CardTitle>
                    <p
                      className={`text-sm ${
                        statusUpdatedBooks.includes(book.name)
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      Status:{" "}
                      {statusUpdatedBooks.includes(book.name)
                        ? "Rented"
                        : "Available"}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">Author:</span>{" "}
                      {book.author}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Genre:</span>{" "}
                      {book.genre}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">City:</span>{" "}
                      {book.city}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Email:</span>{" "}
                      {book.email}
                    </p>

                    <Button
                      type="button"
                      className={`${
                        statusUpdatedBooks.includes(book.name)
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white font-semibold py-2 px-6 rounded-lg transition-all ease-in duration-300`}
                      onClick={() => {
                        toggleStatus(
                          user.email,
                          user.type,
                          book.name,
                          book.author,
                          book.genre,
                          book.city,
                          book.email
                        );
                      }}
                    >
                      {statusUpdatedBooks.includes(book.name)
                        ? "Rented"
                        : "Available"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
};

export default Page;
