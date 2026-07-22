// // import { test, expect } from '@playwright/test';

// // const ADMIN_EMAIL = 'admin@cakelytics.com';
// // const ADMIN_PASSWORD = 'password123';

// // /**
// //  * Dismisses the next browser dialog (window.confirm/alert) that appears and
// //  * logs its message. Playwright's dialog handler only fires once per
// //  * page.once('dialog', ...) call, so this is a thin wrapper to avoid
// //  * repeating the same boilerplate at every "Finalize/Confirm/Delete" click.
// //  */
// // function expectNextDialog(page) {
// //   page.once('dialog', (dialog) => {
// //     console.log(`Dialog message: ${dialog.message()}`);
// //     dialog.dismiss().catch(() => {});
// //   });
// // }

// // test.describe('Cakelytics admin flows', () => {
// //   test.beforeEach(async ({ page }) => {
// //     await page.goto('http://localhost:5173/login');
// //     await page.getByRole('textbox', { name: '@gmail.com' }).fill(ADMIN_EMAIL);
// //     await page.getByRole('textbox', { name: '••••••••' }).fill(ADMIN_PASSWORD);
// //     await page.getByRole('button', { name: 'Sign in' }).click();

// //     // Confirms login succeeded before each test proceeds.
// //     await expect(page).toHaveURL(/\/dashboard|\/pos|\//);
// //   });

// //   test('POS - Buy Now order can be completed with cash payment', async ({ page }) => {
// //     await page.getByRole('link', { name: 'Point Of Sale' }).click();

// //     // Add a product to the cart and complete the order.
// //     await page.getByRole('button', { name: 'ADD' }).nth(4).click();
// //     await page.getByRole('button', { name: 'Complete Order' }).click();
// //     await page.getByPlaceholder('Enter cash amount').fill('900');

// //     expectNextDialog(page);
// //     await page.getByRole('button', { name: 'Finalize Transaction' }).click();
// //   });

// //   test('POS - Pre-Order can be placed with customer and pickup details', async ({ page }) => {
// //     await page.getByRole('link', { name: 'Point Of Sale' }).click();

// //     // Sanity check the category filters render before switching modes.
// //     await page.getByRole('button', { name: 'Package' }).click();
// //     await page.getByRole('button', { name: 'Pastry' }).click();
// //     await page.getByRole('button', { name: 'Celebration Material' }).click();

// //     await page.getByRole('button', { name: 'Pre-Order' }).click();
// //     await page.getByRole('button', { name: 'Package' }).click();
// //     await page.getByRole('button', { name: 'ADD' }).nth(1).click();

// //     await page.getByRole('textbox', { name: 'Phone Number *' }).fill('09469589398');
// //     await page.getByRole('textbox', { name: 'Customer Name *' }).fill('Princes');
// //     await page.locator('input[type="date"]').fill('2026-07-23');
// //     await page.locator('input[type="time"]').fill('12:00');

// //     await page.getByRole('button', { name: 'Confirm Pre-Order' }).click();
// //     await page.getByPlaceholder('Enter cash amount').fill('1600');

// //     expectNextDialog(page);
// //     await page.getByRole('button', { name: 'Finalize Transaction' }).click();
// //   });

// //   test('Orders - status filters, cancel, and mark as ready', async ({ page }) => {
// //     await page.getByRole('link', { name: 'All Orders' }).click();

// //     // Cycle through each status filter tab.
// //     for (const status of ['Confirmed', 'Ready', 'Completed', 'Cancelled', 'All']) {
// //       await page.getByRole('button', { name: status }).click();
// //     }

// //     // Cancel the first order in the list.
// //     await page.getByRole('cell', { name: 'View Details' }).first().click();
// //     expectNextDialog(page);
// //     await page.getByRole('button', { name: 'Cancel Order' }).click();

// //     // Mark the second order as ready.
// //     await page.getByRole('button', { name: 'View Details' }).nth(1).click();
// //     expectNextDialog(page);
// //     await page.getByRole('button', { name: 'Mark as Ready' }).click();
// //   });

