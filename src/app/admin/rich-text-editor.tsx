"use client";

import { Node } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

type Collection = "works" | "blog_posts";
type UploadMode = "insert" | "replace";
type ImageAttributes = {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  originalWidth?: number;
  originalHeight?: number;
  originalBytes?: number;
  optimizedBytes?: number;
};

function imageElement(element: HTMLElement) {
  return element.tagName === "IMG" ? element as HTMLImageElement : element.querySelector("img");
}

function positiveNumber(value: string | null) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function numberAttribute(value?: number) {
  return value ? String(value) : undefined;
}

const CmsImage = Node.create({
  name: "cmsImage",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    const image = (element: HTMLElement) => imageElement(element);
    return {
      src: { default: "", parseHTML: (element) => image(element)?.getAttribute("src") || "" },
      alt: { default: "", parseHTML: (element) => image(element)?.getAttribute("alt") || "" },
      caption: {
        default: "",
        parseHTML: (element) => element.tagName === "FIGURE" ? element.querySelector("figcaption")?.textContent || "" : "",
      },
      width: { default: null, parseHTML: (element) => positiveNumber(image(element)?.getAttribute("width") || null) },
      height: { default: null, parseHTML: (element) => positiveNumber(image(element)?.getAttribute("height") || null) },
      originalWidth: { default: null, parseHTML: (element) => positiveNumber(image(element)?.getAttribute("data-original-width") || null) },
      originalHeight: { default: null, parseHTML: (element) => positiveNumber(image(element)?.getAttribute("data-original-height") || null) },
      originalBytes: { default: null, parseHTML: (element) => positiveNumber(image(element)?.getAttribute("data-original-bytes") || null) },
      optimizedBytes: { default: null, parseHTML: (element) => positiveNumber(image(element)?.getAttribute("data-optimized-bytes") || null) },
    };
  },

  parseHTML() {
    const hasImage = (element: HTMLElement) => imageElement(element)?.getAttribute("src") ? {} : false;
    return [
      { tag: "figure", getAttrs: (element) => hasImage(element as HTMLElement) },
      { tag: "img[src]", getAttrs: (element) => hasImage(element as HTMLElement) },
    ];
  },

  renderHTML({ node }) {
    const attrs = node.attrs as ImageAttributes;
    const imageAttrs: Record<string, string> = {
      src: attrs.src,
      alt: attrs.alt || "",
    };
    const optional = {
      width: numberAttribute(attrs.width),
      height: numberAttribute(attrs.height),
      "data-original-width": numberAttribute(attrs.originalWidth),
      "data-original-height": numberAttribute(attrs.originalHeight),
      "data-original-bytes": numberAttribute(attrs.originalBytes),
      "data-optimized-bytes": numberAttribute(attrs.optimizedBytes),
    };
    for (const [key, value] of Object.entries(optional)) if (value) imageAttrs[key] = value;
    return ["figure", { class: "cms-content-image" }, ["img", imageAttrs], ["figcaption", {}, attrs.caption || ""]];
  },
});

