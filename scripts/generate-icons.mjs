// Rasterises the traced LSD letters onto a round dark plate for favicon / apple icon / OG fallback.
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'

const src = readFileSync('src/components/brand/lsd-letters.ts', 'utf8')
const d = src.match(/LSD_LETTERS_PATH =\n\s+'([^']+)'/)[1]
const [x0, y0, x1, y1] = JSON.parse(src.match(/LSD_LETTERS_BBOX = (\[[^\]]+\])/)[1])
const w = x1 - x0, h = y1 - y0
const scale = 0.68 * 1000 / w
const svg = (bg, fg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
<circle cx="500" cy="500" r="500" fill="${bg}"/>
<g transform="translate(${500 - (w * scale) / 2} ${500 - (h * scale) / 2}) scale(${scale}) translate(${-x0} ${-y0})"><path d="${d}" fill="${fg}" fill-rule="evenodd"/></g></svg>`
const dark = Buffer.from(svg('#0b0b0c', '#f2efe9'))
const light = Buffer.from(svg('#f2efe9', '#0b0b0c'))
await sharp(dark).resize(512, 512).png().toFile('src/app/icon.png')
await sharp(dark).resize(180, 180).flatten({ background: '#0b0b0c' }).png().toFile('src/app/apple-icon.png')
writeFileSync('public/brand/lsd-mark-dark.svg', dark)
writeFileSync('public/brand/lsd-mark-light.svg', light)
console.log('icons written')
