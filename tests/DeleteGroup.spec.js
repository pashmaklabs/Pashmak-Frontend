import { test, expect } from '@playwright/test';

test('delete all saved groups', async ({ page }) => {
  test.setTimeout(90000); 

  await page.goto('http://localhost:5173/map');

  await page.getByRole('link', { name: 'profile' }).click();
  await page.getByRole('button', { name: 'ورود به حساب' }).click();
  await page.getByRole('textbox', { name: 'ایمیل' }).fill('saeednourian82@gmail.com');
  await page.getByRole('button', { name: 'ورود' }).click();
  await page.getByRole('button', { name: 'ورود با رمز عبور' }).click();
  await page.getByRole('textbox', { name: 'رمز عبور' }).fill('Qwerty12345@');
  await page.getByRole('button', { name: 'ورود', exact: true }).click();

  await expect(page).toHaveURL(/admin/);
  await page.goto('http://localhost:5173/map');
  await page.getByRole('link', { name: 'saved places' }).click();

 
  const deleteButtons = page.locator('.flex.items-center.justify-center.bg-transparent'); 
  
  const count = await deleteButtons.count();
  console.log(`Found ${count} groups to delete.`);

  for (let i = 0; i < count; i++) {
    await deleteButtons.first().click();
    
    const confirmButton = page.getByRole('button', { name: 'بله' });
    await confirmButton.waitFor({ state: 'visible' });
    await confirmButton.click();

    await expect(confirmButton).not.toBeVisible();
    
   await page.waitForTimeout(500); 
  }

  await expect(page.getByText('ایجاد گروه جدید')).toBeVisible();
  console.log('All groups deleted successfully.');
});
