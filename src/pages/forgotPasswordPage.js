import { step } from "allure-js-commons";
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
}