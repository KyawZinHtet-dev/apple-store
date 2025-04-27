import "./style.css";
import { Toggle } from "@/components/ui/toggle";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Heading1,
  Heading2,
  Heading3,
  ItalicIcon,
  List,
  ListOrdered,
  Pilcrow,
  RedoIcon,
  Strikethrough,
  Undo,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

const TiptapEditor = ({ value, status }: { value: string; status: string }) => {
  const { setValue, resetField, setError } = useFormContext();
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();
      if (textContent.trim() === "") {
        resetField("description");
        setError("description", {
          message: "Description is required",
        });
        return;
      }
      setValue("description", htmlContent, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },

    content: value,
    extensions: [
      Placeholder.configure({
        placeholder: "Product Description",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
      }),
    ],
    editorProps: {
      attributes: {
        placeholder: "Product Description",
        spellcheck: "false",
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl min-h-[150px] min-w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors overflow-auto placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      if (status === "hasSucceeded") {
        editor.commands.clearContent();
      }
    }
  }, [status, editor]);

  useEffect(() => {
    if (editor) {
      if (value) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col space-y-2">
      {editor && (
        <div className=" space-x-1">
          <Toggle
            onPressedChange={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Toggle>
          <Toggle
            onPressedChange={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <RedoIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <BoldIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <ItalicIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("paragraph")}
            onPressedChange={() => editor.chain().focus().setParagraph().run()}
          >
            <Pilcrow className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("heading", { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive({ textAlign: "right" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive({ textAlign: "center" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive({ textAlign: "justify" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("justify").run()
            }
          >
            <AlignJustify className="h-4 w-4" />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
