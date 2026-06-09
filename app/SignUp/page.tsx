"use client";

import { supabase } from '@/supabase/supabase';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();

    async function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            setMessage("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: trimmedEmail,
                password,
            });

            if (error) {
                setMessage(error.message);
                console.error(error.message);
                return;
            }

            setMessage(`Account created for ${data.user?.email ?? trimmedEmail}. Check your email to confirm.`);
            console.log("user created", data);

            router.replace('/');

        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Something went wrong. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }


  return (
    <main className="relative flex min-h-[calc(100dvh-5rem)] flex-1 items-center justify-center overflow-hidden px-6 pt-20 pb-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(139,92,246,0.1),transparent)]" />
      </div>

      <div className="animate-fade-up relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Sign Up</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Create your account and start organizing your thoughts.
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSignup}>
            <div>
              <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="signup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 transition-colors outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 transition-colors outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {message ? (
              <p className="text-sm text-indigo-300" role="status">
                {message}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 pt-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="btn-shimmer flex-1 rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
                <button
                    type="button"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
                >
                    <Link href="/LogIn">
                    
                        Log in
                    </Link>
                </button>  
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Signup;
