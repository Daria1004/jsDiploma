import { test, expect } from '@playwright/test';
import { MainPage, FindBugsPage, StorePage, ExtraStoredPage } from '../src/pages/index';
import { CommentBuilder } from '../src/helpers/builder/index';

test.describe('Карточка товара', () => {
  test('Changing currency should not freeze the page', {tag: ['@store_page', '@03', '@crash']}, async ({ page }) => { //выбрать другую валюту
    const mainPage = new MainPage(page);
    await mainPage.open();

    await mainPage.closeTutorial();
    await mainPage.gotoFindBugs();  

    const findBugsPage = new FindBugsPage(page);
    await findBugsPage.openFirstProduct();

    const storePage = new StorePage(page);
    await page.waitForTimeout(3000);
    await storePage.changeCurrency("EUR");

    await expect(page.locator('.academy-bug-info-overlay')).toContainText(
    'You found a crash bug, examine the page for 5 seconds.'
    );
})

test('Manufacturer link should not lead to error page', {tag: ['@extra/stored/hdx/_page', '@16', '@functional']},async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.closeTutorial();
    await mainPage.gotoFindBugs();  

    const findBugsPage = new FindBugsPage(page);
    await findBugsPage.openFirstProduct();

    const storePage = new StorePage(page);
    await storePage.gotoManufacturer();

    const extraStoredPage = new ExtraStoredPage(page);
    await expect(extraStoredPage.errorContainer).toBeVisible();
    await expect(extraStoredPage.errorContainer).toContainText("Oops! That page can’t be found.");
  });

  test('Comment form should not freeze the page on submission', {tag: ['@store_page', '@02', '@crash']}, async ({ page }) => { //оставить комментарий
    const mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.closeTutorial();
    await mainPage.gotoFindBugs();  

    const findBugsPage = new FindBugsPage(page);
    await findBugsPage.openFirstProduct();

    const storePage = new StorePage(page);

    const commentBuilder = new CommentBuilder()
            .addText()
            .addName()
            .addEmail()
            .generate();

    await storePage.addComment(commentBuilder);

    await expect(page.locator('.academy-bug-info-overlay'))
    .toContainText('You found a crash bug, examine the page by clicking on any button for 5 seconds.');
  });
});