import { test, expect } from '@playwright/test';
import { MainPage, FindBugsPage, StorePage, AccountPage, ForgotPasswordPage } from '../src/pages/index';
import { AccountBuilder } from '../src/helpers/builder/index';
import { step } from "allure-js-commons";

test.describe('Аккаунт', () => {
  test('Password retrieval does not work on AcademyBugs', {tag: ['@forgot_password_page', '@21', '@crush']}, async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.open();

    await mainPage.closeTutorial();
    await mainPage.gotoFindBugs();  

    const findBugsPage = new FindBugsPage(page);
    await findBugsPage.openFirstProduct();

    const storePage = new StorePage(page);
    await storePage.gotoSignUp();

    const accountPage = new AccountPage(page);
    await accountPage.gotoForgotYourPassword();

    const forgotPasswordPage = new ForgotPasswordPage(page);

    const accountBuilder = new AccountBuilder()
        .addEmail()
        .generate();

    await forgotPasswordPage.fillEmail(accountBuilder);

    await forgotPasswordPage.retrievePassword();

    await step("Краш баг сообщение видимо", async () => {
        await expect(forgotPasswordPage.crashBugOverlay).toContainText(
        'You found a crash bug, examine the page for 5 seconds.');
        });  
    });
});