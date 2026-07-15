import { test, expect } from '@playwright/test';

test.describe('Place Review/Comment', () => {
  test('login and submit a review for a specific place', async ({ page }) => {
    const baseURL = 'http://localhost:5173';
    const mapURL = `${baseURL}/map?#c35.689200-l51.389000-13.00z-0p`;

    const user = {
      email: 'saeednourian82@gmail.com',
      password: 'Qwerty12345@',
    };

    const targetPlace = 'سینما کوروش';
    const reviewText = 'خوبه';

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

    await page.goto(mapURL);

    const searchInput = page.getByRole('textbox', { name: 'کجا میخواهید بروید؟' });
    await expect(searchInput).toBeVisible();
    await searchInput.fill(targetPlace);
    await searchInput.press('Enter');

    const placeHeading = page.getByRole('heading', { name: targetPlace }).first();
    await expect(placeHeading).toBeVisible({ timeout: 10000 });
    await placeHeading.click();

    const rateButton = page.getByRole('button', { name: 'ثبت نظر' }).first();
    await expect(rateButton).toBeVisible({ timeout: 10000 });
    await rateButton.click();

    const starRating = page.getByRole('button', { name: /Rate 4 stars/i });
    await expect(starRating).toBeVisible();
    await starRating.click();

    const reviewInput = page.getByRole('textbox', { name: 'نظر خود را درباره این مکان بنویسید' });
    await expect(reviewInput).toBeVisible();
    await reviewInput.fill(reviewText);
    await expect(reviewInput).toHaveValue(reviewText);

    const submitButton = page.getByRole('button', { name: 'ثبت', exact: true });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(submitButton).toBeHidden({ timeout: 10000 });
  });
});
