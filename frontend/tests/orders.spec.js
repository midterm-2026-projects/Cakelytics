// // import { test, expect } from '@playwright/test';

// // test('test', async ({ page }) => {
// //   await page.goto('http://localhost:5173/');
  
// //   await page.getByRole('button', { name: 'EXPLORE MENU' }).click();
// //   await page.getByRole('button', { name: 'Add to Cart' }).first().click();

// //   // 1. Makinig muna sa dialog at i-ACCEPT ito bago i-click ang checkout
// //   page.once('dialog', async (dialog) => {
// //     console.log(`Dialog message: ${dialog.message()}`);
// //     await dialog.accept(); // Confirms "Proceed to checkout?"
// //   });

// //   await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  
// //   // 2. Pumunta sa checkout options
// //   await page.getByText('Pay full amount').click();

// //   // 3. I-fill ang Customer Details (Cleaned up version)
// //   await page.getByRole('textbox', { name: 'Full Name *' }).fill('Michelle De Guzman');
// //   await page.getByRole('textbox', { name: 'Contact Number *' }).fill('09352006368');
// //   await page.getByRole('textbox', { name: 'Alternative Contact Number (' }).fill('09977959907');
// //   await page.getByRole('textbox', { name: 'Facebook Name (Optional)' }).fill('Michelle De Guzman');
// //   await page.getByRole('textbox', { name: 'Email Address (Optional)' }).fill('mitcdeguzman@gmail.com');

// //   // 4. Place Order
// //   await page.getByRole('button', { name: 'Place Order' }).click();

// //   // 5. Download E-Receipt File
// //   const downloadPromise = page.waitForEvent('download');
// //   await page.getByRole('button', { name: '↓ Download E-Receipt File' }).click();
// //   const download = await downloadPromise;

// //   // 6. Return Home
// //   await page.getByRole('button', { name: '🔄 Order Again' }).click();
// //   await page.getByRole('navigation').getByRole('link', { name: 'Home' }).click();
// // });

// import { test, expect } from '@playwright/test';

// test.beforeEach(async ({ page }) => {
//   await page.goto('http://localhost:5173/');
//   await page.evaluate(() => localStorage.clear());
// });

// test('test', async ({ page }) => {
//   // Accept all dialogs (hindi dismiss) para hindi ma-cancel ang mga confirmation flows
//   page.on('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.accept().catch(() => {});
//   });

//   await page.goto('http://localhost:5173/');
//   await page.getByRole('button', { name: 'EXPLORE MENU' }).click();
//   await page.getByRole('button', { name: 'Add to Cart' }).first().click();

//   await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

//   const fullNameInput = page.getByRole('textbox', { name: 'Full Name *' });
//   await expect(fullNameInput).toBeVisible({ timeout: 15000 });
//   await fullNameInput.fill('Michelle');

//   await page.getByRole('textbox', { name: 'Contact Number *' }).fill('09758583764');
//   await page.getByRole('textbox', { name: 'Alternative Contact Number (' }).fill('09268804514');
//   await page.getByRole('textbox', { name: 'Facebook Name (Optional)' }).fill('Mitch');
//   await page.getByRole('textbox', { name: 'Email Address (Optional)' }).fill('michelleddaluz@gmail.com');

//   await page.getByText('Full PaymentPay full amount₱').click();
//   await page.getByRole('button', { name: 'Place Order' }).click();

//   const downloadPromise = page.waitForEvent('download');
//   await page.getByRole('button', { name: '↓ Download E-Receipt File' }).click();
//   const download = await downloadPromise;

//   await page.getByRole('button', { name: '🔄 Order Again' }).click();
//   await page.getByRole('navigation').getByRole('link', { name: 'Home' }).click();
// });

import { test, expect } from '@playwright/test';

test.use({
  trace: 'on',
  video: 'on',
});

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => localStorage.clear());
});

test('It should pass the full E2E Customer Orders Flow', async ({ page }) => {
  // Accept all dialogs (hindi dismiss) para hindi ma-cancel ang mga confirmation flows
  page.on('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept().catch(() => {});
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'EXPLORE MENU' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).first().click();

  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

  const fullNameInput = page.getByRole('textbox', { name: 'Full Name *' });
  await expect(fullNameInput).toBeVisible({ timeout: 15000 });
  await fullNameInput.fill('Michelle');

  await page.getByRole('textbox', { name: 'Contact Number *' }).fill('09758583764');
  await page.getByRole('textbox', { name: 'Alternative Contact Number (' }).fill('09268804514');
  await page.getByRole('textbox', { name: 'Facebook Name (Optional)' }).fill('Mitch');
  await page.getByRole('textbox', { name: 'Email Address (Optional)' }).fill('michelleddaluz@gmail.com');

  await page.getByText('Full PaymentPay full amount₱').click();
  await page.getByRole('button', { name: 'Place Order' }).click();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '↓ Download E-Receipt File' }).click();
  const download = await downloadPromise;

  await page.getByRole('button', { name: '🔄 Order Again' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Home' }).click();
});