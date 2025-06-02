"use client";

import ArrowRight from "@/assets/arrow-right.svg";
import Logo from "@/assets/pub2win-logo.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export const Header = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Fetch user data on component mount and listen for localStorage changes
  useEffect(() => {
    const fetchUserData = () => {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser); // Use the full user object instead of parsedUser.user
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      } else {
        setUserData(null); // Ensure userData is reset if no data is found
      }
    };

    // Initial fetch
    fetchUserData();

    // Listen for localStorage changes
    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null); // Clear userData state
    router.push("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-[#023047] text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Promote your business and earn cashback with Pub2Win
        </p>
        <div className="inline-flex gap-1 items-center">
          <p className="text-[#00B8D2]">Join us</p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center text-[#00B8D2]" />
        </div>
      </div>

      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="Pub2Win Home">
              <Image src={Logo} alt="Pub2Win logo" height={80} width={80} />
            </Link>
            <MenuIcon className="h-5 w-5 md:hidden cursor-pointer" onClick={toggleMobileMenu} />
            <nav className="hidden md:flex gap-6 text-[#023047] items-center">
              <Link href="/about" className="hover:text-[#00B8D2]">
                About
              </Link>
              <Link href="/how-it-works" className="hover:text-[#00B8D2]">
                How It Works
              </Link>
              <Link href="/restaurants" className="hover:text-[#00B8D2]">
                Restaurants & Bars
              </Link>
              <Link href="/influencers" className="hover:text-[#00B8D2]">
                Influencers
              </Link>
              <Link href="/contact" className="hover:text-[#00B8D2]">
                Contact
              </Link>

              {/* Conditional rendering based on authentication status */}
              {!userData ? (
                <>
                  <Link href="/login" className="hover:text-[#00B8D2]">
                    Login
                  </Link>
                  <Link href="/signup">
                    <button
                      className="bg-[#00B8D2] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-[#023047]"
                      aria-label="Join Pub2Win"
                    >
                      Join us
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="hover:text-[#00B8D2]">
                    {userData.firstName || "User"} {/* Fallback to "User" if firstName is missing */}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-[#00B8D2] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-[#023047]"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-24 right-0 bg-white w-full shadow-lg">
                <nav className="flex flex-col gap-4 p-4 text-[#023047]">
                  <Link href="/about" className="hover:text-[#00B8D2]">
                    About
                  </Link>
                  <Link href="/how-it-works" className="hover:text-[#00B8D2]">
                    How It Works
                  </Link>
                  <Link href="/restaurants" className="hover:text-[#00B8D2]">
                    Restaurants & Bars
                  </Link>
                  <Link href="/influencers" className="hover:text-[#00B8D2]">
                    Influencers
                  </Link>
                  <Link href="/contact" className="hover:text-[#00B8D2]">
                    Contact
                  </Link>

                  {/* Conditional rendering based on authentication status */}
                  {!userData ? (
                    <>
                      <Link href="/login" className="hover:text-[#00B8D2]">
                        Login
                      </Link>
                      <Link href="/signup">
                        <button
                          className="bg-[#00B8D2] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-[#023047]"
                          aria-label="Join Pub2Win"
                        >
                          Join us
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard" className="hover:text-[#00B8D2]">
                        {userData.firstName || "User"} {/* Fallback to "User" if firstName is missing */}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="bg-[#00B8D2] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-[#023047]"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};