function formatBytes(bytes?: number) {
  if (!bytes) return "未記錄";
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function validLink(url: string) {
  return /^(https:\/\/|mailto:|tel:|\/)/i.test(url.trim());
}

function selectedImage(editor: Editor | null): ImageAttributes | null {
  if (!editor?.isActive("cmsImage")) return null;
  return editor.getAttributes("cmsImage") as ImageAttributes;
}

export function RichTextEditor({ value, onChange, collection, itemId, accessToken }: {
  value: string;
  onChange: (html: string) => void;
  collection: Collection;
  itemId: string;
  accessToken: () => Promise<string>;
}) {
  const [imageAttrs, setImageAttrs] = useState<ImageAttributes | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadMode = useRef<UploadMode>("insert");
  const insertPosition = useRef(1);
  const lastEmittedValue = useRef<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: false }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["mailto", "tel"],
        isAllowedUri: (url) => validLink(url),
      }),
      TableKit.configure({ table: { resizable: false, HTMLAttributes: { class: "cms-editor-table" } } }),
      CmsImage,
    ],
    content: value || "<p>請輸入內文</p>",
    editorProps: {
      attributes: {
        class: "min-h-[28rem] rounded-b-2xl bg-white px-5 py-6 leading-8 outline-none md:px-8",
        "aria-label": "圖文內文編輯器",
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      lastEmittedValue.current = html;
      onChange(html);
    },
    onSelectionUpdate: ({ editor: current }) => setImageAttrs(selectedImage(current)),
    onCreate: ({ editor: current }) => setImageAttrs(selectedImage(current)),
  });

  useEffect(() => {
    if (!editor) return;
    if (lastEmittedValue.current === value) {
      lastEmittedValue.current = null;
      return;
    }
    const next = value || "<p>請輸入內文</p>";
    if (editor.getHTML() !== next) editor.commands.setContent(next, { emitUpdate: false });
    setImageAttrs(selectedImage(editor));
  }, [editor, itemId, value]);

  function command(action: () => void) {
    action();
    editor?.commands.focus();
  }

  function editLink() {
    if (!editor) return;
    const current = editor.getAttributes("link").href || "";
    const url = window.prompt("請輸入連結網址（https://、mailto:、tel: 或站內 / 路徑）", current);
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!validLink(url)) {
      setMessage("連結格式不安全，請使用 https://、mailto:、tel: 或站內 / 路徑。");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function chooseImage(mode: UploadMode) {
    if (!editor) return;
    uploadMode.current = mode;
    insertPosition.current = editor.state.selection.to;
    setMessage("");
    fileInput.current?.click();
  }

  async function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] || null;
    setFile(next);
    setDimensions(null);
    setMessage("");
    if (!next) return;
    const acceptedMime = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(next.type);
    const acceptedName = /\.(jpe?g|png|webp)$/i.test(next.name);
    if ((!acceptedMime && !(next.type === "" && acceptedName)) || next.size > 4 * 1024 * 1024) {
      setMessage("僅接受 4 MB 以下的 JPG、PNG 或 WebP。");
      setFile(null);
      return;
    }
    const url = URL.createObjectURL(next);
    const image = new Image();
    image.onload = () => {
      setDimensions({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setMessage("無法讀取圖片內容。");
      setFile(null);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  async function upload() {
    if (!file || !editor) return;
    setUploading(true);
    setMessage("正在最佳化並上傳圖片，請勿關閉頁面…");
    try {
      const token = await accessToken();
      if (!token) {
        setMessage("登入狀態已過期，請重新登入後再上傳。");
        return;
      }
      const form = new FormData();
      form.append("file", file);
      form.append("collection", collection);
      form.append("itemId", itemId);
      form.append("usage", "content");
      const response = await fetch("/api/cms/assets", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "圖片上傳失敗。");
        return;
      }
      const attrs: ImageAttributes = {
        src: result.url,
        alt: file.name.replace(/\.[^.]+$/, "") || "文章圖片",
        caption: "",
        width: result.width,
        height: result.height,
        originalWidth: result.originalWidth,
        originalHeight: result.originalHeight,
        originalBytes: result.originalBytes,
        optimizedBytes: result.optimizedBytes,
      };
      if (uploadMode.current === "replace" && editor.isActive("cmsImage")) {
        editor.chain().focus().updateAttributes("cmsImage", attrs).run();
      } else {
        const position = Math.max(1, Math.min(insertPosition.current, editor.state.doc.content.size));
        editor.chain().focus().insertContentAt(position, [{ type: "cmsImage", attrs }, { type: "paragraph" }]).run();
      }
      setImageAttrs(attrs);
      const saving = result.savedPercent > 0 ? `縮小 ${result.savedPercent}%` : "已完成網站格式轉換";
      setMessage(`圖片已放入目前游標位置：${formatBytes(result.originalBytes)} → ${formatBytes(result.optimizedBytes)}（${saving}）。`);
      setFile(null);
      setDimensions(null);
      if (fileInput.current) fileInput.current.value = "";
    } catch {
      setMessage("圖片上傳失敗，文章沒有被修改。請檢查網路後再試一次。");
    } finally {
      setUploading(false);
    }
  }

  function updateImage(attributes: Partial<ImageAttributes>) {
    if (!editor || !editor.isActive("cmsImage")) return;
    const next = { ...imageAttrs, ...attributes } as ImageAttributes;
    setImageAttrs(next);
    editor.commands.updateAttributes("cmsImage", attributes);
  }

  if (!editor) return <div className="rounded-2xl border border-neutral-200 p-6 text-neutral-500">正在載入圖文編輯器…</div>;

  const button = (label: string, action: () => void, active = false, disabled = false) => <button
    type="button"
    disabled={disabled}
    aria-pressed={active}
    className={`rounded-lg border px-3 py-2 text-sm disabled:opacity-30 ${active ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white hover:border-neutral-700"}`}
    onClick={() => command(action)}
  >{label}</button>;

  return <section className="rounded-2xl border border-neutral-200 bg-neutral-50">
    <div className="border-b border-neutral-200 p-4 md:p-5">
      <h3 className="font-semibold">圖文內文編輯器</h3>
      <p className="mt-1 text-sm text-neutral-600">這是一個完整內文，不再拆成多個區塊。把游標放在文字中，再按「插入圖片」，圖片就會出現在該位置。</p>
    </div>
    <div className="sticky top-0 z-10 flex flex-wrap gap-2 border-b border-neutral-200 bg-neutral-50/95 p-3 backdrop-blur" aria-label="文章格式工具列">
      {button("H2", () => editor.chain().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
      {button("H3", () => editor.chain().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }))}
      {button("H4", () => editor.chain().toggleHeading({ level: 4 }).run(), editor.isActive("heading", { level: 4 }))}
      {button("粗體", () => editor.chain().toggleBold().run(), editor.isActive("bold"))}
      {button("斜體", () => editor.chain().toggleItalic().run(), editor.isActive("italic"))}
      {button("項目清單", () => editor.chain().toggleBulletList().run(), editor.isActive("bulletList"))}
      {button("數字清單", () => editor.chain().toggleOrderedList().run(), editor.isActive("orderedList"))}
      {button("引言", () => editor.chain().toggleBlockquote().run(), editor.isActive("blockquote"))}
      {button("連結", editLink, editor.isActive("link"))}
      {button("插入表格", () => editor.chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
      {button("插入圖片", () => chooseImage("insert"))}
      {button("復原", () => editor.chain().undo().run(), false, !editor.can().undo())}
      {button("重做", () => editor.chain().redo().run(), false, !editor.can().redo())}
    </div>
    {editor.isActive("table") && <div className="flex flex-wrap gap-2 border-b border-neutral-200 bg-white px-4 py-3">
      {button("新增列", () => editor.chain().addRowAfter().run())}
      {button("新增欄", () => editor.chain().addColumnAfter().run())}
      {button("刪除列", () => editor.chain().deleteRow().run())}
      {button("刪除欄", () => editor.chain().deleteColumn().run())}
      {button("刪除表格", () => editor.chain().deleteTable().run())}
    </div>}
    <EditorContent editor={editor} className="[&_.ProseMirror_blockquote]:my-5 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-amber-400 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_figure]:my-7 [&_.ProseMirror_figure]:cursor-pointer [&_.ProseMirror_figure]:overflow-hidden [&_.ProseMirror_figure]:rounded-2xl [&_.ProseMirror_figure]:bg-neutral-100 [&_.ProseMirror_figure.ProseMirror-selectednode]:ring-2 [&_.ProseMirror_figure.ProseMirror-selectednode]:ring-amber-500 [&_.ProseMirror_figcaption]:px-4 [&_.ProseMirror_figcaption]:py-3 [&_.ProseMirror_figcaption]:text-center [&_.ProseMirror_figcaption]:text-sm [&_.ProseMirror_figcaption]:text-neutral-600 [&_.ProseMirror_h2]:mb-4 [&_.ProseMirror_h2]:mt-8 [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h3]:mb-3 [&_.ProseMirror_h3]:mt-7 [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h4]:mb-2 [&_.ProseMirror_h4]:mt-6 [&_.ProseMirror_h4]:text-xl [&_.ProseMirror_h4]:font-semibold [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:w-full [&_.ProseMirror_img]:object-contain [&_.ProseMirror_li]:my-1 [&_.ProseMirror_ol]:my-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-7 [&_.ProseMirror_p]:mb-4 [&_.ProseMirror_table]:my-5 [&_.ProseMirror_table]:w-full [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-neutral-300 [&_.ProseMirror_td]:p-2 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-neutral-300 [&_.ProseMirror_th]:bg-neutral-100 [&_.ProseMirror_th]:p-2 [&_.ProseMirror_ul]:my-4 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-7" />
    {imageAttrs && <div className="border-t border-neutral-200 bg-amber-50 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="font-medium">已選取內文圖片</h4><p className="text-sm text-neutral-600">可直接修改說明、替換圖片或刪除。</p></div><div className="flex gap-2"><button type="button" className="rounded-full border border-neutral-900 bg-white px-4 py-2 text-sm" onClick={() => chooseImage("replace")}>替換圖片</button><button type="button" className="rounded-full bg-red-700 px-4 py-2 text-sm text-white" onClick={() => { if (window.confirm("確定從文章移除這張圖片？")) editor.chain().focus().deleteSelection().run(); }}>刪除圖片</button></div></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2"><label className="text-sm">替代文字（描述圖片內容）<input className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2" value={imageAttrs.alt || ""} onChange={(event) => updateImage({ alt: event.target.value })} /></label><label className="text-sm">圖片說明（可留白）<input className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2" value={imageAttrs.caption || ""} onChange={(event) => updateImage({ caption: event.target.value })} /></label></div>
      <p className="mt-3 text-sm text-neutral-600">網站顯示：{imageAttrs.width && imageAttrs.height ? `${imageAttrs.width} × ${imageAttrs.height} px` : "尺寸未記錄"}・{formatBytes(imageAttrs.optimizedBytes)}；保留原圖比例、不裁切。</p>
    </div>}
    <input ref={fileInput} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={chooseFile} />
    {file && <div className="border-t border-neutral-200 bg-white p-4 md:p-5"><p className="text-sm">已選擇：{file.name}・{formatBytes(file.size)}{dimensions ? `・${dimensions.width} × ${dimensions.height} px` : "・正在讀取圖片尺寸…"}</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" className="rounded-full bg-neutral-900 px-5 py-2 text-white disabled:opacity-40" disabled={uploading} onClick={upload}>{uploading ? "正在最佳化並上傳…" : uploadMode.current === "replace" ? "上傳並替換圖片" : "上傳並插入游標位置"}</button><button type="button" className="rounded-full border border-neutral-300 px-5 py-2" disabled={uploading} onClick={() => { setFile(null); setDimensions(null); if (fileInput.current) fileInput.current.value = ""; }}>取消</button></div></div>}
    {message && <p role="status" aria-live="polite" className="border-t border-neutral-200 bg-blue-50 px-5 py-3 text-sm text-blue-900">{message}</p>}
  </section>;
}
