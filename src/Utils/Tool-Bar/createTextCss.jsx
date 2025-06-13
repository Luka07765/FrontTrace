// src/Utils/Tool-Bar/createTextCss.js
import { Mark } from '@tiptap/core'

export const createTextCss = (name, className) => {
  return Mark.create({
    name,
    addAttributes() {
      return {
        class: {
          default: className,
        },
      }
    },
    parseHTML() {
      return [
        {
          tag: 'span',
          getAttrs: (node) =>
            node instanceof HTMLElement && node.classList.contains(className),
        },
      ]
    },
    renderHTML({ HTMLAttributes }) {
      return ['span', HTMLAttributes, 0]
    },
    addCommands() {
      return {
        toggleMarkClass: () => ({ commands }) =>
          commands.toggleMark(name),
      }
    },
  })
}
