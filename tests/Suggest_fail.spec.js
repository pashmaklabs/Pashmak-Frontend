import { test, expect } from '@playwright/test';

test.describe('Failing Test Example', () => {
  test('this test is designed to fail', async ({ page }) => {
    const baseURL = 'http://localhost:5173';
    const mapURL = `${baseURL}/map?#c35.689200-l51.389000-13.00z-0p`;

    const user = {
      email: 'saeednourian82@gmail.com',
      password: 'Qwerty12345@',
    };

    await page.goto(mapURL);
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

    await page.goto(`${baseURL}/profile`);

    const nameInput = page.getByRole('textbox', { name: 'نام' });
    await expect(nameInput).toBeVisible({ timeout: 10000 });
    
    // این بخش باعث شکست تست می‌شود، زیرا مقدار فیلد نام "کاربر ناموجود" نیست.
    await expect(nameInput).toHaveValue('کاربر ناموجود');
  });
});
