import { step } from "allure-js-commons";
import { expect } from '@playwright/test';
export class FindBugsPage {
    
    constructor(page){
        this.page = page;
        this.onPageButton = page.getByRole('link', {class: 'what-we-offer-pagination-link', name: '10'})
        this.productLink = page.locator('li.ec_product_li').first().locator('a.ec_image_link_cover').first(); 
        this.crashBugOverlay = page.locator('.academy-bug-overlay');
  }   

    async changeItemsOnPage() {
        await step("Изменить количество отображаемых товаров на странице", async () => {
            await this.onPageButton.click();
        });
    }

    async openFirstProduct() {
        await step("Открыть первый товар", async () => {
            await this.productLink.click();
        });
    } 

    async verifyCrashBugMessageIsVisible() {
        await step("Краш баг сообщение видимо", async () => {
            await expect(this.crashBugOverlay).toContainText(
            'You found a crash bug, examine the page by clicking on any button for 5 seconds.');
        });
    }
}