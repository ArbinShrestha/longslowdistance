import { expect, test } from '@playwright/test'

const base = process.env.BASE_URL || 'http://localhost:3000'
const slug = 'long-slow-distance-backyard-ultra'

test.use({ baseURL: base })

test('register flow stores a pending registration and rejects duplicates', async ({ page, request }) => {
  const email = `e2e-${Date.now()}@example.com`
  await page.goto(`/events/${slug}/register`)
  await page.getByLabel('Full name').fill('Test Runner')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Phone', { exact: true }).fill('9800000000')
  await page.getByLabel('Emergency contact name').fill('Test Contact')
  await page.getByLabel('Emergency contact phone').fill('9811111111')
  await page.getByLabel('T-shirt size').selectOption('M')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Register' }).click()
  await expect(page.getByRole('status')).toContainText('You are in.')

  // Duplicate email for the same event is refused with an inline message.
  await page.goto(`/events/${slug}/register`)
  await page.getByLabel('Full name').fill('Test Runner')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Phone', { exact: true }).fill('9800000000')
  await page.getByLabel('Emergency contact name').fill('Test Contact')
  await page.getByLabel('Emergency contact phone').fill('9811111111')
  await page.getByLabel('T-shirt size').selectOption('M')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Register' }).click()
  await expect(page.getByRole('alert')).toContainText('already registered')

  // Registrations are not readable anonymously.
  const res = await request.get(`${base}/api/registrations?limit=1`)
  expect(res.status()).toBe(403)
})

test('inquiry flow stores an inquiry', async ({ page }) => {
  await page.goto('/work-with-us')
  await page.getByLabel('Your name').fill('Test Client')
  await page.getByLabel('Email').fill(`client-${Date.now()}@example.com`)
  await page.getByLabel('What do you have in mind?').selectOption('corporate')
  await page.getByLabel('Tell us about it').fill('A team day for forty people on the valley rim in November, budget flexible.')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByRole('status')).toContainText('Got it.')
})

test('honeypot submissions are dropped silently', async ({ page }) => {
  await page.goto('/work-with-us')
  await page.evaluate(() => {
    const el = document.querySelector<HTMLInputElement>('input[name="website"]')
    if (el) el.value = 'http://spam.example'
  })
  await page.getByLabel('Your name').fill('Spam Bot')
  await page.getByLabel('Email').fill('bot@example.com')
  await page.getByLabel('What do you have in mind?').selectOption('other')
  await page.getByLabel('Tell us about it').fill('Buy cheap things now from this long enough message.')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByRole('status')).toContainText('Got it.')
})
