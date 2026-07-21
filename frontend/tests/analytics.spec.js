import { test} from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';

test(' It should pass the full E2E Analytics Flow', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: '@gmail.com' }).click();
  await page.getByRole('textbox', { name: '@gmail.com' }).fill('tinadepadua19@gmail.com');
  await page.getByRole('textbox', { name: '••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••' }).fill('Araymo.123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Analytics' }).click();
  await page.getByTestId('performance-dropdown-trigger').click();
  await page.getByTestId('option-today').click();
  await page.getByTestId('performance-dropdown-trigger').click();
  await page.getByTestId('option-yesterday').click();
  await page.getByTestId('performance-dropdown-trigger').click();
  await page.getByTestId('option-last-7-days').click();
  await page.getByTestId('performance-dropdown-trigger').click();
  await page.getByTestId('option-last-month').click();
  await page.getByTestId('performance-dropdown-trigger').click();
  await page.getByTestId('option-this-month').click();
  await page.getByTestId('performance-dropdown-trigger').click();
  await page.getByTestId('option-this-year').click();
  await page.getByTestId('performance-dropdown-trigger').click();
  await page.getByTestId('option-custom-range...').click();
  await page.getByTestId('custom-start-date').fill('2026-07-12');
  await page.getByTestId('custom-end-date').fill('2026-07-18');
  await page.getByTestId('apply-custom-range').click();
  await page.getByTestId('forecast-btn-7d').click();
  await page.getByTestId('forecast-btn-30d').click();
  await page.getByTestId('forecast-btn-60d').click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.getByRole('button', { name: 'Yes, sign out' }).click();
}, 60000);