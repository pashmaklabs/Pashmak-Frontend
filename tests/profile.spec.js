import { test, expect } from '@playwright/test';

test.describe('Profile flow', () => {
  test('login with password and update profile info', async ({ page }) => {
    const baseURL = 'http://localhost:5173';
    const mapURL = `${baseURL}/map?#c35.689200-l51.389000-13.00z-0p`;
    const profileURL = `${baseURL}/profile`;

    const user = {
      email: 'saeednourian82@gmail.com',
      password: 'Qwerty12345@',
    };

    await page.goto(mapURL);
    await page.getByRole('link', { name: /profile/i }).click();
    await page.getByRole('button', { name: 'ورود به حساب' }).click();

    await page.getByRole('textbox', { name: 'ایمیل' }).fill(user.email);
    await page.getByRole('button', { name: 'ورود' }).click();

    await page.getByRole('button', { name: 'ورود با رمز عبور' }).click();
    await page.getByRole('textbox', { name: 'رمز عبور' }).fill(user.password);
    await page.getByRole('button', { name: 'ورود', exact: true }).click();

    await page.waitForURL(/\/admin|\/map|\/profile/, { timeout: 15000 });

    await page.goto(profileURL);
    await expect(page).toHaveURL(/\/profile/);

    const firstNameInput = page.getByRole('textbox', { name: 'نام', exact: true });
    const lastNameInput = page.getByRole('textbox', { name: 'نام خانوادگی' });
    const saveButton = page.getByRole('button', { name: 'تایید تغییرات' });

    await expect(async () => {
      const accountInfoButton = page.getByRole('button', { name: 'اطلاعات حساب کاربری' });
      await accountInfoButton.click();
      await expect(firstNameInput).toBeVisible({ timeout: 2000 });
    }).toPass({
      intervals: [500, 1000, 2000],
      timeout: 15000
    });

    const currentFirstName = (await firstNameInput.inputValue()).trim();

    const newFirstName = currentFirstName === 'سعید' ? 'حمید' : 'سعید';
    const newLastName = currentFirstName === 'سعید' ? 'نوریان فر' : 'نوریان';

    await firstNameInput.clear();
    await firstNameInput.fill(newFirstName);
    await expect(firstNameInput).toHaveValue(newFirstName);

    await lastNameInput.fill(newLastName);
    await expect(lastNameInput).toHaveValue(newLastName);

    await lastNameInput.blur();

    await expect(saveButton).toBeEnabled({ timeout: 15000 });
    await saveButton.click();

    await expect(firstNameInput).toHaveValue(newFirstName);
    await expect(lastNameInput).toHaveValue(newLastName);
  });
});
