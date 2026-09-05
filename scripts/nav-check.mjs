import { chromium } from '@playwright/test'
const base = process.env.BASE_URL || 'https://longslowdistance.vercel.app'
const browser = await chromium.launch({ channel: 'chrome' })
const nav = async (from, label) => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message.slice(0, 120)))
  page.on('console', (m) => { if (m.type() === 'error' && !/402/.test(m.text())) errs.push('console: ' + m.text().slice(0, 160)) })
  await page.goto(base + from, { waitUntil: 'networkidle', timeout: 120000 })
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: label }).click()
  await page.waitForTimeout(3500)
  const broken = /couldn.t load/i.test(await page.locator('body').innerText().catch(() => ''))
  console.log(`${from} -> ${label}: broken=${broken} ${errs.join(' | ')}`)
  await page.close()
}
await nav('/', 'Events')
await nav('/', 'About')
await nav('/about', 'Events')
await nav('/events', 'Journal')
await nav('/work-with-us', 'About')
await browser.close()
