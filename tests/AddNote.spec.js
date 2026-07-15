import { test, expect } from '@playwright/test';

test.describe('Saved places notes', () => {
  test('login and add note to a saved place', async ({ page }) => {
    const baseURL = 'http://localhost:5173';

    const urls = {
      map: `${baseURL}/map?#c35.689200-l51.389000-13.00z-0p`,
      savedPlaces: `${baseURL}/map/bookmarks?#c35.689200-l51.389000-13.00z-0p`,
    };

    const user = {
      email: 'saeednourian82@gmail.com',
      password: 'Qwerty12345@',
    };

    const savedPlaceName = 'Group-1783958957803';
    const noteText = `Good ${Date.now()}`;

    await page.goto(urls.map);

    await page.getByRole('link', { name: /profile|پروفایل/i }).click();
    await page.getByRole('button', { name: 'ورود به حساب' }).click();

    const emailInput = page.getByRole('textbox', { name: 'ایمیل' });
    await emailInput.fill(user.email);
    await expect(emailInput).toHaveValue(user.email);

    await page.getByRole('button', { name: 'ورود', exact: true }).click();

    const loginWithPasswordBtn = page.getByRole('button', { name: 'ورود با رمز عبور' });
    await expect(loginWithPasswordBtn).toBeVisible({ timeout: 10000 });
    await loginWithPasswordBtn.click();

    const passwordInput = page.getByRole('textbox', { name: 'رمز عبور' });
    await passwordInput.fill(user.password);
    await expect(passwordInput).toHaveValue(user.password);

    await Promise.all([
      page.waitForURL(/\/admin|\/map|\/profile/, { timeout: 15000 }),
      page.getByRole('button', { name: 'ورود', exact: true }).click(),
    ]);

    await page.goto(urls.savedPlaces);

    const savedPlace = page.getByText(savedPlaceName, { exact: false }).first();
    await expect(savedPlace).toBeVisible({ timeout: 10000 });
    await savedPlace.click();

    const noteInput = page.getByRole('textbox', {
      name: 'یادداشت خود را بنویسید',
    });

    const noteButton = page.getByRole('button', { name: 'یادداشت' });

    try {
      await expect(noteInput).toBeVisible({ timeout: 3000 });
    } catch {
      await expect(noteButton).toBeVisible({ timeout: 10000 });
      await expect(noteButton).toBeEnabled();
      await noteButton.click();
      await expect(noteInput).toBeVisible({ timeout: 10000 });
    }

    await noteInput.clear();
    await noteInput.fill(noteText);
    await expect(noteInput).toHaveValue(noteText);

    await noteInput.blur();

    await expect(noteInput).toHaveValue(noteText, { timeout: 10000 });
  });
});
