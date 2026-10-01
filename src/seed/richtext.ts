/** Tiny helpers to write Lexical rich text in seed data. */
const text = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const block = (type: 'paragraph' | 'heading', t: string, tag?: string) => ({
  type,
  ...(tag ? { tag } : {}),
  children: [text(t)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...(type === 'paragraph' ? { textFormat: 0, textStyle: '' } : {}),
})

/** Lines starting with "## " become headings, everything else paragraphs. */
export const rich = (...lines: string[]) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: lines.map((l) => (l.startsWith('## ') ? block('heading', l.slice(3), 'h2') : block('paragraph', l))),
  },
})
