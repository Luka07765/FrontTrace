import { createLowlight } from 'lowlight';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';

export const createConfiguredLowlight = () => {
  const lowlight = createLowlight();
  lowlight.register('html', html);
  lowlight.register('css', css);
  lowlight.register('js', js);
  lowlight.register('ts', ts);
  return lowlight;
};
