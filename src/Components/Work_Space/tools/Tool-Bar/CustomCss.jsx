// hooks/useEditorSetup.js
import { useRef, useEffect } from 'react';
import { Mark } from '@tiptap/core';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const NeonText = Mark.create({
  name: 'neonText',
  addAttributes() {
    return {
      class: {
        default: 'text-neon',
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.classList.contains('text-neon'),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
  addCommands() {
    return {
      toggleNeon: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
    };
  },
});

export const useEditorSetup = (initialContent, onContentUpdate) => {
  const editor = useEditor({
    extensions: [StarterKit, NeonText],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentUpdate(html);
    },
  });

  const toggleNeon = () => {
    editor?.chain().focus().toggleNeon().run();
  };

  useEffect(() => {
    if (editor && initialContent !== undefined) {
      editor.commands.setContent(initialContent || '');
    }
  }, [initialContent, editor]);

  return { editor, toggleNeon };
};