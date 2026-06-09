"use client";

import { supabase } from "@/supabase/supabase";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { formatDate } from "@/helperfunc/formatDate";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [createmodel , setCreateModel ] = useState(false);
  const [notename , SetNoteName] = useState("");

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }

    getUser();
  }, []);

  useEffect(() => {
    async function GetNote() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setNotes(data ?? []);
      setLoading(false);
    }

    GetNote();
  }, [user]);

  async function addNote() {
    if (!user || !notename.trim()) return;

    const { data } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        title: notename,
        content: "",
      })
      .select()
      .single();

    if (data) {
      setNotes((prev) => [data, ...prev]);
    }

    SetNoteName("");
    setCreateModel(false);
  }

  function closeModal() {
    SetNoteName("");
    setCreateModel(false);
  }

  
  return (
    
    <main className="min-h-screen pt-24 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
              My Notes
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {user ? user.email : "Sign in to see your notes"}
            </p>
          </div>

          <button
            onClick= {() => setCreateModel(true)} 
            disabled={!user}
            className="rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + New Note
          </button>
        </header>

        {createmodel && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-white">Create a new note</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Give your note a name to get started.
              </p>

              <label className="mt-5 block text-sm font-medium text-zinc-400">
                Note name
              </label>
              <input
                autoFocus
                required
                value={notename}
                onChange={(e) => SetNoteName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && notename.trim() && addNote()}
                type="text"
                placeholder="e.g. Meeting ideas"
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addNote}
                  disabled={!notename.trim()}
                  className="rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}


   

        {/* Notes grid */}
        {loading ? (
          <p className="text-sm text-zinc-500">Loading notes...</p>
        ) : !user ? (
          <div className="rounded-2xl border border-white/5 bg-white/2 px-8 py-16 text-center">
            <p className="text-lg font-medium text-zinc-300">
              You&apos;re not signed in
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Log in to create and view your notes.
            </p>
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 px-8 py-16 text-center">
            <p className="mt-4 text-lg font-medium text-zinc-300">No notes yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              Hit &quot;New Note&quot; to create your first one.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <article
                key={note.id}
                className="group cursor-pointer rounded-2xl border border-white/5 bg-zinc-900/60 p-5 transition-colors hover:border-indigo-500/25 hover:bg-indigo-500/5"
              >
                <h2 className="truncate font-semibold text-white group-hover:text-indigo-200">
                  {note.title || "Untitled Note"}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-500">
                  {note.content || "No content yet..."}
                </p>
                <p className="mt-4 text-xs text-zinc-600">
                  {formatDate(note.created_at)}
                </p>
              </article>
            ))}
          </div>
        )}
        </div>
    </main>
  );
};

export default Dashboard;
