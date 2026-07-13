import { test, expect } from '@playwright/test';

test('create group and save place', async ({ page }) => {
  test.setTimeout(60000); 

  await page.goto('http://localhost:5173/map');

  await page.getByRole('link', { name: 'saved places' }).click();
  await page.getByRole('button', { name: 'ورود به حساب' }).click();
  await page.getByRole('textbox', { name: 'ایمیل' }).fill('saeednourian82@gmail.com');
  await page.getByRole('button', { name: 'ورود' }).click();
  await page.getByRole('button', { name: 'ورود با رمز عبور' }).click();
  await page.getByRole('textbox', { name: 'رمز عبور' }).fill('Qwerty12345@');
  await page.getByRole('button', { name: 'ورود', exact: true }).click();

  await expect(page).toHaveURL(/admin/);
  await page.goto('http://localhost:5173/map');

  await page.getByRole('link', { name: 'saved places' }).click();

  await page.getByRole('button', { name: 'ایجاد گروه جدید' }).click();
  const groupName = `Group-${Date.now()}`; 
  await page.getByRole('textbox', { name: 'نام گروه' }).fill(groupName);
  await page.getByRole('button', { name: 'ساخت گروه' }).click();

  await expect(page.getByText(groupName)).toBeVisible({ timeout: 15000 });

  const searchInput = page.getByRole('textbox', { name: 'کجا میخواهید بروید؟' });
  await searchInput.click();
  await searchInput.fill('لمیز');
  await searchInput.press('Enter'); 

  const result = page.getByText('قهوه لمیز شعبه تجریش').first();
  await result.waitFor({ state: 'visible', timeout: 15000 }); 
  await result.click();


  await page.locator('img[alt="save"]').click(); 
  
  await page.getByText(groupName).last().click(); 

  console.log(`Test finished for ${groupName}`);
});
