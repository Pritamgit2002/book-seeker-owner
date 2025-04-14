"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";

const Navbar = () => {
  const { user, setUser } = useUser();
  const pathname = usePathname();
  // const searchParams = useSearchParams();

  // useEffect(() => {
  //   const nameParam = searchParams.get("name");
  //   const emailParam = searchParams.get("email");

  //   if (nameParam && emailParam) {
  //     let decodedEmail = emailParam;
  //     try {
  //       // Check if the email is base64 encoded
  //       if (emailParam.indexOf("@") === -1) {
  //         decodedEmail = atob(emailParam);
  //       }
  //     } catch (e) {
  //       console.error("Error decoding email:", e);
  //     }
  //   }
  // }, [searchParams, setUser]);

  // Define dynamic navigation links
  const links = [
    { label: "Books", href: "/books" },
    {
      label: user.type === "owner" ? "Owner" : "Seeker",
      href:
        user.type === "owner"
          ? `/owner-dashboard?name=${encodeURIComponent(
              user.name
            )}&email=${btoa(user.email)}`
          : `/seeker-dashboard?name=${encodeURIComponent(
              user.name
            )}&email=${btoa(user.email)}`,
    },
    {
      label: user.name ? "Log-out" : "Log-in",
      href: user.name ? "/log-out" : "/log-in",
    },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          📚 BookShelf
        </Link>

        <div className="flex gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={
                  pathname === link.href.split("?")[0] ? "default" : "ghost"
                }
                className={cn("text-sm font-medium cursor-pointer", {
                  "bg-blue-600 text-white hover:bg-blue-700":
                    pathname === link.href.split("?")[0],
                })}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
