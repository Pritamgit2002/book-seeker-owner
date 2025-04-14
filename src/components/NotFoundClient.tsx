"use client";

import { useSearchParams } from "next/navigation";

export default function NotFoundClient() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  return (
    <p className="text-gray-600">
      {from
        ? `Looks like you came from ${from}`
        : `We couldn't find that page.`}
    </p>
  );
}
