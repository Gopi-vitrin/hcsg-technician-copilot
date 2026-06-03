// Pass 3 — mop up remaining rgba blues, green Tailwind classes, hcsg-blue in multi-class strings
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const REPLACEMENTS = [
  // rgba(17,89,175,*) forms not caught by pass 2
  ['rgba(17,89,175,0.06)', 'rgba(1,30,65,0.1)'],
  ['rgba(17,89,175,0.07)', 'rgba(1,30,65,0.1)'],
  ['rgba(17,89,175,0.1)',  'rgba(1,30,65,0.12)'],
  ['rgba(17,89,175,0.12)', 'rgba(1,30,65,0.15)'],

  // hcsg-blue class inside multi-class strings (space before and after)
  [' text-hcsg-blue ',  ' text-hcsg-navy '],
  [' text-hcsg-blue"',  ' text-white/60"'],
  [" text-hcsg-blue'",  " text-white/60'"],
  ['"text-hcsg-blue',   '"text-white/60'],
  ["'text-hcsg-blue",   "'text-white/60"],

  // Green Tailwind classes → HCSG dark green
  ['bg-green-400 animate-pulse', 'animate-pulse'],        // keep pulse, just remove green bg class
  [' bg-green-400',   ' bg-hcsg-green'],                  // needs hcsg-green in tailwind
  ['text-green-400',  'text-hcsg-green'],
  ['text-green-600',  'text-hcsg-green'],
  ['border-green-400','border-hcsg-green'],
  ['border-green-500','border-hcsg-green'],
  ['bg-green-500',    'bg-hcsg-green'],
  ['bg-green-100',    'rgba(19,97,46,0.12)'],

  // rgba green tints
  ['rgba(74,222,128,0.15)',  'rgba(19,97,46,0.12)'],
  ['rgba(74,222,128,0.04)',  'rgba(19,97,46,0.06)'],
  ['rgba(74,222,128,0.1)',   'rgba(19,97,46,0.1)'],
  ['rgba(74,222,128,0.12)',  'rgba(19,97,46,0.1)'],
  ['rgba(74,222,128,0.2)',   'rgba(19,97,46,0.15)'],
  ['rgba(74,222,128,0.05)',  'rgba(19,97,46,0.06)'],
  ['rgba(74,222,128,0.08)',  'rgba(19,97,46,0.08)'],

  // Any #52b96e (intermediate) → use exact HCSG green
  ['#52b96e', '#13612e'],
  ['#5aad74', '#13612e'],

  // Knowledge Base card background in Profile → orange-accent style
  ["border: '1px solid rgba(1,30,65,0.3)', borderRadius: 4, background: 'rgba(1,30,65,0.1)'",
   "border: '1px solid rgba(230,94,37,0.2)', borderRadius: 4, background: 'rgba(230,94,37,0.05)'"],
  ["border: '1px solid rgba(1,30,65,0.3)', borderRadius: 4, background: 'rgba(1,30,65,0.12)'",
   "border: '1px solid rgba(230,94,37,0.2)', borderRadius: 4, background: 'rgba(230,94,37,0.05)'"],
]

let changed = 0
function processDir(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) { processDir(full); continue }
    if (!name.endsWith('.jsx') && !name.endsWith('.css') && !name.endsWith('.js')) continue
    let content = readFileSync(full, 'utf8')
    const before = content
    for (const [from, to] of REPLACEMENTS) {
      content = content.split(from).join(to)
    }
    if (content !== before) {
      writeFileSync(full, content, 'utf8')
      console.log('Updated:', name)
      changed++
    }
  }
}

processDir('src/v2')
console.log(`\nPass 3 done — ${changed} files updated`)
