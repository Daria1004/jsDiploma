import { test } from '@playwright/test';
import { MainPage, FindBugsPage } from '../src/pages/index';

test.describe('Каталог товаров', () => {
  test('Page freezes when selecting number of results to display', { tag: ['@findbugs_page', '@09', '@crash'] }, async ({ page }) => {//фильтры и пагинация
    const mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.closeTutorial();
    await mainPage.gotoFindBugs();  

    const findBugsPage = new FindBugsPage(page);
    await findBugsPage.changeItemsOnPage();
    await findBugsPage.verifyCrashBugMessageIsVisible();
  });
});


