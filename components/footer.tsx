import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React from "react";

const Footer = ({ user }: { user: User | null }) => {
  const router = useRouter();

  function CheckUser() {
    if (user) {
      router.push("/dashboard");
    }else{
      router.push("/SignUp");
    }
  }

  

  return (
    <section className="relative z-10 border-t border-zinc-200 bg-linear-to-b from-transparent via-zinc-100/40 to-zinc-100/90 px-6 py-20 backdrop-blur-sm dark:border-white/5 dark:via-zinc-950/40 dark:to-zinc-950/90">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="select-none text-2xl font-bold md:text-3xl">
          Ready to capture your next big idea?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-zinc-600 selection:bg-violet-600 selection:text-white dark:text-zinc-400">
          Join thousands of thinkers, builders, and creators who trust Notify
          every day.
        </p>
        <button onClick={CheckUser} className="btn-shimmer mt-8 cursor-pointer select-none rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-500 px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95">
          Get started for free
        </button>
      </div>
    </section>
  );
};

export default Footer;
