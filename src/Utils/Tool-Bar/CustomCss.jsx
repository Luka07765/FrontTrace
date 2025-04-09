import { Mark } from '@tiptap/core';
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
      toggleNeon:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
    };
  },
});  const toggleNeon = () => {
    editor?.chain().focus().toggleNeon().run(); // Now matches the command name in the extension
  };