// //   test('Product Management - create, edit, and delete a product', async ({ page }) => {
// //     await page.getByRole('link', { name: 'Product Management' }).click();

// //     // Create a new product.
// //     await page.getByRole('button', { name: '+ Add Product' }).click();
// //     await page.getByRole('textbox', { name: 'Product Name' }).fill('Cake');
// //     await page.getByPlaceholder('0', { exact: true }).fill('2000');
// //     await page
// //       .getByRole('textbox', { name: 'e.g. Themed Cake (7x5) w/' })
// //       .fill('Round Cake');

// //     await page.getByText('Upload Image').click();
// //     await page.getByLabel('Upload Image').setInputFiles('images.jpg');
// //     await page.getByText('Upload Image').click();
// //     await page.getByLabel('Upload Image').setInputFiles('94bcf438c4cfda92e528010dba8f54f1.jpg');

// //     await page.getByRole('button', { name: 'Submit' }).click();
// //     await expect(page.getByText('Cake')).toBeVisible();

// //     // Edit the product just created (assumes it's the 3rd row).
// //     await page.getByRole('button', { name: 'Edit' }).nth(2).click();
// //     await page.getByRole('textbox', { name: 'Product Name' }).press('ControlOrMeta+a');
// //     await page.getByRole('textbox', { name: 'Product Name' }).fill('Butterfly');
// //     await page.getByPlaceholder('0', { exact: true }).press('ControlOrMeta+a');
// //     await page.getByPlaceholder('0', { exact: true }).fill('800');
// //     await page.getByRole('button', { name: 'Submit' }).click();
// //     await expect(page.getByText('Butterfly')).toBeVisible();

// //     // Delete the product.
// //     expectNextDialog(page);
// //     await page.getByRole('button', { name: 'Delete' }).nth(2).click();
// //     await expect(page.getByText('Butterfly')).not.toBeVisible();
// //   });

// //   test('Product Management - category filters and search', async ({ page }) => {
// //     await page.getByRole('link', { name: 'Product Management' }).click();

// //     for (const category of ['Package', 'Pastry', 'Celebration Material']) {
// //       await page.getByRole('button', { name: category }).click();
// //     }

// //     await page.getByRole('button', { name: 'All' }).click();
// //     await page.getByPlaceholder('Search by product name...').fill('choco');
// //     await expect(page.getByPlaceholder('Search by product name...')).toHaveValue('choco');
// //   });
// // });

// // // import { test, expect } from '@playwright/test';

