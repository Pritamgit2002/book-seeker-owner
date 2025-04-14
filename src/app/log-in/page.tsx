"use client";

import React from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addOwner } from "@/actions/add-owner";
import { addSeeker } from "@/actions/add-seeker";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["owner", "sekker"]),
});

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  const { setUser } = useUser();
  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    setUser({ name: data.name, email: data.email, type: data.role });

    try {
      if (data.role === "owner") {
        const result = await addOwner({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        if (result.success) {
          toast.success(result.message);
          reset();
          const { name, email } = data;
          const encodedEmail = btoa(email); // encode to base64
          router.push(
            `/owner-dashboard?name=${encodeURIComponent(
              name
            )}&email=${encodeURIComponent(encodedEmail)}`
          );
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await addSeeker({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        if (result.success) {
          toast.success(result.message);
          const { name, email } = data;
          const encodedEmail = btoa(email); // encode to base64
          router.push(
            `/seeker-dashboard?name=${encodeURIComponent(
              name
            )}&email=${encodeURIComponent(encodedEmail)}`
          );
          reset();
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 space-y-6"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-extrabold text-center text-gray-800"
        >
          Register / Login
        </motion.h2>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            className="rounded-xl"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            placeholder="Enter your email"
            className="rounded-xl"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="rounded-xl"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="text-gray-700">
            Role
          </Label>
          <Select
            onValueChange={(value) =>
              setValue("role", value as FormData["role"])
            }
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="sekker">Sekker</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition duration-300"
        >
          Submit
        </Button>
        <p className="text-sm text-gray-600">
          Password verification is not provided. To get prev data please use
          same email.
        </p>
      </motion.form>
    </div>
  );
};

export default Page;
