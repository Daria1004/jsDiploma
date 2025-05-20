import { step } from "allure-js-commons";

export class AccountPage {
    constructor(page) {
        this.page = page;
        this.forgotYourPasswordLink = page.locator('div.ec_cart_button_row').getByRole('link', {name: "Forgot Your Password?", class: "ec_account_login_link"});
    }   

    async gotoForgotYourPassword() {
        await step("Переход на страницу восстановления пароля", async () => {
            await this.forgotYourPasswordLink.click();
        });
    } 
};