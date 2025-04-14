"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

const Page = () => {
  const { user, setUser, clearUser } = useUser();
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md space-y-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-extrabold text-center text-gray-800"
        >
          User Profile
        </motion.h1>

        <div className="space-y-3 text-gray-700 text-base">
          <p>
            <span className="font-semibold text-gray-800">Name:</span>{" "}
            {user.name}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Type:</span>{" "}
            {user.type}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => {
              setUser({ name: "", email: "", type: "" });
              setTimeout(() => {
                router.push("/log-in");
              }, 200);
            }}
            className="w-full py-2 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all duration-300"
          >
            Logout
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Page;
