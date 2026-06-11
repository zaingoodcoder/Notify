"use client";

import { supabase } from "@/supabase/supabase";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { formatDate } from "@/helperfunc/formatDate";
import Link from "next/link";
import DashboardSidebar, { type DashboardSection } from "@/components/DashboardSidebar";

export type Note = {
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
  const [createmodel, setCreateModel] = useState(false);
  const [notename, SetNoteName] = useState("");
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<DashboardSection>("notes");

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

  const query = search.toLowerCase().trim();

  const filteredNotes = query
    ? notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      )
    : notes;

  const sectionTitles: Record<DashboardSection, string> = {
    favorites: "Favorites",
    notes: "My Notes",
    profile: "Profile",
    "ai-summaries": "AI Summaries",
  };

  return (
    <main className="relative min-h-screen pt-24 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.1),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
      </div>

      <div className="mx-auto flex max-w-6xl">
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="min-w-0 flex-1 px-6">
          <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Dashboard</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {sectionTitles[activeSection]}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                {activeSection === "profile"
                  ? "Manage your account details"
                  : user
                    ? user.email
                    : "Sign in to see your notes"}
              </p>
            </div>

            {activeSection === "notes" && (
              <button
                onClick={() => setCreateModel(true)}
                disabled={!user}
                className="rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                + New Note
              </button>
            )}
          </header>

        {createmodel && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm dark:bg-black/60"
            onClick={closeModal}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-300/50 dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Create a new note</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Give your note a name to get started.
              </p>

              <label className="mt-5 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
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
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-800/80 dark:text-white dark:placeholder:text-zinc-600"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
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

          {activeSection === "notes" && (
            <>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="mb-6 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              />

              {loading ? (
                <p className="text-sm text-zinc-500">Loading notes...</p>
              ) : !user ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-8 py-16 text-center dark:border-white/5 dark:bg-white/2">
                  <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                    You&apos;re not signed in
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Log in to create and view your notes.
                  </p>
                </div>
              ) : notes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center dark:border-white/10 dark:bg-white/2">
                  <p className="mt-4 text-lg font-medium text-zinc-700 dark:text-zinc-300">No notes yet</p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Hit &quot;New Note&quot; to create your first one.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredNotes.map((note) => (
                    <Link key={note.id} href={`/notes/${note.id}`}>
                      <article className="group cursor-pointer rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/5 dark:bg-zinc-900/60 dark:hover:border-indigo-500/25 dark:hover:bg-indigo-500/5">
                        <h2 className="truncate font-semibold text-zinc-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-200">
                          {note.title || "Untitled Note"}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                          {note.content || "No content yet..."}
                        </p>
                        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">
                          {formatDate(note.created_at)}
                        </p>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSection === "favorites" && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center dark:border-white/10 dark:bg-white/2">
              <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">No favorites yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                Star notes to see them here.
              </p>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900/60">
              {user ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Email</p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-white">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">User ID</p>
                    <p className="mt-1 break-all text-sm text-zinc-600 dark:text-zinc-400">{user.id}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Sign in to view your profile.</p>
              )}
            </div>
          )}

          {activeSection === "ai-summaries" && (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center dark:border-white/10 dark:bg-white/2">
              <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">No AI summaries yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                AI-generated summaries of your notes will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
