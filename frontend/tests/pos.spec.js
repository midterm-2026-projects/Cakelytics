import { test, expect } from '@playwright/test';

test('POS and Product Management E2E Workflow', async ({ page }) => {
  // 1. Regular POS Order
  await page.goto('http://localhost:5173/pos');
  
  await page.getByRole('button', { name: 'ADD' }).first().click();
  await page.getByRole('button', { name: 'ADD' }).nth(1).click();
  
  await page.getByRole('button', { name: 'Discounts & Options' }).click();
  
  const firstSpinButton = page.getByRole('spinbutton').first();
  await firstSpinButton.click();
  await firstSpinButton.fill('20');
  
  const secondSpinButton = page.getByRole('spinbutton').nth(1);
  await secondSpinButton.click();
  await secondSpinButton.dblclick();
  await secondSpinButton.fill('20');
  
  await page.getByRole('button', { name: 'Complete Order' }).click();
  await page.getByPlaceholder('Enter cash amount').fill('1000');
  
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  
  await page.getByRole('button', { name: 'Finalize Transaction' }).click();

  // 2. Pre-Order Workflow
  await page.getByRole('button', { name: 'Package' }).click();
  await page.getByRole('button', { name: 'Pastry' }).click();
  await page.getByRole('button', { name: 'Celebration Material' }).click();
  await page.getByRole('button', { name: 'Celebration Material' }).click(); // Toggle/Repeat if needed
  await page.getByRole('button', { name: 'Pre-Order' }).click();
  
  await page.getByRole('button', { name: 'Pastry' }).click();
  await page.getByRole('button', { name: 'Package' }).click();
  
  await page.getByRole('button', { name: 'ADD' }).first().click();
  await page.getByRole('button', { name: 'ADD' }).nth(1).click();
  
  await page.getByRole('textbox', { name: 'Phone Number *' }).fill('09469559498');
  await page.getByRole('textbox', { name: 'Customer Name *' }).fill('Mich');
  
  await page.locator('input[type="date"]').fill('2026-07-23');
  await page.locator('input[type="time"]').fill('00:00');
  
  await page.getByRole('button', { name: 'Discounts & Options' }).click();
  await page.getByRole('button', { name: 'Confirm Pre-Order' }).click();
  
  const cashInput = page.getByPlaceholder('Enter cash amount');
  await cashInput.click();
  await cashInput.fill('10000');
  
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  
  await page.getByRole('button', { name: 'Finalize Transaction' }).click();

  // 3. Order Management View Iterations
  await page.getByRole('link', { name: 'All Orders' }).click();
  
  await page.getByRole('button', { name: 'Confirmed' }).click();
  await page.getByRole('button', { name: 'Ready' }).click();
  await page.getByRole('button', { name: 'Completed' }).click();
  await page.getByRole('button', { name: 'Cancelled' }).click();
  await page.getByRole('button', { name: 'All' }).click();
  
  // Update Order Status
  await page.getByRole('button', { name: 'View Details' }).first().click();
  
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Mark as Ready' }).click();
  
  // Cancel an Order
  await page.getByRole('button', { name: 'View Details' }).nth(1).click();
  await page.getByText('Special Instructions').click(); // Adjust selector if exact text matches
  
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Cancel Order' }).click();

  // 4. Product Management
  await page.getByRole('link', { name: 'Product Management' }).click();
  
  // Edit existing product
  await page.getByRole('button', { name: 'Edit' }).first().click();
  const productNameInput = page.getByRole('textbox', { name: 'Product Name' });
  await productNameInput.click();
  await productNameInput.fill('Classic Vanilla Cakey');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Add new product workflow
  await page.getByRole('button', { name: '+ Add Product' }).click();
  await productNameInput.click();
  await productNameInput.fill('Cookies');
  
  const priceInput = page.getByPlaceholder('0', { exact: true });
  await priceInput.click();
  await priceInput.fill('50');
  
  await page.getByRole('combobox').selectOption('Pastry');
  
  const descriptionInput = page.getByRole('textbox', { name: 'e.g. Themed Cake (7x5) w/' });
  await descriptionInput.click();
  await descriptionInput.fill('bbbb');
  
  const imageUrlInput = page.getByRole('textbox', { name: 'Image URL (paste from web or' });
  await imageUrlInput.click();
  await imageUrlInput.fill('https://i.pinimg.com/736x/b8/84/69/b88469b8c4bdf4878a050c250bc1a10e.jpg');
  
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Delete product action with dialog handler
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept().catch(() => {}); // Usually delete dialogs need to be accepted rather than dismissed
  });
  await page.getByRole('button', { name: 'Delete' }).nth(1).click();
  
  // Final navigation check
  await page.getByRole('button', { name: 'Package' }).click();
  await page.getByRole('button', { name: 'Pastry' }).click();
  await page.getByRole('button', { name: 'Celebration Material' }).click();
});