import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';

test('it should pass the E2E Inventory Flow', async ({ page }) => {
  // Unique suffix para hindi mag-collide ang test data kahit ma-retry
  const testId = Date.now();
  const ingredientName = `sugar-${testId}`;
  const materialName = `lobo-${testId}`;

  await page.goto(`${APP_URL}/login`);

  await page.getByRole('textbox', { name: '@gmail.com' }).click();
  await page.getByRole('textbox', { name: '@gmail.com' }).fill('tinadepadua19@gmail.com');
  await page.getByRole('textbox', { name: '••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••' }).fill('Araymo.123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  const addBtn = page.getByRole('button', { name: 'Add New Ingredient' });
  await addBtn.waitFor({ state: 'visible', timeout: 60000 });
  await addBtn.click();

  await page.getByRole('textbox', { name: 'e.g. Wash Sugar' }).click();
  await page.getByRole('textbox', { name: 'e.g. Wash Sugar' }).fill(ingredientName);
  await page.getByRole('spinbutton').first().click();
  await page.getByRole('spinbutton').first().fill('1');
  await page.getByRole('spinbutton').nth(1).click();
  await page.getByRole('spinbutton').nth(1).fill('1');
  await page.getByRole('spinbutton').nth(2).click();
  await page.getByRole('spinbutton').nth(2).fill('100');
  await page.getByRole('button', { name: 'Save Ingredient' }).click();

  // Hintayin talaga na sarado na ang modal bago tumuloy
  await page.getByText(/Raw ingredient added successfully/i).waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

  await page.getByRole('button', { name: 'Celebration Materials' }).click();
  await page.getByRole('button', { name: 'Add New Material' }).click();
  await page.getByRole('textbox', { name: 'e.g. Tarpaulin (2x3 ft)' }).click();
  await page.getByRole('textbox', { name: 'e.g. Tarpaulin (2x3 ft)' }).fill(materialName);
  await page.getByRole('spinbutton').first().click();
  await page.getByRole('spinbutton').first().fill('11');
  await page.getByRole('spinbutton').nth(1).click();
  await page.getByRole('spinbutton').nth(1).fill('1');
  await page.getByRole('spinbutton').nth(2).click();
  await page.getByRole('spinbutton').nth(2).fill('100');
  await page.getByRole('button', { name: 'Save Material' }).click();

  await page.getByText(/added successfully/i).first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

  await page.getByRole('button', { name: 'Recipe Log' }).click();
  await page.getByRole('button', { name: 'Add Recipe' }).click();
  await page.getByRole('combobox').first().selectOption({ label: 'Chocolate Fudge Cake' });
  await page.getByPlaceholder('12').click();
  await page.getByPlaceholder('12').fill('1');
  await page.getByPlaceholder('0.00').click();
  await page.getByPlaceholder('0.00').fill('1500');
  await page.getByRole('combobox').nth(1).selectOption({ label: `${ingredientName} (Raw · kg)` });
  await page.getByText('IngredientsSelect ingredient/').click();
  await page.getByPlaceholder('Qty').click();
  await page.getByPlaceholder('Qty').fill('1');
  await page.getByRole('button', { name: '+ Row' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('combobox').nth(3).selectOption({ label: `${materialName} (Material · pcs)` });
  await page.getByPlaceholder('Qty').nth(1).click();
  await page.getByPlaceholder('Qty').nth(1).fill('11');
  await page.getByRole('button', { name: 'Save Recipe' }).click();

  await page.getByRole('button', { name: 'Product Log' }).click();
  await page.getByRole('button', { name: 'Waste Log' }).click();

  await page.getByRole('button', { name: 'Spoiled Ingredient' }).click();
  await page.getByRole('combobox').nth(1).selectOption(ingredientName);
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('1');
  await page.getByRole('button', { name: 'Confirm Log' }).click();

  await page.getByRole('button', { name: 'Unsold Product' }).click();
  await page.getByRole('combobox').nth(1).selectOption('Chocolate Fudge Cake');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('1');
  await page.getByRole('button', { name: 'Confirm Log' }).click();

  await page.getByRole('button', { name: 'Damaged Material' }).click();
  await page.getByRole('combobox').nth(1).selectOption(materialName);
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('1');
  await page.getByRole('button', { name: 'Confirm Log' }).click();

  // ── CLEANUP — naka-scope na sa specific row, hindi na basta unang "Delete" na nakita ──
  await page.getByRole('button', { name: 'Stocks' }).click();
  await page.getByText('Raw Ingredients').click();
  await page.getByRole('row', { name: new RegExp(ingredientName, 'i') })
    .getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).last().click();

  await page.getByRole('button', { name: 'Celebration Materials' }).click();
  await page.getByRole('row', { name: new RegExp(materialName, 'i') })
    .getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).last().click();

  await page.getByRole('button', { name: 'Recipe Log' }).click();
  await page.getByRole('row', { name: /Chocolate Fudge Cake/i }).locator('button').last().click();
  await page.getByRole('button', { name: 'Delete' }).click();

  await page.getByRole('button', { name: 'Logout' }).click();
  await page.getByRole('button', { name: 'Yes, sign out' }).click();

  await page.waitForURL(/.*login/);
  expect(page.url()).toMatch(/.*login/);
});

test.setTimeout(300000);