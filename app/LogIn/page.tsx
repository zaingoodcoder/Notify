"use client";

import React from 'react';
import { useState, type FormEvent  } from 'react';
import { supabase } from '@/supabase/supabase';
import { useRouter } from 'next/navigation';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message , setMessage] = useState("");


  
  
  const router = useRouter();

  async function handleLogin(e :FormEvent<HTMLFormElement>) {
    
    e.preventDefault();


    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      setMessage("Error Occured While Log In");
      return;
    }else{
      setMessage("Login Succesful");
      router.replace("/");

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
            <h1 className="text-2xl font-bold tracking-tight text-white">Login</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Login your account and start organizing your thoughts.
            </p>
          </div>

          <form className="space-y-5" onSubmit ={handleLogin}>
            <div>
              <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                onChange = {(e) => setEmail(e.target.value)}
                id="signup-email"
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
                onChange = {(e) => setPassword(e.target.value)}
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 transition-colors outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {
              message ? 
              (
                <p className='text-sm text-indigo-300'>{message}</p>
              ):
              null
            }

            <div className="flex flex-col gap-3 pt-3 sm:flex-row">
              <button
                type="submit"
                className="btn-shimmer flex-1 rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}


export default Login;