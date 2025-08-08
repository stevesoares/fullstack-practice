import { test, expect } from '@playwright/test';

test('landing renders hero heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /manage clients, contracts, payments, and galleries/i })).toBeVisible({ timeout: 15_000 });
});


