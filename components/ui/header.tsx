"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./logo";
import MobileMenu from "./mobile-menu";
import { createClient } from "@/utils/supabase/client";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop menu links */}
            <ul className="flex grow flex-wrap items-center justify-center gap-4 text-sm lg:gap-8">
              <li>
                <Link
                  href="/about"
                  className="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/command-center"
                  className="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                >
                  Command Center
                </Link>
              </li>
              <li>
                <Link
                  href="/help/frequently-asked-questions"
                  className="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                >
                  Help Centre
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop sign in/out links */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              {isAuthenticated ? (
                <button
                  onClick={handleSignOut}
                  className="btn-sm relative bg-linear-to-b from-red-600 to-red-500/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="btn-sm relative bg-linear-to-b from-indigo-600 to-indigo-500/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
                >
                  Sign In
                </Link>
              )}
            </li>
          </ul>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
