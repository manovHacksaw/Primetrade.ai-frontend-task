'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  error?: boolean;
}

export default function RichTextEditor({ content, onChange, error }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Underline,
      Strike,
      Placeholder.configure({
        placeholder: 'Write your post content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      style={{
        border: `1px solid ${error ? '#ef4444' : 'var(--foreground-border)'}`,
        borderRadius: '0.5rem',
        backgroundColor: 'var(--background)',
        transition: 'all 0.2s',
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
        }
      }}
      onBlur={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = 'var(--foreground-border)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          padding: '0.75rem',
          borderBottom: '1px solid var(--foreground-border)',
          backgroundColor: 'var(--background)',
        }}
      >
        {/* Headings */}
        <div style={{ display: 'flex', gap: '0.25rem', borderRight: '1px solid var(--foreground-border)', paddingRight: '0.5rem', marginRight: '0.5rem' }}>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: editor.isActive('paragraph') ? 600 : 400,
              color: editor.isActive('paragraph') ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('paragraph') ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('paragraph')) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('paragraph')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            P
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: editor.isActive('heading', { level: 1 }) ? 600 : 400,
              color: editor.isActive('heading', { level: 1 }) ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('heading', { level: 1 }) ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('heading', { level: 1 })) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('heading', { level: 1 })) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: editor.isActive('heading', { level: 2 }) ? 600 : 400,
              color: editor.isActive('heading', { level: 2 }) ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('heading', { level: 2 }) ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('heading', { level: 2 })) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('heading', { level: 2 })) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: editor.isActive('heading', { level: 3 }) ? 600 : 400,
              color: editor.isActive('heading', { level: 3 }) ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('heading', { level: 3 }) ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('heading', { level: 3 })) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('heading', { level: 3 })) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            H3
          </button>
        </div>

        {/* Text Emphasis */}
        <div style={{ display: 'flex', gap: '0.25rem', borderRight: '1px solid var(--foreground-border)', paddingRight: '0.5rem', marginRight: '0.5rem' }}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: editor.isActive('bold') ? 600 : 400,
              color: editor.isActive('bold') ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('bold') ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('bold')) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('bold')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontStyle: 'italic',
              fontWeight: editor.isActive('italic') ? 600 : 400,
              color: editor.isActive('italic') ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('italic') ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('italic')) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('italic')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              textDecoration: 'underline',
              fontWeight: editor.isActive('underline') ? 600 : 400,
              color: editor.isActive('underline') ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('underline') ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('underline')) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('underline')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            U
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              textDecoration: 'line-through',
              fontWeight: editor.isActive('strike') ? 600 : 400,
              color: editor.isActive('strike') ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('strike') ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('strike')) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('strike')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            S
          </button>
        </div>

        {/* Lists */}
        <div style={{ display: 'flex', gap: '0.25rem', borderRight: '1px solid var(--foreground-border)', paddingRight: '0.5rem', marginRight: '0.5rem' }}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: editor.isActive('bulletList') ? 600 : 400,
              color: editor.isActive('bulletList') ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('bulletList') ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('bulletList')) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('bulletList')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: editor.isActive('orderedList') ? 600 : 400,
              color: editor.isActive('orderedList') ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('orderedList') ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('orderedList')) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('orderedList')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            1.
          </button>
        </div>

        {/* Code */}
        <div style={{ display: 'flex', gap: '0.25rem', borderRight: '1px solid var(--foreground-border)', paddingRight: '0.5rem', marginRight: '0.5rem' }}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              fontWeight: editor.isActive('code') ? 600 : 400,
              color: editor.isActive('code') ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('code') ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('code')) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('code')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            &lt;/&gt;
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            style={{
              padding: '0.375rem 0.5rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              fontWeight: editor.isActive('codeBlock') ? 600 : 400,
              color: editor.isActive('codeBlock') ? 'var(--foreground)' : 'var(--foreground-muted)',
              backgroundColor: editor.isActive('codeBlock') ? 'var(--foreground-border)' : 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!editor.isActive('codeBlock')) {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              if (!editor.isActive('codeBlock')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }
            }}
          >
            {'{}'}
          </button>
        </div>

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          style={{
            padding: '0.375rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: editor.isActive('link') ? 600 : 400,
            color: editor.isActive('link') ? 'var(--foreground)' : 'var(--foreground-muted)',
            backgroundColor: editor.isActive('link') ? 'var(--foreground-border)' : 'transparent',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!editor.isActive('link')) {
              e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
              e.currentTarget.style.color = 'var(--foreground)';
            }
          }}
          onMouseLeave={(e) => {
            if (!editor.isActive('link')) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--foreground-muted)';
            }
          }}
        >
          🔗
        </button>

        {/* Clean Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          style={{
            padding: '0.375rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: 400,
            color: 'var(--foreground-muted)',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginLeft: 'auto',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
            e.currentTarget.style.color = 'var(--foreground)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--foreground-muted)';
          }}
        >
          Clear
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: '300px',
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.8',
          color: 'var(--foreground)',
        }}
        className="sm:text-base"
      />
    </div>
  );
}

