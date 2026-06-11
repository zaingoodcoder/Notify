"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import FloatingMenuExtension from "@tiptap/extension-floating-menu";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TiptapLink from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import { useParams } from "next/navigation";
import { supabase } from "@/supabase/supabase";
import { Note } from "@/app/dashboard/page";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { formatDate } from "@/helperfunc/formatDate";
import { textColors, highlightColors } from "@/data/colors";


import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Code,
  Undo,
  Redo,
  Underline as UnderlineIcon,
  Highlighter,
  Link2,
  Unlink,
  ListTodo,
  ArrowLeft,
  Save,
  Trash2,
  Palette
} from "lucide-react";



const MenuButton = ({ 
  onClick, 
  isActive = false, 
  children, 
  title 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode;
  title?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded-md transition-all cursor-pointer ${
      isActive 
        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" 
        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10"
    }`}
  >
    {children}
  </button>
);

export default function TestEditor() {
  const [note, setNote] = useState<Note | null>(null);
  const [saved, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);



  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    async function getNote() {
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("id", params.id)
        .single();

      setNote(data);
      hasInitialized.current = false;
    }

    getNote();
  }, [params.id]);

  const performSave = async (updatedTitle: string, currentEditor: any) => {
    if (!note) return;
    setSaving(true);
    const { error } = await supabase
      .from("notes")
      .update({
        title: updatedTitle,
        editor_content: currentEditor ? currentEditor.getJSON() : note.editor_content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id);

    if (error) {
      console.error("Autosave error:", error);
    }
    setSaving(false);
  };

  const triggerAutosave = (updatedTitle: string, currentEditor: any) => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    setSaving(true);
    saveTimeout.current = setTimeout(() => {
      performSave(updatedTitle, currentEditor);
    }, 1200);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!note) return;
    const newTitle = e.target.value;
    setNote({ ...note, title: newTitle });
    if (editor) {
      triggerAutosave(newTitle, editor);
    }
  };

  async function saveNote() {
    if (!note || !editor) return;
    setSaving(true);
    const { error } = await supabase
      .from("notes")
      .update({
        title: note.title,
        editor_content: editor.getJSON(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id);
      
    if (error) {
      console.error("Manual save error:", error);
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenuExtension,
      FloatingMenuExtension,
      Placeholder.configure({
        placeholder: "Start writing your masterpiece...",
      }),
      CharacterCount,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "cursor-pointer text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: note?.editor_content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[500px] px-4 py-8",
      },
    },
    onUpdate: ({ editor }) => {
      if (!note) return;
      triggerAutosave(note.title, editor);
    },
  });

  useEffect(() => {
    if (!editor || !note || hasInitialized.current) return; 

    const content = note.editor_content ?? note.content;
    editor.commands.setContent(content, { emitUpdate: false });
    hasInitialized.current = true;
  }, [editor, note]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!note || !editor) {
    return (
      <main className="mt-20 min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-24 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="w-24 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
          {/* Editor skeleton */}
          <div className="w-full h-[600px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full mb-6" />
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3" />
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-5/6" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mt-20 min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full max-w-4xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back button + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <NextLink
            href="/dashboard"
            className="flex items-center justify-center p-2 rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </NextLink>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={note.title || ""}
              onChange={handleTitleChange}
              placeholder="Untitled Note"
              className="text-2xl font-bold bg-transparent border-none outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-0 w-full"
            />
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Last updated: {formatDate(note.updated_at || note.created_at)}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          {/* Autosave Status */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-white/5 text-xs text-zinc-500">
            <div className={`w-2 h-2 rounded-full ${saved ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
            <span>{saved ? "Saving..." : "Saved"}</span>
          </div>

          <button
            onClick={saveNote}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/40 active:scale-95 cursor-pointer dark:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={openDeleteModal}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 cursor-pointer dark:border-red-500/20 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Editor Main Container */}
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-zinc-200 dark:border-white/10 p-2 flex flex-wrap gap-1 bg-zinc-50/50 dark:bg-white/5 backdrop-blur-sm">
          {/* Bold */}
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
          >
            <Bold size={18} />
          </MenuButton>

          {/* Italic */}
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
          >
            <Italic size={18} />
          </MenuButton>

          {/* Underline */}
          <MenuButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </MenuButton>

          <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 mx-1 self-center" />

          {/* Color Picker (Inline) */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-lg border border-zinc-200/50 dark:border-white/5">
            <MenuButton
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              isActive={editor.isActive("textStyle") || showColorPicker}
              title="Text Color"
            >
              <Palette size={18} />
            </MenuButton>
            {showColorPicker && (
              <div className="flex gap-1.5 items-center pl-1 border-l border-zinc-300 dark:border-zinc-700">
                {textColors.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (c.color === "") {
                        editor.chain().focus().unsetColor().run();
                      } else {
                        editor.chain().focus().setColor(c.color).run();
                      }
                      setShowColorPicker(false);
                    }}
                    title={c.name}
                    className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    style={{ backgroundColor: c.color || "transparent", borderStyle: c.color ? "solid" : "dashed" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Highlight Picker (Inline) */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-lg border border-zinc-200/50 dark:border-white/5">
            <MenuButton
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              isActive={editor.isActive("highlight") || showHighlightPicker}
              title="Highlight"
            >
              <Highlighter size={18} />
            </MenuButton>
            {showHighlightPicker && (
              <div className="flex gap-1.5 items-center pl-1 border-l border-zinc-300 dark:border-zinc-700">
                {highlightColors.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (c.color === "") {
                        editor.chain().focus().unsetHighlight().run();
                      } else {
                        editor.chain().focus().setHighlight({ color: c.color }).run();
                      }
                      setShowHighlightPicker(false);
                    }}
                    title={c.name}
                    className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    style={{ backgroundColor: c.color || "transparent", borderStyle: c.color ? "solid" : "dashed" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <MenuButton 
            onClick={setLink}
            isActive={editor.isActive("link")}
            title="Add Link"
          >
            <Link2 size={18} />
          </MenuButton>
          {editor.isActive("link") && (
            <MenuButton 
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
            >
              <Unlink size={18} />
            </MenuButton>
          )}

          <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 mx-1 self-center" />

          {/* Headings */}
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </MenuButton>

          <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 mx-1 self-center" />

          {/* Lists */}
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Ordered List"
          >
            <ListOrdered size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
            title="Task List"
          >
            <ListTodo size={18} />
          </MenuButton>

          <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 mx-1 self-center" />

          {/* Block extensions */}
          <MenuButton 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <Code size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Quote"
          >
            <Quote size={18} />
          </MenuButton>

          <div className="flex-1" />

          {/* Undo/Redo */}
          <MenuButton 
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo size={18} />
          </MenuButton>
        </div>

        {/* Bubble Menu */}
        <BubbleMenu 
          editor={editor} 
          className="flex gap-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 p-1.5 rounded-lg shadow-xl transition-all duration-200 z-50"
        >
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <Bold size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <Italic size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          >
            <UnderlineIcon size={16} />
          </MenuButton>
          <MenuButton 
            onClick={setLink}
            isActive={editor.isActive("link")}
          >
            <Link2 size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
          >
            <Code size={16} />
          </MenuButton>
        </BubbleMenu>

        {/* Floating Menu */}
        <FloatingMenu 
          editor={editor} 
          className="flex gap-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 p-1.5 rounded-lg shadow-xl transition-all duration-200 z-50"
        >
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
          >
            <Heading1 size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
          >
            <Heading2 size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
          >
            <List size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
          >
            <ListTodo size={16} />
          </MenuButton>
        </FloatingMenu>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} />
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
                &ldquo;{note?.title || "Untitled"}&rdquo; will be permanently removed. This
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

        {/* Status Bar */}
        <div className="border-t border-zinc-200 dark:border-white/10 px-4 py-2 flex items-center justify-between text-[10px] uppercase tracking-wider font-medium text-zinc-500 dark:text-zinc-500 bg-zinc-50/30 dark:bg-black/10">
          <div className="flex gap-4">
            <span>{editor.storage.characterCount?.characters() || 0} Characters</span>
            <span>{editor.storage.characterCount?.words() || 0} Words</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{saved ? "saving..." : "saved"}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
