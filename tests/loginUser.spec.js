import { test, expect } from '@playwright/test';

test('admin login and go to map', async ({ page }) => {
  await page.goto('http://localhost:5173/map');

  await page.getByRole('link', { name: 'profile' }).click();
  await page.getByRole('button', { name: 'ورود به حساب' }).click();

  await page.getByRole('textbox', { name: 'ایمیل' })
    .fill('saeednourian82@gmail.com');

  await page.getByRole('button', { name: 'ورود' }).click();

  await page.getByRole('button', { name: 'ورود با رمز عبور' }).click();

  await page.getByRole('textbox', { name: 'رمز عبور' })
    .fill('Qwerty12345@');

  await page.getByRole('button', { name: 'ورود', exact: true }).click();

  await expect(page).toHaveURL(/admin/);

  await page.goto('http://localhost:5173/map');

  await expect(page).toHaveURL(/map/);
});
