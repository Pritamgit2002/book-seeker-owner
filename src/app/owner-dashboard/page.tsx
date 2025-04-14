"use client";

import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addBook } from "@/actions/add-book";
import { IBook } from "@/modules/book";
import { fetchBooks } from "@/actions/fetch-books";
import { fetchBooksByOwner } from "@/actions/fetch-books-by-owner";
import { X, Trash2, Link } from "lucide-react";
import {
  deleteBookByOwner,
  DeleteBookByOwnerParams,
} from "@/actions/delete-book-by-owner";
import { useUser } from "@/context/userContext";
import { fetchOwnerByMail } from "@/actions/fetch-owner-by-mail";
import { IOwnerUser } from "@/modules/owner";

const formSchema = z.object({
  bookName: z.string().min(3, "Name must be at least 3 characters"),
  author: z.string().min(3, "Author must be at least 3 characters"),
  genre: z.string().min(3, "Genre must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  bookEmail: z.string().email().min(1, "Email is required"),
});
type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const [books, setBooks] = useState<
    Pick<IBook, "name" | "author" | "genre" | "city" | "email">[]
  >([]);
  const [userData, setUserData] = useState<IOwnerUser | null>(null);

  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  if (!name || !email) {
    toast.error("Invalid Login Details");
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            You are not logged in
          </h2>
          <p className="text-gray-700 mb-6">
            Please log in to access your dashboard.
          </p>
          <Link
            href="/log-in"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Login Here
          </Link>
        </div>
      </div>
    );
  }
  const { user, setUser } = useUser();

  useEffect(() => {
    async function getBooks() {
      try {
        const result = await fetchBooksByOwner({
          ownerEmail: user.email,
        });
        if (result.success) {
          setBooks(result.data);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error while fetching book details");
      }
    }
    getBooks();
  }, [user.email, user.name, user.type]);

  useEffect(() => {
    async function getUserData() {
      if (!user?.email || !user?.type) return;
      try {
        const result = await fetchOwnerByMail({
          email: user.email,
          type: user.type,
        });
        if (result.success) {
          setUserData(result.data);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error while fetching user data");
      }
    }
    getUserData();
  }, [user.email, user.type, userData?.booksRented]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    try {
      const result = await addBook({
        ownerEmail: email,
        ownerName: name || "",
        bookName: data.bookName,
        author: data.author,
        genre: data.genre,
        city: data.city,
        bookEmail: data.bookEmail,
      });
      if (result.success) {
        toast.success(result.message);
        setBooks([
          ...books,
          {
            name: data.bookName,
            author: data.author,
            genre: data.genre,
            city: data.city,
            email: data.bookEmail,
          },
        ]);
        reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteBook = async (data: DeleteBookByOwnerParams) => {
    try {
      const result = await deleteBookByOwner(data);
      if (result.success) {
        toast.success(result.message);
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.name !== data.bookName)
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            📚 Owner Dashboard
          </h1>
          <p className="text-gray-700 text-lg">
            Welcome back,{" "}
            <span className="text-blue-600 font-semibold">{user.name}</span> 👋
          </p>
          <p className="text-sm text-gray-600">
            Your email: <span className="font-medium">{user.email}</span>
          </p>
        </div>

        {/* Add Book Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              ➕ Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-semibold text-gray-800">
                Add a New Book
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-gray-600">
                Fill in the details to publish your book
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Book Name */}
              <div>
                <Label htmlFor="name" className="text-gray-700 font-semibold">
                  Book Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter book name"
                  {...register("bookName")}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bookName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.bookName.message}
                  </p>
                )}
              </div>

              {/* Author */}
              <div>
                <Label htmlFor="author" className="text-gray-700 font-semibold">
                  Author
                </Label>
                <Input
                  id="author"
                  placeholder="Enter author name"
                  {...register("author")}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.author && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.author.message}
                  </p>
                )}
              </div>

              {/* Genre */}
              <div>
                <Label htmlFor="genre" className="text-gray-700 font-semibold">
                  Genre
                </Label>
                <Input
                  id="genre"
                  placeholder="Enter genre"
                  {...register("genre")}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.genre && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.genre.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city" className="text-gray-700 font-semibold">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  {...register("city")}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Contact Email */}
              <div>
                <Label htmlFor="email" className="text-gray-700 font-semibold">
                  Contact Email
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  {...register("bookEmail")}
                  defaultValue={user.email || ""}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bookEmail && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.bookEmail.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Submit Book
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Published Books Section */}
        {books.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              📖 Published Books
            </h2>
            <span className="text-sm text-gray-600">
              Visible to other users
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {books.map((book, index) => (
                <div
                  key={`${book.name}-${index}`}
                  className="bg-white border rounded-xl p-5 shadow-lg hover:shadow-2xl transition duration-300"
                >
                  <h3 className="text-xl font-semibold text-blue-700">
                    {book.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Genre:</strong> {book.genre}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>City:</strong> {book.city}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Email:</strong> {book.email}
                  </p>

                  {/* Delete Button */}
                  <div className="pt-3">
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                      onClick={() =>
                        handleDeleteBook({
                          ownerEmail: email,
                          bookName: book.name,
                          bookAuthor: book.author,
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rented Books Section */}
        {userData?.booksRented && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              📦 Rented Books
            </h2>
            <span className="text-sm text-gray-600">
              Books currently rented by you
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userData.booksRented.map((book, index) => (
                <div
                  key={`${book.name}-${index}`}
                  className="bg-white border rounded-xl p-5 shadow-lg hover:shadow-2xl transition duration-300"
                >
                  <h3 className="text-xl font-semibold text-green-700">
                    {book.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Genre:</strong> {book.genre}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>City:</strong> {book.city}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Email:</strong> {book.email}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Page;
