import { expect } from '@playwright/test';
import { test } from '../src/helpers/fixtures/index';
import { step } from "allure-js-commons";

test.describe('Каталог товаров', () => {
  test('Page freezes when selecting number of results to display', { tag: ['@findbugs_page', '@ui', '@09', '@crash'] }, async ({ app }) => {//фильтры и пагинация
    await app.findBugs.changeItemsOnPage();
    
    await step("Краш баг сообщение видимо", async () => {
        await expect(app.findBugs.crashBugOverlay).toContainText(
        'You found a crash bug, examine the page by clicking on any button for 5 seconds.');
    });
  });
});


