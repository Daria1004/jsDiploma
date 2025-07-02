import { step } from "allure-js-commons";
import { expect } from '@playwright/test';
export class ForgotPasswordPage {
    
    constructor(page) {
        this.page = page;
        this.emailField = page.locator('.ec_cart_input_row').locator('input#ec_account_forgot_password_email');
        this.retrievePasswordButton = page.getByRole('button', {class: 'ec_account_button', name: 'RETRIEVE PASSWORD'})
        this.crashBugOverlay = page.locator('.academy-bug-info-overlay');

    }

    async fillEmail(account) {
        await step("Заполнить поле Email для восстановления пароля", async () => {
            await this.emailField.click();
            await this.emailField.fill(account.email);
        });
    }

    async retrievePassword() {
        await step("Нажать кнопку Получить пароль", async () => {
            await this.retrievePasswordButton.click();
        });
    }

    async verifyCrashBugMessageIsVisible() {
        await step("Краш баг сообщение видимо", async () => {
            await expect(this.crashBugOverlay).toContainText(
            'You found a crash bug, examine the page for 5 seconds.');
        });
    }
}