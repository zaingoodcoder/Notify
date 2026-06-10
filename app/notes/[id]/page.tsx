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

 //autosave
  useEffect(() => {
    if (!note) return;

    if(firstloadRef.current){
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

  async function deleteNote() {
    if (!note) return;
  
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", note.id);
  
    if (error) {
      console.error(error);
      return;
    }
  
    router.replace("/dashboard");
  }




  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <div className="mb-8 h-4 w-32 animate-pulse rounded bg-zinc-800" />
          <div className="mb-3 h-10 w-2/3 animate-pulse rounded-lg bg-zinc-800/80" />
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-zinc-800/60" />
          <div className="mt-10 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-800/40" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-zinc-800/40" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-800/40" />
          </div>
        </div>
      </main>
    );
  }

  if (!note) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-24 pb-16">
        <p className="text-lg font-medium text-zinc-300">Note not found</p>
        <Link
          href="/dashboard"
          className="mt-4 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
        >
          ← Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)]" />
      </div>

      

      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-indigo-400"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
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
            className="w-full border-0 bg-transparent text-4xl font-bold tracking-tight text-white placeholder:text-zinc-600 outline-none focus:ring-0"
          />

          <p className="mt-2 text-xs text-zinc-600">
            {formatDate(note.created_at)}
          </p>


          <div className="flex items-center  justify-end gap-3">
            <button
              onClick={saveNote}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-80"
            >
              Save
            </button>

            <button
              onClick={deleteNote}
              className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400 hover:text-black transistion:all"
            >
              Delete
            </button>
          </div>

          {
            saving ? (
              <div className="text-green-500">Saving...</div>
            ):
            null  
          }

          <div className="mt-8 border-t border-white/5 pt-8">
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
              className="w-full resize-none overflow-hidden border-0 bg-transparent text-base leading-[1.75] text-zinc-300 placeholder:text-zinc-600 outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotePage;
