"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/supabase/supabase";
import { Note } from "@/app/dashboard/page";
import { formatDate } from "@/helperfunc/formatDate";
import { useRouter } from "next/navigation";

const NotePage = () => {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const firstloadRef = useRef(true);
  const params = useParams();
  const router = useRouter();

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    async function getNote() {
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("id", params.id)
        .single();

      setNote(data);
      setLoading(false);
    }

    getNote();
  }, [params.id]);

  useEffect(() => {
    adjustHeight();
  }, [note?.content, adjustHeight]);

  useEffect(() => {
    if (!note) return;

    if (firstloadRef.current) {
      firstloadRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveNote();
    }, 1000);

    return () => clearTimeout(timer);
  }, [note]);

  async function saveNote() {
    if (!note) return;

    setSaving(true);

    const { error } = await supabase
      .from("notes")
      .update({
        title: note.title,
        content: note.content,
      })
      .eq("id", note.id);

    if (error) {
      console.error(error);
      return;
    }

    setSaving(false);
  }

  function openDeleteModal() {
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    if (deleting) return;
    setDeleteModal(false);
  }

  async function confirmDelete() {
    if (!note) return;

    setDeleting(true);

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", note.id);

    if (error) {
      console.error(error);
      setDeleting(false);
      return;
    }

    router.replace("/dashboard");
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <div className="mb-8 h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mb-3 h-10 w-2/3 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800/80" />
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800/60" />
          <div className="mt-10 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/40" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/40" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/40" />
          </div>
        </div>
      </main>
    );
  }

  if (!note) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-24 pb-16">
        <p className="text-lg font-medium text-zinc-600 dark:text-zinc-300">Note not found</p>
        <Link
          href="/dashboard"
          className="mt-4 text-sm text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          ← Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)]" />
      </div>

      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All notes
        </Link>

        <div className="note-editor">
          <input
            value={note.title}
            onChange={(e) =>
              setNote({
                ...note,
                title: e.target.value,
              })
            }
            placeholder="Untitled"
            className="w-full border-0 bg-transparent text-4xl font-bold tracking-tight text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-0 dark:text-white dark:placeholder:text-zinc-600"
          />

          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-600">
            {formatDate(note.created_at)}
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={saveNote}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              Save
            </button>

            <button
              onClick={openDeleteModal}
              className="rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black"
            >
              Delete
            </button>
          </div>

          {deleteModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm dark:bg-black/60"
              onClick={closeDeleteModal}
            >
              <div
                className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-300/50 dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/50"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Delete this note?
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  &ldquo;{note.title || "Untitled"}&rdquo; will be permanently removed. This
                  can&apos;t be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={deleting}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/25 transition-all hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-600 dark:hover:bg-red-500"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {saving ? <div className="text-green-600 dark:text-green-500">Saving...</div> : null}

          <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-white/5">
            <textarea
              ref={textareaRef}
              value={note.content}
              onChange={(e) => {
                setNote({
                  ...note,
                  content: e.target.value,
                });
                adjustHeight();
              }}
              placeholder="Start writing..."
              rows={1}
              className="w-full resize-none overflow-hidden border-0 bg-transparent text-base leading-[1.75] text-zinc-700 placeholder:text-zinc-400 outline-none focus:ring-0 dark:text-zinc-300 dark:placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotePage;
