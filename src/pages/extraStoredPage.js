import { step } from "allure-js-commons";
export class ExtraStoredPage {
    constructor(page) {
        this.page = page;
        this.errorContainer = page.locator('div.sq-container').locator('h6');
    }   

    async checkErrorMessage() {
        await step("Проверить сообщение об ошибке", async () => {
            await expect(this.errorContainer).toBeVisible();
        });
    } 
};