// // // test('test', async ({ page }) => {
// // //   await page.goto('http://localhost:5173/login');
// // //   await page.getByRole('textbox', { name: '@gmail.com' }).click();
// // //   await page.getByRole('textbox', { name: '@gmail.com' }).fill('admin');
// // //   await page.getByRole('textbox', { name: '@gmail.com' }).click();
// // //   await page.getByRole('textbox', { name: '@gmail.com' }).fill('admin@cakelytics.com');
// // //   await page.getByRole('textbox', { name: '••••••••' }).click();
// // //   await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
// // //   await page.getByRole('textbox', { name: '••••••••' }).press('Enter');
// // //   await page.getByRole('link', { name: 'Point Of Sale' }).click();
// // //   await page.getByText('Mocha Cake₱850.00ADD').click();
// // //   await page.getByRole('button', { name: 'ADD' }).nth(4).click();
// // //   await page.getByRole('button', { name: 'Discounts & Options' }).click();
// // //   await page.getByRole('button', { name: 'Discounts & Options' }).click();
// // //   await page.getByRole('button', { name: 'Complete Order' }).click();
// // //   await page.getByPlaceholder('Enter cash amount').fill('900');
// // //   page.once('dialog', dialog => {
// // //     console.log(`Dialog message: ${dialog.message()}`);
// // //     dialog.dismiss().catch(() => {});
// // //   });
// // //   await page.getByRole('button', { name: 'Finalize Transaction' }).click();
// // //   await page.getByRole('button', { name: 'Pre-Order' }).click();
// // //   await page.getByRole('button', { name: 'ADD' }).nth(1).click();
// // //   await page.getByRole('textbox', { name: 'Phone Number *' }).click();
// // //   await page.getByRole('textbox', { name: 'Phone Number *' }).fill('094695589398');
// // //   await page.getByRole('textbox', { name: 'Customer Name *' }).click();
// // //   await page.getByRole('textbox', { name: 'Customer Name *' }).fill('Margareth');
// // //   await page.locator('input[type="date"]').fill('2026-07-24');
// // //   await page.locator('input[type="time"]').fill('00:07');
// // //   await page.getByText('Current Order1 item').click();
// // //   await page.getByRole('button', { name: 'ADD' }).nth(1).click();
// // //   await page.getByRole('button', { name: 'Discounts & Options' }).click();
// // //   await page.getByRole('spinbutton').first().click();
// // //   await page.getByRole('spinbutton').first().fill('10');
// // //   await page.getByRole('button', { name: 'Discounts & Options' }).click();
// // //   await page.getByRole('button', { name: 'Confirm Pre-Order' }).click();
// // //   await page.getByPlaceholder('Enter cash amount').fill('4000');
// // //   page.once('dialog', dialog => {
// // //     console.log(`Dialog message: ${dialog.message()}`);
// // //     dialog.dismiss().catch(() => {});
// // //   });
// // //   await page.getByRole('button', { name: 'Finalize Transaction' }).click();
// // //   await page.getByRole('button', { name: 'Package' }).click();
// // //   await page.getByRole('button', { name: 'Pastry' }).click();
// // //   await page.getByRole('button', { name: 'Celebration Material' }).click();
// // //   await page.getByRole('button', { name: 'All', exact: true }).click();
// // //   await page.locator('label').first().click();
// // //   await page.getByPlaceholder('Search product...').fill('');
// // //   await page.getByRole('link', { name: 'All Orders' }).click();
// // //   await page.getByRole('button', { name: 'Confirmed' }).click();
// // //   await page.getByRole('button', { name: 'Ready' }).click();
// // //   await page.getByRole('button', { name: 'Completed' }).click();
// // //   await page.getByRole('button', { name: 'Cancelled' }).click();
// // //   await page.getByRole('button', { name: 'All' }).click();
// // //   await page.getByRole('button', { name: 'View Details' }).first().click();
// // //   page.once('dialog', dialog => {
// // //     console.log(`Dialog message: ${dialog.message()}`);
// // //     dialog.dismiss().catch(() => {});
// // //   });
// // //   await page.getByRole('button', { name: 'Cancel Order' }).click();
// // //   await page.getByRole('button', { name: 'View Details' }).nth(1).click();
// // //   page.once('dialog', dialog => {
// // //     console.log(`Dialog message: ${dialog.message()}`);
// // //     dialog.dismiss().catch(() => {});
// // //   });
// // //   await page.getByRole('button', { name: 'Mark as Ready' }).click();
// // //   await page.getByPlaceholder('Search order ID or customer...').click();
// // //   await page.getByPlaceholder('Search order ID or customer...').fill('');
// // //   await page.getByRole('link', { name: 'Product Management' }).click();
// // //   await page.getByRole('button', { name: 'Package' }).click();
// // //   await page.getByRole('button', { name: 'Pastry' }).click();
// // //   await page.getByRole('button', { name: 'Celebration Material' }).click();
// // //   await page.getByRole('button', { name: 'All' }).click();
// // //   await page.getByPlaceholder('Search by product name...').click();
// // //   await page.getByPlaceholder('Search by product name...').fill('');
// // //   await page.getByRole('button', { name: '+ Add Product' }).click();
// // //   await page.getByRole('textbox', { name: 'Product Name' }).click();
// // //   await page.getByRole('textbox', { name: 'Product Name' }).fill('Cake');
// // //   await page.getByPlaceholder('0', { exact: true }).click();
// // //   await page.getByPlaceholder('0', { exact: true }).fill('200');
// // //   await page.getByRole('textbox', { name: 'e.g. Themed Cake (7x5) w/' }).click();
// // //   await page.getByRole('textbox', { name: 'e.g. Themed Cake (7x5) w/' }).fill('round cake');
// // //   await page.getByText('Upload Image').click();
// // //   await page.getByLabel('Upload Image').setInputFiles('94bcf438c4cfda92e528010dba8f54f1.jpg');
// // //   await page.getByRole('button', { name: 'Submit' }).click();
// // //   await page.getByRole('button', { name: 'Edit' }).nth(2).click();
// // //   await page.getByRole('textbox', { name: 'Product Name' }).click();
// // //   await page.getByRole('textbox', { name: 'Product Name' }).press('ControlOrMeta+a');
// // //   await page.getByRole('textbox', { name: 'Product Name' }).fill('Butterfly');
// // //   await page.getByRole('button', { name: 'Submit' }).click();
// // //   page.once('dialog', dialog => {
// // //     console.log(`Dialog message: ${dialog.message()}`);
// // //     dialog.dismiss().catch(() => {});
// // //   });
// // //   await page.getByRole('button', { name: 'Delete' }).nth(2).click();
// // // });

// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('http://localhost:5173/login');
//   await page.getByRole('textbox', { name: '@gmail.com' }).click();
//   await page.getByRole('textbox', { name: '@gmail.com' }).fill('admin@cakelytics.com');
//   await page.getByRole('textbox', { name: '••••••••' }).click();
//   await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
//   await page.getByRole('button').filter({ hasText: /^$/ }).click();
//   await page.getByRole('button', { name: 'Sign in' }).click();
//   await page.getByRole('link', { name: 'Point Of Sale' }).click();
//   await page.getByRole('button', { name: 'Package' }).click();
//   await page.getByRole('button', { name: 'Pastry' }).click();
//   await page.getByRole('button', { name: 'Celebration Material' }).click();
//   await page.getByPlaceholder('Search product...').click();
//   await page.getByRole('button', { name: 'All' }).click();
//   await page.locator('label').click();
//   await page.getByPlaceholder('Search product...').fill('ch');
//   await page.getByRole('button', { name: 'ADD' }).first().click();
//   await page.getByRole('button', { name: 'Complete Order' }).click();
//   await page.getByPlaceholder('Enter cash amount').click();
//   await page.getByPlaceholder('Enter cash amount').fill('700');
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Finalize Transaction' }).click();
//   await page.getByRole('button', { name: 'Pre-Order' }).click();
//   await page.getByRole('button', { name: 'Package' }).click();
//   await page.getByRole('button', { name: 'All', exact: true }).click();
//   await page.getByRole('button', { name: 'Package' }).click();
//   await page.getByRole('button', { name: 'Pastry' }).click();
//   await page.getByRole('button', { name: 'All', exact: true }).click();
//   await page.getByRole('button', { name: 'ADD' }).first().click();
//   await page.getByRole('textbox', { name: 'Phone Number *' }).click();
//   await page.getByRole('textbox', { name: 'Phone Number *' }).fill('09268804514');
//   await page.getByRole('textbox', { name: 'Customer Name *' }).click();
//   await page.getByRole('textbox', { name: 'Customer Name *' }).press('CapsLock');
//   await page.getByRole('textbox', { name: 'Customer Name *' }).fill('H');
//   await page.getByRole('textbox', { name: 'Customer Name *' }).press('CapsLock');
//   await page.getByRole('textbox', { name: 'Customer Name *' }).fill('Hazel');
//   await page.locator('input[type="date"]').fill('2026-07-30');
//   await page.locator('input[type="time"]').fill('00:00');
//   await page.getByRole('button', { name: 'Confirm Pre-Order' }).click();
//   await page.getByPlaceholder('Enter cash amount').click();
//   await page.getByPlaceholder('Enter cash amount').fill('700');
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Finalize Transaction' }).click();
//   await page.getByRole('link', { name: 'All Orders' }).click();
//   await page.getByRole('button', { name: 'View Details' }).first().click();
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Cancel Order' }).click();
//   await page.getByRole('button', { name: 'View Details' }).first().click();
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Cancel Order' }).click();
//   await page.getByRole('button', { name: 'View Details' }).nth(2).click();
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Mark as Ready' }).click();
//   await page.getByRole('link', { name: 'Product Management' }).click();
//   await page.getByRole('link', { name: 'All Orders' }).click();
//   await page.getByRole('button', { name: 'Confirmed' }).click();
//   await page.getByRole('button', { name: 'Ready' }).click();
//   await page.getByRole('button', { name: 'Completed' }).click();
//   await page.getByRole('button', { name: 'Cancelled' }).click();
//   await page.getByRole('button', { name: 'Completed' }).click();
//   await page.getByRole('button', { name: 'Cancelled' }).click();
//   await page.getByRole('link', { name: 'Product Management' }).click();
//   await page.getByRole('link', { name: 'Point Of Sale' }).click();
//   await page.getByRole('link', { name: 'Product Management' }).click();
//   await page.getByRole('button', { name: 'Edit' }).nth(4).click();
//   await page.getByRole('textbox', { name: 'Product Name' }).click();
//   await page.getByRole('textbox', { name: 'Product Name' }).fill('Keyki');
//   await page.getByRole('textbox', { name: 'Product Name' }).press('Enter');
//   await page.getByRole('button', { name: 'Submit' }).click();
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Delete' }).nth(4).click();
//   await page.getByRole('button', { name: '+ Add Product' }).click();
//   await page.getByRole('textbox', { name: 'Product Name' }).click();
//   await page.getByRole('textbox', { name: 'Product Name' }).fill('keyk');
//   await page.getByPlaceholder('0', { exact: true }).click();
//   await page.getByPlaceholder('0', { exact: true }).fill('1000');
//   await page.getByRole('textbox', { name: 'e.g. Themed Cake (7x5) w/' }).click();
//   await page.getByRole('textbox', { name: 'e.g. Themed Cake (7x5) w/' }).fill('round cake');
//   await page.getByText('Upload Image').click();
//   await page.getByLabel('Upload Image').setInputFiles('94bcf438c4cfda92e528010dba8f54f1.jpg');
//   await page.getByText('Upload Image').click();
//   await page.getByLabel('Upload Image').setInputFiles('celebration.jpg');
//   await page.getByRole('button', { name: 'Submit' }).click();
//   await page.getByRole('button', { name: 'Edit' }).nth(4).click();
//   await page.getByRole('textbox', { name: 'Product Name' }).click();
//   await page.getByRole('textbox', { name: 'Product Name' }).fill('keyki');
//   await page.getByRole('button', { name: 'Submit' }).click();
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Delete' }).nth(4).click();
// });

