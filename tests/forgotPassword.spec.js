import { expect } from '@playwright/test';
import { test } from '../src/helpers/fixtures/index';
import { AccountBuilder } from '../src/helpers/builders/index';
import { step } from "allure-js-commons";

test.describe('Аккаунт', () => {
  test('Password retrieval does not work on AcademyBugs', {tag: ['@forgot_password_page', '@ui', '@21', '@crush']}, async ({ app }) => {
    const accountBuilder = new AccountBuilder()
        .addEmail()
        .generate();

    await app.findBugs.openFirstProduct();
    await app.store.gotoSignUp();
    await app.account.gotoForgotYourPassword();
    await app.forgotPassword.fillEmail(accountBuilder);
    await app.forgotPassword.retrievePassword();

    await step("Краш баг сообщение видимо", async () => {
        await expect(app.forgotPassword.crashBugOverlay).toContainText(
        'You found a crash bug, examine the page for 5 seconds.');
        });  
    });
});