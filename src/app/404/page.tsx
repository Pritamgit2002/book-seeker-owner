import NotFoundClient from "@/components/NotFoundClient";
import { Suspense } from "react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <NotFoundClient />
      </Suspense>
    </div>
  );
}
