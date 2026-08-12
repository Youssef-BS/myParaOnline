const { chromium } = require('playwright')

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(String(err)))

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
  await page.waitForSelector('button[aria-label*=" to cart"]', { timeout: 15000 })

  const target = page.locator('button[aria-label*=" to cart"]').first()
  await target.scrollIntoViewIfNeeded()
  await page.screenshot({ path: 'scratchpad-before.png' })

  await target.click()

  await page.waitForSelector('text=Added to cart', { timeout: 5000 })
  await page.screenshot({ path: 'scratchpad-toast-visible.png' })

  await page.waitForTimeout(3000)
  const stillVisible = await page.locator('text=Added to cart').count()

  console.log('TOAST_APPEARED: true')
  console.log('TOAST_AUTO_DISMISSED:', stillVisible === 0)
  console.log('CONSOLE_ERRORS:', JSON.stringify(consoleErrors))

  await browser.close()
}

main().catch((err) => {
  console.error('SCRIPT_ERROR:', err.message)
  process.exit(1)
})
