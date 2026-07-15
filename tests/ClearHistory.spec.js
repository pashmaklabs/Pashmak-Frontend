import { test, expect } from '@playwright/test';

test.describe('Search history', () => {
  test('login and clear all search history', async ({ page }) => {
    const baseURL = 'http://localhost:5173';

    const urls = {
      map: `${baseURL}/map?#c35.689200-l51.389000-13.00z-0p`,
      searchHistory: `${baseURL}/map/search-history?#c35.689200-l51.389000-13.00z-0p`,
    };

    const user = {
      email: 'saeednourian82@gmail.com',
      password: 'Qwerty12345@',
    };

    await page.goto(urls.map);

    await page.getByRole('link', { name: /profile|پروفایل/i }).click();
    await page.getByRole('button', { name: 'ورود به حساب' }).click();

    await page.getByRole('textbox', { name: 'ایمیل' }).fill(user.email);
    await page.getByRole('button', { name: 'ورود', exact: true }).click();

    await page.getByRole('button', { name: 'ورود با رمز عبور' }).click();
    await page.getByRole('textbox', { name: 'رمز عبور' }).fill(user.password);

    await Promise.all([
      page.waitForURL(/\/admin|\/map|\/profile/, { timeout: 15000 }),
      page.getByRole('button', { name: 'ورود', exact: true }).click(),
    ]);

    await page.goto(urls.searchHistory);

    await expect(
      page.getByRole('heading', { name: 'تاریخچه جستجو', level: 1 })
    ).toBeVisible();

    const clearAllButton = page.getByRole('button', { name: 'پاک کردن همه' });
    const historyItems = page.getByRole('heading', { level: 3 });
    const emptyState = page
      .getByText(/تاریخچه جستجو خالی است|جستجوهای شما در اینجا نمایش داده خواهد شد/i)
      .first();

    if (await clearAllButton.isVisible().catch(() => false)) {
      await expect(clearAllButton).toBeEnabled();

      await clearAllButton.scrollIntoViewIfNeeded();
      await clearAllButton.click();

      const confirmButton = page.getByRole('button', {
        name: /تایید|تأیید|حذف|بله|قبول/i,
      });

      if (await confirmButton.isVisible().catch(() => false)) {
        await confirmButton.click();
      }

      await expect(historyItems).toHaveCount(0, { timeout: 10000 });
      await expect(clearAllButton).toBeHidden({ timeout: 10000 });
    }

    await expect(emptyState).toBeVisible({ timeout: 10000 });
  });
});
