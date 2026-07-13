# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Suggest_fail.spec.js >> Failing Test Example >> this test is designed to fail
- Location: tests\Suggest_fail.spec.js:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('textbox', { name: 'نام' })
Expected: visible
Error: strict mode violation: getByRole('textbox', { name: 'نام' }) resolved to 2 elements:
    1) <input dir="rtl" value="سعید" placeholder="نام" class="w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 border-gray-400↵                                    text-gray-900 placeholder:text-right focus:outline-none focus:border-primary"/> aka getByRole('textbox', { name: 'نام', exact: true })
    2) <input dir="rtl" value="نوریان" placeholder="نام خانوادگی" class="w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 border-gray-400↵                            text-secondary placeholder:text-right focus:outline-none focus:border-primary"/> aka getByRole('textbox', { name: 'نام خانوادگی' })

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('textbox', { name: 'نام' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - img [ref=e9]
      - paragraph [ref=e29]: پیدا کردن بهترین مسیر
    - generic [ref=e30]:
      - region "Map" [ref=e31]
      - generic:
        - generic [ref=e32]:
          - button "Zoom in" [ref=e33] [cursor=pointer]
          - button "Zoom out" [ref=e35] [cursor=pointer]
          - button "Reset bearing to north" [ref=e37]
        - group [ref=e39]:
          - generic "Toggle attribution" [ref=e40] [cursor=pointer]
          - generic [ref=e41]:
            - link "© MapTiler" [ref=e42] [cursor=pointer]:
              - /url: https://www.maptiler.com/copyright/
            - link "© OpenStreetMap contributors" [ref=e43] [cursor=pointer]:
              - /url: https://www.openstreetmap.org/copyright
  - generic [ref=e44]:
    - generic [ref=e46]:
      - generic [ref=e48]:
        - img "User" [ref=e49]
        - img [ref=e51] [cursor=pointer]:
          - img [ref=e52]
      - textbox "نام" [ref=e55]: سعید
      - textbox "نام خانوادگی" [ref=e57]: نوریان
      - button "تغییر رمز عبور" [ref=e59] [cursor=pointer]
      - generic [ref=e60]:
        - button "لغو" [disabled] [ref=e61]
        - button "تایید تغییرات" [disabled] [ref=e62]
    - generic [ref=e63]:
      - generic [ref=e64]:
        - img "profile_picture" [ref=e66]
        - generic [ref=e67]: سعید نوریان
        - img "back" [ref=e68] [cursor=pointer]
      - generic [ref=e69]:
        - generic [ref=e70]:
          - generic [ref=e71]:
            - button "اطلاعات حساب کاربری" [ref=e72] [cursor=pointer]
            - img [ref=e74]:
              - img [ref=e75]
          - generic [ref=e78]:
            - button "نظرات" [ref=e79] [cursor=pointer]
            - img [ref=e81]:
              - img [ref=e82]
        - button "خروج از حساب" [ref=e84] [cursor=pointer]
  - region "Notifications Alt+T"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Failing Test Example', () => {
  4  |   test('this test is designed to fail', async ({ page }) => {
  5  |     const baseURL = 'http://localhost:5173';
  6  |     const mapURL = `${baseURL}/map?#c35.689200-l51.389000-13.00z-0p`;
  7  | 
  8  |     const user = {
  9  |       email: 'saeednourian82@gmail.com',
  10 |       password: 'Qwerty12345@',
  11 |     };
  12 | 
  13 |     await page.goto(mapURL);
  14 |     await page.getByRole('link', { name: /profile|پروفایل/i }).click();
  15 |     await page.getByRole('button', { name: 'ورود به حساب' }).click();
  16 | 
  17 |     await page.getByRole('textbox', { name: 'ایمیل' }).fill(user.email);
  18 |     await page.getByRole('button', { name: 'ورود', exact: true }).click();
  19 | 
  20 |     await page.getByRole('button', { name: 'ورود با رمز عبور' }).click();
  21 |     await page.getByRole('textbox', { name: 'رمز عبور' }).fill(user.password);
  22 | 
  23 |     await Promise.all([
  24 |       page.waitForURL(/\/admin|\/map|\/profile/, { timeout: 15000 }),
  25 |       page.getByRole('button', { name: 'ورود', exact: true }).click(),
  26 |     ]);
  27 | 
  28 |     await page.goto(`${baseURL}/profile`);
  29 | 
  30 |     const nameInput = page.getByRole('textbox', { name: 'نام' });
> 31 |     await expect(nameInput).toBeVisible({ timeout: 10000 });
     |                             ^ Error: expect(locator).toBeVisible() failed
  32 |     
  33 |     // این بخش باعث شکست تست می‌شود، زیرا مقدار فیلد نام "کاربر ناموجود" نیست.
  34 |     await expect(nameInput).toHaveValue('کاربر ناموجود');
  35 |   });
  36 | });
  37 | 
```