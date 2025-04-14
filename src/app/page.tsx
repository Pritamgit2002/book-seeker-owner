"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-10 py-20 bg-gradient-to-br from-white via-slate-100 to-slate-200 font-[family-name:var(--font-geist-sans)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 sm:p-10 text-center"
      >
        {user.name === "" ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Welcome to BookRent
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to access your personalized dashboard.
            </p>
            <Link href="/log-in">
              <Button className="w-full py-3 text-lg bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition duration-300">
                Log In
              </Button>
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Welcome back,
            </h2>
            <p className="text-xl text-gray-700">{user.name}</p>
            <Link href={`/${user.type}-dashboard`}>
              <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300">
                Go to Dashboard
              </Button>
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
