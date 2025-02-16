"use client";

import { useState, useRef, useEffect } from "react";
import { Transition, Switch } from "@headlessui/react";
import Link from "next/link";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { createClient } from "@/utils/supabase/client";

export default function MobileMenu() {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isDemoMode, setIsDemoMode } = useDemoMode();
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

  const trigger = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLDivElement>(null);

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!mobileNav.current || !trigger.current) return;
      if (
        !mobileNavOpen ||
        mobileNav.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setMobileNavOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="flex md:hidden">
      {/* Hamburger button */}
      <button
        ref={trigger}
        className={`group inline-flex h-8 w-8 items-center justify-center text-center text-gray-200 transition ${mobileNavOpen && "active"}`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="pointer-events-none fill-current"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            className="origin-center -translate-y-[5px] translate-x-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
            y="7"
            width="9"
            height="2"
            rx="1"
          ></rect>
          <rect
            className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
            y="7"
            width="16"
            height="2"
            rx="1"
          ></rect>
          <rect
            className="origin-center translate-y-[5px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
            y="7"
            width="9"
            height="2"
            rx="1"
          ></rect>
        </svg>
      </button>

      {/*Mobile navigation */}
      <div ref={mobileNav}>
        <Transition
          show={mobileNavOpen}
          as="nav"
          id="mobile-nav"
          className="absolute left-0 top-full z-20 mt-2 w-full rounded-xl bg-gray-900/90 backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] transform transition ease-out duration-200 data-enter:data-closed:-translate-y-2 data-closed:opacity-0"
        >
          <ul className="p-2 text-sm space-y-1">
            <li>
              <Link
                href="/pricing"
                className="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                onClick={() => setMobileNavOpen(false)}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                onClick={() => setMobileNavOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                onClick={() => setMobileNavOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/help/frequently-asked-questions"
                className="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                onClick={() => setMobileNavOpen(false)}
              >
                Help Centre
              </Link>
            </li>
            <li>
              <Link
                href="/newsletter"
                className="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                onClick={() => setMobileNavOpen(false)}
              >
                Newsletter
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                onClick={() => setMobileNavOpen(false)}
              >
                Contact
              </Link>
            </li>
            {/* Demo mode switch */}
            <li className="border-t border-gray-700/50 mt-2 pt-2">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-sm text-gray-200">Demo Mode</span>
                <div className="relative group">
                  <Switch
                    checked={isDemoMode}
                    onChange={(value) => {
                      // Only allow turning off demo mode if authenticated
                      if (isAuthenticated || value === true) {
                        setIsDemoMode(value);
                      }
                    }}
                    className={`${
                      isDemoMode ? 'bg-indigo-600' : 'bg-gray-700'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      !isAuthenticated && isDemoMode ? 'cursor-not-allowed opacity-75' : ''
                    }`}
                  >
                    <span className="sr-only">Toggle demo mode</span>
                    <span
                      className={`${
                        isDemoMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  {!isAuthenticated && isDemoMode && (
                    <div className="absolute right-0 bottom-full mb-2 px-3 py-1 text-sm text-gray-200 bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Sign in to disable demo mode
                    </div>
                  )}
                </div>
              </div>
            </li>
          </ul>
        </Transition>
      </div>
    </div>
  );
}
