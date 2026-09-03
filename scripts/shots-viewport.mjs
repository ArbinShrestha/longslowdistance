// Viewport screenshots at chosen scroll anchors, so pinned sections are seen the way a reader sees them.
import { chromium } from '@playwright/test'
const T = process.env.SHOTS_DIR || 'test-results'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)) })
await page.goto((process.env.BASE_URL || 'http://localhost:3000') + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const stops = [['hero', 0], ['event', 900], ['manifesto', 2400], ['manifesto2', 3300], ['services', 4600], ['journal', 5600], ['cta', 6600]]
for (const [name, y] of stops) {
  await page.evaluate((y) => window.scrollTo(0, y), y)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${T}/vp-${name}.png` })
}
// sheet: 7 tiles at 480x300
import sharp from 'sharp'
const tiles = []
for (let i = 0; i < stops.length; i++) tiles.push({ input: await sharp(`${T}/vp-${stops[i][0]}.png`).resize(480, 300).toBuffer(), left: (i % 2) * 480, top: Math.floor(i / 2) * 300 })
await sharp({ create: { width: 960, height: 1200, channels: 3, background: '#333' } }).composite(tiles).jpeg({ quality: 80 }).toFile(`${T}/vp-sheet.jpg`)
await browser.close()
console.log(errors.length ? errors.join('\n') : 'no console errors')
