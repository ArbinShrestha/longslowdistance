// Fails the build if an em dash appears anywhere in project-owned files.
import fs from 'node:fs'
import path from 'node:path'
const ROOTS = ['src', 'agents', '.github', 'scripts', 'README.md', 'CLAUDE.md']
const SKIP = new Set(['payload-types.ts'])
const EXTS = new Set(['.ts', '.tsx', '.mjs', '.md', '.json', '.yml', '.css'])
const hits = []
const walk = (p) => {
  const st = fs.statSync(p)
  if (st.isDirectory()) return fs.readdirSync(p).forEach((f) => walk(path.join(p, f)))
  if (!EXTS.has(path.extname(p)) || SKIP.has(path.basename(p))) return
  fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
    if (line.includes('\u2014')) hits.push(`${p}:${i + 1}`)
  })
}
ROOTS.filter(fs.existsSync).forEach(walk)
if (hits.length) {
  console.error(`Em dash found in ${hits.length} place(s). Replace with a comma, colon or period:`)
  hits.slice(0, 40).forEach((h) => console.error('  ' + h))
  process.exit(1)
}
console.log('lint:emdash OK')
