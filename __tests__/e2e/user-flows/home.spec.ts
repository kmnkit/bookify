import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display the app title', async ({ page }) => {
    await page.goto('/ja')
    await expect(page.getByText('おすすめの本')).toBeVisible()
  })

  test('should switch language to English', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByText('Recommended Books')).toBeVisible()
  })

  test('should switch language to Korean', async ({ page }) => {
    await page.goto('/ko')
    await expect(page.getByText('추천 도서')).toBeVisible()
  })

  test('should have navigation links', async ({ page }) => {
    await page.goto('/ja')
    await expect(page.getByRole('link', { name: 'Bookify' })).toBeVisible()
  })
})
