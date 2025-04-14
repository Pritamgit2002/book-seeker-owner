"use client";
import { fetchSeekerByMail } from "@/actions/fetch-seeker-by-mail";
import { useUser } from "@/context/userContext";
import { ISekkerUser } from "@/modules/seeker";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SeekerDashboard = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<ISekkerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserData() {
      if (!user?.email || !user?.type) return;
      try {
        const result = await fetchSeekerByMail({
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
      } finally {
        setLoading(false);
      }
    }
    getUserData();
  }, [user.email, user.type, userData?.booksRented]);

  if (loading) return <p className="p-4">Loading...</p>;

  if (!user.name || !user.email) {
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        Seeker Dashboard
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6 mb-8"
      >
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold text-gray-900">Name:</span>{" "}
          {user?.name}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-semibold text-gray-900">Email:</span>{" "}
          {user?.email}
        </p>
      </motion.div>

      {userData?.booksRented?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Rented Books
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {userData.booksRented.map((book, index) => (
              <motion.div
                key={`${book.name}-${book.author}-${index}`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm"
              >
                <p className="text-gray-800">
                  <span className="font-semibold">Name:</span> {book.name}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Author:</span> {book.author}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Genre:</span> {book.genre}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">City:</span> {book.city}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Email:</span> {book.email}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-center mt-4"
        >
          No rented books found.
        </motion.p>
      )}
    </div>
  );
};

export default SeekerDashboard;
