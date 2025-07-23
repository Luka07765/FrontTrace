import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { createTextCss } from '@/Utils/Tool-Bar/createTextCss';
import { createConfiguredLowlight } from '@/Utils/Tool-Bar/lowLightConfig';
import CodeBlockComponent from './codeBlock';

export const NeonText = createTextCss('neonText', 'text-neon');
export const HighlightText = createTextCss('highlightText', 'bg-yellow-300');
export const H1 = createTextCss( 'h1', "text-[50px]");
export const useEditorSetup = (initialContent, onContentUpdate) => {
  const lowlight = createConfiguredLowlight(); 

  const editor = useEditor({
    extensions: [
      StarterKit,
      NeonText,
      HighlightText,
      Document,H1,
      Paragraph,
      Text,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }), 
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentUpdate(html);
    },
  });

  return {
    editor,
  };
};
