// playwright.config.js
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

function findWindowsBrowser() {
  const candidates = [
    // Chrome
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    // Edge
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  return candidates.find(p => fs.existsSync(p));
}

const executablePath = process.env.BROWSER_PATH || findWindowsBrowser();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    headless: false,                 // مرورگر واقعی (headed)
    screenshot: 'only-on-failure',   // بند d
    video: 'retain-on-failure',      // بند e
    trace: 'on-first-retry',

    // راه‌حل اصلی: اول تلاش با channel، اگر نشد با executablePath
    channel: 'chrome',
    launchOptions: executablePath ? { executablePath } : {},
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
