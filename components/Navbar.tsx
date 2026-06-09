"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabase";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";


const Navbar = () => {
  const [user, Setuser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function GetUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      Setuser(user);
    }

    GetUser();

  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    Setuser(null);
    router.replace("/");
  }



  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
        <Link
          href="/"
          className="flex flex-1 items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <span className="text-2xl font-semibold tracking-tight text-zinc-100">
            Notify
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 text-sm md:flex">
          <Link
            href="#features"
            className="text-zinc-400 transition-colors hover:text-indigo-300"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-zinc-400 transition-colors hover:text-indigo-300"
          >
            Pricing
          </Link>
          <Link
            href="/SignUp"
            className="text-zinc-400 transition-colors hover:text-indigo-300"
          >
            Sign in
          </Link>
        </div>

        <div className="flex flex-1 justify-end gap-3">
          {
            user ? (
              <div className="group relative">
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-3.5 py-2 text-sm text-zinc-200 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-indigo-500/50 hover:bg-zinc-800 hover:text-white hover:shadow-md hover:shadow-indigo-500/10"
                >
                  <span className="max-w-[180px] truncate">{user.email}</span>
                  <svg
                    className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="invisible absolute right-0 top-full z-50 mt-2 w-44 translate-y-1 rounded-xl border border-zinc-700/60 bg-zinc-900/95 py-1.5 opacity-0 shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <Link
                    href="#"
                    className="block px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300"
                  >
                    Dashboard
                  </Link>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleLogout}
                    className="cursor-pointer px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  >
                    Logout
                  </div>
                </div>
              </div>
            ):
            <>
            <Link href="/SignUp">
              <button className="rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 active:scale-95">
                Sign up
              </button>         
            </Link>
            <Link href="/LogIn">
              <button className="rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 active:scale-95">
                Sign in
              </button>      
            </Link>
          </> 
          }
        </div>
        

      </div>
    </nav>
  );
};

export default Navbar;
