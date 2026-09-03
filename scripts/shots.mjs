import { chromium } from '@playwright/test'
const T = process.env.SHOTS_DIR || 'test-results'
const routes = ['/', '/events', '/events/long-slow-distance-backyard-ultra', '/events/long-slow-distance-backyard-ultra/register', '/work-with-us', '/about', '/journal', '/journal/why-a-backyard-ultra']
const browser = await chromium.launch({ channel: 'chrome' })
const errors = []
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp })
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name} ${page.url()} console: ${m.text().slice(0, 200)}`) })
  page.on('pageerror', (e) => errors.push(`${name} ${page.url()} pageerror: ${e.message.slice(0, 200)}`))
  for (const r of routes) {
    await page.goto((process.env.BASE_URL || 'http://localhost:3000') + r, { waitUntil: 'networkidle', timeout: 120000 })
    await page.waitForTimeout(800)
    // scroll through so reveals and pins fire, then back to top for the full-page shot
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)) } window.scrollTo(0, 0) })
    await page.waitForTimeout(600)
    const file = `${T}/shot-${name}-${r.replace(/\//g, '_') || 'home'}.png`
    await page.screenshot({ path: file, fullPage: true })
  }
  await page.close()
}
await browser.close()
console.log(errors.length ? errors.join('\n') : 'no console/page errors')