import { test, expect } from '@playwright/test';

test('It should pass the full E2E POS Flow', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: '@gmail.com' }).click();
  await page.getByRole('textbox', { name: '@gmail.com' }).fill('admin@cakelytics.com');
  await page.getByRole('textbox', { name: '••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••' }).fill('password123');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Point Of Sale' }).click();
  await page.getByRole('button', { name: 'Package' }).click();
  await page.getByRole('button', { name: 'Pastry' }).click();
  await page.getByRole('button', { name: 'Celebration Material' }).click();
  await page.getByPlaceholder('Search product...').click();
  await page.getByRole('button', { name: 'All' }).click();
  await page.locator('label').click();
  await page.getByPlaceholder('Search product...').fill('ch');
  await page.getByRole('button', { name: 'ADD' }).first().click();
  await page.getByRole('button', { name: 'Complete Order' }).click();
  await page.getByPlaceholder('Enter cash amount').click();
  await page.getByPlaceholder('Enter cash amount').fill('700');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Finalize Transaction' }).click();
  await page.getByRole('button', { name: 'Pre-Order' }).click();
  await page.getByRole('button', { name: 'Package' }).click();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await page.getByRole('button', { name: 'Package' }).click();
  await page.getByRole('button', { name: 'Pastry' }).click();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await page.getByRole('button', { name: 'ADD' }).first().click();
  await page.getByRole('textbox', { name: 'Phone Number *' }).click();
  await page.getByRole('textbox', { name: 'Phone Number *' }).fill('09268804514');
  await page.getByRole('textbox', { name: 'Customer Name *' }).click();
  await page.getByRole('textbox', { name: 'Customer Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Customer Name *' }).fill('H');
  await page.getByRole('textbox', { name: 'Customer Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Customer Name *' }).fill('Hazel');
  await page.locator('input[type="date"]').fill('2026-07-30');
  await page.locator('input[type="time"]').fill('00:00');
  await page.getByRole('button', { name: 'Confirm Pre-Order' }).click();
  await page.getByPlaceholder('Enter cash amount').click();
  await page.getByPlaceholder('Enter cash amount').fill('700');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Finalize Transaction' }).click();
  await page.getByRole('link', { name: 'All Orders' }).click();
  await page.getByRole('button', { name: 'View Details' }).first().click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Cancel Order' }).click();
  await page.getByRole('button', { name: 'View Details' }).first().click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Cancel Order' }).click();
  await page.getByRole('button', { name: 'View Details' }).nth(2).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Mark as Ready' }).click();
  await page.getByRole('link', { name: 'Product Management' }).click();
  await page.getByRole('link', { name: 'All Orders' }).click();
  await page.getByRole('button', { name: 'Confirmed' }).click();
  await page.getByRole('button', { name: 'Ready' }).click();
  await page.getByRole('button', { name: 'Completed' }).click();
  await page.getByRole('button', { name: 'Cancelled' }).click();
  await page.getByRole('button', { name: 'Completed' }).click();
  await page.getByRole('button', { name: 'Cancelled' }).click();
  await page.getByRole('link', { name: 'Product Management' }).click();
  await page.getByRole('link', { name: 'Point Of Sale' }).click();
  await page.getByRole('link', { name: 'Product Management' }).click();
  await page.getByRole('button', { name: 'Edit' }).nth(4).click();
  await page.getByRole('textbox', { name: 'Product Name' }).click();
  await page.getByRole('textbox', { name: 'Product Name' }).fill('Keyki');
  await page.getByRole('textbox', { name: 'Product Name' }).press('Enter');
  await page.getByRole('button', { name: 'Submit' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Delete' }).nth(4).click();
  await page.getByRole('button', { name: '+ Add Product' }).click();
  await page.getByRole('textbox', { name: 'Product Name' }).click();
  await page.getByRole('textbox', { name: 'Product Name' }).fill('keyk');
  await page.getByPlaceholder('0', { exact: true }).click();
  await page.getByPlaceholder('0', { exact: true }).fill('1000');
  await page.getByRole('textbox', { name: 'e.g. Themed Cake (7x5) w/' }).click();
  await page.getByRole('textbox', { name: 'e.g. Themed Cake (7x5) w/' }).fill('round cake');
  await page.getByText('Upload Image').click();
  await page.getByLabel('Upload Image').setInputFiles('tests/fixtures/sample1.jpg');
  await page.getByText('Upload Image').click();
  await page.getByLabel('Upload Image').setInputFiles('tests/fixtures/sample2.jpg');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Edit' }).nth(4).click();
  await page.getByRole('textbox', { name: 'Product Name' }).click();
  await page.getByRole('textbox', { name: 'Product Name' }).fill('keyki');
  await page.getByRole('button', { name: 'Submit' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Delete' }).nth(4).click();
});