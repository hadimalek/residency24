"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface TiptapEditorProps {
  value: any | null; // Tiptap JSON document
  onChange: (json: any) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  fallbackHtml?: string | null; // stored HTML, used to seed the editor when JSON is empty
}

/** True when a Tiptap JSON document carries no real content (null, no blocks,
 *  or a single empty paragraph). Such a doc is treated as "no JSON yet" so we
 *  can fall back to the cached HTML. */
function isEmptyDoc(json: any): boolean {
  if (!json) return true;
  const content = json.content;
  if (!Array.isArray(content) || content.length === 0) return true;
  if (content.length === 1) {
    const only = content[0];
    if (only?.type === "paragraph" && (!only.content || only.content.length === 0)) {
      return true;
    }
  }
  return false;
}

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

export default function TiptapEditor({ value, onChange, dir = "rtl", placeholder, fallbackHtml }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // When there is no usable JSON but we do have cached HTML (e.g. WP imports
  // whose HTML→JSON conversion failed, or posts inserted with HTML only),
  // seed the editor from that HTML so the editor isn't blank.
  const initialContent =
    !isEmptyDoc(value) ? value : fallbackHtml ? fallbackHtml : EMPTY_DOC;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener" } }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] p-4",
          dir === "rtl" ? "prose-rtl" : ""
        ),
        dir,
      },
    },
  });

  // External value sync (e.g. when loading existing post into the editor)
  useEffect(() => {
    if (!editor) return;
    if (isEmptyDoc(value)) return;
    const current = editor.getJSON();
    // Avoid resetting selection on every keystroke — only sync if document
    // really differs.
    if (JSON.stringify(current) !== JSON.stringify(value)) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, JSON.stringify(value)]);

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50 text-sm text-gray-500">
        در حال بارگذاری ادیتور…
      </div>
    );
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("آدرس لینک:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    let normalized = url;
    if (!/^https?:\/\//i.test(normalized) && !normalized.startsWith("/") && !normalized.startsWith("#")) {
      normalized = "https://" + normalized;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: normalized }).run();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      toast.success("تصویر اضافه شد");
    } catch (err: any) {
      toast.error(err.message || "آپلود ناموفق بود");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const ToolBtn = ({
    onClick,
    active,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn("h-8 w-8 p-0", active && "bg-gray-200")}
    >
      {children}
    </Button>
  );

  return (
    <div className="border rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 sticky top-0 z-10" dir="ltr">
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strike"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolBtn>
        <span className="w-px bg-gray-300 self-stretch mx-1" />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolBtn>
        <span className="w-px bg-gray-300 self-stretch mx-1" />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus className="h-4 w-4" />
        </ToolBtn>
        <span className="w-px bg-gray-300 self-stretch mx-1" />
        <ToolBtn
          onClick={setLink}
          active={editor.isActive("link")}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          title="Unlink"
        >
          <Unlink className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={handleUploadClick}
          disabled={uploading}
          title={uploading ? "در حال آپلود…" : "Insert image"}
        >
          <ImageIcon className="h-4 w-4" />
        </ToolBtn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelected}
        />
        <span className="flex-1" />
        <ToolBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolBtn>
      </div>

      {/* Editable area */}
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}
