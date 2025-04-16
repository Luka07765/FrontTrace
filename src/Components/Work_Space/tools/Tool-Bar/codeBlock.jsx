import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

const CodeBlock = ({ node: { attrs: { language: defaultLanguage } }, updateAttributes, extension }) => (
  <NodeViewWrapper className="code-block">
    <select 
      className="absolute top-2 right-2 bg-white pr-8 appearance-none bg-red bg-no-repeat bg-[length:1.25rem] bg-[right_0.5rem_center] text-sm border rounded" 
      contentEditable={false} 
      defaultValue={defaultLanguage} 
      onChange={event => updateAttributes({ language: event.target.value })}
    >
      <option value="null">
        auto
      </option>
      <option disabled>
        —
      </option>
      {extension.options.lowlight.listLanguages().map((lang, index) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))}
    </select>
    <pre>
      <NodeViewContent as="code" />
    </pre>
  </NodeViewWrapper>
)

CodeBlock.displayName = 'CodeBlock'
export default CodeBlock