

import { Mark } from '@tiptap/core';
import {  ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { all, createLowlight } from 'lowlight'


import CodeBlockComponent from './codeBlock'

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
  const lowlight = createLowlight(all)

lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
  const editor = useEditor({
    extensions: [StarterKit, NeonText, Document,
      Paragraph,
      Text,
      CodeBlockLowlight
        .extend({
          addNodeView() {
            return ReactNodeViewRenderer(CodeBlockComponent)
          },
        })
        .configure({ lowlight }),],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentUpdate(html);
    },
  });

  const toggleNeon = () => {
    editor?.chain().focus().toggleNeon().run();
  }; 
  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  }
  const toggleProgram = () => {
    editor.chain().focus().toggleCodeBlock().run()
  }



  return { 
    editor, 
    commands: {
      toggleNeon,
      toggleBold,toggleProgram
 
    }
  };
};