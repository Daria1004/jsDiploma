import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
	console.log(process.env);

	// Переменная на уровне workflow
	console.log(process.env.QualityGates);
	// Переменная на уровне job
	console.log(process.env.Integration);
	// TypeOfTests мы не сможни увидеть, она хранится в другом шаге

	//
	console.log(process.env.Username);
	console.log(process.env.Baseurl);

	await page.goto('.');
	await page.getByRole('link', { name: '50' }).click();
	await expect(page.locator('.academy-bug-overlay')).toContainText(
		'You found a crash bug, examine the page for',
	);
});
