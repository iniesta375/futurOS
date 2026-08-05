import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Underline as UnderlineIcon,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

function ToolbarButton({ onClick, active, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-10 w-10 items-center justify-center rounded-xl transition-all
        ${
          active
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      {children}
    </button>
  );
}

export default function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-white/5 py-3 px-4">
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Enter URL");

          if (!url) return;

          editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <Link2 size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={false}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={18} />
      </ToolbarButton>
      <div className="h-6 w-px bg-white/10" />

      <ToolbarButton
        active={false}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={18} />
      </ToolbarButton>
    </div>
  );
}
